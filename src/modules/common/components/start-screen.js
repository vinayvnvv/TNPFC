import React from 'react';
import { StyleSheet, Image, Linking } from 'react-native';
import { Container, Text, View, Button, Icon} from 'native-base';
import { THEME } from '../../../../config';
import { NAVIGATION } from '../../../navigation';

const StartScreen = ({
    navigation,
}) => {
    const navigate = to => {
        navigation.navigate(to);
    };
    const openLink = async (url) => {
        // Checking if the link is supported for links with custom URL scheme.
        const supported = await Linking.canOpenURL(url);
    
        if (supported) {
          // Opening the link with some app, if the URL scheme is "http" the web link should be opened
          // by some browser in the mobile
          await Linking.openURL(url);
        } else {
          Alert.alert(`Don't know how to open this URL: ${url}`);
        }
    }
    return (
        <Container style={styles.container}>
            <View style={styles.mask} />
            <View style={styles.content}>
                <Text style={styles.title}>TNPFC</Text>
                <Image 
                    style={styles.logo} 
                    source={require('./../../../../assets/logo.png')}/>
                <Text style={styles.subT}>
                    Absolute Safety & Assured Income
                </Text>
                <Text style={styles.subT1}>
                    For Fixed Deposit
                </Text>
                <View style={{height: 32}}/>
                <Button style={styles.btn} iconRight primary onPress={()=>navigate(NAVIGATION.CREATE_FD)}>
                    <Text>Create Fixed Deposit</Text>
                    <Icon name='arrow-forward' />
                </Button>
                <Button style={styles.btn} iconRight warning onPress={()=>navigate(NAVIGATION.LOGIN)}>
                    <Text>Depositor Login</Text>
                    <Icon name='arrow-forward' />
                </Button>
                <View style={styles.btm}>
                    <Button 
                        transparent 
                        onPress={() => openLink('https://www.tnpowerfinance.com/tnpfc-web/tnpfc-policy?selectedTab=3')}>
                        <Text>IT Policy</Text>
                    </Button>
                    <Button 
                        onPress={() => openLink('https://www.tnpowerfinance.com/tnpfc-web/mandatory-disclosures')}
                        transparent>
                        <Text>Mandatory Disclosures</Text>
                    </Button>
                </View>
            </View>
        </Container>
    );
}
const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    mask: {
        backgroundColor: THEME.PRIMARY,
        width: '100%',
        position: 'absolute',
        height: '105%',
        top: '-50%',
        // left: '-20%',
        borderRadius: 200,
        transform: [{rotateZ: '62deg'}]
    },
    title: {
        position: "absolute",
        top: '12%',
        fontSize: 25,
        fontWeight: '700',
        letterSpacing: 1,
        color: '#fff',
    },
    logo: {
        width: 82,
        height: 82,
        marginTop: '52%',
        borderRadius: 82,
        borderStyle: 'solid',
        borderColor: '#fff',
        borderWidth: 7,
    },
    content: {
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    subT: {
        marginTop: 31,
        fontWeight: '700',
        maxWidth: '70%',
    },
    subT1: {
        fontSize: 13,
        marginTop: 3,
    },
    btn: {
        width: '60%',
        marginTop: 11,
        borderBottomRightRadius: 18,
    },
    btm: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 27,
        justifyContent: 'space-around',
        maxWidth: '80%',
    },
    
})
export default StartScreen;