import React from 'react';
import {connect} from 'react-redux';
import { StyleSheet, Platform } from 'react-native';
import { Container, View, Header, Left, Button, Icon, Body, Right, Title, Text, Label, Input, Item, Spinner } from 'native-base';
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

const CATEGORY = {
    GENERAL: 'GENERAL_CATEGORY',
    SENIOR: 'SENIOR_CITIZENS'
};
const schemeOptions = [
    {label: 'RIPS', value: 'rips'},
    {label: 'CIPS', value: 'cips'},
];
const periodOptions = [
    {label: '12', value: 12},
    {label: '24', value: 24},
    {label: '36', value: 36},
    {label: '48', value: 48},
    {label: '60', value: 60},
];
const interestOptions = [
    {label: 'Monthly', value: 'month'},
    {label: 'Quarterly', value: 'quarter'},
    {label: 'Annually', value: 'Annual'},
    {label: 'On Maturity', value: 'maturity'},
];

class FDCalc extends React.Component {
    state = {
        currentStep: 0,
        paymentHtml: null,
        init: true,
        selected: '',
        acceptTerms: false,
        maturityAmount: 0,
        form: {
            isSenior: false,
            scheme: schemeOptions[0].value,
            period: periodOptions[0].value,
            interest: interestOptions[0].value,
            amount: '25000',
        },
        periodOptionsData: periodOptions,
        interestOptionsData: interestOptions,
        amountErr: false,
        paymentType: 'card',
        txnDetails: null,
        transactionStatus: null,
        initStep3Status: false,
    }
    selectedProduct;
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
        this.selectScheme(schemeOptions[0].value);
        if(userDetails) {
            if(userDetails.customerCategory === 'SENIOR_CITIZENS') {
                this.onFormChange('isSenior', true);
            }
        }
    }
    onChangeState = (f, v) => {
        this.setState({[f]: v});
    }
    onFormChange = (field, value, callback) => {
       this.setState(update(this.state, {
           form: {
               [field]: {
                   $set: value,
               }
           }
       }), () => {
           if(callback) callback();
       });
    }
    onAmountChange = v => {
        this.onFormChange('amount', v);
        const amount = parseInt(v);
        let err = false;
        if(amount%1000 !== 0) {
            err = 'Amount should be multiple of 1000';
        } else if(amount < 25000) {
            err = 'Amount should be more than of 25,000';
        } else if(amount > 50000) {
            err = 'Amount should not be more than of 50,000';
        } else {
            err = false;
        }
        this.setState({amountErr: err});
        
    }

    getMaturityDate = () => {
        const {form: {period}} = this.state;
        let currentDate = new Date();
        let maturityDate =  currentDate.setMonth(currentDate.getMonth() + period );
        return moment(maturityDate).format('DD/MM/YYYY');
    }
    selectScheme = type => {
        if(type === schemeOptions[0].value) {
            this.onFormChange('scheme', type, () => {
                let periodOptionsData = periodOptions;
                periodOptionsData[0]['disabled'] = true;
                this.setState({
                    periodOptionsData,
                }, () => {
                    this.selectPeriod(periodOptions[1].value);
                })
            });
        } else {
            this.onFormChange('scheme', type, () => {
                let periodOptionsData = periodOptions;
                delete periodOptionsData[0]['disabled'];
                this.setState({periodOptionsData}, () => {
                    this.selectPeriod(periodOptions[0].value);
                });
            });  
        }
    }
    selectPeriod = type => {
        if(this.state.form.scheme === schemeOptions[0].value) {
            if(type > 24) {
                let interestOptionsData = interestOptions;
                delete interestOptionsData[0]['disabled'];
                delete interestOptionsData[1]['disabled'];
                delete interestOptionsData[2]['disabled'];
                interestOptionsData[3]['disabled'] = true;
                this.setState({interestOptionsData}, () => {
                    this.selectInterest(interestOptions[0].value);
                });
                

            } else {
                let interestOptionsData = interestOptions;
                interestOptionsData[0]['disabled'] = true;
                delete interestOptionsData[1]['disabled'];
                interestOptionsData[2]['disabled'] = true;
                interestOptionsData[3]['disabled'] = true;
                this.setState({interestOptionsData}, () => {
                    this.selectInterest(interestOptions[1].value);
                });
            }
        } else {
            let interestOptionsData = interestOptions;
            delete interestOptionsData[3]['disabled'];
            interestOptionsData[0]['disabled'] = true;
            interestOptionsData[1]['disabled'] = true;
            interestOptionsData[2]['disabled'] = true;
            this.setState({interestOptionsData}, () => {
                this.selectInterest(interestOptions[3].value);
            });   
        }
        this.onFormChange('period', type);
    }
    selectInterest = type => {
        console.log('selectInterest', type);
        this.onFormChange('interest', type, () => {
            this.calculateMaturity();
        });
    }
    calculateMaturity = () => {
        const {productDetails} = this.props;
        if(!(productDetails && productDetails.length > 0 && Array.isArray(productDetails))) return;
        let productName = this.state.form.scheme;
        if(productName === schemeOptions[0].value) {
            productName = 'RIPS'
        } else {
            productName = 'CIPS I'
        }
        let category = this.state.isSenior ? CATEGORY.SENIOR : CATEGORY.GENERAL;
        let period = this.state.form.period;
        let depositAmount = this.state.form.amount;
        let interestPayment = this.state.form.interest;
        let selectedProduct = productDetails.find((product) => {
            if (product.categoryId === category 
              && product.productAliasName === productName
              &&  product.tenure === period ) {
                return true;
            }
        });
        this.selectedProduct = selectedProduct;
        let ROI = 0;
        if (interestPayment === 'month') {
            ROI = selectedProduct.monthlyIntRate;
        } else if (interestPayment === 'quarter') {
            ROI = selectedProduct.quarterlyIntRate;
        } else if (interestPayment === 'annual') {
            ROI = selectedProduct.yearlyIntRate;
        } else if (interestPayment === 'maturity') {
            ROI = selectedProduct["onMaturityRate "];
        }
        let maturityAmount = 0;
        if (productName === 'RIPS') {
            let interestAmount = ((Number(depositAmount) * Number(ROI)/1200))* Number(selectedProduct.tenure);
            maturityAmount = Math.floor(Number(depositAmount) + interestAmount);
        } else {
            let tenure = selectedProduct.tenure / 12;
            maturityAmount = Number(depositAmount) * Math.pow(1 + (Number(ROI) / (12 * 100)), 12 *  tenure);
            maturityAmount = Math.floor(Number(maturityAmount));
        }
        console.log('maturityAmount', maturityAmount);
        this.setState({
            maturityAmount,
        })
    }
    isFormValid = () => {
        const {amountErr, acceptTerms} = this.state;
        return !amountErr && acceptTerms;
    }
    onPaymentClick = () => {
        if(!this.selectedProduct) return;
        this.setState({
            currentStep: 0,
        });
        const {
            form: {
                interest,
                amount,
                period,
            },
            maturityAmount,
        } = this.state;
        const {navigation} = this.props;
        let ROI = 0;
        let interestPayment = 0;
        if (interest === 'month') {
            ROI = this.selectedProduct.monthlyIntRate;
            interestPayment = 30;
        } else if (interest === 'quarter') {
            ROI = this.selectedProduct.quarterlyIntRate;
            interestPayment = 90;
        } else if (interest === 'annual') {
            ROI = this.selectedProduct.yearlyIntRate;
            interestPayment = 360;
        } else if (interest === 'maturity') {
            ROI = this.selectedProduct["onMaturityRate "];
            interestPayment = 0;
        }
        let channel = 'web';
        const data = {
            depositAmount: parseInt(amount).toFixed(2),
            productId: this.selectedProduct.productId,
            categoryId: this.selectedProduct.categoryId,
            period,
            interestPayment,
            rateOfInterest: ROI,
            maturityAmount,
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
            navigation.navigate(NAVIGATION.PAYMENT_PAGE, {
                html,
                onPaymentComplete: this.onPaymentComplete
            });
        })
    }
    onPaymentComplete = () => {
        console.log('onPaymentComplete', this.pgPayloadData);
        this.setState({currentStep: 1, transactionStatus: null});
        const {transactionId, merchantId} = this.pgPayloadData;
        apiServices.getTxnDetails(merchantId, transactionId).then(_res => {
            console.log('getTxnDetails', _res.data);
            const d = _res.data;
            let transactionStatus = null;
            if(d.trans_status === 'F') transactionStatus = false;
            else transactionStatus = true;
            console.log('transactionStatus', transactionStatus);
            this.setState({transactionStatus, txnDetails: transactionStatus ? 'loading': null});
            if(transactionStatus === true) {
                apiServices.paymentSucess(transactionId).then(res => {
                    console.log('apiServices');
                    const {data} = res;
                    console.log(data, data.response, data.response[0]);
                    if(data.responseCode === '200') {
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
    render() {
        const {
            form: {
                isSenior,
                scheme,
                period,
                amount,
                interest,
            },
            periodOptionsData,
            interestOptionsData,
            amountErr,
            init,
            maturityAmount,
            acceptTerms,
            paymentType,
            currentStep,
            txnDetails,
            transactionStatus,
            initStep3Status,
        } = this.state;
        const {fdSummary, userDetails} = this.props;
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
                            <Title>FD Calculator</Title>
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
                                <View style={styles.calc}>
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
                                        {/* <View style={styles.formRL}>
                                            <Text style={styles.formRLT}>Enter Amount</Text>
                                        </View> */}
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
                                </View>


                                <View style={styles.depositeInfo}>
                                    <ListItemPanel 
                                        itemWidth={'50%'}
                                        noHoverEffect
                                        borderRadius={9}
                                        lists={[
                                            ['Deposit Amount', utils.convertToINRFormat(amount)],
                                            ['Maturity Amount', utils.convertToINRFormat(maturityAmount)], 
                                            ['Start Date', moment(new Date()).format('DD/MM/YYYY')],
                                            ['Maturity Date', this.getMaturityDate()],
                                            ['Interest Payment', (maturityAmount - amount)],
                                            ['Months', period],
                                        ]}
                                        panelTitleLabel={'Deposit Info'}/>
                                </View>

                                <View style={styles.innerContent}>
                                    <View style={styles.formRH}>
                                        <View style={styles.formRHF}>
                                            <CheckBox 
                                                onChange={()=>this.onChangeState('acceptTerms', !acceptTerms)}
                                                checked={acceptTerms}/>
                                        </View>
                                        <View style={styles.formRHL}>
                                            <TouchableOpacity onPress={()=>this.onChangeState('acceptTerms', !acceptTerms)}>
                                                <Text style={[styles.formRLT, COMMON_STYLES.textPrimary]}>Accept all terms and conditions of the scheme's, before you, continue to pay</Text>
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
                                                        disabled
                                                        onChange={()=>this.onChangeState('paymentType', 'neft')}
                                                        checked={paymentType === 'neft'}/>
                                                </View>
                                                <View style={styles.formRHL}>
                                                    <TouchableOpacity 
                                                        disabled
                                                        style={{opacity: 0.5}} 
                                                        onPress={()=>this.onChangeState('paymentType', 'neft')}>
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