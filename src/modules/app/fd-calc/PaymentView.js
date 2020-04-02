import React from 'react';
import { Container, Content, Text, Header, Left, Body, Title, Right, Image, View } from 'native-base';
import WebView from 'react-native-webview';
import {StyleSheet, Platform, Dimensions, BackHandler, Alert} from 'react-native';
import { THEME } from '../../../../config';
import logo from './../../../../assets/logo.png';
import utils from '../../../services/utils';

class PaymentView extends React.Component {
    killed;
    constructor(props) {
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    componentDidMount() {
        this.killed = false;
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        // setTimeout(() => {
        //     this.props.route.params.onPaymentComplete();
        //     this.props.navigation.goBack();
        // }, 3000);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    
    handleBackButtonClick() {
        const {navigation} = this.props;
        Alert.alert('Warning', 'Are you sure to cancel transaction?', [
            {text: 'Yes', onPress: () => {
                BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
                navigation.goBack();
            }},
            {text: 'No', onPress: () => console.log('No'), style: 'cancel'},
        ])
        return true;
    }

    isTNPHost = url => {
        console.log('isTNPHost');
        try {
            const hostname = utils.domain_from_url(url);
            var host = hostname.split('.');
            console.log(host);
            var status = false;
            host.forEach(h=>{
                if(h === 'tnpowerfinance') status = true; 
            });
            console.log('status', status)
            return status;
        } catch(err) {
            console.log('inside catch', url);
            return false;
        } 
    };


    onNavigationStateChange = webViewState => {
        const {
            navigation,
            route : {
                params: {
                    onPaymentComplete,
                } = {},
            } = {},
        } = {} = this.props;
        const {url} = webViewState;
        // onPaymentComplete();
        // navigation.goBack(null);
        console.log(url);
        if(this.isTNPHost(url) && !this.killed) {
            console.log('this.isTNPHost');
            this.killed = true;
            if(onPaymentComplete) {
                console.log('onPaymentComplete();');
                try{
                    onPaymentComplete();
                    navigation.goBack(null);
                } catch(err) {
                    console.log(err);
                }
                
            }
        }
    }
    render() {
        const {
            route : {
                params: {
                    html,
                } = {},
            } = {},
        } = {} = this.props;
        return (
            <Container>
                <Header>
                    <Body>
                        <Title>TNPFC  Payment</Title>
                    </Body>
                    <Right />
                </Header>
                <View style={styles.container}>
                    <Text style={styles.info}>Dont click Back button untill transaction completes.</Text>
                    {Platform.OS === 'web' ? (
                        <iframe style={{height: '100%'}} src={'http://google.com'}/>
                    ) : (
                        <WebView 
                            style={styles.web}
                            onNavigationStateChange={this.onNavigationStateChange}
                            source={{html}} />
                    )}
                    
                </View>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: '100%',
        flex: 1,
        flexGrow: 1,
        height: '100%'
    },
    info: {
        height: 22,
        backgroundColor: '#ffcc00',
        color: '#000',
        fontWeight: '700',
        fontSize: 13,
        paddingHorizontal: 11,
    },
    web: {
        flex: 1,
        flexGrow: 1,
        height: Dimensions.get('window').height - 22 - 56,
        backgroundColor: '#f0f0f0'
    }
}) 

export default PaymentView;