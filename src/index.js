import React from 'react';
import { Text, View } from 'react-native';
import {connect} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './modules/login/Login';
import authServices from './services/authServices';
import {setAuth} from './store/actions/auth-actions';
import DashBoard from './modules/app/dashboard';
import { NAVIGATION } from './navigation';
import {DepositeList} from './modules/app/deposite';
const Stack = createStackNavigator();
class Index extends React.Component {
    state = {
        isLoggedIn: false,
    }
    async componentDidMount() {
        await this.checkLogin();
    }
    checkLogin = async () => {
        const {setAuth} = this.props;
        return new Promise(async (res) => {
            const data = await authServices.getAuth();
            if(data) {
                setAuth(data.token, data.customerId);
                res(true);
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
    {setAuth}
)(Index);