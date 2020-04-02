import React from 'react';
import {connect} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './modules/login/Login';
import authServices from './services/authServices';
import {setAuth, removeAuth, loadAuth} from './store/actions/auth-actions';
import {fetchCustomerDetails} from './store/actions/common-actions';
import DashBoard from './modules/app/dashboard';
import { NAVIGATION } from './navigation';
import {DepositeList} from './modules/app/deposite';
import Profile from './modules/app/profile';
import fdDetails from './modules/app/deposite/fd-details';
import MyLoans from './modules/app/my-loans';
import serviceRequest from './modules/app/service-request';
import { View, Container, Content, Left, Right, Header, Body, Button, Icon, Text } from 'native-base';
import CertificateList from './modules/app/certificate-list';
import ViewCertificate from './modules/app/certificate-list/view-certificate';
import fdCalc from './modules/app/fd-calc';
import PaymentView from './modules/app/fd-calc/PaymentView';
import LoadingApp from './modules/common/components/loading-app';
const Stack = createStackNavigator();
class Index extends React.Component {
    state = {
        isLoggedIn: false,
    }
    async componentDidMount() {
        await this.checkLogin();
    }

    initApp = () => {
        const {fetchCustomerDetails} = this.props;
        fetchCustomerDetails();
    }

    checkLogin = async () => {
        const {setAuth, loadAuth, removeAuth} = this.props;
        return new Promise(async (res) => {
            loadAuth();
            const data = await authServices.getAuth();
            if(data) {
                setAuth(data.token, data.customerId);
                res(true);
                this.initApp();
            } else {
                res(false);
                removeAuth();
            }
        });
    }
    render() {
        const {token} = this.props;
        return(
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false
                    }}>
                    {!token ? (
                        <Stack.Screen
                            name="Login"
                            component={
                                token === null ? 
                                    LoadingApp :
                                    Login
                            }
                            options={{title: ''}}
                            />
                    ) : (
                        <>
                            <Stack.Screen
                                name={NAVIGATION.DASHBOARD}
                                component={DashBoard} />
                            <Stack.Screen
                                name={NAVIGATION.DEPOSITE_LIST}
                                component={DepositeList} />
                            <Stack.Screen
                                name={NAVIGATION.PROFILE}
                                component={Profile} />
                            <Stack.Screen
                                name={NAVIGATION.FD_DETAILS}
                                component={fdDetails} />
                            <Stack.Screen
                                name={NAVIGATION.MY_LOANS}
                                component={MyLoans} />
                            <Stack.Screen
                                name={NAVIGATION.SERVICE_REQUEST}
                                component={serviceRequest} />
                            <Stack.Screen
                                name={NAVIGATION.COMMING_SOON}
                                component={CommingSoon} />
                            <Stack.Screen
                                name={NAVIGATION.CERTIFICATE_LIST}
                                component={CertificateList} />
                            <Stack.Screen
                                name={NAVIGATION.VIEW_CERTIFICATE}
                                component={ViewCertificate} />
                            <Stack.Screen
                                name={NAVIGATION.FD_CALCULATER}
                                component={fdCalc} />
                            <Stack.Screen
                                options={{
                                    headerLeft: null,
                                }}
                                name={NAVIGATION.PAYMENT_PAGE}
                                component={PaymentView} />
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

const mapStateToProps = state => ({
    token: state.authReducer.token,
});

export default connect(
    mapStateToProps,
    {setAuth, fetchCustomerDetails, removeAuth, loadAuth}
)(Index);



const CommingSoon = ({
    navigation,
}) => {
    return (
        <Container>
            <Header>
                <Left>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon name='arrow-back' />
                    </Button>
                </Left>
                <Body/>
                <Right />
            </Header>
            <Content>
                <View style={{height: 400, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 18, fontWeight: '700'}}>Comming Soon...</Text>
                </View>
            </Content>
        </Container>
    )
}