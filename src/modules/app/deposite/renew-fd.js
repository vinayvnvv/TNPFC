import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import { THEME } from '../../../../config';
import ListItemPanel from '../../common/components/list-item-panel';
import { Button, Text, Spinner } from 'native-base';
import utils from '../../../services/utils';
import SuccessScreen from '../../common/components/success-screen';
const width = Dimensions.get('window').width;
const RenewFD = ({
    fdSummary,
    onRenewFD,
    status,
}) => {
    const {
        interestAmount,
        depositAmount,
        productDesc,
        interestPaid,
        maturityDate,
        interestRatePercent,
        maturityAmount,
        openDate,
    } = fdSummary.length > 0 ? fdSummary[0] : {};
    const successData = status && status.data;
    return (
        <View>
            {status && status.type === 'renew' && status.status === 'success' ? (
                <SuccessScreen 
                    successText={'Your FD Re-new been submitted successfully'} 
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
                                ['Interest Payment', interestPaid],
                                ['Deposited Amount', depositAmount],
                                ['Maturity Amount', maturityAmount],
                                ['Interest Rate', interestRatePercent],
                                ['Duration', '5 years']
                            ]}
                            panelTitleLabel={'Schema Name'}
                            panelTitleValue={'RSIPN'}/>
                    </View>
                    <View style={styles.actions}>
                        <View style={styles.actionBtnC}>
                            <Button light style={styles.actionBtn} block>
                                <Text style={styles.actionBtnText}>Late Re-new FD</Text>
                            </Button>
                        </View>
                        <View style={styles.actionBtnC}>
                            {status && status.type === 'renew' && status.status === 'loading' ? (
                                <Spinner />
                            ) : (
                                <Button primary block onPress={onRenewFD}>
                                    <Text style={styles.actionBtnText}>Re-new FD</Text>
                                </Button>
                            )}
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

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
        width,
        marginTop: 9,
        marginLeft: -(THEME.LAYOUT_PADDING),
        // justifyContent: 'center',
    },
    actionBtnC: {
        width: '50%',
        paddingHorizontal: THEME.LAYOUT_PADDING,
    },
    actionBtn: {
        width: '100%',
    },
    actionBtnText: {
        textTransform: 'none'
    }
});

export default RenewFD;

