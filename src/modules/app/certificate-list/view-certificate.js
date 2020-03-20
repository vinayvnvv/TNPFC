import React, {useState} from 'react';
import { Text, Container, Button, Left, Right, Body, Header, Icon, Title, Spinner, View } from 'native-base';
import {StyleSheet, Platform} from 'react-native';
import WebView from 'react-native-webview';
import { COMMON_STYLES } from '../../common/styles';
// import Pdf from 'react-native-pdf';
// import PDFView from 'react-native-pdf-view';
// import PDFView from 'react-native-view-pdf';

const ViewCertificate = ({
    navigation,
    route: {
        params: {
            title,
            url,
        } = {}
    } = {}
}) => {
    console.log('ViewCertificate', url);
    const onWebViewLoad = () => {
        setLoaded(true);
    }
    const [loaded, setLoaded] = useState(false);
    return (
        <Container>
            <Header>
                <Left>
                    <Button transparent onPress={() => navigation.goBack()}>
                        <Icon name='arrow-back' />
                    </Button>
                </Left>
                <Body>
                    <Title>View Certificate</Title>
                </Body>
                <Right />
            </Header>
            {url ? (
                <Container style={styles.container}>
                    {!loaded && (
                        <View style="spc">
                            {/* <Container> */}
                                <View style={COMMON_STYLES.spinnerContainerFullScreen}>
                                    <Spinner />
                                    <Text style={COMMON_STYLES.spinnerContainerFullScreenText}>Loading Document...</Text>
                                </View>
                            {/* </Container> */}
                        </View>
                    )}
                    
                    {/* <Pdf
                        source={url}/> */}
                        {/* <PDFView
                            // fadeInDuration={250.0}
                            style={{ flex: 1 }}
                            resource={url}
                            resourceType={'url'}
                            // onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
                            // onError={() => console.log('Cannot render PDF', error)}
                            /> */}
                    {Platform.OS === 'web' ? 
                        <iframe 
                            onLoad={onWebViewLoad}
                            src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${url}`}/> : 
                        <WebView 
                            style={[styles.webview, loaded ? {} : {opacity: 0, height: 0}]} 
                            onLoad={onWebViewLoad}
                            source={{uri: `https://drive.google.com/viewerng/viewer?embedded=true&url=${url}`}} />
                    }
                    
                </Container>
            ) : (
                <Container style={styles.err}>
                    <Icon style={styles.errIcon} name={'ios-alert'}/>
                    <Text>No Document found!</Text>
                </Container>
            )}
            
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // overflow: 'hidden'
    },
    webview: {
        height: '100%',
        width: '100%'
    },
    err: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    errIcon: {
        color: '#777',
        fontSize: 52,
        marginBottom: 21
    },
    spc: {
        // top: 200,
        // position: 'absolute',
        // width: '100%',
        // height: 300
    }
});

export default ViewCertificate;