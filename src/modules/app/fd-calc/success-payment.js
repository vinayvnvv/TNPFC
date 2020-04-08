import React from 'react';
import { COMMON_STYLES } from '../../common/styles/index.js';
import { View, Text, Button, Icon } from 'native-base';
import {StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import utils from '../../../services/utils.js';
import { THEME } from '../../../../config.js';

const SuccessPayment = ({
    txnDetails,
    onCompleteClick,
    transactionStatus,
    goToStep,
    completeText,
    pgPayloadData: {
        transactionId,
    } = {}
}) => {
    console.log('SuccessPayment', txnDetails);
    return (
        <View>
            {(txnDetails === 'loading' || transactionStatus === null)  && (
                <View style={[COMMON_STYLES.spinnerContainerFullScreen, {marginTop: 50, height: 300}]}>
                    <LottieView
                        style={{width: 80, height: 80}}
                        autoPlay
                        source={require('./../../../../assets/anim/loader-1.json')}
                    />
                    <Text style={COMMON_STYLES.spinnerContainerFullScreenText}>Fetching Transaction...</Text>
                </View>
            )}
            {transactionStatus === false && (
                <View style={styles.successView}>
                    <Icon name={'close-circle'} style={{fontSize: 52, color: THEME.DANGER}} />
                    <View style={{height: 11}} />
                    <Text style={styles.successText}>Payment Failed</Text>
                    <View style={{height: 21}}/>
                    <Text>Transaction Id: {transactionId}</Text>
                    <View style={{height: 21}} />
                    <Button block onPress={() => goToStep(0)}>
                        <Text>Back</Text>
                    </Button>
                </View>
            )}
            {txnDetails && txnDetails !== 'loading' && txnDetails !== 'failed' && (
                <View style={styles.successView}>
                    <LottieView
                        style={{width: 80, height: 80}}
                        autoPlay
                        loop={false}
                        source={require('./../../../../assets/anim/anim-check.json')}
                    />
                    <Text style={styles.successText}>Payment Success</Text>
                    <View style={{height: 20}}/>
                    {transactionId && (
                        <View style={styles.dtR}>
                            <View style={styles.dtRL}>
                                <Text style={styles.dtRLT}>Transaction ID:</Text>
                            </View>
                            <View style={styles.dtRV}>
                                <Text style={styles.dtRVT}>{transactionId}</Text>
                            </View>
                        </View>
                    )}
                    <View style={styles.dtR}>
                        <View style={styles.dtRL}>
                            <Text style={styles.dtRLT}>Account Number:</Text>
                        </View>
                        <View style={styles.dtRV}>
                            <Text style={styles.dtRVT}>{txnDetails['ACCOUNTNUMBER']}</Text>
                        </View>
                    </View>
                    <View style={styles.dtR}>
                        <View style={styles.dtRL}>
                            <Text style={styles.dtRLT}>Start Date:</Text>
                        </View>
                        <View style={styles.dtRV}>
                            <Text style={styles.dtRVT}>{utils.getAppCommonDateFormat(txnDetails['OPENDATE'])}</Text>
                        </View>
                    </View>
                    <View style={styles.dtR}>
                        <View style={styles.dtRL}>
                            <Text style={styles.dtRLT}>Deposit Amount:</Text>
                        </View>
                        <View style={styles.dtRV}>
                            <Text style={styles.dtRVT}>{txnDetails['DEPOSITAMOUNT'] ? utils.convertToINRFormat(txnDetails['DEPOSITAMOUNT']) : '---'}</Text>
                        </View>
                    </View>
                    <View style={{height: 21}} />
                    <Button block onPress={onCompleteClick}>
                        <Text>{completeText ? completeText : 'Complete Profile'}</Text>
                    </Button>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    successView: {
        marginVertical: 31,
        flexDirection: 'column',
        alignItems: 'center',
    },
    successText: {
        fontWeight: '700',
        fontSize: 20
    },
    dtR: {
        flexDirection: 'row',
        marginVertical: 7,
        alignItems: 'center'
    },
    dtRL: {
        width: '50%',
        paddingRight: 7,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    dtRLT: {
        color: '#666',
        fontSize: 14,
    },
    dtRV: {
        width: '50%',
        paddingLeft: 7,
    },
    dtRVT: {
        color: '#222',
        fontWeight: '700'
    }
});

export default SuccessPayment;