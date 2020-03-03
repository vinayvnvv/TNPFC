import React from 'react';
import {connect} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './modules/login/Login';
import authServices from './services/authServices';
import {setAuth} from './store/actions/auth-actions';
import {fetchCustomerDetails} from './store/actions/common-actions';
import DashBoard from './modules/app/dashboard';
import { NAVIGATION } from './navigation';
import {DepositeList} from './modules/app/deposite';
import Profile from './modules/app/profile';
import fdDetails from './modules/app/deposite/fd-details';
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
        const {setAuth} = this.props;
        return new Promise(async (res) => {
            const data = await authServices.getAuth();
            if(data) {
                setAuth(data.token, data.customerId);
                res(true);
                this.initApp();
            } else {
                res(false);
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
                            component={Login}
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
    {setAuth, fetchCustomerDetails}
)(Index);