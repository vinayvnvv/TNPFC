import React, {useState} from 'react';
import { Text, View, Spinner, Button, DatePicker, Picker, Toast } from 'native-base';
import { TextInput } from 'react-native-gesture-handler';
import SelectAccount from './select-account';
import Steps from '../../common/components/steps';
import ListItemPanel from '../../common/components/list-item-panel';
import apiServices from '../../../services/api-services';
import utils from '../../../services/utils';
import FormItem from '../../common/components/form-item';
import { createForm } from '../../../lib/form';
import { StyleSheet, Platform, Alert } from 'react-native';
import { REGEX } from '../../../constants';
import moment from 'moment';
import { SERV_REQ_STYLES } from './service-req-styles';
import OTPVerify from './otp-verify';
const TEXT_INPUT_TRIGGER = Platform.OS === 'web' ? 'onChange' : 'onChangeText';

const steps = [
    {label: 'Select Account'},
    {label: 'Change Request'}
];

const NomineeForm = ({
    depositeList,
    navigation,
    userDetails: {
        panNumber,
        customerId,
    } = {},
    relationships,
    form: {
        createField, 
        getFieldsValue, 
        setFieldValue, 
        validateForm,
        clearFields,
    },
}) => {
    const [showOTP, setShowOtp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentStep, setStep] = useState(0);
    const [selectedAcc, setSelectedAcc] = useState(null);
    const [listPanelData, setListPanelData] = useState([]);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [isGuardian, setIsGuardian] = useState(false);
    const onAccChange = (v) => {
        console.log(v);
        setSelectedAcc(v);
        createListPanelData(v);
    }
    const createListPanelData = accNumber  => {
        if(accNumber) {
            setLoadingSummary(true);
            apiServices.fetchFDSummary(accNumber).then(res => {
                setLoadingSummary(false);
                const {data} = res;
                if(data.response && data.response[0]) {
                    const d = data.response[0];
                    setListPanelData([
                        ['Nominee Name', d.nomineeName],
                        ['Date of Birth', d.nomineeDob ? utils.getAppCommonDateFormat(d.nomineeDob) : '--'],
                        ['Relationship', d.nomineeRelationship],
                    ]);
                }
            }).catch(err => {
                setLoadingSummary(false);
            });
            
        }
    }
    const onDateChange = v => {
        const age = moment().diff(v, 'years');
        if(age < 18) {
            setIsGuardian(true);
        } else {
            setIsGuardian(false);
            clearFields(['guardianRelationship', 'guardianName']);
        }
    }
    const onSubmit = () => {
        validateForm((err, values) => {
            console.log(err, values);
            if(!err) {
                setShowOtp(true);
            }
        });
    }

    const onVerify = () => {
        setShowOtp(false);
        setLoading(true);
        const values = getFieldsValue();

        let data = {
            "serviceType":"nomineeChange",
            "depositNumber": values.depositNumber,
            "customerId": customerId,
            "nomineeName": values.nomineeName,
            "relationship": values.relationship,
            "nomineeDob": moment(values.nomineeDob).format('DD-MMM-YYYY'),
            "nomineeStatus": "0",
        };
        if(isGuardian) {
            data["guardianName"] = values.guardianName,
            data["guardianRelationship"] = values.guardianRelationship,
            data["nomineeStatus"] = "0"
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
    
    return (
        <>
            <Steps steps={steps} currentStep={currentStep}/>
            {currentStep === 0 ? (
                <>
                    <SelectAccount 
                        onChange={onAccChange} 
                        accounts={depositeList}/>
                    {loadingSummary && <Spinner />}
                    {listPanelData && listPanelData.length > 0 && !loadingSummary &&  (
                        <ListItemPanel 
                            itemWidth={'50%'}
                            noHoverEffect
                            panelTitleLabel={'Existing Nominee Details'}
                            lists={listPanelData}
                            panelTitleValue={selectedAcc}/>
                    )}
                    <View style={{height: 18}}/>
                    <Button 
                        onPress={() => setStep(1)}
                        disabled={loadingSummary || !selectedAcc} 
                        block>
                        <Text>Nominee Inclusion / Update / Cancel</Text>
                    </Button>
                </>
            ) : (
                <View style={styles.formC}>
                    {createField('depositNumber', {
                        trigger: TEXT_INPUT_TRIGGER,   
                        initialValue: selectedAcc,
                        localData: {
                            label: 'Selected Account',
                            disabled: true,
                        }
                    })(<TextInput editable={false}/>)}

                    {createField('nomineeName', {
                        trigger: TEXT_INPUT_TRIGGER,  
                        rules: [
                            {required: true, message: 'Nominee Name is Required'},
                            {pattern: REGEX.NAME_WITH_SPACE.PATTERN, message: REGEX.NAME_WITH_SPACE.MESSAGE('Nominee Name')}
                        ],
                        localData: {
                            label: 'Nominee Name',
                        }
                    })(<TextInput placeholder="Enter Name" />)}

                    {createField('relationship', {
                            trigger: 'onValueChange',
                            initialValue: relationships && relationships[0] && relationships[0].relationshipCode,
                            valueProp: '=selectedValue',
                            localData: {
                                label: 'Relationship',
                            },
                            rules: [
                                {required: true, message: 'Relationship is required.'},
                            ],
                        })(<Picker
                            placeholder="Select Relationship"
                            selectedValue={getFieldsValue('relationship')}
                            mode={'dropdown'}>
                                {relationships && relationships.map((item, idx) =>
                                    <Picker.Item 
                                        label={item.relationshipName} 
                                        value={item.relationshipCode} 
                                        key={idx + 'state'} /> 
                                )}
                        </Picker>)}

                    {createField('nomineeDob', {
                        trigger: 'onDateChange',
                        initialValue: Platform.OS === 'web' && new Date('05-29-1967'),
                        localData: {
                            label: 'Date of Birth',
                        },
                        onValueChange: onDateChange,
                        rules: [
                            {required: true, message: 'Date of Birth is required.'},
                        ],
                    })(<DatePicker placeHolderTextStyle={
                            Platform.OS !== 'web' ? {color: '#999'} : {}
                        }/>)}
                    {isGuardian && (
                        <>
                            <Text style={SERV_REQ_STYLES.sectionTtl}>Guardian Details</Text>
                            {createField('guardianName', {
                                trigger: TEXT_INPUT_TRIGGER,  
                                rules: [
                                    {required: true, message: 'Guardian name is Required'},
                                    {pattern: REGEX.NAME_WITH_SPACE.PATTERN, message: REGEX.NAME_WITH_SPACE.MESSAGE('Nominee Name')}
                                ],
                                localData: {
                                    label: 'Guardian name',
                                }
                            })(<TextInput placeholder="Guardian name" />)}

                            {createField('guardianRelationship', {
                                trigger: 'onValueChange',
                                initialValue: relationships && relationships[0] && relationships[0].relationshipCode,
                                valueProp: '=selectedValue',
                                localData: {
                                    label: 'Relationship',
                                },
                                rules: [
                                    {required: true, message: 'Relationship is required.'},
                                ],
                            })(<Picker
                                placeholder="Select Relationship"
                                selectedValue={getFieldsValue('relationship')}
                                mode={'dropdown'}>
                                    {relationships && relationships.map((item, idx) =>
                                        <Picker.Item 
                                            label={item.relationshipName} 
                                            value={item.relationshipCode} 
                                            key={idx + 'state'} /> 
                                    )}
                            </Picker>)}
                        </>
                    )}

                    {showOTP && <OTPVerify panNumber={panNumber} onVerify={onVerify}/>}
                    {loading && <Spinner />}
                    {!showOTP && !loading  && (
                        <Button block onPress={onSubmit}>
                            <Text>Authenticate Your Request</Text>
                        </Button>
                    )}
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    formC: {
        marginTop: 21
    }
});

export default createForm({
    showErrosOnInit: true,
    onValueChanges: (value, values, errors, props) => {
        console.log('hnhe-->', value, values, errors, props);
    },
    defaultValueProp: Platform.OS === 'web' ? 'value' : '=value',
    template: (field, input, form, data = {}, props) => {
        const {error, touched, isSubmit} = field;
        return <FormItem 
                input={input} 
                onFocusOut={data && data.onFocusOut}
                isVertical
                style={{marginBottom: 31}}
                label={data.label} 
                disabled={data.disabled}
                errText={(error) ? error[0].message : null}
                isErr={(error && (touched || isSubmit)) ? true : false}/>
    }
})(NomineeForm);