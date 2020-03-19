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

    onRenewFD = () => {
        const {fdSummary} = this.props;
        const depositNumber = fdSummary && fdSummary[0] && fdSummary[0].accountNumber;
        this.setState({
            renewFDScreenStatus: {type: 'renew', status: 'loading'},
        });
        apiServices.depositeRenewFD(depositNumber, '2233', '31232', '24', 'monthly', '202').then(res => {
            console.log('res-->', res);
            const {data} = res;
            if(data.responseCode === '200') {
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
            if(data.responseCode === '200') {
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

    depositClosure = () => {
        const {fdSummary} = this.props;
        const depositNumber = fdSummary && fdSummary[0] && fdSummary[0].accountNumber;
        this.setState({
            depositClosureStatus: {type: 'depositClosure', status: 'loading'},
        });
        apiServices.depositClosure(depositNumber).then(res => {
            console.log('res-->', res);
            const {data} = res;
            if(data.responseCode === '200') {
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
        const {pageInit, renewFDScreenStatus, applyLoanStatus, depositClosureStatus} = this.state;
        const {fdSummary, userDetails, fdLoans} = this.props;
        return (
            pageInit ? (
                <Container>
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
                        <Tabs renderTabBar={() => <TabBar />}>
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
                                <Certificate />
                            </ScrollView>
                            <ScrollView heading="Re-new FD">
                                <RenewFD 
                                    onRenewFD={this.onRenewFD}
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