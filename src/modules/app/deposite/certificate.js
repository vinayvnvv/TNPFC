import React, { useState } from 'react';
import {View, StyleSheet, Image, Platform} from 'react-native';
import { THEME } from '../../../../config';
import ListItemPanel from '../../common/components/list-item-panel';
import { Button, Text, Icon, Spinner, Container } from 'native-base';
import WebView from 'react-native-webview';
import { COMMON_STYLES } from '../../common/styles';

const Certificate = ({
    fdSummary,
}) => {
    let {
        eFdrUrl,
    } = fdSummary.length > 0 ? fdSummary[0] : {};
    const onWebViewLoad = () => {
        setLoaded(true);
    }
    const [loaded, setLoaded] = useState(false);
    console.log(eFdrUrl, loaded);
    return (
        <View>
            <View style={styles.container}>
                <View style={styles.section}>
                    <ListItemPanel 
                        itemWidth={'50%'}
                        noHoverEffect={true}
                        content={
                            <View style={styles.imageContainer}>
                                {eFdrUrl ? (
                                    <View style={styles.webviewC}>
                                        {!loaded && (
                                            <View>
                                                {/* <Container> */}
                                                    <View style={COMMON_STYLES.spinnerContainerFullScreen}>
                                                        <Spinner />
                                                        <Text style={COMMON_STYLES.spinnerContainerFullScreenText}>Loading Document...</Text>
                                                    </View>
                                                {/* </Container> */}
                                            </View>
                                        )}
                                        {(
                                            Platform.OS === 'web' ? 
                                                <iframe 
                                                    onLoad={onWebViewLoad}
                                                    src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${eFdrUrl}`}/> : 
                                                <WebView 
                                                    style={[styles.webview, loaded ? {} : {opacity: 0, height: 0}]} 
                                                    onLoad={onWebViewLoad}
                                                    source={{uri: `https://drive.google.com/viewerng/viewer?embedded=true&url=${eFdrUrl}`}} />
                                            
                                        )}
                                        
                                    </View>
                                ) : (
                                    <Container style={styles.err}>
                                        <Icon style={styles.errIcon} name={'ios-alert'}/>
                                        <Text>No Document found!</Text>
                                    </Container>
                                )}
                            </View>
                        }
                        panelTitleLabel={'Cerificate'}/>
                        {/* <View style={styles.actions}>
                            <Button info style={styles.actionBtn}>
                                <Icon name='mail' style={styles.actionBtnIcon}/>
                                <Text>Mail</Text>
                            </Button>
                            <Button style={styles.actionBtn} iconRight>
                                <Icon name='print' style={styles.actionBtnIcon}/>
                                <Text>Print</Text>
                            </Button>
                            <Button success style={styles.actionBtn}>
                                <Icon name='download' style={styles.actionBtnIcon}/>
                                <Text>Download</Text>
                            </Button>
                        </View> */}
                </View>
            </View>
        </View>
    )
};  

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: THEME.LAYOUT_PADDING,
        flex: 1,
        height: 500,
    },
    section: {
        marginVertical: 0,
    },
    imageDoc: {
        width: '100%',
        height: 400,
    },
    imageContainer: {
        flexDirection: 'row',
        width: '100%',
        paddingVertical: 11,
    },
    actions: {
        marginVertical: 21,
        flexDirection: 'column',
        alignItems: 'center',
    },
    actionBtn: {
        marginTop: 9,
        width: 180,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    actionBtnIcon: {
        marginHorizontal: 0,
    },
    webviewC: {
        flex: 1,
        width: '100%',
        height: 400,
    },
    webview: {
        height: 400,
        width: '100%'
    },
}); 

export default Certificate;