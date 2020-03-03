import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import { THEME } from '../../../../config';
import ListItemPanel from '../../common/components/list-item-panel';
import { Button, Text } from 'native-base';
import utils from '../../../services/utils';
const width = Dimensions.get('window').width;
const Closure = ({
    fdSummary
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
    return (
        <View>
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
                        panelTitleLabel={'Closure'}
                        panelTitleValue={'RSIPN'}/>
                </View>
                <View style={styles.actions}>
                    <View style={{flexGrow: 1}}>
                        <Button primary danger style={styles.actionsBtn}>
                            <Text>Close FD</Text>
                        </Button>
                    </View>
                </View>
            </View>
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

