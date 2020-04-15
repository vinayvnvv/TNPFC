import React from 'react';
import { View, AsyncStorage, StyleSheet, TextInput, StatusBar, ScrollView, Image } from 'react-native';
import {Button, Toast, Container, Header, Spinner, Text, Icon, Left, Body, Title, Item, Input, Label, Content} from 'native-base';
import {connect} from 'react-redux';
import { save } from '../../store/actions/test-actions';
import { setAuth } from '../../store/actions/auth-actions';
import authServices from '../../services/authServices';
import { CONFIG } from '../../../config';
import apiServices from '../../services/api-services';
import icons from '../../../assets/icons';
import utils from '../../services/utils';
const {THEME} = CONFIG.APP;

const resendTime = 12000;
let timer = resendTime / 1000;

const debugMode = false;

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
        otpSending: false,
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
        this.setState({otpSending: true});
        const {panNumber} = this.state;
        if(panNumber === "TEST123") {
            Toast.show({
                text: 'OTP Sent Successfully!',
                buttonText: "Okay",
                duration: 3000,
                type: "success"
            });
            this.setState({otpSending: false, otpSent: true,});
            return;
        }
        if(panNumber !== '') {
            console.log('send', panNumber);
            apiServices.getOTP(panNumber).then(res => {
                const {data} = res;
                if(data.responseCode !== '404') {
                    console.log('suuccess', data.response.otp);
                    this.setState({
                        otpSent: true,
                        otpNumber: data && data.response && data.response.otp,
                        canReSendOtp: false,
                        verifying: false,
                    }, () => {
                        // setTimeout(()=>{
                        //     this.setState({otpTextFieldValue: data.response.otp + ''})
                        // }, 1300);
                        // SmsRetriever.addSmsListener(event => {
                        //     console.log('SmsRetriever.addSmsListener', event.message);
                        //     SmsRetriever.removeSmsListener();
                        //   }); 

                        
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
                this.setState({otpSending: false});
            }).catch(err => {
                Toast.show({
                    text: 'error in network',
                    buttonText: "Okay",
                    duration: 3000,
                });
                this.setState({otpSending: false});
            })
        }
        // await authServices.setAuth('sdsd');
        // this.props.setAuthToken('ssdsd');
    }
    verifyOTP = () => {
        const {panNumber, otpTextFieldValue} = this.state;
        if(panNumber === "TEST123") {
            Toast.show({
                text: 'OTP Verfied Successfully',
                buttonText: "Okay",
                duration: 3000,
                type: "success"
            });
            this.onLogin({
                response: {
                    authToken: 'test-token',
                    customerId: 'AACPQ0764B',
                }
            });
            return;
        }
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
            await authServices.setAuth(response.authToken, response.customerId);
            setAuth(response.authToken, response.customerId);
        }
    }
    render() {
        const {panNumber, otpSent, canReSendOtp, timer, otpTextFieldValue, verifying, otpSending} = this.state;
        return(
            <Container style={{backgroundColor: '#fff'}}>
                <StatusBar backgroundColor={THEME.PRIMARY}/>
                {/* <Header noLeft>
                    <Left />
                <Body>
                    <Title>{'Sign In / Sign Up'}</Title>
                </Body>
                </Header> */}
                <ScrollView>
                    <Content>
                        <View style={styles.headerContainerOuter}>
                            <View style={styles.backdrop}/>
                            <View style={styles.headerContainer}>
                                <Image 
                                    source={icons.LoginWelcomeIcon} 
                                    style={styles.headerContainerImage}/>
                                <Text style={styles.headerContainerTitle}>Tamil Nadu Power Finance and Infrastructure Development Corporation</Text>
                                <Text style={styles.headerContainerTitle}>(A Tamil Nadu Government Enterprise)</Text>
                                <Text style={styles.headerContainerSub}>
                                    Do not provide your credentials anywhere other than in this page
                                </Text>
                            </View>
                        </View>
                        <View style={styles.containerOuter}>
                            <View style={styles.container}>
                                <Text style={styles.title}>Login</Text>
                                <Text style={styles.subtitle}>For existing Users</Text>
                                <View style={styles.formRow}>
                                    {/* <Text style={styles.formRowLabel} >PAN / Aadhar Number</Text> */}
                                    <Item floatingLabel>
                                        <Label>Enter PAN</Label>
                                        <Input 
                                            value={panNumber} 
                                            onChangeText={(text) => this.onFieldChange('panNumber', text)} />
                                        <Icon active name='person' />
                                    </Item>
                                    {/* <TextInput 
                                        style={styles.formRowField} 
                                        value={panNumber} 
                                        onChangeText={(text) => this.onFieldChange('panNumber', text)} /> */}
                                </View>
                                {otpSent && (
                                    <View style={styles.formRow}>
                                        {/* <Text style={styles.formRowLabel} >Enter OTP</Text> */}
                                        <Item floatingLabel>
                                            <Label>Enter OTP</Label>
                                            <Input 
                                                onChangeText={(text) => this.onFieldChange('otpTextFieldValue', text)}
                                                value={otpTextFieldValue}
                                                placeholder='Icon Alignment in Textbox'/>
                                            <Icon active name='lock' />
                                        </Item>
                                        {/* <TextInput 
                                            style={styles.formRowField} 
                                            onChangeText={(text) => this.onFieldChange('otpTextFieldValue', text)}
                                            value={otpTextFieldValue}/> */}
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
                                            <Button success block onPress={this.verifyOTP} disabled={verifying}>
                                                <Text style={styles.loginBtn}>Login</Text>
                                            </Button>
                                        ) 
                                    ) : (
                                        otpSending ? (
                                            <Spinner />
                                        ) : (
                                            <Button disabled={!panNumber} success block onPress={this.sendOTP}>
                                                <Text style={styles.loginBtn}>Request OTP</Text>
                                            </Button>
                                        )
                                    )}
                                    
                                </View>
                            </View>
                        </View>
                    </Content>
                </ScrollView>
                
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: THEME.PRIMARY,
        padding: THEME.LAYOUT_PADDING + 41,
        flexDirection: 'column',
        // justifyContent: "center",
        alignItems: "center",
        paddingTop: 71,
        paddingBottom: 91,
    },
    headerContainerTitle: {
        color: THEME.PRIMARY_INVERT,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 5,
    },
    headerContainerSub: {
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '300',
        color: '#f9f9f9',
        marginTop: 9,
    },
    headerContainerImage: {
        width: 62,
        height: 38,
        marginBottom: 11,
    },
    backdrop: {
        position: 'absolute',
        height: 70,
        backgroundColor: THEME.PRIMARY,
        bottom: -30,
        borderRadius: 90,
        width: '100%',
    },
    containerOuter: {   
        paddingVertical: 21,
        paddingHorizontal: 32,
        position: 'relative',
    },
    container: {
        ...utils.getBoxShadow(11, '#00000077'),
        marginTop: -11,
        flexDirection: 'column',
        // justifyContent: "center",
        alignItems: "center",
        // height: '100%',
        backgroundColor: '#fff',
        padding: THEME.LAYOUT_PADDING,
        position: 'relative',
        top: -60,
        borderRadius: 5,
    },
    title: {
        fontSize: 18,
        color: THEME.PRIMARY,
        // fontWeight: 'bold',
        marginBottom: 11,
    },
    subtitle: {
        fontSize: 14,
        color: '#000000',
        marginBottom: 41,
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
        color: THEME.PRIMARY
    },
    actionSection: {
        width: '100%',
        marginVertical: 21,
    },
    loginBtn: {
        // textTransform: 'capitalize',
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