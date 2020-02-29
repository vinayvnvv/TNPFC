import React from 'react';
import {TouchableOpacity, StyleSheet, View, Text, Image} from 'react-native';
import { CONFIG } from '../../../../config';
const {THEME} = CONFIG.APP;
const DashBoardListItem = ({
    title,
    onListPress,
    icon,
}) => (
    <TouchableOpacity onPress={onListPress}>
        <View style={styles.itemContainer}>
            <Image style={styles.itemIcon} source={icon} />
            <Text style={styles.itemTitle}>{title || 'Title'}</Text>
        </View>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    itemContainer: {
        height: 150,
        backgroundColor: THEME.PRIMARY,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center',
        padding: 11
    },
    itemTitle: {
        color: THEME.PRIMARY_INVERT,
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: "center"
    },
    itemIcon: {
        height: 62,
        width: 62,
        marginBottom: 17,
    }
});

export default DashBoardListItem;