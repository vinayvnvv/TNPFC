import React, {useState, useEffect} from 'react';
import { StyleSheet, Platform, Image } from 'react-native';
import { View, Text, Picker, Icon, Button } from 'native-base';
import StepNavigation from './step-navigation';
import { THEME } from '../../../config';
import { CREATE_FD_STYLES } from './common-styles';
import { createForm } from '../../lib/form';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import FormItem from '../common/components/form-item';
import { REGEX } from '../../constants';
import * as ImagePicker from 'expo-image-picker';
import CheckBox from '../common/components/checkbox';
const TEXT_INPUT_TRIGGER = Platform.OS === 'web' ? 'onChange' : 'onChangeText';


class AddressInfo extends React.Component {
    state = {
        sameAddress: false,
        isSubmit: false,
    }
    validateForm2;
    setSameAddress = (sameAddress) => {
        this.setState({sameAddress});
    }

    componentDidMount() {
        this.initSameAddress();
    }

    initSameAddress() {
        const {data: {same} = {}} = this.props;
        this.setState({sameAddress: same});
    }

    initForm2Validate = validate => {
        this.validateForm2 = validate;
    }
    onFormSubmit = () => {
        const {
            form: {validateForm},
            onSubmit,
        } = this.props;
        let errs;
        let values = {};
        this.setState({isSubmit: true});
        validateForm((err1, values1) => {
            errs = err1;
            values['permanent'] = values1;
            values['same'] = this.state.sameAddress;
            if(!this.state.sameAddress) {
                this.validateForm2((err2, values2) => {
                    errs = err1 ? {...err1} : err2;
                    values['other'] = values2;
                    onSubmit((callback) => {
                        callback(errs, values);
                    })
                });
            } else {
                onSubmit((callback) => {
                    callback(errs, values);
                })
            }
        })
    }
    pickImage = async () => {
        const {form: {setFieldValue}} = this.props;
        const field = 'address_proof';
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
    render() {
        const {
            onPreviousStep,
            data: {
                permanent,
                other,
            },
            states,
            districts,
            form: {
                createField, getFieldsValue, errors,
            },
            addressProofDocs,
        } = this.props;
        const {sameAddress, isSubmit} = this.state;
        // const errors = getErrors();
        {createField('address_proof', {
            initialValue: permanent && permanent.address_proof,
            rules: [
                {required: true, message: 'Address proof required!'}
            ]
        })}
        return (
            <View style={styles.container}>
                <View style={CREATE_FD_STYLES.section}>
                    <Text style={CREATE_FD_STYLES.sectionTitle}>Permanent Address</Text>
                    <View style={CREATE_FD_STYLES.sectionContent}>
                        {createField('address_line_1', {
                            trigger: TEXT_INPUT_TRIGGER,
                            initialValue: permanent && permanent.address_line_1,
                            rules: [
                                {required: true, message: 'Address Line 1 is required.'},
                            ],
                            localData: {
                                label: 'Building/Apartment',
                            }
                        })(<TextInput placeholder={'Enter Address'} />)}
                        {createField('address_line_2', {
                            trigger: TEXT_INPUT_TRIGGER,
                            initialValue: permanent && permanent.address_line_2,
                            rules: [
                                {required: true, message: 'Address Line 2 is required.'},
                            ],
                            localData: {
                                label: 'Location/Landmark',
                            }
                        })(<TextInput placeholder={'Enter Address'} />)}
    
                        {createField('state', {
                            trigger: 'onValueChange',
                            initialValue: (permanent && permanent.state) || (states && states[0] && states[0].stateCode),
                            valueProp: '=selectedValue',
                            localData: {
                                label: 'State',
                            },
                            rules: [
                                {required: true, message: 'State is required.'},
                            ],
                        })(<Picker
                            placeholder="Select State"
                            selectedValue={getFieldsValue('state')}
                            mode={'dropdown'}>
                                {states && states.map((item, idx) =>
                                    <Picker.Item 
                                        label={item.stateName} 
                                        value={item.stateCode} 
                                        key={idx + 'state'} /> 
                                )}
                        </Picker>)}
    
                        {createField('district', {
                            trigger: 'onValueChange',
                            initialValue: (permanent && permanent.district) || (districts && districts[0] && districts[0].districtCode),
                            valueProp: '=selectedValue',
                            localData: {
                                label: 'District',
                            },
                            rules: [
                                {required: true, message: 'District is required.'},
                            ],
                        })(<Picker
                            placeholder="Select District"
                            selectedValue={getFieldsValue('district')}
                            mode={'dropdown'}>
                                {districts && districts.map((item, idx) =>
                                    <Picker.Item 
                                        label={item.districtName} 
                                        value={item.districtCode} 
                                        key={idx + 'district'} /> 
                                )}
                        </Picker>)}
    
                        {createField('city', {
                            trigger: TEXT_INPUT_TRIGGER,
                            initialValue: permanent && permanent.city,
                            rules: [
                                {required: true, message: 'City is required.'},
                                {pattern: REGEX.NAME_WITH_SPACE.PATTERN, message: REGEX.NAME_WITH_SPACE.MESSAGE('City')}
                            ],
                            localData: {
                                label: 'City',
                            }
                        })(<TextInput placeholder={'Enter City'} />)}
    
                        {createField('pincode', {
                            trigger: TEXT_INPUT_TRIGGER,
                            initialValue: permanent && permanent.pincode,
                            rules: [
                                {required: true, message: 'Pincode is required.'},
                            ],
                            localData: {
                                label: 'Pincode',
                            }
                        })(<TextInput placeholder={'Enter Pincode'} />)}
    
                        <View style={CREATE_FD_STYLES.section}>
                            <View style={CREATE_FD_STYLES.sectionTitleC}>
                                <Text style={CREATE_FD_STYLES.sectionTitleCText}>Upload Address Proof</Text>
                                {getFieldsValue('address_proof') ? (
                                    <Button 
                                        onPress={() => this.pickImage()}
                                        info
                                        small 
                                        style={styles.changeFileBtn}>
                                        <Text>Change</Text>
                                    </Button>
                                ) : (<></>)}
                            </View>
                            {createField('addressProofType', {
                                trigger: 'onValueChange',
                                initialValue: (permanent && permanent.addressProofType) || (addressProofDocs && addressProofDocs[0] && addressProofDocs[0].addressProofDocCode),
                                valueProp: '=selectedValue',
                                localData: {
                                    label: 'Address Proof Type',
                                },
                                rules: [
                                    {required: true, message: 'Address Proof Type is required.'},
                                ],
                            })(<Picker
                                placeholder="Select Address Proof Type"
                                selectedValue={getFieldsValue('addressProofType')}
                                mode={'dropdown'}>
                                    {addressProofDocs && addressProofDocs.map((item, idx) =>
                                        <Picker.Item 
                                            label={item.addressProofDocName} 
                                            value={item.addressProofDocCode} 
                                            key={idx + 'addressProofType'} /> 
                                    )}
                            </Picker>)}
                            <View style={CREATE_FD_STYLES.sectionContent}>
                                {getFieldsValue('address_proof') ? (
                                    <>
                                    <Image 
                                        source={{uri: getFieldsValue('address_proof')}} 
                                        style={styles.panImage}/>
                                    </>
                                ) : (
                                    <TouchableOpacity onPress={() => this.pickImage()}>
                                        <View style={styles.uploader}>
                                            <Icon style={styles.uploaderIcon} name={'cloud-upload'}/>
                                            <Text style={styles.uploaderText}>Upload Profile Pic</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            </View>
                            {isSubmit && errors && errors['address_proof'] && !getFieldsValue('address_proof') && (
                                <Text style={styles.err}>{errors['address_proof'][0].message}</Text>
                            )}
                        </View>
    
                    </View>
                </View>
                <View style={CREATE_FD_STYLES.section}>
                    <Text style={CREATE_FD_STYLES.sectionTitle}>Correspondence Address</Text>
                    <View style={CREATE_FD_STYLES.sectionContent}>
                        <View style={styles.checkC}>
                            <CheckBox 
                                checked={sameAddress} 
                                onChange={
                                    () => this.setSameAddress(!sameAddress)
                                }/>
                            <Text style={styles.checkCL}>Same as Permanent Address</Text>
                        </View>
                        <View style={{height: 21}}/>
                        {!sameAddress && (
                            <Address2Form 
                                states={states} 
                                data={other}
                                initForm2Validate={this.initForm2Validate}
                                districts={districts}/>
                        )}
                    </View>
                </View>
                <StepNavigation 
                    nextBtn={'Next'} 
                    prevBtn={'Previous'} 
                    onNext={() => this.onFormSubmit()}
                    onPrev={onPreviousStep}/>
            </View>
        )
    }
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
    checkC: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    checkCL: {
        fontSize: 13,
        fontWeight: '500',
        color: '#666',
        flex: 1,
        flexGrow: 1,
        marginLeft: 9,
    },
    err: {
        color: THEME.DANGER,
        fontSize: 12,
    }
})

export default createForm({
    showErrosOnInit: true,
    defaultValueProp: Platform.OS === 'web' ? 'value' : '=value',
    template: (field, input, form, data, props) => {
        const {error, touched, isSubmit} = field;
        return <FormItem 
                input={input} 
                onFocusOut={data.onFocusOut}
                label={data.label} 
                errText={(error) ? error[0].message : null}
                isErr={(error && (touched || isSubmit)) ? true : false}/>
    }
})(AddressInfo);



const Address2FormComponent = ({
    data,
    form: {createField, getFieldsValue, validateForm},
    states,
    districts,
    initForm2Validate,
}) => {
    useEffect(() => {
        initForm2Validate(validateForm);
    }, []);
    return (
        <View>
            {createField('address_line_1', {
                trigger: TEXT_INPUT_TRIGGER,
                initialValue: data && data.address_line_1,
                rules: [
                    {required: true, message: 'Address Line 1 is required.'},
                ],
                localData: {
                    label: 'Building/Apartment',
                }
            })(<TextInput placeholder={'Enter Address'} />)}
            {createField('address_line_2', {
                trigger: TEXT_INPUT_TRIGGER,
                initialValue: data && data.address_line_2,
                rules: [
                    {required: true, message: 'Address Line 2 is required.'},
                ],
                localData: {
                    label: 'Location/Landmark',
                }
            })(<TextInput placeholder={'Enter Address'} />)}

            {createField('state', {
                trigger: 'onValueChange',
                initialValue: (data && data.state) || (states && states[0] && states[0].stateCode),
                valueProp: '=selectedValue',
                localData: {
                    label: 'State',
                },
                rules: [
                    {required: true, message: 'State is required.'},
                ],
            })(<Picker
                placeholder="Select State"
                selectedValue={getFieldsValue('state')}
                mode={'dropdown'}>
                    {states && states.map((item, idx) =>
                        <Picker.Item 
                            label={item.stateName} 
                            value={item.stateCode} 
                            key={idx + 'state'} /> 
                    )}
            </Picker>)}

            {createField('district', {
                trigger: 'onValueChange',
                initialValue: (data && data.district) || (districts && districts[0] && districts[0].districtCode),
                valueProp: '=selectedValue',
                localData: {
                    label: 'District',
                },
                rules: [
                    {required: true, message: 'District is required.'},
                ],
            })(<Picker
                placeholder="Select District"
                selectedValue={getFieldsValue('district')}
                mode={'dropdown'}>
                    {districts && districts.map((item, idx) =>
                        <Picker.Item 
                            label={item.districtName} 
                            value={item.districtCode} 
                            key={idx + 'district'} /> 
                    )}
            </Picker>)}

            {createField('city', {
                trigger: TEXT_INPUT_TRIGGER,
                initialValue: data && data.city,
                rules: [
                    {required: true, message: 'City is required.'},
                    {pattern: REGEX.NAME_WITH_SPACE.PATTERN, message: REGEX.NAME_WITH_SPACE.MESSAGE('City')}
                ],
                localData: {
                    label: 'City',
                }
            })(<TextInput placeholder={'Enter City'} />)}

            {createField('pincode', {
                trigger: TEXT_INPUT_TRIGGER,
                initialValue: data && data.pincode,
                rules: [
                    {required: true, message: 'Pincode is required.'},
                ],
                localData: {
                    label: 'Pincode',
                }
            })(<TextInput placeholder={'Enter Pincode'} />)}
        </View>
    )
}

const Address2Form = createForm({
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
                label={data.label} 
                errText={(error) ? error[0].message : null}
                isErr={(error && (touched || isSubmit)) ? true : false}/>
    }
})(Address2FormComponent);