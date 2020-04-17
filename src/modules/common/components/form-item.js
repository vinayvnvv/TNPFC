import React, {useState} from 'react';
import { StyleSheet } from 'react-native';
import { THEME } from '../../../../config';
import { View, Text } from 'native-base';
const FormItem = ({
    input,
    label,
    focusInEvent = 'onFocus',
    focusOutEvent = 'onBlur',
    isErr,
    errText,
    onFocusOut,
    disabled,
    style ={},
    isVertical,
}) => {
    const [isFocus, setFocus] = useState(false);
    const inputProps = {
        style: [styles.input]
    };
    if(focusInEvent) {
        inputProps[focusInEvent] = () => {
            setFocus(true);
        }
    }
    if(focusOutEvent) {
        inputProps[focusOutEvent] = () => {
            setFocus(false);
            if(onFocusOut) onFocusOut();
        }
    }
    return (
        !isVertical ? 
        <>
            <View 
                pointerEvents={disabled ? 'none' : 'auto'}
                style={[
                        styles.formItem, 
                        isFocus ? styles.formItemFocus : {},
                        isErr ? styles.formErr : {}, 
                        disabled ? styles.formItemDisabled : {},
                    ]}>
                <View style={styles.label}>
                    <Text style={[
                            styles.labelText, 
                            isErr ? styles.formErr : {}
                        ]}>{label}</Text>
                </View>
                <View style={styles.field}>
                    {React.cloneElement(input, {...inputProps})}
                </View>
                
            </View>
            {isErr && errText && (
                <View style={styles.errC}>
                    <Text style={styles.errText}>{errText}</Text>
                </View>
            )}
        </>
        : 
        <>
            <View style={[styles.formItemVertical, style]}>
                <Text style={[styles.labelText, styles.formItemVerticalLabelText]}>{label}</Text>
                <View style={[
                    styles.formField,
                    isFocus ? styles.formItemFocus : {},
                    isErr ? styles.formErr : {}, 
                    disabled ? styles.formItemDisabled : {},
                    ]}>
                    {React.cloneElement(input, {...inputProps})}
                </View>
                {isErr && errText && (
                    <View style={[styles.errC, styles.formItemVerticalErrC]}>
                        <Text style={styles.errText}>{errText}</Text>
                    </View>
                )}
            </View>
        </>
    );
}

const inputMinHeight = 52;
const styles = StyleSheet.create({
    formItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#c8c8c8',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 5,
        marginBottom: 23,
        position: 'relative',
        minHeight: inputMinHeight,
    },
    formItemDisabled: {
        backgroundColor: '#f0f0f0',
    },
    formItemFocus: {
        borderWidth: 2,
        borderColor: '#444',
    },
    formErr: {
        borderColor: THEME.DANGER,
        color: THEME.DANGER,
    },  
    label: {
        // minHeight: inputMinHeight,
        width: '40%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 13,
    },
    labelText: {
        color: '#888',
        fontSize: 13,
        marginRight: 21,
    },
    field: {
        flex: 1,
        flexGrow: 1,
        // minHeight: inputMinHeight,
        flexDirection: 'row',
        alignItems: "center",
        maxHeight: inputMinHeight - 10,
    },
    input: {
        // minHeight: inputMinHeight,
        fontSize: 16,
        width: '100%',
        fontWeight: '500',
        color: '#000',
    },
    errC: {
        // position: 'absolute',
        // top: '100%',
        // left: 0,
        // width: '100%',
        marginTop: -23,
    },
    errText: {
        color: THEME.DANGER,
        fontSize: 13,
    },
    formItemVertical: {
        marginBottom: 25,
        position: 'relative',
    },
    formField: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: inputMinHeight - 10,
        borderColor: '#d9d9d9',
        borderStyle: 'solid',
        borderWidth: 1,
        paddingHorizontal: 17,
    },
    formItemVerticalLabelText: {
        marginBottom: 3,
        color: '#666'
    },
    formItemVerticalErrC: {
        position: 'absolute',
        top: '100%',
        marginTop: 0,
    }
});

export default FormItem;