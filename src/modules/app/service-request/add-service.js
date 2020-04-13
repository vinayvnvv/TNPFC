import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Header, Left, Button, Icon, Title, Body, Right, Content, Container, Spinner, Text } from 'native-base';
import { connect } from 'react-redux';
import TaxForm from './tax-form';
import { THEME } from '../../../../config';
import { fetchCustomerDetails } from '../../../store/actions/common-actions';
import { fetchAllDeposites } from '../../../store/actions/deposite-actions';
import { COMMON_STYLES } from '../../common/styles';

class AddService extends React.Component {
    state = {
        pageTitle: 'Service Request',
        currentForm: 'tax',
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
            depositeList
        } = this.props;
        if(!userDetails) await fetchCustomerDetails();
        if(!depositeList) await fetchAllDeposites();
        this.init();
        this.setState({init: true});
    }
    init = () => {
        const {currentForm} = this.state;
        let pageTitle = '';
        switch(currentForm) {
            case 'tax':
                pageTitle = 'Tax Form 15G/15H';
        }
        this.setState({
            pageTitle,
        });
    }

    renderForm = () => {
        const {currentForm} = this.state;
        const {userDetails, depositeList} = this.props;
        switch(currentForm) {
            case 'tax':
                return <TaxForm 
                            depositeList={depositeList}
                            userDetails={userDetails}/>;
        }
    }
    render() {
        const {pageTitle, init} = this.state;
        console.log(this.props);
        return (
            init ? (
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
                    <Container style={styles.container}>
                        {this.renderForm()}
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
});

export default connect(
    mapStateToProps,
    {fetchCustomerDetails, fetchAllDeposites},
)(AddService);