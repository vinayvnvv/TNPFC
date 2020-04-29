import React from 'react';
import { connect } from 'react-redux';
import { Container, Header, Button, Icon, Body, Title, Left, Right, View, Text, Spinner } from 'native-base';
import { StyleSheet } from 'react-native';
import FDCalc from './fd-calc';
import Steps from './../common/components/steps';
import utils from '../../services/utils';
import { ScrollView } from 'react-native-gesture-handler';
import { THEME } from '../../../config';
import { fetchProductDetails } from '../../store/actions/common-actions';
import { COMMON_STYLES } from '../common/styles';
import PersonalInfo from './personal-info';
import AddressInfo from './address-info';
import moment from 'moment';
import apiServices from '../../services/api-services';
import NomineeInfo from './nominee-info';
import PaymentSection from './payment-section';
import { getInterestPayment } from '../common/components/fd-calculater';
import { NAVIGATION } from '../../navigation';
import TermsConditions from '../common/components/terms-condtions';

// import * as FileSystem from 'expo-file-system';
const DEBUG = false;
const steps = [
    {label: 'Select Plan'}, {label: 'Personal Information'}, {label: 'Address Information'}, 
    {label: 'Nominee Details'}, {label: 'Payment'},
];

class CreateFD extends React.Component {
    state = {
        currentStep: 0,
        init: false,
        panStatus: null,
        aadharStatus: null,
        otpStatus: null,
        // otpStatus: 'ok',
        data: {
            fdCalc: {},
            personalInfo: {},
            addressInfo: {},
            nomineeInfo: {},
        },
        authToken: null,
        createdUserData: null,
        accept: false,
        paymentType: 'rtgs',
        paymentStatus: null,
        txnDetails: null,
        transactionStatus: null,
        panStatusCode: null,
        termsModal: false,
    }
    scroll;
    async componentDidMount() {
        const {fetchProductDetails, productDetails} = this.props;
        if(!productDetails) await fetchProductDetails();
        this.setState({init: true});


        // const downloadResumable = FileSystem.createDownloadResumable(
        //     'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        //     FileSystem.documentDirectory + 'aa.pdf',
        //     {},
        //   );
        // const {uri} = await downloadResumable.downloadAsync();
        // console.log('Finished downloading to ', uri);

    }
    goBack = () => {
        const {navigation} = this.props;
        navigation.goBack();
    }
    goToTop = () => {
        if(this.scroll) this.scroll.scrollTo({x: 0, y: 0, animated: false});
     }
    onFDCalcSubmit = validate => {
        validate((err, values) => {
            console.log('onFDCalcSubmit', err, values);
            if(!err) {
                this.setState({
                    data: {
                        ...this.state.data,
                        fdCalc: values,
                    },
                    currentStep: 1,
                }, () => {
                    this.goToTop();
                })
            }
        });
    }
    onAddressFormSubmit = validate => {
        validate((err, values) => {
            console.log('onAddressFormSubmit', err, values);
            if(!err) {
                this.setState({
                    data: {
                        ...this.state.data,
                        addressInfo: values,
                    },
                    currentStep: this.state.currentStep + 1,
                }, () => {
                    this.goToTop();
                })
            }
        });
    }
    onNomineeFormSubmit = validate => {
        validate((err, values) => {
            console.log('onNomineeFormSubmit', err, values);
            if(!err) {
                this.setState({
                    data: {
                        ...this.state.data,
                        nomineeInfo: values,
                    },
                    currentStep: this.state.currentStep + 1,
                }, () => {
                    this.initPaymentSection();
                    this.goToTop();
                })
            }
        });
    }
    initPaymentSection = () => {
        this.sendOTP();
    }
    sendOTP = () => {
        const {
            otpVerfied,
            data: {
                personalInfo: {
                    mobile,
                }
            }
        } = this.state;
        if(!otpVerfied) {
            this.setState({otpStatus: 'loading'});
            apiServices.registerPhoneNumber(DEBUG ? '8197600944' : mobile).then(res => {
                const {data} = res;
                if(data.response) {
                    this.setState({
                        otpStatus: {type: 'sent', msg: data.response},
                    });
                }
            }).catch(err => {
                this.setState({otpStatus: false});
            })
        }
    }
    verifyOTP = otp => {
        const {
            data: {
                personalInfo: {
                    mobile,
                }
            }
        } = this.state;
        this.setState({
            otpStatus: 'loading',
        })
        apiServices.verifyRegisterPhonenumber(DEBUG ? '8197600944' : mobile, otp).then(res => {
            const {status, data} = res;
            console.log('verifyRegisterPhonenumber', data);
            if(status === 200) {
                this.setState({
                    otpStatus: 'ok',
                    authToken: data.authToken,
                });
            } else {
                this.setState({
                    otpStatus: {type: 'verify', msg: 'Invalid OTP'},
                })
            }
        }).catch(err => {
            this.setState({
                otpStatus: {type: 'verify', msg: err.status === 422 ? 'Invalid OTP' : 'Error in server, try again!'},
            })
        });
    }
    onAcceptChange = () => {
        if(this.state.accept) {
            this.setState({accept: !this.state.accept})
        } else {
            this.toggleTermsModal();
        }
        
    }
    validateAadhar = number => {
        if(this.state.aadharStatus === 'loading' || this.state.aadharStatus === true) return;
        const data = {
            number,
            "type": "aadhar"
        };
        this.setState({aadharStatus: 'loading'});
        console.log('validatePan', data);
        apiServices.documentVerify(data).then(res => {
            console.log('res--->', res.data);
            const {data} = res;
            this.setState({
                aadharStatus: data.responseCode === 1 ? true : 'Aadhaar Verification failed.',
            }, () => {
                if(data.responseCode === -1) {
                    this.validateAadhar(number);
                }
            });
        }).catch(err => {
            console.log(err);
            this.setState({
                aadharStatus: 'error occured while validating the PAN number',
            })
        })
    }
    validatePan = (pan, name, dob) => {
        if(this.state.panStatus === 'loading' || this.state.panStatus === true) return;
        const data = {
            "number": pan,
            "name": name,
            // "dob": moment(dob).format('DD/MM/YYYY'),
            "dob": moment(dob).toISOString(),
            "type": "pan"
        };
        this.setState({panStatus: 'loading'});
        console.log('validatePan', data);
        apiServices.documentVerify(data).then(res => {
            console.log('res--->', res.data);
            const {data} = res;
            this.setState({
                panStatusCode: data.responseCode,
                panStatus: 
                    data.responseCode === 1 || data.responseCode === 2 ? 
                    true : 
                    data.response ? data.response : 'Verification failed, enter valid PAN number. This may problem with the mismatching of PAN with your basic details that you have filled.',
            }, () => {
                if(data.responseCode === -1) {
                    try {
                        if(pan, name, dob) this.validatePan(pan, name, dob);
                    } catch(err) {
                        console.log(err);
                    }
                }
            });
        }).catch(err => {
            console.log(err);
            this.setState({
                panStatus: 'error occured while validating the PAN number',
            })
        })
    }
    onPersonalFormSubmit = validate => {
        validate((err, values) => {
            if(!err && this.state.aadharStatus === true && this.state.panStatus === true) {
                this.setState({
                    data: {
                        ...this.state.data,
                        personalInfo: values,
                    },
                    currentStep: this.state.currentStep + 1,
                }, () => {
                    this.goToTop();
                })
            }
        })
    }
    createFormData = () => {
        const {
            data: {
                fdCalc,
                personalInfo,
                addressInfo: {permanent, other, same},
                nomineeInfo: {nominee, is_guardian, guardian},
            },
            panStatusCode,
            paymentType,
        } = this.state;
        const {productDetails} = this.props;
        const productId = productDetails && productDetails.filter(
                    i=>String(i.productAliasName).toLowerCase().includes(fdCalc.scheme)
                );
        let address = {
            perAddress1: permanent.address_line_1,
            perAddress2: permanent.address_line_2,
            perState: permanent.state,
            perDistrict: permanent.district,
            perCity: permanent.city,
            perpinCode: permanent.pincode,
            addressProofType: permanent.addressProofType,
        };
        if(!same && other) {
            address = {
                ...address,
                corAddress1: other.address_line_1,
                corAddress2: other.address_line_2,
                corState: other.state,
                corDistrict: other.district,
                corCity: other.city,
                corpinCode: other.pincode,
            }
        } else {
            address = {
                ...address,
                corAddress1: permanent.address_line_1,
                corAddress2: permanent.address_line_2,
                corState: permanent.state,
                corDistrict: permanent.district,
                corCity: permanent.city,
                corpinCode: permanent.pincode,
            }
        }
        let gurdianData = {};
        console.log('guardn data-->', guardian, is_guardian);
        if(is_guardian && guardian) {
            gurdianData = {
                guardianName: guardian.name,
                guardianRelationship: guardian.relationship,
            }
        }
        const data = {
            productId: productId && productId[0].productId,
            categoryId: fdCalc.isSenior ? 'GENERAL_CATEGORY' : 'SENIOR_CITIZENS',
            period: fdCalc.period,
            interestPayment: getInterestPayment(fdCalc.interest),
            depositAmount: parseInt(fdCalc.amount).toFixed(2),
            rateOfInterest: fdCalc.ROI,
            maturityAmount: parseInt(fdCalc.maturityAmount).toFixed(2),
            title: personalInfo.gender === 'MALE' ? 'MR' : 'MRS',
            fName: personalInfo.first_name,
            // lName: personalInfo.last_name,
            dob: moment(personalInfo.dob).format('DD-MMM-YYYY'),
            gender: personalInfo.gender,
            phoneNumber: personalInfo.mobile,
            emailId: personalInfo.email,
            aadhaarNumber: personalInfo.aadhaar,
            panNumber: personalInfo.pan,
            residentialStatus: personalInfo.residence,
            nomineeName: nominee.name,
            nomineeDob: moment(nominee.dob).format('DD-MMM-YYYY'),
            nomineeRelationship: nominee.relationship,
            idProofUrl: 'url',
            profilePicUrl: 'url',
            addProofurl: 'url',
            ...gurdianData,
            ...address,
            verifiedPAN: panStatusCode === 1 ? 'Y' : 'N',
            verifiedAADHAAR: 'Y',
            paymentType: paymentType === 'net' ? 'NETBANKING' : 'RTGS',

        };
        return data;
        
    }

    onCancel = () => {
        this.setState({paymentStatus: null, txnDetails: 'failed'});
    }

    onPaymentComplete = () => {
        this.setState({paymentStatus: 'init'});
        const {navigation}  = this.props;
        console.log('onPaymentComplete', this.state.createdUserData);
        this.setState({transactionStatus: null});
        const {transactionId, merchantId, beneficiaryAccountNumber} = this.state.createdUserData;
        const paymentType = this.state.paymentType === 'net' ? 'NETBANKING' : 'RTGS';
        apiServices.getTxnDetails(merchantId, transactionId).then(_res => {
            console.log('getTxnDetails', _res.data);
            const d = _res.data;
            let transactionStatus = null;
            if(d.trans_status === 'F') transactionStatus = false;
            else transactionStatus = true;
            console.log('transactionStatus', transactionStatus);
            this.setState({transactionStatus, txnDetails: transactionStatus ? 'loading': null});
            if(transactionStatus === true) {
                apiServices.paymentSucess(transactionId || beneficiaryAccountNumber, this.state.authToken, paymentType).then(res => {
                    console.log('apiServices');
                    const {data} = res;
                    if(this.state.paymentType !== 'net') {
                        navigation.navigate(NAVIGATION.RTGS_SCREEN, {
                            paymentInfo: data,
                        });
                    }
                    console.log(data, data.response, data.response[0]);
                    if(data.responseCode === '200') {
                        console.log('success 200')
                        this.setState({txnDetails: data.response[0]});
                    } 
                    // else {
                    //     console.log('success not 200', res.data.responseCode, res.data);
                    //     this.setState({txnDetails: 'failed'});
                    // }
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

    finish = () => {
        const data = this.createFormData();
        console.log('createFormData', JSON.stringify(data));
        const {navigation}  = this.props;
        this.setState({paymentStatus: 'loading'});
        apiServices.createUser(data, this.state.authToken)
            .then(res => {
                const {data} = res;
                console.log('user created', data);
                this.setState({
                    createdUserData: data,
                }, () => {
                    const html = utils.getPaymentHTML(data);
                    this.setState({paymentStatus: 'loading'});
                    if(this.state.paymentType === 'net') {
                        navigation.navigate(NAVIGATION.PAYMENT_PAGE, {
                            html,
                            onPaymentComplete: this.onPaymentComplete,
                            onCancel: this.onCancel,
                        });
                    } else {
                        this.onPaymentComplete();
                    }
                    
                });
            }).catch(err => {
                console.log(err, err.data);
                this.setState({paymentStatus: null});
            })
    }
    onPreviousStep = () => {
        this.setState({
            currentStep: this.state.currentStep - 1,
        })
    }
    onPaymentTypeChange = (paymentType) => {
        this.setState({paymentType});
    }
    finishCreateFD = () => {
        const {navigation} = this.props;
        navigation.navigate(NAVIGATION.LOGIN);
    }
    onRePayment = () => {
        this.setState({
            paymentStatus: null,
            txnDetails: null,
            transactionStatus: null,
        })
    }
    goToTerms = () => {
        const {navigation} = this.props;
        navigation.navigate(NAVIGATION.TERMS);
    }
    toggleTermsModal = isOk => {
        this.setState({
            termsModal: !this.state.termsModal,
            accept: isOk ? true : this.state.accept,
        })
    }
    renderStepContainer = () => {
        const {
            currentStep,
            panStatus,
            data: {
                fdCalc,
                personalInfo,
                addressInfo,
                nomineeInfo,
            },
            aadharStatus,
            otpStatus,
            accept,
            paymentType,
            paymentStatus,
            transactionStatus,
            txnDetails,
            createdUserData,
        } = this.state;
        const {
            productDetails, 
            states, 
            districts, 
            relationships, 
            residentList, 
            addressProofDocs
        } = this.props;
        switch(currentStep) {
            case 0:
                return <FDCalc 
                        productDetails={productDetails} 
                        data={fdCalc}
                        onSubmit={this.onFDCalcSubmit}/>
            case 1:
                return <PersonalInfo 
                        data={personalInfo}
                        validatePan={this.validatePan}
                        validateAadhar={this.validateAadhar}
                        aadharStatus={aadharStatus}
                        panStatus={panStatus}
                        residentList={residentList}
                        onSubmit={this.onPersonalFormSubmit}
                        onPreviousStep={this.onPreviousStep} />
            case 2:
                return <AddressInfo 
                        states={states}
                        data={addressInfo}
                        districts={districts}
                        addressProofDocs={addressProofDocs}
                        onSubmit={this.onAddressFormSubmit}
                        onPreviousStep={this.onPreviousStep} />
            case 3:
                return <NomineeInfo 
                        relationships={relationships}
                        data={nomineeInfo}
                        onSubmit={this.onNomineeFormSubmit}
                        onPreviousStep={this.onPreviousStep} />
            case 4:
                return <PaymentSection 
                        otpStatus={otpStatus}
                        txnDetails={txnDetails}
                        transactionStatus={transactionStatus}
                        resendOTP={this.sendOTP}
                        finish={this.finish}
                        accept={accept}
                        createdUserData={createdUserData}
                        onRePayment={this.onRePayment}
                        finishCreateFD={this.finishCreateFD}
                        fdCalc={fdCalc}
                        goToTerms={this.goToTerms}
                        paymentStatus={paymentStatus}
                        personalInfo={personalInfo}
                        onAcceptChange={this.onAcceptChange}
                        paymentType={paymentType}
                        onPaymentTypeChange={this.onPaymentTypeChange}
                        verifyOTP={this.verifyOTP}
                        onPreviousStep={this.onPreviousStep} />
        }
    }
    renderStep = () => {
        const {currentStep, termsModal} = this.state;
        return <View style={[!termsModal ? utils.getBoxShadow(4, "#444") : {}, styles.stepTitleC]}>
                <Text style={styles.stepTitle}>
                    {steps[currentStep].label}
                </Text>
                <Text style={styles.stepSubTitle}>
                    Step {currentStep + 1} of {steps.length}
                </Text>
            </View>
    }
    render() {
        const {currentStep, init, termsModal} = this.state;
        return (
            init ? 
                <Container>
                    <Header>
                        <Left>
                            <Button transparent onPress={this.goBack}>
                                <Icon name='arrow-back' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Create New FD</Title>
                        </Body>
                        <Right />
                    </Header>
                    <View style={styles.container}>
                        {this.renderStep()}
                        <ScrollView 
                            ref={(c) => {this.scroll = c}}
                            style={styles.stepContent}>
                            <View style={styles.stepsC}>
                                <Steps 
                                    noShadow
                                    numberIndication
                                    steps={steps}
                                    hideLabel
                                    currentStep={currentStep}/>
                            </View>
                            {this.renderStepContainer()}
                        </ScrollView>
                        
                    </View>
                    <TermsConditions 
                        style={{zIndex: 999}}
                        onOk={()=>this.toggleTermsModal(true)}
                        onCancel={()=>this.toggleTermsModal()} 
                        visible={termsModal}/>
                </Container>
                :
                <Container>
                    <View style={COMMON_STYLES.spinnerContainerFullScreen}>
                        <Spinner />
                        <Text style={COMMON_STYLES.spinnerContainerFullScreenText}>Loading Data...</Text>
                    </View>
                </Container>
        );  
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    stepsC: {
        marginVertical: 13,
    },
    stepTitleC: {
        // ...utils.getBoxShadow(4, '#000'),
        backgroundColor: '#f0f0f0',
        paddingHorizontal: THEME.LAYOUT_PADDING,
        paddingVertical: 11,
    },
    stepTitle: {
        // textAlign: 'center',
        fontWeight: '700',
        fontSize: 18,
        color: '#333',
        marginBottom: 3,
    },
    stepSubTitle: {
        fontSize: 13,   
        color: '#555',
        marginTop: -2,
    },
    stepContent: {
        flex: 1,
        flexGrow: 1,
    }
})

const mapStateToProps = state => ({
    productDetails: state.commonReducer.productDetails,
    userDetails: state.commonReducer.userDetails,
    fdSummary: state.depositeReducer.fdSummary,
    states: state.commonReducer.states,
    districts: state.commonReducer.districts,
    relationships: state.commonReducer.relationships,
    residentList: state.commonReducer.residentList,
    addressProofDocs: state.commonReducer.addressProofDocs,
})
export default connect(
    mapStateToProps,
    {fetchProductDetails}
)(CreateFD);