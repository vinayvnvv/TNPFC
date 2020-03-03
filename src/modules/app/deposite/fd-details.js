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
import { fetchCustomerNominees } from '../../../store/actions/common-actions';
import { fetchFDSummary, fetchFdLoans } from '../../../store/actions/deposite-actions';
import { COMMON_STYLES } from '../../common/styles';
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
    }
    componentDidMount() {
        this.initPageData();
    }

    initPageData = async () => {
        const {
            fetchCustomerNominees,
            fetchFDSummary,
            fetchFdLoans,
            // fdLoans,
            customerNominee,
            fdSummary,
            route: {params: {selectedDeposite = {}} = {}}
        } = this.props;
        if(!fdSummary) await fetchFDSummary(selectedDeposite.accountNumber);
        await fetchFdLoans();
        if(!customerNominee) await fetchCustomerNominees();
        this.setState({pageInit: true});
    }

    goBack = () => {
        const {navigation} = this.props;
        navigation.goBack();
    }
    render() {
        const {pageInit} = this.state;
        const {fdSummary, customerNominee, userDetails} = this.props;
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
                                <PersonalInfo userDetails={userDetails}/>
                            </ScrollView>
                            <ScrollView heading="Nominee">
                                <Nominee customerNominee={customerNominee}/>
                            </ScrollView>
                            <ScrollView heading="Certificate">
                                <Certificate />
                            </ScrollView>
                            <ScrollView heading="Re-new FD">
                                <RenewFD fdSummary={fdSummary}/>
                            </ScrollView>
                            <ScrollView heading="Loans">
                                <Loans fdSummary={fdSummary}/>
                            </ScrollView>
                            <ScrollView heading="Closure">
                                <Closure fdSummary={fdSummary}/>
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
    customerNominee: state.commonReducer.customerNominee,
    userDetails: state.commonReducer.userDetails,
});

export default connect(
    mapStateToProps,
    {   
        fetchCustomerNominees,
        fetchFDSummary,
        fetchFdLoans,
    },
)(FDDetails);