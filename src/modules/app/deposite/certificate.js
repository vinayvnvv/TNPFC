import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import { THEME } from '../../../../config';
import ListItemPanel from '../../common/components/list-item-panel';
import { Button, Text, Icon } from 'native-base';

const Certificate = ({

}) => (
    <View>
        <View style={styles.container}>
            <View style={styles.section}>
                <ListItemPanel 
                    itemWidth={'50%'}
                    noHoverEffect={true}
                    content={
                        <View style={styles.imageContainer}>
                            <Image 
                                style={styles.imageDoc} 
                                source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}/>
                        </View>
                    }
                    panelTitleLabel={'Cerificate'}/>
                    <View style={styles.actions}>
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
                    </View>
            </View>
        </View>
    </View>
);  

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: THEME.LAYOUT_PADDING,
    },
    section: {
        marginVertical: 0,
    },
    imageDoc: {
        width: '100%',
        height: 300,
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
    }
}); 

export default Certificate;