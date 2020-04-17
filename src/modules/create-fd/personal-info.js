import React, {useState} from 'react';
import { StyleSheet, Image } from 'react-native';
import { THEME } from '../../../config';
import { View, DatePicker, Picker, Text, Button, Icon } from 'native-base';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import FormItem from '../common/components/form-item';
import { createForm } from '../../lib/form';
import { Platform } from '@unimodules/core';
import { CREATE_FD_STYLES } from './common-styles';
import * as ImagePicker from 'expo-image-picker';
import { REGEX } from '../../constants';
import StepNavigation from './step-navigation';

const TEXT_INPUT_TRIGGER = Platform.OS === 'web' ? 'onChange' : 'onChangeText';
const residenceOptions = [
    {label: 'Resident', value: 'resisent'},
    {label: 'Non Resident', value: 'non_resisent'},
    {label: 'Foreiner', value: 'foreiner'},
];
const profilePicUploadOption = {
    aspect: [1, 1],
    quality: 1
};
const PersonalInfo = ({
    form: {
        createField, getFieldsValue, setFieldValue, validateForm,
        getErrors,
    },
    onPreviousStep,
    onSubmit,
    data,
    panStatus,
    validatePan,
    aadharStatus,
    validateAadhar,
    residentList,
}) => {
    const errors = getErrors() || {};
    const [isSubmit, setIsSubmit] = useState(false);
    let panVal = false;
    const pickImage = async (field) => {
        let options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
        };
        if(field === 'profile_image') {
            options = {
                ...options,
                ...profilePicUploadOption,
            };
        }
        let result = await ImagePicker.launchImageLibraryAsync(options);
        const {uri} = result;
        setFieldValue(field, uri);
    }
    {createField('pan_image', {
        initialValue: data && data.pan_image,
        rules: [
            {required: true, message: 'Pan Card proof is required!'}
        ]
    })}
    {createField('profile_image', {
        initialValue: data && data.profile_image,
        rules: [
            {required: true, message: 'Profile Image is required!'}
        ]
    })}
    const onFormSubmit = () => {
        if(!isSubmit) setIsSubmit(true);
        onSubmit(validateForm);
    }
    
    const doValidatePan = () => {
        const val = getFieldsValue('pan');
        let valid = false;
        if(REGEX.PAN.PATTERN.test(val)) {
            const errors = getErrors();
            if(errors) {
                let errField;
                if(errors['dob']) {
                    errField = 'Date of birth';
                }
                if(errors['mobile']) {
                    errField = 'Mobile number';
                }
                // if(errors['last_name']) {
                //     errField = 'Last Name';
                // }
                if(errors['first_name']) {
                    errField = 'First Name';
                }
                if(errField) {
                    valid = errField + ' is required for PAN validation.';
                }
            } 
        }
        return valid;
    }
    panVal = doValidatePan();

    if(!panVal && panStatus === null) {
        const {first_name, last_name, dob, pan} = getFieldsValue();
        if(REGEX.PAN.PATTERN.test(pan)) {
            validatePan(pan, first_name, dob);
        }
    } 

    if(aadharStatus === null) {
        const {aadhaar} = getFieldsValue();
        if(REGEX.AADHAAR.PATTERN.test(aadhaar)) {
            validateAadhar(aadhaar);
        }
    }

    const onBlurAadhar = () => {
        const val = getFieldsValue('aadhaar');
        if(REGEX.AADHAAR.PATTERN.test(val)) {
            const {aadhaar} = getFieldsValue();
            validateAadhar(aadhaar);
        }
    }
    
    const onBlurPan = () => {
        let panValid = doValidatePan();
        if(!panValid) {
            const val = getFieldsValue('pan');
            if(REGEX.PAN.PATTERN.test(val)) {
                const {first_name, last_name, dob, pan} = getFieldsValue();
                validatePan(pan, first_name, dob);
            }
        }
    }
    return (
        <View style={styles.container}>
            <View style={CREATE_FD_STYLES.section}>
                <Text style={CREATE_FD_STYLES.sectionTitle}>Basic</Text>
                <View style={CREATE_FD_STYLES.sectionContent}>
                    {createField('first_name', {
                        trigger: TEXT_INPUT_TRIGGER,
                        initialValue: 'VIJAYKUMAR KUNNATH',
                        // initialValue: data && data.first_name,
                        rules: [
                            {required: true, message: 'Name is required.'},
                            {pattern: REGEX.NAME_WITH_SPACE.PATTERN, message: REGEX.NAME_WITH_SPACE.MESSAGE('Name')}
                        ],
                        localData: {
                            label: 'Name',
                        }
                    })(<TextInput placeholder={'Enter First Name'} />)}

                    {/* {createField('last_name', {
                        trigger: TEXT_INPUT_TRIGGER,
                        // initialValue: data && data.last_name,
                        initialValue: 'KUNNATH',
                        rules: [
                            {required: true, message: 'First Name is required.'},
                            {pattern: REGEX.NAME_WITH_SPACE.PATTERN, message: REGEX.NAME_WITH_SPACE.MESSAGE('Last Name')}
                        ],
                        localData: {
                            label: 'Last Name',
                        }
                    })(<TextInput placeholder={'Enter Last Name'}/>)} */}

                    {createField('dob', {
                        trigger: 'onDateChange',
                        initialValue: Platform.OS === 'web' ? new Date('05-29-1967') : (data && data.dob),
                        localData: {
                            label: 'DOB',
                        },
                        rules: [
                            {required: true, message: 'DOB is required.'},
                        ],
                    })(<DatePicker placeHolderTextStyle={
                            Platform.OS !== 'web' ? {color: '#999'} : {}
                        }/>)}

                    {createField('gender', {
                        trigger: 'onValueChange',
                        initialValue: (data && data.gender) || 'MALE',
                        valueProp: '=selectedValue',
                        localData: {
                            label: 'Gender',
                        },
                        rules: [
                            {required: true, message: 'Gender is required.'},
                        ],
                    })(<Picker
                        placeholder="Select Gender"
                        selectedValue={getFieldsValue('gender')}
                        mode={'dropdown'}>
                            <Picker.Item label="Male" value="MALE" />
                            <Picker.Item label="Female" value="FEMALE" />
                            <Picker.Item label="Others" value="OTHERS" />
                    </Picker>)}

                    {createField('residence', {
                        trigger: 'onValueChange',
                        initialValue: (data && data.residence) || (residentList && residentList[2] && residentList[2].residentCode),
                        valueProp: '=selectedValue',
                        localData: {
                            label: 'Residential',
                        },
                        rules: [
                            {required: true, message: 'Residential is required.'},
                        ],
                    })(<Picker
                        placeholder="Select Residential Status"
                        selectedValue={getFieldsValue('gender')}
                        mode={'dropdown'}>
                            {residentList && residentList.map((item, idx) =>
                                <Picker.Item 
                                    label={item.residentName} 
                                    value={item.residentCode} 
                                    key={idx + 'resident'} /> 
                            )}
                    </Picker>)}

                    {createField('mobile', {
                        trigger: TEXT_INPUT_TRIGGER,
                        // initialValue: data && data.mobile,
                        initialValue: '7045843647',
                        localData: {
                            label: 'Mobile Number',
                        },
                        rules: [
                            {required: true, message: 'Mobile number is required.'},
                            {pattern: REGEX.MOBILE.PATTERN, message: REGEX.MOBILE.MESSAGE('Mobile Number')}
                        ],
                    })(<TextInput placeholder={'Enter Mobile Number'}/>)}

                    {createField('email', {
                        trigger: TEXT_INPUT_TRIGGER,
                        initialValue: data && data.email,
                        localData: {
                            label: 'Email',
                        },
                        rules: [
                            {required: true, message: 'Email is required.'},
                            {pattern: REGEX.EMAIL.PATTERN, message: REGEX.EMAIL.MESSAGE()}
                        ],
                    })(<TextInput placeholder={'someone@gmail.com'}/>)}
                </View>
            </View>

            <View style={CREATE_FD_STYLES.section}>
                <Text style={CREATE_FD_STYLES.sectionTitle}>Identification</Text>
                {/* <Text style={CREATE_FD_STYLES.sectionSubTitle}>(Fill Basis details to validate)</Text> */}
                <View style={CREATE_FD_STYLES.sectionContent}>
                    {createField('aadhaar', {
                        trigger: TEXT_INPUT_TRIGGER,
                        initialValue: '830910399777',
                        // initialValue: data && data.aadhaar,
                        localData: {
                            label: 'Aadhaar No',
                            onFocusOut: () => {
                                if(aadharStatus !== 'loading') onBlurAadhar();
                            },
                            disabled: (props) => {
                                if(!props) return false;
                                return props.aadharStatus === true || props.aadharStatus === 'loading';
                            },
                        },
                        rules: [
                            {required: true, message: 'Aadhaar No is required.'},
                            {pattern: REGEX.AADHAAR.PATTERN, message: REGEX.AADHAAR.MESSAGE()},
                        ],
                    })(<TextInput 
                            editable={aadharStatus !== 'loading' && aadharStatus !== true}
                            placeholder={'Enter Aadhaar'}/>)}
                    {aadharStatus === true && <Text style={[styles.successTextSub, {marginBottom: 25}]}>Aadhaar number is verified.</Text>}
                    {(!errors || !errors['aadhaar']) && aadharStatus === 'loading' && <Text style={styles.infoTextSub}>Verifying Aadhaar number..</Text>}
                    {!errors['aadhaar'] && aadharStatus && aadharStatus !== 'loading' && <Text style={styles.errTextSub}>{aadharStatus}</Text>}

                    {createField('pan', {
                        trigger: TEXT_INPUT_TRIGGER,
                        initialValue: 'ARRPK7194H',
                        // initialValue: data && data.pan,
                        localData: {
                            label: 'PAN No',
                            onFocusOut: () => {
                                if(panStatus !== 'loading') onBlurPan();
                            },
                            disabled: (props) => {
                                if(!props) return false;
                                return props.panStatus === true || props.panStatus === 'loading';
                            }
                        },
                        // onValueChange: (v) => {
                        //     if(v && !errors['pan']) validateForm();
                        // },
                        rules: [
                            {required: true, message: 'PAN No is required.'},
                            {pattern: REGEX.PAN.PATTERN, message: REGEX.PAN.MESSAGE()}
                        ],
                    })(<TextInput 
                        placeholder={'Enter PAN no'} 
                        selectTextOnFocus={panStatus !== 'loading'}
                        editable={panStatus !== 'loading' && panStatus !== true}/>)}
                    {panVal && <Text style={styles.errTextSub}>{panVal}</Text>}
                    {panStatus === true && <Text style={styles.successTextSub}>PAN number is verified.</Text>}
                    {(!errors || !errors['pan']) && panStatus === 'loading' && <Text style={styles.infoTextSub}>Verifying PAN number..</Text>}
                    {/* {!panVal && panStatus === null && <Text style={styles.errTextSub}>Loading</Text>} */}
                    {!errors['pan'] && !panVal && panStatus && panStatus !== 'loading' && <Text style={styles.errTextSub}>{panStatus}</Text>}
                    
                </View>
            </View>

            <View style={CREATE_FD_STYLES.section}>
                <View style={CREATE_FD_STYLES.sectionTitleC}>
                    <Text style={CREATE_FD_STYLES.sectionTitleCText}>Upload PAN (jpg, png, pdf)</Text>
                    {getFieldsValue('pan_image') ? (
                        <Button 
                            onPress={() => pickImage('pan_image')}
                            info 
                            small
                            style={styles.changeFileBtn}>
                            <Text>Change</Text>
                        </Button>
                    ) : <></>}
                </View>
                
                <View style={CREATE_FD_STYLES.sectionContent}>
                    {getFieldsValue('pan_image') ? (
                        <>
                        <Image 
                            source={{uri: getFieldsValue('pan_image')}} 
                            style={styles.panImage}/>
                        </>
                    ) : (
                        <TouchableOpacity onPress={() => pickImage('pan_image')}>
                            <View style={styles.uploader}>
                                <Icon style={styles.uploaderIcon} name={'cloud-upload'}/>
                                <Text style={styles.uploaderText}>Upload PAN/AADHAAR ID</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
                {isSubmit && errors && errors['pan_image'] && !getFieldsValue('pan_image') && (
                    <Text style={styles.err}>{errors['pan_image'][0].message}</Text>
                )}
            </View>

            <View style={CREATE_FD_STYLES.section}>
                <View style={CREATE_FD_STYLES.sectionTitleC}>
                    <Text style={CREATE_FD_STYLES.sectionTitleCText}>Upload Profile Pic</Text>
                    {getFieldsValue('profile_image') ? (
                        <Button 
                            onPress={() => pickImage('profile_image')}
                            info
                            small 
                            style={styles.changeFileBtn}>
                            <Text>Change</Text>
                        </Button>
                    ) : (<></>)}
                </View>
                <View style={CREATE_FD_STYLES.sectionContent}>
                    {getFieldsValue('profile_image') ? (
                        <>
                        <Image 
                            source={{uri: getFieldsValue('profile_image')}} 
                            style={styles.profileImage}/>
                        </>
                    ) : (
                        <TouchableOpacity onPress={() => pickImage('profile_image')}>
                            <View style={styles.uploader}>
                                <Icon style={styles.uploaderIcon} name={'cloud-upload'}/>
                                <Text style={styles.uploaderText}>Upload Profile Pic</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
                {isSubmit && errors && errors['profile_image'] && !getFieldsValue('profile_image') && (
                    <Text style={styles.err}>{errors['profile_image'][0].message}</Text>
                )}
            </View>

            <StepNavigation 
                nextBtn={'Next'} 
                prevBtn={'Previous'} 
                onNext={onFormSubmit}
                onPrev={onPreviousStep} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: THEME.LAYOUT_PADDING,
        paddingVertical: THEME.LAYOUT_PADDING,
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
    panImage: {
        height: 200,
        borderRadius: 9,
    },
    changeFileBtn: {
        marginTop: 5,
    },
    profileImage: {
        width: 200,
        height: 200,
        flexDirection: 'row',
        alignContent: 'center',
        alignSelf: 'center',
        borderRadius: 200,
    },
    errTextSub: {
        fontSize: 12,
        color: THEME.DANGER,
        marginTop: -19,
    },
    infoTextSub: {
        fontSize: 12,
        color: THEME.INFO,
        marginTop: -19,
        marginBottom: 7,
        fontWeight: '700',
    },
    successTextSub: {
        fontSize: 12,
        color: THEME.SUCCESS,
        fontWeight: '700',
        marginTop: -19,
        marginBottom: 9,
    },
    err: {
        color: THEME.DANGER,
        fontSize: 12,
    },
});

export default createForm({
    showErrosOnInit: true,
    defaultValueProp: Platform.OS === 'web' ? 'value' : '=value',
    template: (field, input, form, data, props) => {
        const {error, touched, isSubmit} = field;
        return <FormItem 
                    input={input} 
                    onFocusOut={data.onFocusOut}
                    disabled={data.disabled ? data.disabled(props) : false}
                    label={data.label} 
                    errText={(error) ? error[0].message : null}
                    isErr={(error && (touched || isSubmit)) ? true : false}/>
    }
})(PersonalInfo);