import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Picker } from 'native-base';
import {THEME} from './../../../../config';
import utils from '../../../services/utils';

const SelectAccount = ({
    accounts,
    onChange,
}) => {
    const [selected, setSelected] = useState('');
    const onChangeValue = (v) => {
        if(v === '') return;
        setSelected(v);
        if(onChange) onChange(v);
    }
    return (
        <View style={styles.container}>
            {accounts && accounts.length > 0 && (
                 <View style={styles.selectAcc}>
                    <View style={styles.selectAccText}>
                        <Text style={styles.selectAccTextLabel}>Select Account</Text>
                    </View>
                    <View style={styles.selectAccPickerC}>
                        {accounts && accounts.length > 0 && (
                            <Picker 
                                selectedValue={selected} 
                                onValueChange={onChangeValue} 
                                style={styles.selectAccPicker} 
                                mode={'dropdown'}>
                                    <Picker.Item label="Select Account" value={''} color={'#c9c9c9'} />
                                    {accounts && accounts.map((a, idx) => 
                                        <Picker.Item 
                                            label={a.accountNumber + ' (' + utils.getAppCommonDateFormat(a.openDate) + ', ' + utils.convertToINRFormat(a.depositAmount) + ')'} 
                                            key={a.accountNumber + '-' + idx}
                                            value={a.accountNumber}/>
                                )}
                            </Picker>
                        )} 
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectAcc: {
        width: '100%',
        marginVertical: THEME.LAYOUT_PADDING,
        borderStyle: 'solid',
        borderColor: "#d9d9d988",
        borderWidth: 1,
    },
    selectAccText: {
        backgroundColor: '#ecf1f9',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 7,
        width: '100%',
        borderStyle: 'solid',
        borderColor: "#d9d9d966",
        borderBottomWidth: 1,
    },
    selectAccTextLabel: {
        color: THEME.PRIMARY,
        fontSize: 14,
        fontWeight: '700'
    },
    selectAccPickerC: {
        paddingVertical: 0,
        paddingHorizontal: 11,
        flexDirection: 'row',
        justifyContent: 'center'
    }
})

export default SelectAccount;