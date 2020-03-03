import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import { THEME } from '../../../../config';
import { Text } from 'native-base';
const ListItemPanel = ({
    panelTitleLabel,
    panelTitleValue,
    lists,
    itemWidth,
    noHoverEffect,
    content,
}) => {
    const listItemDRowOverrideStyle = itemWidth ? {width: itemWidth} : {};
    return (
        <View style={styles.listItemContainer}>
            <TouchableOpacity activeOpacity={noHoverEffect ? 1 : 0.9}>
                <View style={styles.listItem}>
                    <View style={styles.listItemTop}>
                        <Text style={styles.listItemTitle}>{panelTitleLabel}</Text>
                        {panelTitleValue && <Text style={styles.listItemSubTitle}>{panelTitleValue}</Text>}
                    </View>
                    <View style={styles.listItemBottom}>
                        {lists && lists.length > 0 && (
                            lists.map((list, index) =>
                                <View 
                                    key={'listItemBottom-' + index} 
                                    style={
                                        [
                                            styles.listItemDRow, 
                                            listItemDRowOverrideStyle,
                                            list && list[2] ? {width: list[2]} : {},
                                        ]
                                    }>
                                    <Text style={styles.listItemDRowLabel}>{list && list[0]}</Text>
                                    <Text style={styles.listItemDRowValue}>{list && list[1]}</Text>
                                </View>
                            )
                        )}
                    </View>
                    {content && (
                        <View style={styles.listItemBottom}>
                            {content}
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const listItemPadding = 11;
const styles = StyleSheet.create({
    listItemContainer: {
        // paddingHorizontal: THEME.LAYOUT_PADDING,
        marginVertical: 11,
    },
    listItem: {
        flexDirection: 'column',
        shadowColor: '#a9a9a9',
        shadowRadius: 5,
        shadowOpacity: 0.5,
        elevation: 5,
        position:'relative',
        backgroundColor: '#000000'
    },
    listItemTop: {
        padding: listItemPadding,
        backgroundColor: '#ecf1f9',
    },
    listItemBottom: {
        paddingHorizontal: listItemPadding - 5,
        // paddingVertical: listItemPadding + 7,
        borderTopColor: '#e6e6e6',
        borderTopWidth: 1,
        borderStyle: 'solid',
        flexDirection: 'row',
        backgroundColor: "#ffffff",
        flexWrap: 'wrap',
    },
    listItemTitle: {
        color: THEME.PRIMARY,
        fontSize: 14,
        fontWeight: 'bold'
    },
    listItemSubTitle: {
        fontSize: 14,
        color: '#000000',
        marginTop: 2,
    },
    listItemDRow: {
        width: '33%',
        paddingHorizontal: 5,
        marginVertical: listItemPadding,
    },
    listItemDRowLabel: {
        fontSize: 12,
        color: THEME.PRIMARY,
    },
    listItemDRowValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333333',
        marginTop: 3
    },
});

export default ListItemPanel;