import React from 'react';
import {connect} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import authServices from './services/authServices';
import {setAuth, removeAuth, loadAuth} from './store/actions/auth-actions';
import {fetchCustomerDetails, fetchStates, fetchDistricts, fetchRelationshipList, getResidentList, getAddressProofDocList, getCountriesList, checkMobileAppVersion} from './store/actions/common-actions';
import Login from './modules/login/Login';
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
import StartScreen from './modules/common/components/start-screen';
import CreateFD from './modules/create-fd';
import Terms from './modules/common/components/terms';
import RTGSScreen from './modules/create-fd/rtgs-screen';
import Test from './modules/common/components/test';
import AddService from './modules/app/service-request/add-service';
import QRCodeScanner from './modules/common/components/qr-code-scanner';
import { Uploader } from './modules/common/components/uploader';
import { PanResponder } from 'react-native';
import { CONFIG } from '../config';
import utils from './services/utils';
import UpdateApp from './modules/common/components/update-app';
const Stack = createStackNavigator();
const APP_ACTIVE_TIME = CONFIG.APP.APP_ACTIVE_TIME_MINS * 60 * 1000;
class Index extends React.Component {
    state = {
        isLoggedIn: false,
    }
    _panResponder;
    timer = 0;
    async componentDidMount() {
        await this.checkLogin();
        const {
            fetchStates, 
            fetchDistricts, 
            fetchRelationshipList,
            getResidentList,
            getAddressProofDocList,
            getCountriesList,
            checkMobileAppVersion,
        } = this.props;
        checkMobileAppVersion();
        fetchStates();
        fetchDistricts();
        fetchRelationshipList();
        getResidentList();
        getAddressProofDocList();
        getCountriesList();
    }

    componentDidUpdate(prevProps) {
        const {token} = this.props;
        if(token !== prevProps.token) {
            // if(token) this.initAppInactivity()
        }
    }

    initAppInactivity = () => {
        console.log('init app in active tracker');
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => {
              this.resetTimer()
              return true;
            },
            onMoveShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => { this.resetTimer() ; return false},
            onMoveShouldSetPanResponderCapture: () => false,
            onPanResponderTerminationRequest: () => true,
            onShouldBlockNativeResponder: () => false,
        });
        this.timer = setTimeout(this.afterAppInActive,APP_ACTIVE_TIME);
        this.forceUpdate();
    }

    resetTimer(){
        clearTimeout(this.timer)
        if(this.state.show)
        this.setState({show:false})
        this.timer = setTimeout(this.afterAppInActive,APP_ACTIVE_TIME)
    }

    afterAppInActive = async () => {
        const {removeAuth} = this.props;
        console.log('after app in active');
        await authServices.removeAuth();
        removeAuth();
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
        const {token, versionData} = this.props;
        const panProps = this._panResponder ? {...this._panResponder.panHandlers} : {};
        return(
            <Container {...panProps}>
            <NavigationContainer >
                {versionData && utils.isOldVersion(versionData) ? (
                    <Stack.Navigator screenOptions={{
                        headerShown: false
                    }}>
                        <Stack.Screen
                            name={NAVIGATION.APP_UPDATE_SCREEN}
                            component={UpdateApp}
                            initialParams={{versionData}}
                        />
                    </Stack.Navigator>
                ) : (
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false
                        }}>
                        {!token ? (
                            <>
                                <Stack.Screen
                                    name={NAVIGATION.START}
                                    component={
                                        token === null ? 
                                            LoadingApp :
                                            StartScreen
                                    }
                                    options={{title: ''}}
                                    />
                                <Stack.Screen
                                    name={NAVIGATION.LOGIN}
                                    component={Login}
                                    options={{title: ''}}
                                    />
                                <Stack.Screen
                                    name={NAVIGATION.CREATE_FD}
                                    component={CreateFD}
                                    />
                                <Stack.Screen
                                    options={{
                                        headerLeft: null,
                                    }}
                                    name={NAVIGATION.PAYMENT_PAGE}
                                    component={PaymentView} />
                                <Stack.Screen
                                    name={NAVIGATION.TERMS}
                                    component={Terms}
                                    />
                                <Stack.Screen
                                    name={NAVIGATION.RTGS_SCREEN}
                                    component={RTGSScreen}
                                    />
                                <Stack.Screen
                                    name={'TEST'}
                                    component={Test}
                                    />
                                <Stack.Screen
                                    name={NAVIGATION.QR_CODE}
                                    component={QRCodeScanner}
                                    />
                                <Stack.Screen
                                    name={NAVIGATION.UPLOADER}
                                    component={Uploader}
                                    />
                            </>
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
                                <Stack.Screen
                                    name={NAVIGATION.RTGS_SCREEN}
                                    component={RTGSScreen} />
                                <Stack.Screen
                                    name={NAVIGATION.ADD_SERVICE}
                                    component={AddService} />
                                <Stack.Screen
                                    name={NAVIGATION.UPLOADER}
                                    component={Uploader}
                                    />
                            </>
                        )}
                    </Stack.Navigator>
                )}
            </NavigationContainer>
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    token: state.authReducer.token,
    versionData: state.commonReducer.versionData,
});
export default connect(
    mapStateToProps,
    {
        setAuth, 
        fetchCustomerDetails, 
        removeAuth, 
        loadAuth, 
        fetchStates, 
        fetchDistricts, 
        fetchRelationshipList,
        getResidentList,
        getAddressProofDocList,
        getCountriesList,
        checkMobileAppVersion,
    }
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