import React, {useState} from 'react';
import {Platform, Alert} from 'react-native';
import { Text, View, Picker, Button, Spinner, Toast } from 'native-base';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import {createForm} from './../../../lib/form';
import FormItem from '../../common/components/form-item';
import { REGEX } from '../../../constants';
import {SERV_REQ_STYLES} from './service-req-styles';
import OTPVerify from './otp-verify';
import apiServices from '../../../services/api-services';
import utils from '../../../services/utils';
const TEXT_INPUT_TRIGGER = Platform.OS === 'web' ? 'onChange' : 'onChangeText';

const TaxForm = ({
    depositeList,
    navigation,
    userDetails: {
        panNumber,
        dob,
        customerId,
    } = {},
    form: {
        createField, getFieldsValue, setFieldValue, validateForm,
        getErrors,
    },
}) => {
    const [showOTP, setShowOtp] = useState(false);
    const [loading, setLoading] = useState(false);
    const onChangeAccountNumber = v => {
        console.log('onChangeAccountNumber', v);
        const d = depositeList.filter(i=>i.accountNumber === v);
        if(d[0]) {
            setFieldValue('estimateInterest', d[0].annualInterest)
        }
    }
    const onVerify = () => {
        setShowOtp(false);
        setLoading(true);
        const values = getFieldsValue();
        const data = {
            ...values,
            "serviceType": "form15gSubmission",
            "customerId": customerId,
        }
        console.log(data);
        apiServices.createServiceRequest(data).then(res => {
            const {data} = res;
            if(data.responseCode === '200') {
                Alert.alert(
                    'ACK ID: ' + data.response.ACK_ID,
                    'Service request created successfully!',
                    [
                      {text: 'OK', onPress: () => navigation.goBack()},
                    ],
                    { cancelable: false }
                  );
                  if(Platform.OS === 'web') {
                      alert('succes - ' + data.response.ACK_ID);
                      navigation.goBack();
                  }
            } else {
                Alert.alert(
                    'Failed',
                    data.response,
                    [
                      {text: 'OK', onPress: () => navigation.goBack()},
                    ],
                    { cancelable: false }
                  );
                if(Platform.OS === 'web') {
                    alert('failed - ' + data.response);
                    navigation.goBack();
                }
            }
            setLoading(false);
        }).catch(err => {
            Toast.show({text: 'Err in newtwork', type: 'danger'});
            setLoading(false);
        })
    }
    const onSubmit = () => {
        validateForm((err, values) => {
            if(!err) {
                setShowOtp(true);
            }
        })
    }
     return (
        <>
            {createField('depositNumber', {
                trigger: TEXT_INPUT_TRIGGER,
                initialValue: depositeList && depositeList[0] && depositeList[0].accountNumber,
                rules: [
                    {required: true, message: 'Account Number is required.'},
                ],
                onValueChange: onChangeAccountNumber,
                localData: {
                    label: 'Account Number',
                }
            })(<Picker>
                {depositeList && depositeList.map((d, idx) =>
                    <Picker.Item 
                        key={d.accountNumber + '-' + idx}
                        value={d.accountNumber} 
                        label={d.accountNumber} />
                )}
            </Picker>)}
            {createField('panNumber', {
                trigger: TEXT_INPUT_TRIGGER,
                initialValue: panNumber,    
                localData: {
                    label: 'PAN Number',
                    disabled: true,
                }
            })(<TextInput  editable={false}/>)}

            {createField('dob', {
                trigger: TEXT_INPUT_TRIGGER,
                initialValue: dob ? utils.getAppCommonDateFormat(dob) : null,    
                localData: {
                    label: 'Date of Birth',
                    disabled: true,
                }
            })(<TextInput placeholder="dd/mm/yyyy" editable={false}/>)}
            {createField('act', {
                trigger: TEXT_INPUT_TRIGGER,
                initialValue: 'y',
                localData: {
                    label: 'Whether assesssment to tax under Income tax Act 1961',
                    disabled: true,
                }
            })(<Picker>
                <Picker.Item value={'y'} label={'Yes'}/>
            </Picker>)}
            {createField('assessmentYear', {
                trigger: TEXT_INPUT_TRIGGER,
                initialValue: '2019',
                rules: [
                    {required: true, message: 'Assesssment Year is required.'},
                ],
                localData: {
                    label: 'Latest assesssment year which assessed #',
                }
            })(<Picker>
                <Picker.Item value={'2019'} label={'2019-20'}/>
                <Picker.Item value={'2020'} label={'2020-21'}/>
            </Picker>)}
            {createField('estimateInterest', {
                initialValue: depositeList && depositeList[0] && depositeList[0].annualInterest,
                trigger: TEXT_INPUT_TRIGGER,      
                localData: {
                    label: 'Estimated Income earned on deposit(s)',
                    disabled: true,
                }
            })(<TextInput editable={false}/>)}
            {createField('estimateTotIncome', {
                trigger: TEXT_INPUT_TRIGGER,     
                rules: [
                    {required: true, message: 'Income is required.'},
                    {pattern: REGEX.NUMBER, message: 'Income should be in number.'},
                ], 
                localData: {
                    label: 'Estimated Total Income including the estimated income earned on deposit(s)*',
                }
            })(<TextInput />)}

            <Text style={SERV_REQ_STYLES.sectionTtl}>Detail of Form No. 15G/15H other than this form filled during the Current Financial Year #</Text>
            {createField('formFiled', {
                trigger: TEXT_INPUT_TRIGGER,     
                rules: [
                    {required: true, message: 'No of Forms is required.'},
                    {pattern: REGEX.NUMBER, message: 'No of Forms should be in number.'},
                ], 
                localData: {
                    label: 'a) No of Forms filed*',
                }
            })(<TextInput />)}
            {createField('aggregateAmt', {
                trigger: TEXT_INPUT_TRIGGER,     
                rules: [
                    {required: true, message: 'Aggregate is required.'},
                    {pattern: REGEX.NUMBER, message: 'Aggregate should be in number.'},
                ], 
                localData: {
                    label: 'b) Aggregate Amount*',
                }
            })(<TextInput />)}


            {showOTP && <OTPVerify panNumber={panNumber} onVerify={onVerify}/>}
            {loading && <Spinner />}
            {!showOTP && !loading  && (
                <Button block primary onPress={onSubmit}>
                    <Text>Authenticate Your Request </Text>
                </Button>
            )}
        </>
    );
}

export default createForm({
    showErrosOnInit: true,
    onValueChanges: (value, values, errors, props) => {
        console.log('hnhe-->', value, values, errors, props);
    },
    defaultValueProp: Platform.OS === 'web' ? 'value' : '=value',
    template: (field, input, form, data, props) => {
        const {error, touched, isSubmit} = field;
        return <FormItem 
                input={input} 
                onFocusOut={data.onFocusOut}
                isVertical
                label={data.label} 
                disabled={data.disabled}
                errText={(error) ? error[0].message : null}
                isErr={(error && (touched || isSubmit)) ? true : false}/>
    }
})(TaxForm);