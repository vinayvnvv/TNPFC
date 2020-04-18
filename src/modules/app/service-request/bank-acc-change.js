import React, {useState} from 'react';
import { Text, View, Spinner, Button, DatePicker, Picker, Toast, Icon } from 'native-base';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import SelectAccount from './select-account';
import Steps from '../../common/components/steps';
import ListItemPanel from '../../common/components/list-item-panel';
import apiServices from '../../../services/api-services';
import utils from '../../../services/utils';
import FormItem from '../../common/components/form-item';
import { createForm } from '../../../lib/form';
import { StyleSheet, Platform, Alert, Image } from 'react-native';
import { REGEX } from '../../../constants';
import moment from 'moment';
import { SERV_REQ_STYLES } from './service-req-styles';
import OTPVerify from './otp-verify';
import { THEME } from '../../../../config';
import * as ImagePicker from 'expo-image-picker';
import { CREATE_FD_STYLES } from '../../create-fd/common-styles';
const TEXT_INPUT_TRIGGER = Platform.OS === 'web' ? 'onChange' : 'onChangeText';

const steps = [
    {label: 'Select Account'},
    {label: 'Change Request'}
];

const profilePicUploadOption = {
    aspect: [1, 1],
    quality: 1
};

const BankAccChange = ({
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
        errors,
    },
}) => {
    const [showOTP, setShowOtp] = useState(false);
    const [isSubmit, setSubmit] = useState(false);
    const [ifscStatus, setIfcsStatus] = useState(null);
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
                        ['Bank Name', d.bankName ? d.bankName : '--'],
                        ['IFSC Code', d.ifscCode ? d.ifscCode : '--'],
                    ]);
                }
            }).catch(err => {
                setLoadingSummary(false);
            });
            
        }
    }
    const pickImage = async (field) => {
        let options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
        };
        if(field === 'imagePath') {
            options = {
                ...options,
                ...profilePicUploadOption,
            };
        }
        let result = await ImagePicker.launchImageLibraryAsync(options);
        const {uri} = result;
        setFieldValue(field, uri);
    }
    const onSubmit = () => {
        setSubmit(true);
        validateForm((err, values) => {
            console.log(err, values);
            if(!err && ifscStatus === true) {
                setShowOtp(true);
            }
        });
    }

    const onVerify = () => {
        setShowOtp(false);
        setLoading(true);
        const values = getFieldsValue();

        let data = {
            ...values,
            imagePath: 'link',
            "serviceType":"bankDetailsChange",
            customerId: customerId,
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

    const onIFSCChange = v => {
        if(REGEX.IFSC.PATTERN.test(v)) {
            console.log('valid');
            setIfcsStatus('loading');
            apiServices.getBankDetails(v).then(res => {
                const {data} = res;
                if(data.responseCode === '200') {
                    setIfcsStatus(true);
                    if(data.response && data.response[0]) {
                        setFieldValue('bankName', data.response[0]['bankName'])
                    }
                } else {
                    setIfcsStatus(false);
                }
            }).catch(err => {
                console.log(err);
                setIfcsStatus(false);
            })
        }
    }

    {createField('imagePath', {
        rules: [
            {required: true, message: 'Bank Cheque is required!'}
        ]
    })}
    
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
                            panelTitleLabel={'Existing Details'}
                            lists={listPanelData}
                            panelTitleValue={selectedAcc}/>
                    )}
                    <View style={{height: 18}}/>
                    <Button 
                        onPress={() => setStep(1)}
                        disabled={loadingSummary || !selectedAcc} 
                        block>
                        <Text>Inclusion / Update / Cancel</Text>
                    </Button>
                </>
            ) : (
                <View style={styles.formC}>
                    {createField('depositNumber', {
                        trigger: TEXT_INPUT_TRIGGER,   
                        initialValue: selectedAcc || 'aa',
                        localData: {
                            label: 'Selected Account',
                            disabled: true,
                        }
                    })(<TextInput editable={false}/>)}

                    {createField('accountNumber', {
                        trigger: TEXT_INPUT_TRIGGER,  
                        rules: [
                            {required: true, message: 'Bank Account Number is Required'},
                            {pattern: REGEX.NUMBER, message: 'Bank Account Number should contain only numbers'}
                        ],
                        localData: {
                            label: 'Bank Account Number',
                        }
                    })(<TextInput placeholder="Enter Account Number" />)}


                    {createField('accountHolderName', {
                        trigger: TEXT_INPUT_TRIGGER,  
                        rules: [
                            {required: true, message: 'Account Holder Name is Required'},
                            {pattern: REGEX.NAME_WITH_SPACE.PATTERN, message: REGEX.NAME_WITH_SPACE.MESSAGE('Account Holder Name')}
                        ],
                        localData: {
                            label: 'Account Holder Name',
                        }
                    })(<TextInput placeholder="Enter Name" />)}

                    {createField('ifscCode', {
                        trigger: TEXT_INPUT_TRIGGER,  
                        rules: [
                            {required: true, message: 'Account Holder Name is Required'},
                            {pattern: REGEX.IFSC.PATTERN, message: REGEX.IFSC.MESSAGE()}
                        ],
                        onValueChange: onIFSCChange,
                        localData: {
                            label: 'IFSC Code',
                        }
                    })(<TextInput placeholder="Enter IFSC Code" />)}
                    {ifscStatus === 'loading' && <Text style={[styles.err, styles.warn]}>Validating..</Text>}
                    {ifscStatus === false && <Text style={styles.err}>Ifsc code is invalid.</Text>}

                    {createField('bankName', {
                        trigger: TEXT_INPUT_TRIGGER,  
                        rules: [
                            {required: true, message: 'Bank Name is Required'},
                        ],
                        localData: {
                            label: 'Bank Name',
                            disabled: ifscStatus === true ? true : false,
                        }
                    })(<TextInput placeholder="Enter Bank Name" editable={ifscStatus === true ? false : true} />)}
                    

                    <View style={CREATE_FD_STYLES.section}>
                        <View style={CREATE_FD_STYLES.sectionTitleC}>
                            <Text style={CREATE_FD_STYLES.sectionTitleCText}>Upload Bank Chequec</Text>
                            {getFieldsValue('imagePath') ? (
                                <Button 
                                    onPress={() => pickImage('imagePath')}
                                    info
                                    small 
                                    style={styles.changeFileBtn}>
                                    <Text>Change</Text>
                                </Button>
                            ) : (<></>)}
                        </View>
                        <View style={CREATE_FD_STYLES.sectionContent}>
                            {getFieldsValue('imagePath') ? (
                                <>
                                <Image 
                                    source={{uri: getFieldsValue('imagePath')}} 
                                    style={styles.pic}/>
                                </>
                            ) : (
                                <TouchableOpacity onPress={() => pickImage('imagePath')}>
                                    <View style={styles.uploader}>
                                        <Icon style={styles.uploaderIcon} name={'cloud-upload'}/>
                                        <Text style={styles.uploaderText}>Upload Bank Cheque</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                        {isSubmit && errors && errors['imagePath'] && !getFieldsValue('imagePath') && (
                            <Text style={[styles.err, {marginTop: 0}]}>{errors['imagePath'][0].message}</Text>
                        )}
                    </View>
                    

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
    },
    warn: {
        color: THEME.ORANGE,
    },
    err: {
        color: THEME.DANGER,
        marginTop: -31,
        marginBottom: 11,
        fontSize: 12,
        fontWeight: '700'
    },
    uploader: {
        borderStyle: 'dotted',
        borderColor: '#d9d9d9',
        borderRadius: 9,
        borderWidth: 2,
        padding: 21,
        minHeight: 100,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0"
    },
    uploaderIcon: {
        marginBottom: 11,
        color: "#555",
        fontSize: 33,
    },
    uploaderText: {
        fontSize: 21,
        color: '#444',
    },
    pic: {
        height: 200,
        borderRadius: 9,
    },
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
})(BankAccChange);