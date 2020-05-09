import React from 'react';
import { Text, View, Button } from 'native-base';
import {StyleSheet, Dimensions, Platform, ScrollView} from 'react-native';
import {WebView} from 'react-native-webview';
import { THEME } from '../../../../config';
import utils from '../../../services/utils';
import ListItemPanel from '../../common/components/list-item-panel';
import Timeline from '../../common/components/timeline';

const FDSummary = ({
    fdSummary,
})  => {
    const {
        interestAmount,
        depositAmount,
        productDesc,
        maturityDate,
        interestRatePercent,
        openDate,
        accountStatus,
    } = fdSummary.length > 0 ? fdSummary[0] : {};
    const graphPercet = (100 * interestAmount) / depositAmount;
    const graphInterst = graphPercet / 100;
    const graphDeposite = 1 - graphInterst;
    const slices = [
        { percent: graphInterst, color: THEME.SUCCESS },
        { percent: graphDeposite, color: THEME.PRIMARY },
    ];
    const getPerceVal = num => {
        return (num * 100).toFixed(2) + '%';
    }
    const chartAsHTML = utils.getPieChartAsHTML(slices);
    const getSummaryStatus = type => {
        let color = '';
        let text = '';
        if(accountStatus === 'NEW') {
            text = 'Active';
            color = THEME.SUCCESS;
        }
        if(accountStatus === 'MATURED') {
            text = 'Matured';
            color = THEME.ORANGE;
        }
        if(accountStatus === 'CLOSED') {
            text = 'Closed';
            color = THEME.DANGER;
        }
        if(type === 'text') {
            return text;
        }
        if(type === 'color') {
            return {backgroundColor: color};
        }
    }
    return (
        <View >
            <View style={styles.container}>
                <View style={styles.activeSection}>
                    <View style={styles.actionC}>
                        <View style={[styles.activeI, getSummaryStatus('color')]} />
                        <Text style={styles.activeT}>{getSummaryStatus('text')}</Text>
                    </View>
                    {/* <Button small warning>
                        <Text>Download</Text>
                    </Button> */}
                </View>
                <View style={styles.chartSection}>
                    <Text style={styles.chartSectionTitle}>Deposit & Interest Breakup</Text>
                    <View style={styles.chartContainer}>
                        {Platform.OS === 'web' ? 
                            <div style={{
                                display: 'flex', justifyContent: 'center'
                            }} dangerouslySetInnerHTML={{ __html: chartAsHTML }} /> : 
                            <WebView style={styles.chart}  source={{ html: chartAsHTML }} />
                        }
                    </View>
                    <View style={styles.chartLegenC}>
                        <View style={styles.chartLegenR}>
                            <View style={styles.chartLegenI}/>
                            <Text style={styles.chartLegenT}>Deposit Amount({getPerceVal(graphDeposite)})</Text>
                        </View>
                        <View style={styles.chartLegenR}>
                            <View style={[styles.chartLegenI, styles.chartLegenISuccess]}/>
                            <Text style={styles.chartLegenT}>Interest Amount ({getPerceVal(graphInterst)})</Text>
                        </View>
                    </View>
                    <View style={styles.chartTC}>
                        <View style={styles.chartTI}>
                            <View style={styles.chartTL}>
                                <Text style={styles.chartTLText}>Deposit Amount</Text>
                            </View>
                            <View style={styles.chartTV}>
                                <Text style={styles.chartTVText}>{utils.convertToINRFormat(depositAmount)}</Text>
                            </View>
                        </View>
                        <View style={[styles.chartTI, styles.chartTISuccess]}>
                            <View style={[styles.chartTL, styles.chartTLSuccess]}>
                                <Text style={styles.chartTLText}>Interest Amount</Text>
                            </View>
                            <View style={styles.chartTV}>
                                <Text style={styles.chartTVText}>{utils.convertToINRFormat(interestAmount)}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.schemaPanel}>
                    <ListItemPanel 
                        lists={
                            [
                                ['Start Date', utils.getAppCommonDateFormat(openDate)],
                                ['Maturity Date', utils.getAppCommonDateFormat(maturityDate)],
                                ['Rate of Interest', interestRatePercent + '%']
                            ]
                        }
                        panelTitleValue={productDesc}
                        noHoverEffect={true}
                        panelTitleLabel={'Scheme Name'}/>
                </View>
                {/* <View style={styles.timeLineC}>
                    <Text style={styles.timeLineT}>Timeline</Text>
                    <Timeline />
                </View> */}
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        padding: THEME.LAYOUT_PADDING,
        // flex: 1,
        // height: 1000,
    },
    activeSection: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between'
    },
    actionC: {
        flexDirection: 'row',
        alignItems: "center",
    },
    activeI: {
        backgroundColor: THEME.SUCCESS,
        marginRight: 15,
        height: 11,
        width: 11,
        borderRadius: 11,
    },
    activeT: {
        fontWeight: 'bold'
    },
    chartSection: {
        ...utils.getBoxShadow(6, '#00000088'),
        backgroundColor: '#fff',
        paddingBottom: 21,
        marginTop: 21,
    },
    chartSectionTitle: {
        color: '#555',
        fontWeight: 'bold',
        margin: 21,
    },
    chartContainer: {
        display: 'flex',
        justifyContent: 'center',
        padding: 11,
        height: 250,
        width: "100%"
    },
    chart: {
        // width: Platform.OS === 'web' ? chartSize + 'px' : chartSize,
        // height: Platform.OS === 'web' ? chartSize + 'px' : chartSize,
        flexDirection: "row",
        justifyContent: "center",
    },
    chartLegenC: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 13,
    },
    chartLegenR: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    chartLegenT: {
        fontSize: 12,
        color: '#666'
    },
    chartLegenI: {
        width: 12,
        height: 12,
        backgroundColor: THEME.PRIMARY,
        marginRight: 7,
    },
    chartLegenISuccess: {
        backgroundColor: THEME.SUCCESS,
    },
    chartTC: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    chartTI: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: THEME.PRIMARY + '88',
        borderRadius: 5,
        flexGrow: 1,
        margin: 15,
    },
    chartTISuccess: {
        borderColor: THEME.SUCCESS + '88',
    },
    chartTL: {
        padding: 5,
        borderBottomColor: THEME.PRIMARY + '88',
        borderBottomWidth: 1,
        borderStyle: 'dashed',
    },
    chartTLSuccess: {
        borderBottomColor: THEME.SUCCESS + '88',
    },
    chartTV: {
        padding: 5,
    },
    chartTLText: {
        textAlign: 'center',
    },
    chartTVText: {
        color: '#555',
        textAlign: 'center',
    },
    schemaPanel: {
        marginTop: 21,
    },
    timeLineC: {
        marginTop: 21,
    }, 
    timeLineT: {
        marginBottom: 11,
        color: '#999',
        fontWeight: 'bold',
        fontSize: 15,
    }
})

export default FDSummary;