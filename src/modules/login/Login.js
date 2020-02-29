import React from 'react';
import { View, AsyncStorage, StyleSheet, TextInput, Text, StatusBar } from 'react-native';
import {Button, Toast, Container, Header, Content, Spinner} from 'native-base';
import {connect} from 'react-redux';
import { save } from '../../store/actions/test-actions';
import { setAuth } from '../../store/actions/auth-actions';
import authServices from '../../services/authServices';
import { CONFIG } from '../../../config';
import apiServices from '../../services/api-services';
const {THEME} = CONFIG.APP;

const resendTime = 12000;
let timer = resendTime / 1000;

const debugMode = true;

class Login extends React.Component {
    state= {
        v: '',
        panNumber: '',
        otpSent: false,
        otpNumber: null,
        canReSendOtp: false,
        timer,
        otpTextFieldValue: '',
        verifying: false,
    }
    intervalCouter;
    timeoutInstance;
    componentDidMount() {
        AsyncStorage.getItem('cc').then((v) => {
            this.setState({v: v});
        })  
    }

    onFieldChange = (field, value) => {
        console.log(field, value)
        this.setState({
            [field]: value,
        });
    }

    handleResendTimer = () => {
        this.intervalCouter = setInterval(() => {
            --timer;
            if(timer === 1) {
                this.setState({
                    canReSendOtp: true,
                });
                timer = resendTime;
                clearInterval(this.intervalCouter);
            }
            this.setState({
                timer,
            });
        }, 1000);
    }
    componentWillUnmount() {
        clearInterval(this.intervalCouter);
        clearTimeout(this.timeoutInstance);
    }
    sendOTP = async () => {
        console.log('send')
        const {panNumber} = this.state;
        if(panNumber !== '') {
            console.log('send', panNumber);
            apiServices.getOTP(panNumber).then(res => {
                const {data} = res;
                if(data.responseCode === '200') {
                    console.log('suuccess', data.response.otp);
                    this.setState({
                        otpSent: true,
                        otpNumber: data && data.response && data.response.otp,
                        canReSendOtp: false,
                        verifying: false,
                    }, () => {
                        if(debugMode) {
                            Toast.show({
                                text: 'OTP is ' + data.response.otp,
                                buttonText: "Okay",
                                duration: 7000,
                                type: "success"
                            });
                        } else {
                            Toast.show({
                                text: 'OTP Sent Successfully!',
                                buttonText: "Okay",
                                duration: 3000,
                                type: "success"
                            });
                        }
                        
                        this.handleResendTimer();
                    });
                } else {
                    console.log(data.message);
                    Toast.show({
                        text: data.message,
                        buttonText: "Okay",
                        duration: 3000,
                        type: "danger"
                    });
                }
            }).catch(err => {
                Toast.show({
                    text: 'error in network',
                    buttonText: "Okay",
                    duration: 3000,
                });
            })
        }
        // await authServices.setAuth('sdsd');
        // this.props.setAuthToken('ssdsd');
    }
    verifyOTP = () => {
        const {panNumber, otpTextFieldValue} = this.state;
        this.setState({
            verifying: true,
        })
        this.timeoutInstance = setTimeout(() => {
            this.setState({
                verifying: false,
            });
            Toast.show({
                text: 'Otp or Pan number is invalid.',
                buttonText: "Okay",
                duration: 3000,
                type: "danger"
            });
        }, 9000);
        apiServices.verifyOTP(otpTextFieldValue, panNumber).then(res=>{
            const {data} = res;
            if(data.responseCode === '200') {
                Toast.show({
                    text: 'OTP Verfied Successfully',
                    buttonText: "Okay",
                    duration: 3000,
                    type: "success"
                });
                this.onLogin(data);
            } else {
                Toast.show({
                    text: 'Otp or Pan number is invalid.',
                    buttonText: "Okay",
                    duration: 3000,
                    type: "danger"
                });
            }
            this.setState({verifying: false});
            clearTimeout(this.timeoutInstance);
        }).catch(err=> {
            Toast.show({
                text: 'Error in connection!',
                buttonText: "Okay",
                duration: 3000,
            });
            this.setState({verifying: false});
            clearTimeout(this.timeoutInstance);
        })
    }
    onLogin = async (data) => {
        const {setAuth} = this.props;
        const {response} = data || {};
        if(response) {
            await authServices.setAuth(response.token, response.customerId);
            setAuth(response.token, response.customerId);
        }
    }
    render() {
        const {panNumber, otpSent, canReSendOtp, timer, otpTextFieldValue, verifying} = this.state;
        return(
            <Container style={{height: '100%'}}>
                <View style={styles.container}>
                    <StatusBar backgroundColor={THEME.PRIMARY}/>
                    <Text style={styles.title}>Log In</Text>
                    <Text style={styles.subTitle}>Enter below details to proceed forward</Text>
                    <View style={styles.formRow}>
                        <Text style={styles.formRowLabel} >PAN / Aadhar Number</Text>
                        <TextInput 
                            style={styles.formRowField} 
                            value={panNumber} 
                            onChangeText={(text) => this.onFieldChange('panNumber', text)} />
                    </View>
                    {otpSent && (
                        <View style={styles.formRow}>
                            <Text style={styles.formRowLabel} >Enter OTP</Text>
                            <TextInput 
                                style={styles.formRowField} 
                                onChangeText={(text) => this.onFieldChange('otpTextFieldValue', text)}
                                value={otpTextFieldValue}/>
                        </View>
                    )}
                    {otpSent && canReSendOtp && (
                        <View style={styles.otpSection}>
                            <Button small transparent onPress={() => this.sendOTP()}>
                                <Text style={styles.otpBtn}>Resend OTP</Text>
                            </Button>
                        </View>
                    )}
                    {otpSent && !canReSendOtp && (
                        <View style={styles.otpSection}>
                                <Text style={styles.otpBtn}>Resend OTP in {timer}</Text>
                        </View>
                    )}
                    <View style={styles.actionSection}>
                        {otpSent ? (
                            verifying ? (
                                <Spinner />
                            ) : (
                                <Button warning block onPress={this.verifyOTP} disabled={verifying}>
                                    <Text style={styles.loginBtn}>Login</Text>
                                </Button>
                            ) 
                        ) : (
                            <Button warning block onPress={this.sendOTP}>
                                <Text style={styles.loginBtn}>Get Otp</Text>
                            </Button>
                        )}
                        
                    </View>
                </View>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        height: '100%',
        backgroundColor: THEME.PRIMARY,
        padding: THEME.LAYOUT_PADDING + 21,
    },
    title: {
        fontSize: 21,
        color: THEME.PRIMARY_INVERT,
        textTransform: "uppercase",
        fontWeight: 'bold',
    },
    subTitle: {
        fontSize: 18,
        color: THEME.PRIMARY_INVERT,
        marginTop: 17,
        marginBottom: 51,
        textAlign: "center"
    },
    formRow: {
        flexDirection: 'column',
        width: "100%",
        marginBottom: 21
    },
    formRowLabel: {
        color: THEME.PRIMARY_INVERT,
        marginBottom: 9,
        fontSize: 16
    },
    formRowField: {
        backgroundColor: "#ffffff",
        width: '100%',
        height: 42,
        paddingHorizontal: 11,
    },
    otpSection: {
        alignItems: 'flex-end',
        width: '100%'
    },
    otpBtn: {
        color: '#ffffff'
    },
    actionSection: {
        width: '100%',
        marginVertical: 21,
    },
    loginBtn: {
        color: "#444444",
        textTransform: 'uppercase',
        fontWeight: '500',
        letterSpacing: 0.7,
        fontSize: 18
    }
})

const mapStateToProps = state => ({
    data: state.testReducer.data,
})

export default connect(
    mapStateToProps,
    {save, setAuth},
)(Login)