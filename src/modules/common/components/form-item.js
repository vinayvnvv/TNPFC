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
        }
    }
    return (
        <>
            <View style={[
                        styles.formItem, 
                        isFocus ? styles.formItemFocus : {},
                        isErr ? styles.formErr : {}, 
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
        width: '35%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 13,
    },
    labelText: {
        color: '#888',
        fontSize: 13,
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
    }
});

export default FormItem;