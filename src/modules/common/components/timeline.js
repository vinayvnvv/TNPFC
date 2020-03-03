import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Text} from 'native-base';
import utils from '../../../services/utils';
import {BoxShadow} from 'react-native-shadow';
import { THEME } from '../../../../config';

const Timeline = ({

}) => (
    <View style={styles.container}>
        {[0,1,2].map((i, idx) =>
            <View key={idx} style={styles.itemOuter}>
                <View  style={[styles.item, idx === 2 ? styles.last : {}]}>
                    <View style={styles.left}>
                        <Text style={styles.txt}>12-june-2019</Text>
                        <Text style={[styles.txt, {marginTop: 3}]}>12:00 PM</Text>
                    </View>
                    <View style={styles.right}>
                        <Text style={styles.title}>KYC Updated</Text>
                    </View>
                    <View style={styles.dot}/>
                </View>
            </View>
        )}
    </View>
);
const styles = StyleSheet.create({
    container: {
        borderLeftColor: '#d9d9d9',
        borderLeftWidth: 1,
        borderStyle: 'solid'
    },
    item: {
        ...utils.getBoxShadow(5, '#00000088'),
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        marginBottom: 21,
    },
    itemOuter: {
        // overflow: 'hidden',
        paddingBottom: 2,
        paddingRight: 2,
    },
    left: {
        padding: 11,
    },
    right: {
        padding: 11,
        borderLeftColor: '#d9d9d9',
        borderLeftWidth: 1,
        borderStyle: 'solid',
        flexDirection: 'row',
        alignItems: 'center'
    },
    last: {
        marginBottom: 0,
    }, 
    txt: {
        color: '#999',
        fontSize: 12,
        textAlign: "center"
    },
    dot: {
        position: 'absolute',
        width: 12,
        height: 12,
        backgroundColor: '#d9d9d9',
        top: '50%',
        marginTop: -6,
        left: -6,
        borderRadius: 12,
    },
    title: {
        color: THEME.PRIMARY,
        fontSize: 14,
        fontWeight: 'bold'
    }
});
export default Timeline;