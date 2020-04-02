import React from 'react';
import { Container } from 'native-base';
import { StyleSheet, Image } from 'react-native';
import { THEME } from './../../../../config';
import splash from './../../../../assets/splash.png';
const LoadingApp = () => {
    return (
        <Container style={styles.container}>
            <Image source={splash} style={{width: '100%', height: '100%'}}/>
        </Container>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'trasnparent',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default LoadingApp;