import React from 'react';
import { Container, Text, View, Button, Icon } from 'native-base';
import { Platform, StyleSheet, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { THEME, CONFIG } from '../../../../config';
import FlexBox from './FlexBox';
import utils from '../../../services/utils';


const UpdateApp = ({
    route: {
        params: {
            versionData = {},
        } = {},
    } = {},
}) => {
    const data = Platform.OS === 'ios' ? versionData.ios : versionData.android;
    console.log(versionData, 'UpdateApp');
    const getBtnProps = (act) => {
        const p = {};
        if(act.color) p.color = act.color;
        if(act.theme) p[act.theme] = true;
        return p;
    };
    return (
        <Container>
            <ScrollView style={styles.scroller}>
                <View style={styles.content}>
                    <FlexBox centered>
                        <Image 
                            style={styles.logo} 
                            source={require('./../../../../assets/logo.png')}/>
                        <Text style={styles.appName}>{CONFIG.APP.TITLE}</Text>
                        <Text style={styles.title}>{data.updateTitle}</Text>
                        <Text style={styles.desc}>{data.updateDesc}</Text>
                        <View style={styles.actions}>
                            {data.actions && data.actions.map((act, idx) =>
                                <Button 
                                    style={styles.actBtn} 
                                    key={'btn-update-' + idx}
                                    block
                                    rounded
                                    {...getBtnProps(act)}
                                    onPress={() => utils.openLink(act.link)}>
                                    <Text>{act.text}</Text>
                                </Button>
                            )}
                        </View>
                    </FlexBox>
                    {data.updateFeatures && (
                        <View style={styles.featureSection} >
                            <Text style={styles.featureSectionTitle}>What's New!</Text>
                            {data.updateFeatures.map((f, idx) =>
                                <View style={styles.featureItem} key={'updte-fetures-' + idx}>
                                    <Icon style={styles.featureItemIcn} name={'ios-radio-button-on'}/>
                                    <Text style={styles.featureItemText}>{f}</Text>
                                </View>
                            )}
                            
                        </View>
                    )}
                </View>
            </ScrollView>
        </Container>
    )
}

const styles = StyleSheet.create({
    scroller: {
        flex: 1,
    },
    content: {
        padding: THEME.LAYOUT_PADDING,
        paddingTop: 100,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 80,
    },
    appName: {
        marginTop: 9,
        fontWeight: '700',
        fontSize: 20,
    },
    title: {
        marginTop: 21,
        fontWeight: '700',
        fontSize: 18,
    },
    desc: {
        color: '#555',
        fontSize: 13,
        marginTop: 4,
    },
    actions: {
        marginVertical: 21,
        width: '70%'
    },
    actBtn: {
        marginBottom: 7,
    },
    featureSectionTitle: {
        fontWeight: '700',
        marginBottom: 11,
    },
    featureItem: {
        flexDirection: 'row',
        marginBottom: 7,
    },
    featureItemIcn: {
        fontSize: 12,
        marginRight: 9,
        marginTop: 3,
    },
    featureItemText: {
        flexGrow: 1,
        flexWrap: 'wrap',
        fontSize: 13,
    }
});

export default UpdateApp;