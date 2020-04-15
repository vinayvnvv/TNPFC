import React, {useState} from 'react';
import { StyleSheet } from 'react-native';
import StepNavigation from './step-navigation';
import { View, Icon, Item, Input, Label, Text, Button, Spinner } from 'native-base';
import { THEME } from '../../../config';
import utils from '../../services/utils';
import CheckBox from '../common/components/checkbox';
import ListItemPanel from '../common/components/list-item-panel';
import SuccessPayment from '../app/fd-calc/success-payment';
import { TouchableOpacity } from 'react-native-gesture-handler';

const PaymentSection = ({
    onPreviousStep,
    otpStatus,
    resendOTP,
    verifyOTP,
    finish,
    accept,
    onAcceptChange,
    fdCalc,
    personalInfo,
    onPaymentTypeChange,
    paymentType,
    paymentStatus,
    createdUserData,
    onRePayment,
    finishCreateFD,
    txnDetails,
    transactionStatus,
    goToTerms,
}) => {
    const [otp, setOtp] = useState('');
    return (
        <View style={styles.container}>
            {otpStatus !== 'ok' && (
                <View style={styles.otpC}>
                    <Icon 
                        style={[styles.otpCIcon, otpStatus === 'ok' ? styles.otpCIconSuccess : {}]} 
                        name={otpStatus === 'ok' ? 'checkmark' : 'phone-portrait'}/>
                    {otpStatus !== 'ok' && <Text style={styles.otpCTitle}>Verification</Text>}
                    {otpStatus === 'ok' && <Text style={[styles.otpCTitle, {color: THEME.SUCCESS}]}>Verified</Text>}
                    {otpStatus === 'loading' && <Spinner />}
                    {otpStatus === false && <Text style={styles.err}>Error in server!, Click on Resend.</Text>}
                    {otpStatus && otpStatus !== 'loading' && otpStatus.type === 'sent' && (
                        <Text style={styles.otpCTitleInfoStatus}>{otpStatus.msg}</Text>
                    )}
                    {otpStatus && otpStatus !== 'loading' && otpStatus.type === 'verify' && (
                        <Text style={styles.err}>{otpStatus.msg}</Text>
                    )} 
                    {otpStatus !== 'ok' && (
                        <>
                            <Item floatingLabel>
                                <Label>Enter OTP</Label>
                                <Input value={otp} onChangeText={(v) => setOtp(v)}/>
                            </Item>
                            <View style={styles.resendC}>
                                <Button transparent onPress={resendOTP}>
                                    <Text style={styles.resendCText}>Resend OTP</Text>
                                </Button>
                            </View>
                            <Button block style={styles.verifyBtn} onPress={()=>verifyOTP(otp)}>
                                <Text>Verify</Text>
                            </Button>
                        </>
                    )}
                    
                </View>
            )}
            {otpStatus === 'ok' && paymentStatus !== 'init' && (
                <View style={styles.acceptC}>
                    <View style={styles.verifiedC}>
                        <Icon style={styles.verifiedCI} name={'checkmark'}/>
                        <Text style={[styles.verifiedCT]}>Verified</Text>
                    </View>
                    <View style={styles.paymentInfo}>
                        <ListItemPanel 
                            panelTitleLabel={'Payment Info'}
                            itemWidth={'50%'}
                            lists={[
                                ['Deposit Amount', fdCalc.amount],
                                ['Maturity Date', fdCalc.maturityDate],
                                ['First Name', personalInfo.first_name],
                                ['Last Name', personalInfo.last_name],
                                ['Mobile Number', personalInfo.mobile],
                                ['PAN Number', personalInfo.pan]
                            ]}/>
                    </View>
                    <View style={styles.acR}>
                        <CheckBox checked={accept} onChange={onAcceptChange}/>
                        <Text style={styles.acRText}>Accept all terms and conditions of the scheme's, before you, continue to pay</Text>
                    </View>
                    <View style={styles.acR}>
                        <View style={{width: 24}}/>
                        <TouchableOpacity style={{flexGrow: 1}} onPress={goToTerms}>
                            <Text style={styles.acRTextBlue}>Terms and Conditions</Text>
                        </TouchableOpacity>
                    </View>
                    <Text>Payment Type</Text>
                    <View style={styles.acR}>
                        <CheckBox checked={paymentType === 'net'} onChange={() => onPaymentTypeChange('net')}/>
                        <Text style={styles.acRText}>Net Banking / UPI / Debit Card</Text>
                    </View>
                    <View style={[styles.acR, styles.acRCenter, {marginTop: -5}]}>
                        <CheckBox checked={paymentType === 'rtgs'} onChange={() => onPaymentTypeChange('rtgs')}/>
                        <Text style={[styles.acRText]}>RTGS / NEFT</Text>
                    </View>
                </View>
            )}
            {paymentStatus === 'loading' && (
                <Spinner style={{alignSelf: 'center'}}/>
            )}
            {paymentStatus === 'init' && (
                <SuccessPayment 
                    txnDetails={txnDetails} 
                    completeText={'Login'}
                    goToStep={onRePayment}
                    onCompleteClick={finishCreateFD}
                    pgPayloadData={createdUserData}
                    transactionStatus={transactionStatus}/>
            )}
            {paymentStatus !== 'loading' && paymentStatus !== 'init' && 
                <StepNavigation 
                    nextBtn={'Continue To Pay'} 
                    prevBtn={'Previous'}
                    onNext={finish}
                    disableNext={otpStatus !== 'ok' || !accept || !paymentType ? true : false}
                    onPrev={onPreviousStep}/>
            }
            
        </View>

    );
};
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: THEME.LAYOUT_PADDING,
        paddingVertical: THEME.LAYOUT_PADDING,
    }, 
    acR: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 15,
    },
    acRCenter: {
        alignItems: 'center'
    },
    acRText: {
        flexGrow: 1,
        flex: 1,
        marginLeft: 11,
        fontSize: 13,
        fontWeight: '500'
    },
    acRTextBlue: {
        fontSize: 13,
        color: THEME.PRIMARY,
        fontWeight: '700',
    },
    verifiedC: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 7,
        paddingHorizontal: 15,
        borderColor: THEME.SUCCESS,
        borderRadius: 5,
        borderStyle: 'solid',
        borderWidth: 2,
        alignSelf: 'center',
        marginBottom: 21,
    },
    verifiedCI : {
        fontSize: 33,
        color: THEME.SUCCESS,
        marginRight: 11,
    },
    verifiedCT: {
        fontSize: 21,
        color: THEME.SUCCESS,
        fontWeight: '700'
    },
    otpC: {
        ...utils.getBoxShadow(5, '#d9d9d9'),
        flexDirection: 'column',
        alignItems: 'center',
        width: '85%',
        alignSelf: 'center',
        marginBottom: 104,
        marginTop: 33,
        backgroundColor: '#fff',
        paddingHorizontal: 21,
        paddingVertical: 41,
        borderRadius: 7,
    },
    otpCTitle: {
        fontSize: 21,
        color: THEME.INFO,
        fontWeight: '700',
        marginTop: 9,
        marginBottom: 21,
    },
    otpCIcon: {
        fontSize: 52,
        marginBottom: 7,
    },
    otpCIconSuccess: {
        color: THEME.SUCCESS,
        borderWidth: 2,
        padding: 15,
        borderRadius: 70,
        borderStyle: 'solid',
        borderColor: THEME.SUCCESS,
    },
    verifyBtn: {
        marginTop: 27,
    },
    otpCTitleInfoStatus: {
        color: THEME.INFO,
        fontWeight: '700',
        fontSize: 12,
        marginBottom: 11,
    },
    err: {
        color: THEME.DANGER,
        fontSize: 12,
    },
    resendC: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 5,
        width: '100%'
    },
    resendCText: {
        fontSize: 12,
    }
});

export default PaymentSection;