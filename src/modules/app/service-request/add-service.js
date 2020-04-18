import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Header, Left, Button, Icon, Title, Body, Right, Content, Container, Spinner, Text } from 'native-base';
import { connect } from 'react-redux';
import TaxForm from './tax-form';
import { THEME } from '../../../../config';
import { fetchCustomerDetails } from '../../../store/actions/common-actions';
import { fetchAllDeposites } from '../../../store/actions/deposite-actions';
import { COMMON_STYLES } from '../../common/styles';
import NomineeForm from './nominee-change';
import { ScrollView } from 'react-native-gesture-handler';
import AddressChange from './address-change';
import BankAccChange from './bank-acc-change';

class AddService extends React.Component {
    state = {
        pageTitle: 'Service Request',
        currentForm: 'address',
        init: false,
    };
    goBack = () => {
        const {navigation} = this.props;
        navigation.goBack();
    }
    async componentDidMount() {
        const {
            userDetails, 
            fetchCustomerDetails, 
            fetchAllDeposites, 
            depositeList,
            route: {
                params: {type}
            }
        } = this.props;
        if(!userDetails) await fetchCustomerDetails();
        if(!depositeList) await fetchAllDeposites();
        this.setState({currentForm: type}, () => {
            this.init();
        });
    }
    init = () => {
        const {currentForm} = this.state;
        let pageTitle = '';
        switch(currentForm) {
            case 'tax':
                pageTitle = 'Tax Form 15G/15H';
                break;
            case 'nominee':
                pageTitle = 'Nominee Change';
                break;
            case 'address':
                pageTitle = 'Address Change';
                break;
            case 'bank_account':
                pageTitle = 'Bank Account Change';
                break;
        }
        this.setState({
            pageTitle,
            init: true,
        });
    }

    renderForm = () => {
        const {currentForm} = this.state;
        const {
            userDetails, 
            depositeList, 
            navigation, 
            states, 
            relationships, 
            districts,
            countries,
            residentList,
        } = this.props;
        switch(currentForm) {
            case 'tax':
                return <TaxForm 
                            navigation={navigation}
                            depositeList={depositeList}
                            userDetails={userDetails} />;
            case 'nominee': 
                return <NomineeForm 
                            navigation={navigation}
                            relationships={relationships}
                            depositeList={depositeList}
                            userDetails={userDetails} />
            case 'address': 
                return <AddressChange 
                            navigation={navigation}
                            residentList={residentList}
                            states={states}
                            countries={countries}
                            districts={districts}
                            userDetails={userDetails} />
            case 'bank_account': 
                return <BankAccChange 
                            navigation={navigation}
                            relationships={relationships}
                            depositeList={depositeList}
                            userDetails={userDetails} />
        }
    }
    render() {
        const {pageTitle, init} = this.state;
        const {userDetails, depositeList} = this.props
        return (
            init && userDetails && depositeList ? (
                <Container>
                    <Header>
                        <Left>
                            <Button transparent onPress={this.goBack}>
                                <Icon name='arrow-back' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>{pageTitle}</Title>
                        </Body>
                        <Right />
                    </Header>
                    <Container>
                        <ScrollView>
                            <View style={styles.container}>
                                {this.renderForm()}
                            </View>
                        </ScrollView>
                    </Container>
                </Container>
            )
            :  (
                <Container>
                    <View style={COMMON_STYLES.spinnerContainerFullScreen}>
                        <Spinner />
                        <Text style={COMMON_STYLES.spinnerContainerFullScreenText}>Loading Data...</Text>
                    </View>
                </Container>
            )
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 1,
        padding: THEME.LAYOUT_PADDING,
    }
})

const mapStateToProps = state => ({
    token: state.authReducer.token,
    userDetails: state.commonReducer.userDetails,
    depositeList: state.depositeReducer.depositeList,
    states: state.commonReducer.states,
    countries: state.commonReducer.countries,
    districts: state.commonReducer.districts,
    relationships: state.commonReducer.relationships,
    residentList: state.commonReducer.residentList,
});

export default connect(
    mapStateToProps,
    {fetchCustomerDetails, fetchAllDeposites},
)(AddService);