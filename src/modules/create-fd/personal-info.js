import React from 'react';
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
    },
    onPreviousStep,
    onSubmit,
    data,
}) => {
    console.log(getFieldsValue());
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
    })}
    {createField('profile_image', {
        initialValue: data && data.profile_image,
    })}
    const onFormSubmit = () => {
        onSubmit(validateForm);
    }
    return (
        <View style={styles.container}>
            <View style={CREATE_FD_STYLES.section}>
                <Text style={CREATE_FD_STYLES.sectionTitle}>Basic</Text>
                <View style={CREATE_FD_STYLES.sectionContent}>
                    {createField('first_name', {
                        trigger: TEXT_INPUT_TRIGGER,
                        initialValue: data && data.first_name,
                        rules: [
                            {required: true, message: 'First Name is required.'},
                            {pattern: REGEX.NAME_WITH_SPACE.PATTERN, message: REGEX.NAME_WITH_SPACE.MESSAGE('First Name')}
                        ],
                        localData: {
                            label: 'First Name',
                        }
                    })(<TextInput placeholder={'Enter First Name'}/>)}

                    {createField('last_name', {
                        trigger: TEXT_INPUT_TRIGGER,
                        initialValue: data && data.last_name,
                        rules: [
                            {required: true, message: 'First Name is required.'},
                            {pattern: REGEX.NAME_WITH_SPACE.PATTERN, message: REGEX.NAME_WITH_SPACE.MESSAGE('Last Name')}
                        ],
                        localData: {
                            label: 'Last Name',
                        }
                    })(<TextInput placeholder={'Enter Last Name'}/>)}

                    {createField('dob', {
                        trigger: 'onDateChange',
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
                        initialValue: data && data.gender,
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
                            <Picker.Item label="Male" value="male" />
                            <Picker.Item label="Female" value="female" />
                            <Picker.Item label="Others" value="others" />
                    </Picker>)}

                    {createField('residence', {
                        trigger: 'onValueChange',
                        initialValue: data && data.residence,
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
                            {residenceOptions.map((item, idx) =>
                                <Picker.Item 
                                    label={item.label} 
                                    value={item.value} 
                                    key={idx + 'resident'} /> 
                            )}
                    </Picker>)}

                    {createField('mobile', {
                        trigger: TEXT_INPUT_TRIGGER,
                        initialValue: data && data.mobile,
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
                <View style={CREATE_FD_STYLES.sectionContent}>
                    {createField('aadhaar', {
                        trigger: TEXT_INPUT_TRIGGER,
                        initialValue: data && data.aadhaar,
                        localData: {
                            label: 'Aadhaar No',
                        },
                        rules: [
                            {required: true, message: 'Aadhaar No is required.'},
                            {pattern: REGEX.AADHAAR.PATTERN, message: REGEX.AADHAAR.MESSAGE()}
                        ],
                    })(<TextInput placeholder={'Enter Aadhaar'}/>)}

                    {createField('pan', {
                        trigger: TEXT_INPUT_TRIGGER,
                        initialValue: data && data.pan,
                        localData: {
                            label: 'PAN No',
                        },
                        rules: [
                            {required: true, message: 'Aadhaar No is required.'},
                            {pattern: REGEX.PAN.PATTERN, message: REGEX.PAN.MESSAGE()}
                        ],
                    })(<TextInput placeholder={'Enter PAN no'}/>)}
                </View>
            </View>

            <View style={CREATE_FD_STYLES.section}>
                <View style={CREATE_FD_STYLES.sectionTitleC}>
                    <Text style={CREATE_FD_STYLES.sectionTitleCText}>Upload PAN/AADHAAR ID</Text>
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
    }
});

export default createForm({
    showErrosOnInit: true,
    defaultValueProp: Platform.OS === 'web' ? 'value' : '=value',
    template: (field, input, form, data) => {
        const {errors} = form;
        const err = errors && errors[field];
        return <FormItem 
                    input={input} 
                    label={data.label} 
                    errText={err ? errors[field][0].message : null}
                    isErr={err ? true : false}/>
    }
})(PersonalInfo);