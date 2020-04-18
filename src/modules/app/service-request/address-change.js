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

const AddressChange = ({
    depositeList,
    navigation,
    userDetails: {
        panNumber,
        customerId,
    } = {},
    form: {
        createField, getFieldsValue, setFieldValue, validateForm,
    },
    residentList,
    states,
    districts,
    countries,
}) => {
    const [showOTP, setShowOtp] = useState(false);
    const [loading, setLoading] = useState(false);
    const onVerify = () => {
        setShowOtp(false);
        setLoading(true);
        const values = getFieldsValue();
        const data = {
            ...values,
            "serviceType":"addressChange",
            "customerId": customerId,
            "addressType": "COMM_ADDR",
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
            {createField('residentialStatus', {
                trigger: 'onValueChange',
                valueProp: '=selectedValue',
                initialValue: residentList && residentList[2] && residentList[2].residentCode,
                rules: [
                    {required: true, message: 'Residential Status is required.'},
                ],
                localData: {
                    label: 'Residential Status',
                }
            })(<Picker>
                {residentList && residentList.map((d, idx) =>
                    <Picker.Item 
                        key={d.residentCode + '-' + idx}
                        value={d.residentCode} 
                        label={d.residentName} />
                )}
            </Picker>)}

            {createField('countryCode', {
                trigger: 'onValueChange',
                valueProp: '=selectedValue',
                initialValue: countries && countries[0] && countries[0].countryCode,
                rules: [
                    {required: true, message: 'Country is required.'},
                ],
                localData: {
                    label: 'Country',
                }
            })(<Picker>
                {countries && countries.map((d, idx) =>
                    <Picker.Item 
                        key={d.countryCode + '-' + idx}
                        value={d.countryCode} 
                        label={d.countryName} />
                )}
            </Picker>)}


            {createField('street', {
                trigger: TEXT_INPUT_TRIGGER,     
                rules: [
                    {required: true, message: 'Required.'},
                ], 
                localData: {    
                    label: 'Door No/ Building/ Street',
                }
            })(<TextInput />)}


            {createField('area', {
                trigger: TEXT_INPUT_TRIGGER,     
                rules: [
                    {required: true, message: 'Required.'},
                ], 
                localData: {    
                    label: 'Area / Landmark',
                }
            })(<TextInput />)}


            {createField('state', {
                trigger: 'onValueChange',
                valueProp: '=selectedValue',
                initialValue: states && states[0] && states[0].stateCode,
                rules: [
                    {required: true, message: 'State is required.'},
                ],
                localData: {
                    label: 'State',
                }
            })(<Picker>
                {states && states.map((d, idx) =>
                    <Picker.Item 
                        key={d.stateCode + '-' + idx}
                        value={d.stateCode} 
                        label={d.stateName} />
                )}
            </Picker>)}

            {createField('district', {
                trigger: 'onValueChange',
                valueProp: '=selectedValue',
                initialValue: districts && districts[0] && districts[0].districtCode,
                rules: [
                    {required: true, message: 'District is required.'},
                ],
                localData: {
                    label: 'District',
                }
            })(<Picker>
                {districts && districts.map((d, idx) =>
                    <Picker.Item 
                        key={d.districtCode + '-' + idx}
                        value={d.districtCode} 
                        label={d.districtName} />
                )}
            </Picker>)}

            {createField('city', {
                trigger: TEXT_INPUT_TRIGGER,     
                rules: [
                    {required: true, message: 'Required.'},
                ], 
                localData: {    
                    label: 'Village/Town/City',
                }
            })(<TextInput />)}

            {createField('pinCode', {
                trigger: TEXT_INPUT_TRIGGER,     
                rules: [
                    {required: true, message: 'Pincode is Required.'},
                    {pattern: REGEX.NUMBER, message: 'Pin code should be in number'},
                ], 
                localData: {    
                    label: 'Pincode',
                }
            })(<TextInput />)}

            {createField('emailId', {
                trigger: TEXT_INPUT_TRIGGER,     
                rules: [
                    {required: true, message: 'Email ID is Required.'},
                    {pattern: REGEX.EMAIL.PATTERN, message: REGEX.EMAIL.MESSAGE()},
                ], 
                localData: {    
                    label: 'Email ID',
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
})(AddressChange);