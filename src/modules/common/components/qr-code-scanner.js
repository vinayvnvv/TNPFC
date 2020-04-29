import React from 'react';
import { View, Text, Container, Header, Left, Button, Icon, Right, Body, Title, Spinner, Toast } from 'native-base';
import { StyleSheet, Platform, Dimensions } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { THEME } from '../../../../config';
import { COMMON_STYLES } from '../styles';
import apiServices from '../../../services/api-services';
import { ScrollView } from 'react-native-gesture-handler';
import utils from './../../../services/utils';

class QRCodeScanner extends React.Component {
    state = {
        hasPermission: null,
        scanned: false,
        loading: false,
        // data: {
        //     "accountNumber": "0120100378661",
        //     "productDesc": "RIPS Regular Interest Payment",
        //     "customerName": "SAGAYA SELVI  M",
        //     "customerId": "C000851867",
        //     "custCategory": "GENERAL_CATEGORY",
        //     "openDate": "2018-12-06T18:30:00.000Z",
        //     "depositAmount": 100000,
        //     "tenure": 60,
        //     "interestRatePercent": 8.31,
        //     "intpayFrequency": "Quarterly",
        //     "maturityAmount": 100000,
        //     "interestAmount": 41550,
        //     "periodicIntAmount": 2077.5,
        //     "maturityDate": "2023-12-06T18:30:00.000Z",
        //     "nomineeName": "Not Applicable",
        //     "depositAccountType": "INDIVIDUAL",
        //     "jointHolder1": "Not Applicable",
        //     "jointHolder2": "Not Applicable"
        // },
        data: null,
        errMsg: null,
    };
    scanned = false;
    async componentDidMount() {
        if(Platform.OS !== 'web') {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            this.setState({hasPermission: status === 'granted'});
        }
        
    }
    handleBarCodeScanned({type, data}) {
        this.scanned = true;
        this.loadData(data);
        this.setState({scanned: true});
        console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
    }
    goBack = () => {
        const {navigation} = this.props;
        navigation.goBack();
    }
    loadData = encDepositNumber => {
        this.setState({loading: true});
        apiServices.getQrCodeUrl(encDepositNumber)
            .then(res1 => {
                const {data: data1} = res1;
                if(data1.responseCode === 200) {
                    apiServices.fetch(data1.response)
                        .then(res2 => {
                            const {data: data2} = res2;
                            if(data2  && data2.response && Array.isArray(data2.response)) {
                                console.log('inside the is arry');
                                this.setState({
                                    data: data2.response[0],
                                    loading: false,
                                });
                            } else {
                                this.setState({
                                    loading: false,
                                    errMsg: data2.message || data2.response,
                                });
                            }
                        }).catch(err => {
                            const {response: {data: errData = {}}} = err;
                            console.log(err, errData);
                            this.setState({
                                loading: false,
                                errMsg: errData.message || errData.response,
                            });
                            Toast.show({
                                text: 'Error in api(getQrCodeData) from the server',
                                type: 'danger',
                                duration: 4000,
                            });
                        });
                } else {
                    this.setState({loading: false});
                    Toast.show({
                        text: 'Error in api(getQrCodeUrl) from the server',
                        type: 'danger',
                        duration: 4000,
                    });
                }
                
            }).catch(err => {
                console.log(err);
                Toast.show({
                    text: 'Error in api(getQrCodeUrl) from the server',
                    type: 'danger',
                    duration: 4000,
                });
                this.setState({loading: false});
            })
    }
    onRetry = () => {
        this.scanned = false,
        this.setState({
            scanned: false,
            loading: false,
            data: null,
            errMsg: null,
        });
    }
    render() {
        const {scanned, hasPermission, loading, data, errMsg} = this.state;
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={this.goBack}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>QR Code Scanner</Title>
                    </Body>
                    <Right />
                </Header>
                {hasPermission === null && (
                    <Container>
                        <View style={COMMON_STYLES.spinnerContainerFullScreen}>
                            <Spinner />
                            <Text style={COMMON_STYLES.spinnerContainerFullScreenText}>Requesting for camera permissio</Text>
                        </View>
                    </Container>
                )}
                {hasPermission === false && (
                    <Container>
                        <View style={COMMON_STYLES.spinnerContainerFullScreen}>
                            <Text style={COMMON_STYLES.spinnerContainerFullScreenText}>No access to camera</Text>
                        </View>
                    </Container>
                )}
                {hasPermission && !scanned && (
                    <Container style={[styles.container, {backgroundColor: '#000'}]}>
                        <Text style={styles.QRTitle}>Scan the QR Code</Text>
                        <View style={styles.QRArea}>
                            <View style={styles.mask}/>
                            <BarCodeScanner
                                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                                onBarCodeScanned={(obj) => this.scanned ? undefined : this.handleBarCodeScanned(obj)}
                                style={styles.scanner}
                            />
                        </View>
                    </Container>
                )}

                {scanned && (
                    <Container style={styles.container}>
                        {loading && (
                            <View style={COMMON_STYLES.spinnerContainerFullScreen}>
                                <Spinner />
                                <Text style={COMMON_STYLES.spinnerContainerFullScreenText}>Loading data..</Text>
                            </View>
                        )}
                        {!loading && !data && (
                            <View style={COMMON_STYLES.spinnerContainerFullScreen}>
                                <Icon style={styles.errIcon} name={'ios-information'}/>
                                <Text style={styles.errTExt}>
                                    Error!
                                </Text>
                                <Text style={styles.errTExtDetails}>
                                    {errMsg || 'Somethings is error on the server.'}
                                </Text>
                                <View style={styles.actions}>
                                    <Button primary rounded onPress={this.onRetry}>
                                        <Text>Retry</Text>
                                    </Button>
                                    <View style={{height: 5}}/>
                                    <Button light rounded onPress={this.goBack}>
                                        <Text>Back</Text>
                                    </Button>
                                </View>
                            </View>
                        )}
                        {data && (
                            <ScrollView style={styles.scroll}>
                                <View style={styles.detailsBox}>
                                    <Text style={styles.ttl}>
                                        FD Details
                                    </Text>
                                    <View style={styles.viewSection}>
                                        <View style={styles.viewR}>
                                            <Text style={styles.viewRL}>Deposit  Number</Text>
                                            <Text style={styles.viewRV}>{data['accountNumber'] || '-'}</Text>
                                        </View>
                                        <View style={styles.viewR}>
                                            <Text style={styles.viewRL}>Scheme Name</Text>
                                            <Text style={styles.viewRV}>{data['productDesc'] || '-'}</Text>
                                        </View>
                                        <View style={styles.viewR}>
                                            <Text style={styles.viewRL}>Customer Name</Text>
                                            <Text style={styles.viewRV}>{data['customerName'] || '-'}</Text>
                                        </View>
                                        <View style={styles.viewR}>
                                            <Text style={styles.viewRL}>Customer Id</Text>
                                            <Text style={styles.viewRV}>{data['customerId'] || '-'}</Text>
                                        </View>
                                        <View style={styles.viewR}>
                                            <Text style={styles.viewRL}>Customer</Text>
                                            <Text style={styles.viewRV}>{data['custCategory'] || '-'}</Text>
                                        </View>
                                        <View style={styles.viewR}>
                                            <Text style={styles.viewRL}>Effective Date</Text>
                                            <Text style={styles.viewRV}>{utils.getAppCommonDateFormat(data['openDate']) || '-'}</Text>
                                        </View>
                                        <View style={styles.viewR}>
                                            <Text style={styles.viewRL}>Deposit Amt</Text>
                                            <Text style={styles.viewRV}>{data['depositAmount'] ? utils.convertToINRFormat(data['depositAmount']) : '-'}</Text>
                                        </View>
                                        <View style={styles.viewR}>
                                            <Text style={styles.viewRL}>Period</Text>
                                            <Text style={styles.viewRV}>{data['tenure'] ? data['tenure'] + ' Months' : '-'}</Text>
                                        </View>
                                        <View style={styles.viewR}>
                                            <Text style={styles.viewRL}>Rate of Interest</Text>
                                            <Text style={styles.viewRV}>{data['interestRatePercent'] ? data['interestRatePercent'] + '%' : '-'}</Text>
                                        </View>
                                        <View style={styles.viewR}>
                                            <Text style={styles.viewRL}>Interest Frequency</Text>
                                            <Text style={styles.viewRV}>{data['intpayFrequency'] || '-'}</Text>
                                        </View>
                                        <View style={styles.viewR}>
                                            <Text style={styles.viewRL}>Maturity Amount</Text>
                                            <Text style={styles.viewRV}>{data['maturityAmount'] ? utils.convertToINRFormat(data['maturityAmount']) : '-'}</Text>
                                        </View>
                                        <View style={styles.viewR}>
                                            <Text style={styles.viewRL}>Total Interest Amt</Text>
                                            <Text style={styles.viewRV}>{data['interestAmount'] ? utils.convertToINRFormat(data['interestAmount']) : '-'}</Text>
                                        </View>
                                        <View style={styles.viewR}>
                                            <Text style={styles.viewRL}>Periodic Interest Amt</Text>
                                            <Text style={styles.viewRV}>{data['periodicIntAmount'] || '-'}</Text>
                                        </View>
                                        <View style={styles.viewR}>
                                            <Text style={styles.viewRL}>Date of Maturity </Text>
                                            <Text style={styles.viewRV}>{utils.getAppCommonDateFormat(data['maturityDate']) || '-'}</Text>
                                        </View>
                                        <View style={styles.viewR}>
                                            <Text style={styles.viewRL}>Nominee</Text>
                                            <Text style={styles.viewRV}>{data['nomineeName'] || '-'}</Text>
                                        </View>
                                        <View style={styles.viewR}>
                                            <Text style={styles.viewRL}>Constitution</Text>
                                            <Text style={styles.viewRV}>{data['depositAccountType'] || '-'}</Text>
                                        </View>
                                        <View style={styles.viewR}>
                                            <Text style={styles.viewRL}>Joint Name 1</Text>
                                            <Text style={styles.viewRV}>{data['jointHolder1'] || '-'}</Text>
                                        </View>
                                        <View style={[styles.viewR, {borderBottomWidth: 0}]}>
                                            <Text style={styles.viewRL}>Joint Name 2</Text>
                                            <Text style={styles.viewRV}>{data['jointHolder2'] || '-'}</Text>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        )}
                    </Container>
                )}
                
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: THEME.LAYOUT_PADDING,
    },
    QRTitle: {
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
        color: '#fff',
        marginTop: -99,
    },
    QRArea: {
        marginTop: 21,
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: 11,
        overflow: 'hidden',
        position: 'relative',
    },
    mask: {
        position: "absolute",
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        borderStyle: 'solid',
        borderWidth: 51,
        borderColor: '#000',
        borderRadius: 59,
        zIndex: 3,
    },
    scanner: {
        width: Dimensions.get('window').width - (2*THEME.LAYOUT_PADDING),
        height: Dimensions.get('window').width - (2*THEME.LAYOUT_PADDING),
        borderRadius: 11,
    },
    errIcon: {
        color: THEME.DANGER,
        fontSize: 92,
    },
    errTExt: {
        fontSize: 26,
        color: '#444',
        marginTop: -11,
        marginBottom: 33,
    },
    errTExtDetails: {
        marginTop: -30,
        textAlign: "center",
        color: '#cc2222',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 18,
    },
    detailsBox: {
        ...utils.getBoxShadow(4, '#f9f9f9'),
        backgroundColor: '#fff',
        borderColor: '#d9d9d9',
        borderWidth: 1,
        // borderTopWidth: 0,
        borderStyle: 'solid',
        borderRadius: 3,
        marginHorizontal: THEME.LAYOUT_PADDING,
        marginVertical: THEME.LAYOUT_PADDING,
    },
    scroll: {
        marginHorizontal: -THEME.LAYOUT_PADDING,    
    },
    ttl: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '700',
        backgroundColor: '#ecf1f9',
        paddingVertical: 9,
        color: THEME.PRIMARY,
    },
    viewSection: {
        padding: 7,
    },
    viewR: {
        flexDirection: 'row',
        paddingVertical: 7,
        borderBottomWidth: 1,
        borderColor: '#d9d9d977'
    },
    viewRL: {
        width: '50%',
        fontSize: 13,
        color: THEME.PRIMARY,
        fontWeight: '700',
    },
    viewRV: {
        width: '50%',
        fontSize: 13,
        fontWeight: '700'
    }

})

export default QRCodeScanner;