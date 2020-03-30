import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Icon } from 'native-base';
import { THEME } from '../../../../config';
import { TouchableOpacity } from 'react-native-gesture-handler';

const CheckBox = ({
    checked,
    onChange,
    size,
    activeColor,
    disabled,
}) => {
    const containerActive = {
        backgroundColor: activeColor ? activeColor : THEME.PRIMARY,
        borderColor: activeColor ? activeColor: THEME.PRIMARY,
    };
    const onPress = () => {
        if(onChange && {}.toString.call(onChange) === '[object Function]') {
            onChange(!checked);
        }
    }
    return (
        <TouchableOpacity onPress={onPress} disabled={disabled}>
            <View 
                style={[
                        styles.container,
                        checked ? containerActive : {},
                        size ? {height: size, width: size} : {},
                        disabled ? {opacity: 0.5} : {}
                    ]}>
                    {checked && 
                        <Icon 
                            name={'checkmark'} 
                            style={styles.icon}/>
                    }
            </View>
        </TouchableOpacity>  
    );
}
const styles = StyleSheet.create({
    container: {
        height: 24,
        width: 24,
        borderRadius: 24,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#c0c0c0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        color: '#fff',
        fontSize: 18,
    },
});

export default CheckBox;