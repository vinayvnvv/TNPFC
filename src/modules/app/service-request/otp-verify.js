import React, { useState, useEffect } from 'react';
import {StyleSheet} from 'react-native';
import { View, Button, Text, Spinner, Toast } from 'native-base';
import FormItem from '../../common/components/form-item';
import { TextInput } from 'react-native-gesture-handler';
import apiServices from '../../../services/api-services';

const OTPVerify = ({
    panNumber,
    onVerify,
}) => {
    useEffect(() => {
        sendOtp();
    }, []);
    const [otp, setOtp] = useState('');
    const [otpSend, setOtpSent] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const onChangeText = v => {
        setOtp(v);
    }
    const sendOtp = () => {
        setOtpSent(null);
        apiServices.getOTP(panNumber).then((res) => {
            const {data} = res;
            if(data.response) {
                Toast.show({text: data.response});
            }
            setOtpSent(true);
        }).catch(err => {
            console.log(err);
            setOtpSent(true);
        });
    }
    const verifyOtp = () => {
        setVerifying(true);
        apiServices.verifyOTP(otp, panNumber).then(res => {
            const {data} = res;
            if(data.responseCode === '200') {
                if(onVerify) onVerify()
            }
            setVerifying(false);
        }).catch(err => {
            setVerifying(false);
            Toast.show({text: 'OTP entered in incorrect.', type: 'danger'});
        })
    }
    return (
        otpSend === null ? (
            <Spinner />
        ) : (
            <View>
                <FormItem 
                    label={'Enter Otp'} 
                    input={<TextInput autoFocus value={otp} onChangeText={onChangeText}/>}
                    isVertical/>
                <View style={styles.resendS}>
                    <Button transparent small onPress={sendOtp}>
                        <Text>Resend OTP</Text>
                    </Button>
                </View>
                {verifying ? (
                    <Spinner />
                ) : (
                    <Button success block disabled={otp.length === 0} onPress={verifyOtp}>
                        <Text>Verify OTP</Text>
                    </Button>
                )}
            </View>
        ) 
    )
}

const styles = StyleSheet.create({
    resendS: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: -26,
        marginBottom: 5,
    }
})

export default OTPVerify;