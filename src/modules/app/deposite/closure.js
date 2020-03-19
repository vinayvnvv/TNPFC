import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import { THEME } from '../../../../config';
import ListItemPanel from '../../common/components/list-item-panel';
import { Button, Text, Toast, Spinner } from 'native-base';
import utils from '../../../services/utils';
import SuccessScreen from '../../common/components/success-screen';
const width = Dimensions.get('window').width;
const Closure = ({
    fdSummary,
    depositClosure,
    status,
}) => {
    const {
        interestAmount,
        depositAmount,
        productDesc,
        interestPaid,
        isDepositClosable,
        maturityDate,
        interestRatePercent,
        maturityAmount,
        openDate,
    } = fdSummary.length > 0 ? fdSummary[0] : {};
    const closeFD = () => {
        if(isDepositClosable === 'Y') {
            depositClosure();
        } else {
            Toast.show({
                text: "Closing this Deposit through online is not possible. Please. contact Branch.",
                buttonText: "Okay",
                duration: 3000,
                type: "warning"
            })
        }
    }
    const successData = status && status.data;
    return (
        <View>
            {status && status.type === 'depositClosure' && status.status === 'success' ? (
                <SuccessScreen 
                    successText={'Your FD Closure request been submitted successfully'} 
                    refNumber={successData && successData.ACK_ID}/>
            ) : (
                <View style={styles.container}>
                    <View style={styles.section}>
                        <ListItemPanel 
                            itemWidth={'50%'}
                            noHoverEffect={true}
                            lists={[
                                ['Start Date', utils.getAppCommonDateFormat(openDate)],
                                ['Maturity Date', utils.getAppCommonDateFormat(maturityDate)],
                                ['Interest Payment', interestAmount],
                                ['Deposited Amount', depositAmount],
                                ['Maturity Amount', maturityAmount],
                                ['Interest Rate', interestRatePercent],
                                ['Duration', '5 years']
                            ]}
                            panelTitleLabel={'Closure'}
                            panelTitleValue={productDesc}/>
                    </View>
                    <View style={styles.actions}>
                        <View style={{flexGrow: 1}}>
                            {status && status.type === 'depositClosure' && status.status === 'loading' ? (
                                    <Spinner />
                                ) : (
                                    <Button 
                                        primary 
                                        onPress={closeFD}
                                        danger 
                                        style={styles.actionsBtn}>
                                            <Text>Close Fixed Deposit</Text>
                                    </Button>
                                )
                            }
                        </View>
                    </View>
                </View>
            )}
        </View>
    )
};  

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: THEME.LAYOUT_PADDING,
    },
    section: {
        marginVertical: 0,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: 9,
    },
    actionsBtn: {
        flexDirection: 'row', 
        justifyContent: 'center'
    }
});

export default Closure;

