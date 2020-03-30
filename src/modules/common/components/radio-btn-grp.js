import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { View, Text } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { THEME } from '../../../../config';
import utils from '../../../services/utils';


const RadioBtnGroup = ({
    data = [],
    onChange,
    selected,
    marginVertical = 0,
    marginHorizontal = 0,
}) => {
    const onPress = item => {
        if(onChange && {}.toString.call(onChange) === '[object Function]') {
            onChange(item.value);
        }
    }
    const isActiveBtn = (style, item) => {
        return selected === item.value ? style : {};
    }
    return (
        <View 
            style={[
                    styles.container,
                    {marginVertical, marginHorizontal}
                ]}>
                {data.map((item, idx) =>
                    <View 
                        key={'rd-btn-' + idx}
                        style={[
                                styles.item, {borderRightWidth: ((data.length - 1) === idx) ? 0 : 1},
                                isActiveBtn(styles.itemActive, item,),
                                item.disabled ? styles.itemDisable : {},
                                // {width: (100 / data.length) + '%'}
                            ]}>
                            <TouchableOpacity 
                                activeOpacity={0.7}
                                disabled={item.disabled}
                                key={'radio-btn-grp-' + idx} 
                                style={[styles.itemTouch]} 
                                onPress={() => onPress(item)}>
                                    <Text 
                                        style={[
                                                styles.itemLabel,
                                                isActiveBtn(styles.itemActiveLabel, item)
                                            ]}>
                                                {item.label}
                                    </Text>
                            </TouchableOpacity>
                    </View> 
                )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#d9d9d9',
        borderRadius: 7,
        overflow: 'hidden',
        padding: 0,
    },
    item: {
        flex: 1,
        flexGrow: 1,
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        borderRightColor: '#d9d9d9',
        borderStyle: 'solid',
        // left: 1,
        // top: -1,
    },
    itemDisable: {
        backgroundColor: '#d9d9d9',
        opacity: 0.5,
    },
    itemActive: {
        backgroundColor: THEME.PRIMARY,
        borderWidth: 2,
        borderRightColor: THEME.PRIMARY,
    },
    itemTouch: {
        width: '100%',
        height: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#333333'
    },
    itemActiveLabel: {
        color: THEME.PRIMARY_INVERT,
    }
});

RadioBtnGroup.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
        disabled: PropTypes.bool,
    })),
    onChange: PropTypes.func,
    selected: PropTypes.any,
    marginVertical: PropTypes.number,
    marginHorizontal: PropTypes.number,
}

export default RadioBtnGroup;