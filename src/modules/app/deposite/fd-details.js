import React from 'react';
import {connect} from 'react-redux';
import { Container, Button, Icon, Left, Right, Header, Body, Title, Text, Tabs, View, Spinner } from "native-base";
import {ScrollView, TouchableOpacity, Image, StyleSheet} from 'react-native';
import icons from '../../../../assets/icons';
import utils from '../../../services/utils';
import { THEME } from '../../../../config';
import FDSummary from './fd-summary';
import PersonalInfo from './personal-info';
import Nominee from './nominee';
import Certificate from './certificate';
import RenewFD from './renew-fd';
import Loans from './loans';
import Closure from './closure';
// import { fetchCustomerNominees } from '../../../store/actions/common-actions';
import { fetchFDSummary, fetchFdLoans } from '../../../store/actions/deposite-actions';
import { COMMON_STYLES } from '../../common/styles';
import apiServices from '../../../services/api-services';
import update from 'immutability-helper';
const TabBar = ({
    tabs,
    goToPage,
    activeTab,
}) => {
    const getTabTextColor = (defaultStyle, index) => {
        return activeTab !== index ? {...defaultStyle, color: '#333'} : {...defaultStyle, color: THEME.PRIMARY, fontWeight: 'bold'};
    }
    return (
        <View style={styles.tabBar}>
            <ScrollView horizontal>
                {tabs.map((i, idx)=>
                    <TouchableOpacity 
                        activeOpacity={0.8}
                        key={idx + '-tab-bar'} 
                        onPress={()=>goToPage(idx)}>
                        <View style={styles.tabItemOuter}>
                            <View style={styles.tabItem}>
                                <Image style={styles.tabItemImage} source={icons.LoanReqIcon}/>
                                <Text style={getTabTextColor(styles.tabItemText, idx)}>{i}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    )
}

class FDDetails extends React.Component {
    state = {
        pageInit: false,
        renewFDScreenStatus: null,
        applyLoanStatus: null,
        topMostElements: [],
    }
    TopMostElement = {
        register: async (arr) => {
            if(arr && Array.isArray(arr)) {
                for(let i=0;i<arr.length;i++) {
                    const {key, component} = arr[i];
                    console.log('register', key, component);
                    const exists = this.state.topMostElements.filter(e => e.key === key)[0];
                    if(!exists) {
                        const itm = {key, component, visible: false};
                        console.log('adding top most to arr', itm);
                        await this.setState({
                            topMostElements: [
                                ...this.state.topMostElements,
                                itm,
                            ]
                        });
                    }
                }
            }
            
        },
        show: key => {
            console.log('show', key);
            const index = utils.findArrayIndexWithAttr(this.state.topMostElements, 'key', key);
            if(index !== -1) {
                const itm = {...this.state.topMostElements[index], visible: true};
                this.setState(update(this.state, {topMostElements: {
                    [index]: {
                        $set: itm,
                    }
                }}));
            }
        },
        close: key => {
            console.log('close', key);
            const index = utils.findArrayIndexWithAttr(this.state.topMostElements, 'key', key);
            if(index !== -1) {
                const itm = {...this.state.topMostElements[index], visible: false};
                this.setState(update(this.state, {topMostElements: {
                    [index]: {
                        $set: itm,
                    }
                }}));
            }
        }
    }
    componentDidMount() {
        this.initPageData();
    }

    initPageData = async () => {
        const {
            // fetchCustomerNominees,
            fetchFDSummary,
            fetchFdLoans,
            fdLoans,
            // customerNominee,
            // fdSummary,
            route: {params: {selectedDeposite = {}} = {}}
        } = this.props;
        await fetchFDSummary(selectedDeposite.accountNumber);
        if(!fdLoans) await fetchFdLoans();
        // if(!customerNominee) await fetchCustomerNominees();
        this.setState({pageInit: true});
    }

    goBack = () => {
        const {navigation} = this.props;
        navigation.goBack();
    }

    onRenewFD = values => {
        this.setState({
            renewFDScreenStatus: {type: 'renew', status: 'loading'},
        });
        console.log('onRenewFD', values);
        const data = {
            purpose: 'RENEWAL',
            depositNumber: values.depositNumber,
            withDrawalAmt: values.withDrawalAmt,
            newDepositAmt: values.newDepositAmt,
            depositTenure: values.period,
            depositPayFrequency: values.depositPayFrequency,
            prodId: values.prodId,
            renewCloseFdUrl: values.renewCloseFdUrl.map(i=>({url: i})),
        };
        apiServices.depositeRenewFD(data).then(res => {
            console.log('res-->', res);
            const {data} = res;
            if(data.responseCode == '200') {
                this.setState({renewFDScreenStatus: {type: 'renew', status: 'success', data: data.response}})
            } else {
                this.setState({
                    renewFDScreenStatus: {type: 'renew', status: 'failed'}
                });
            }
        }).catch(err => {
            console.log('err-->', err);
            this.setState({
                renewFDScreenStatus: {type: 'renew', status: 'failed'}
            });
        });
    }

    applyLoan = loanAmt => {
        const {fdSummary} = this.props;
        const depositNumber = fdSummary && fdSummary[0] && fdSummary[0].accountNumber;
        this.setState({
            applyLoanStatus: {type: 'applyLoan', status: 'loading'},
        });
        apiServices.applyLoan(depositNumber, loanAmt).then(res => {
            console.log('res-->', res);
            const {data} = res;
            if(data.responseCode == '200' || data.response) {
                this.setState({applyLoanStatus: {type: 'applyLoan', status: 'success', data: data.response}})
            } else {
                this.setState({
                    applyLoanStatus: {type: 'applyLoan', status: 'failed'}
                });
            }
        }).catch(err => {
            console.log('err-->', err);
            this.setState({
                applyLoanStatus: {type: 'applyLoan', status: 'failed'}
            });
        });
    }

    depositClosure = values => {
        this.setState({
            depositClosureStatus: {type: 'depositClosure', status: 'loading'},
        });
        const data = {
            ...values,
            renewCloseFdUrl: values.renewCloseFdUrl.map(i=>({url: i})),
            purpose: 'CLOSURE',
            depositNumber: values.depositNumber,
        };
        apiServices.depositClosure(data).then(res => {
            console.log('res-->', res);
            const {data} = res;
            if(data.responseCode == '200') {
                this.setState({depositClosureStatus: {type: 'depositClosure', status: 'success', data: data.response}})
            } else {
                this.setState({
                    depositClosureStatus: {type: 'depositClosure', status: 'failed'}
                });
            }
        }).catch(err => {
            console.log('err-->', err);
            this.setState({
                depositClosureStatus: {type: 'depositClosure', status: 'failed'}
            });
        });
    }


    render() {
        const {pageInit, renewFDScreenStatus, applyLoanStatus, depositClosureStatus, topMostElements} = this.state;
        const {fdSummary, userDetails, fdLoans, navigation} = this.props;
        console.log(topMostElements);
        return (
            pageInit ? (
                <Container>
                    {topMostElements.filter(e => e.visible).map((el, index) => 
                        <el.component key={index + 'dd'} />
                    )}
                    <Header>
                        <Left>
                            <Button transparent onPress={this.goBack}>
                                <Icon name='arrow-back' />
                            </Button>
                        </Left>
                    <Body>
                        <Title>Fixed Deposit</Title>
                    </Body>
                        <Right />
                    </Header>
                    <Container>
                        <Tabs 
                            renderTabBar={() => <TabBar />}
                            >
                            <ScrollView heading={'FD Summary'}>
                                <FDSummary fdSummary={fdSummary}/>
                            </ScrollView>
                            <ScrollView heading={'Personal Info'}>
                                <PersonalInfo fdSummary={fdSummary} userDetails={userDetails}/>
                            </ScrollView>
                            <ScrollView heading="Nominee">
                                <Nominee fdSummary={fdSummary}/>
                            </ScrollView>
                            <ScrollView heading="Certificate">
                                <Certificate fdSummary={fdSummary} />
                            </ScrollView>
                            <ScrollView heading="Renew-FD">
                                <RenewFD 
                                    onRenewFD={this.onRenewFD}
                                    navigation={navigation}
                                    TopMostElement={this.TopMostElement}
                                    status={renewFDScreenStatus} 
                                    fdSummary={fdSummary}/>
                            </ScrollView>
                            <ScrollView heading="Loans">
                                <Loans 
                                    fdSummary={fdSummary} 
                                    fdLoans={fdLoans} 
                                    status={applyLoanStatus}
                                    applyLoan={this.applyLoan}/>
                            </ScrollView>
                            <ScrollView heading="Closure">
                                <Closure 
                                    status={depositClosureStatus}
                                    navigation={navigation}
                                    TopMostElement={this.TopMostElement}
                                    depositClosure={this.depositClosure}
                                    fdSummary={fdSummary}/>
                            </ScrollView>
                        </Tabs>
                    </Container>
                </Container>
            ) : (
                <Container>
                    <View style={COMMON_STYLES.spinnerContainerFullScreen}>
                        <Spinner />
                        <Text style={COMMON_STYLES.spinnerContainerFullScreenText}>Loading Data...</Text>
                    </View>
                </Container>
            )
        )
    }
}

const styles = StyleSheet.create({
    tabBar: {
        // height: 110,
        paddingLeft: THEME.LAYOUT_PADDING - 9
    },
    tabItem: {
        ...utils.getBoxShadow(4, '#00000088'),
        backgroundColor: '#ffffff',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 90,
        width: 120,
        padding: 9,
        marginHorizontal: 7,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#d9d9d9'
    },
    tabItemOuter: {
        paddingVertical: 11,
    },
    tabItemImage: {
        width: 40,
        height: 40,
        marginBottom: 5,
    },
    tabItemText: {
       marginTop: 5,
       fontSize: 14, 
       textAlign: "center"
    }
})

const mapStateToProps = state => ({
    fdSummary: state.depositeReducer.fdSummary,
    fdLoans: state.depositeReducer.fdLoans,
    // customerNominee: state.commonReducer.customerNominee,
    userDetails: state.commonReducer.userDetails,
});

export default connect(
    mapStateToProps,
    {   
        // fetchCustomerNominees,
        fetchFDSummary,
        fetchFdLoans,
    },
)(FDDetails);