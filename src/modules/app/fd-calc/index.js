import React from 'react';
import {connect} from 'react-redux';
import { StyleSheet, Platform } from 'react-native';
import { Container, View, Header, Left, Button, Icon, Body, Right, Title, Text, Label, Input, Item, Spinner, Toast } from 'native-base';
import { THEME } from '../../../../config';
import RadioBtnGroup from '../../common/components/radio-btn-grp';
import Steps from '../../common/components/steps';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import utils from '../../../services/utils';
import CheckBox from '../../common/components/checkbox';
import update from 'immutability-helper';
import { fetchProductDetails } from '../../../store/actions/common-actions';
import { COMMON_STYLES } from '../../common/styles';
import moment from 'moment';
import ListItemPanel from '../../common/components/list-item-panel';
import apiServices from '../../../services/api-services';
import WebView from 'react-native-webview';
import { NAVIGATION } from '../../../navigation';
import SuccessPayment from './success-payment';
import PersonalInfo from '../deposite/personal-info';
import { fetchFDSummary } from '../../../store/actions/deposite-actions';
import FDCalculater, { getFdCalcInitValues, getInterestPayment } from '../../common/components/fd-calculater';
import TermsConditions from '../../common/components/terms-condtions';
import { TEXTS } from '../../../constants';

class FDCalc extends React.Component {
    state = {
        currentStep: 0,
        paymentHtml: null,
        init: true,
        selected: '',
        acceptTerms: false,
        maturityAmount: 0,
        form: getFdCalcInitValues(),
        maturityDate: null,
        formErr: false,
        paymentType: 'rtgs',
        txnDetails: null,
        transactionStatus: null,
        initStep3Status: false,
        ROI: null,
        termsModal: false,
    }
    pgPayloadData;
    goBack = () => {
        const {navigation} = this.props;
        navigation.goBack();
    }
    async componentDidMount() {
        this.setState({init: false});
        const {productDetails, fetchProductDetails, userDetails} = this.props;
        if(!productDetails) await fetchProductDetails();
        this.setState({init: true});
        if(userDetails) {
            if(userDetails.customerCategory === 'SENIOR_CITIZENS') {
                this.onFormChange('isSenior', true);
            }
        }
    }
    onChangeState = (f, v) => {
        this.setState({[f]: v});
    }
    isFormValid = () => {
        
        const {formErr, acceptTerms} = this.state;
        console.log(!formErr && acceptTerms);
        return !formErr && acceptTerms;
    }
    onPaymentClick = async () => {
        // if(!this.selectedProduct) return;
        this.setState({
            currentStep: 0,
        });
        const {
            form: {
                interest,
                amount,
                period,
                scheme,
                isSenior,
            },
            ROI,
            maturityAmount,
            paymentType,
        } = this.state;
        const {navigation, productDetails} = this.props;
        // let ROI = 0;
        // let interestPayment = 0;
        // if (interest === 'month') {
        //     ROI = this.selectedProduct.monthlyIntRate;
        //     interestPayment = 30;
        // } else if (interest === 'quarter') {
        //     ROI = this.selectedProduct.quarterlyIntRate;
        //     interestPayment = 90;
        // } else if (interest === 'annual') {
        //     ROI = this.selectedProduct.yearlyIntRate;
        //     interestPayment = 360;
        // } else if (interest === 'maturity') {
        //     ROI = this.selectedProduct && this.selectedProduct["onMaturityRate "] ? 
        //                 this.selectedProduct["onMaturityRate "] : 0;
        //     interestPayment = 0;
        // }
        // let channel = 'web';
        const productId = productDetails && productDetails.filter(
            i=>String(i.productAliasName).toLowerCase().includes(scheme)
        );
        const data = {
            depositAmount: parseInt(amount).toFixed(2),
            productId: productId && productId[0].productId,
            categoryId: isSenior ? 'GENERAL_CATEGORY' : 'SENIOR_CITIZENS',
            period,
            interestPayment: getInterestPayment(interest),
            rateOfInterest: ROI,
            maturityAmount,
            paymentType: paymentType === 'card' ? 'NETBANKING' : 'RTGS',
        };
        apiServices.getPGPayload(data).then(res => {
            console.log(res);
            const {data} = res;
            this.pgPayloadData = data;
            let html = `
            <div>
                <form #form ngNoForm action="https://hdfcprodsigning.in/onepayVAS/payprocessorV2" method="POST">
                                
                    <input type="text" type="hidden" name="reqData" value="${data.reqData}">
                    <input type="text" type="hidden" name="merchantId" value="${data.merchantId}">
                
                </form>
                <div class="_load">
                    <h1>Loading</h1>
                </div>
            </div>
                <style>
                    input {
                        height: 0px;
                        width: 0px;
                        pointer-events: none;
                        opacity: 0;
                    }
                    ._load {
                        position: fixed;
                        top: 0;
                        left: 0;
                        height: 100%;
                        width: 100%;
                        background-color: #fff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                </style>
                <script>
                    window.document.forms[0].submit();
                </script>
            `;
            // this.setState({paymentHtml: html});
            if(this.state.paymentType === 'card') {
                navigation.navigate(NAVIGATION.PAYMENT_PAGE, {
                    html,
                    onPaymentComplete: this.onPaymentComplete
                });
            } else {
                this.onPaymentComplete();
            }
            
        }).catch(err => {
            console.log('err', err.status, err.response);
            if(err.response.status === 403) {
                Toast.show({text: 'Login Session has been Expired, Please Logout and Re-Sign in again!', type: 'danger', duration: 4000});
            }
        })
    }
    onPaymentComplete = () => {
        console.log('onPaymentComplete', this.pgPayloadData);
        this.setState({currentStep: 1, transactionStatus: null});
        const {navigation} = this.props;
        const {transactionId, merchantId, beneficiaryAccountNumber} = this.pgPayloadData;
        apiServices.getTxnDetails(merchantId, transactionId).then(_res => {
            console.log('getTxnDetails', _res.data);
            const d = _res.data;
            let transactionStatus = null;
            if(d.trans_status === 'F') transactionStatus = false;
            else transactionStatus = true;
            console.log('transactionStatus', transactionStatus);
            this.setState({transactionStatus, txnDetails: transactionStatus ? 'loading': null});
            if(transactionStatus === true) {
                apiServices.paymentSucess(
                    transactionId ? transactionId : beneficiaryAccountNumber, 
                    null, 
                    this.state.paymentType === 'card' ? 'NETBANKING' : 'RTGS'
                ).then(res => {
                    console.log('apiServices');
                    const {data} = res;
                    console.log(data, data.response, data.response[0]);
                    if(this.state.paymentType !== 'card') {
                        navigation.navigate(NAVIGATION.RTGS_SCREEN, {
                            paymentInfo: data,
                        });
                        return;
                    }
                    if(data.response) {
                        console.log('success 200')
                        this.setState({txnDetails: data.response[0]});
                    } else {
                        console.log('success not 200', res.data.responseCode, res.data);
                        this.setState({txnDetails: 'failed'});
                    }
                }).catch(err => {
                    console.log('catch', err);
                    this.setState({txnDetails: 'failed'});
                });
            }
        }).catch(err => {
            console.log('err getTxnDetails', err);
            this.setState({transactionStatus: false});
        })
        
    }
    onNavigationStateChange = webViewState => {
        console.log(webViewState.url);
    }
    onCompleteProfileClick = () => {
        this.setState({
            currentStep: 2,
        }, () => this.initStep3());
    }

    initStep3 = async () => {
        const {
            fetchFDSummary
        } = this.props;
        // fetchFDSummary(txnDetails['ACCOUNTNUMBER']);
        this.setState({initStep3Status: false});
        await fetchFDSummary(this.state.txnDetails['ACCOUNTNUMBER']);
        this.setState({initStep3Status: true});
    }
    goToStep = step => {
        this.setState({currentStep: step});
    }
    completeTrasaction = () => {
        const {navigation, fdSummary} = this.props;
        // navigation.navigate(NAVIGATION.DEPOSITE_LIST);
        navigation.navigate(NAVIGATION.FD_DETAILS, {selectedDeposite: fdSummary[0]});
    }

    onCalcValueChange = (form, maturityAmount, formErr, maturityDate, ROI) => {
        console.log('onChange');
        console.log(form);
        this.setState({
            form,
            maturityAmount,
            formErr,
            maturityDate,
            ROI,
        })
    }
    toggleTermsModal = () => {
        this.setState({termsModal: !this.state.termsModal});
    }
    onAcceptCheckBoxChange = () => {
        const {acceptTerms} = this.state;
        if(acceptTerms) this.onChangeState('acceptTerms', false);
        else this.toggleTermsModal();
    }
    render() {
        const {
            form: {
                isSenior,
                scheme,
                period,
                amount,
                interest,
            },
            maturityDate,
            periodOptionsData,
            interestOptionsData,
            formErr,
            init,
            maturityAmount,
            acceptTerms,
            paymentType,
            currentStep,
            txnDetails,
            transactionStatus,
            initStep3Status,
            termsModal,
        } = this.state;
        const {fdSummary, userDetails, productDetails} = this.props;
        return (
            init ? (
                <Container>
                    <Header>
                        <Left>
                            <Button transparent onPress={this.goBack}>
                                <Icon name='arrow-back' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>New Fixed Deposit</Title>
                        </Body>
                        <Right />
                    </Header>
                    <Container style={styles.container}>
                        <View style={styles.mask}/>
                        <View style={styles.stepsOuter}>
                            <View style={styles.steps}>
                                <Steps 
                                    currentStep={currentStep}
                                    steps={[
                                        {label: 'Investment'},
                                        {label: 'Payment'},
                                        {label: 'Personal Info'},
                                    ]}/>
                            </View>
                        </View>
                        {currentStep === 0 && (
                            <ScrollView style={styles.content}> 
                                <FDCalculater onChange={this.onCalcValueChange} productDetails={productDetails}/>
                                {/* <View style={styles.calc}>
                                    <View style={styles.formRH}>
                                        <View style={styles.formRHF}>
                                            <CheckBox 
                                                // onChange={()=>this.onFormChange('isSenior', !isSenior)}
                                                checked={isSenior}/>
                                        </View>
                                        <View style={styles.formRHL}>
                                            <TouchableOpacity 
                                                // onPress={()=>this.onFormChange('isSenior', !isSenior)}
                                            >
                                                <Text style={styles.formRLT}>Senior Citizen</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.formR}>
                                        <View style={styles.formRF}>
                                            <Item fixedLabel>
                                                <Label style={[styles.formRLT, {fontSize: 15}]}>Enter Amount:</Label>
                                                <Input 
                                                    onChangeText={(v) => this.onAmountChange(v)} 
                                                    value={amount}/>
                                            </Item>
                                        </View>
                                        {amountErr && (
                                            <Text style={styles.formErr}>
                                                {amountErr}
                                            </Text>
                                        )}
                                    </View>

                                    <View style={styles.formR}>
                                        <View style={styles.formRL}>
                                            <Text style={styles.formRLT}>Scheme</Text>
                                        </View>
                                        <View style={styles.formRF}>
                                            <RadioBtnGroup 
                                                selected={scheme}
                                                onChange={(v) => this.selectScheme(v)}
                                                data={schemeOptions} />
                                        </View>
                                    </View>

                                    <View style={styles.formR}>
                                        <View style={styles.formRL}>
                                            <Text style={styles.formRLT}>Period</Text>
                                        </View>
                                        <View style={styles.formRF}>
                                            <RadioBtnGroup 
                                                selected={period}
                                                onChange={(v) => this.selectPeriod(v)}
                                                data={periodOptionsData} />
                                        </View>
                                    </View>

                                    <View style={styles.formR}>
                                        <View style={styles.formRL}>
                                            <Text style={styles.formRLT}>Interest Payment</Text>
                                        </View>
                                        <View style={styles.formRF}>
                                            <RadioBtnGroup 
                                                selected={interest}
                                                onChange={(v) => this.selectInterest(v)}
                                                data={interestOptionsData} />
                                        </View>
                                    </View>
                                </View> */}


                                <View style={styles.depositeInfo}>
                                    <ListItemPanel 
                                        itemWidth={'50%'}
                                        noHoverEffect
                                        borderRadius={9}
                                        lists={[
                                            ['Deposit Amount', utils.convertToINRFormat(amount)],
                                            ['Maturity Amount', utils.convertToINRFormat(maturityAmount)], 
                                            ['Start Date', moment(new Date()).format('DD/MM/YYYY')],
                                            ['Maturity Date', maturityDate],
                                            ['Interest Payment', (maturityAmount - amount)],
                                            ['Months', period],
                                        ]}
                                        panelTitleLabel={'Deposit Info'}/>
                                </View>

                                <View style={styles.innerContent}>
                                    <View style={styles.formRH}>
                                        <View style={styles.formRHF}>
                                            <CheckBox 
                                                onChange={this.onAcceptCheckBoxChange}
                                                checked={acceptTerms}/>
                                        </View>
                                        <View style={styles.formRHL}>
                                            <TouchableOpacity onPress={this.onAcceptCheckBoxChange}>
                                                <Text style={[styles.formRLT, COMMON_STYLES.textPrimary]}>{TEXTS.TERMS}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.formR}>
                                        <View style={styles.formRL}>
                                            <Text style={styles.formRLT}>Payment Type:</Text>
                                        </View>
                                        <View style={styles.formRF}>
                                            <View style={styles.formRH}>
                                                <View style={styles.formRHF}>
                                                    <CheckBox 
                                                        // disabled
                                                        onChange={()=>this.onChangeState('paymentType', 'card')}
                                                        checked={paymentType === 'card'}/>
                                                </View>
                                                <View style={styles.formRHL}>
                                                    <TouchableOpacity onPress={()=>this.onChangeState('paymentType', 'card')}>
                                                        <Text style={[styles.formRLT, COMMON_STYLES.textPrimary]}>Net Banking / UPI / Debit Card</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={[styles.formRF, {marginTop: -9}]}>
                                            <View style={styles.formRH}>
                                                <View style={styles.formRHF}>
                                                    <CheckBox 
                                                        onChange={()=>this.onChangeState('paymentType', 'rtgs')}
                                                        checked={paymentType === 'rtgs'}/>
                                                </View>
                                                <View style={styles.formRHL}>
                                                    <TouchableOpacity 
                                                        onPress={()=>this.onChangeState('paymentType', 'rtgs')}>
                                                        <Text style={[styles.formRLT, COMMON_STYLES.textPrimary]}>RTGS / NEFT</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <Button 
                                        block 
                                        onPress={this.onPaymentClick}
                                        disabled={!this.isFormValid()}>
                                        <Text>Continue to Pay</Text>
                                    </Button>

                                    <View style={{height: 30}}/>
                                </View>
                                
                            </ScrollView>
                        )}
                        {currentStep === 1 && (
                            <ScrollView>
                                <View style={[styles.innerContent],{marginHorizontal: THEME.LAYOUT_PADDING}}>
                                    <SuccessPayment 
                                        onCompleteClick={this.onCompleteProfileClick}
                                        transactionStatus={transactionStatus}
                                        goToStep={this.goToStep}
                                        txnDetails={txnDetails} 
                                        pgPayloadData={this.pgPayloadData}/>
                                </View>
                            </ScrollView>
                        )}  
                        {currentStep === 2 && (
                            !initStep3Status ? (
                                <View style={COMMON_STYLES.spinnerContainerFullScreen}>
                                    <Spinner />
                                    <Text style={COMMON_STYLES.spinnerContainerFullScreenText}>Loading...</Text>
                                </View>
                            ) : (
                                <View>
                                    <PersonalInfo fdSummary={fdSummary} userDetails={userDetails}/>
                                    <Button onPress={this.completeTrasaction} block style={{marginHorizontal: THEME.LAYOUT_PADDING}}>
                                        <Text>OK</Text>
                                    </Button>
                                </View>
                                
                            )  
                        )}                       
                    </Container>
                    <TermsConditions 
                        visible={termsModal} 
                        onOk={() => {
                            this.onChangeState('acceptTerms', true);
                            this.toggleTermsModal();
                        }}
                        onCancel={this.toggleTermsModal}/>
                </Container>
            ) : (
                <Container>
                    <View style={COMMON_STYLES.spinnerContainerFullScreen}>
                        <Spinner />
                        <Text style={COMMON_STYLES.spinnerContainerFullScreenText}>Loading Data...</Text>
                    </View>
                </Container>
            )
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // padding: THEME.LAYOUT_PADDING,
        flexDirection: 'column',
        position: 'relative',
    },
    mask: {
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0,
        height: 60,
        backgroundColor: THEME.PRIMARY,
    },
    stepsOuter: {
        paddingHorizontal: 17,
        paddingTop: 15,
        zIndex: 3,
    },
    steps: {
        ...utils.getBoxShadow(7, '#777'),
        backgroundColor: '#fff',
        paddingVertical: 13,
        paddingHorizontal: 9,
        position: 'relative',
        // top: 15,
        zIndex: 5,
        borderRadius: 9,
    },
    calc: {
        ...utils.getBoxShadow(7, '#777'),
        backgroundColor: '#fff',
        padding: 16,
        borderWidth: 1,
        borderColor: '#d9d9d999',
        borderStyle: 'solid',
        borderRadius: 9,
        marginHorizontal: 6,
        marginTop: 3,
    },
    formRH: {
        flexDirection: 'row',
        marginVertical: 13,
        alignItems: "center"
    },
    formRHF: {
        minWidth: 40,  
    },
    formRHL: {
        flexGrow: 1,
        flex: 1,
    },
    formRLT: {
        color: '#111',
        fontWeight: '700',
        fontSize: 13,
    },
    formR: {
        marginVertical: 13,
    },
    formRF: {

    },
    formRL: {
        marginBottom: 9,
    },
    formErr: {
        color: THEME.DANGER,
        fontWeight: '600',
        marginTop: 3,
    },
    content: {
        flexGrow: 1,
        zIndex: 1,
        paddingVertical: 12,
        paddingHorizontal: 11,
        zIndex: 1,
    },
    depositeInfo: {
        marginHorizontal: 6,
        marginTop: 9,
    },
    innerContent: {
        marginHorizontal: 6,
    },
});

const mapStateToProps = state => ({
    productDetails: state.commonReducer.productDetails,
    userDetails: state.commonReducer.userDetails,
    fdSummary: state.depositeReducer.fdSummary,
    token: state.authReducer.token,
})

export default connect(
    mapStateToProps,
    { fetchProductDetails, fetchFDSummary }
)(FDCalc);