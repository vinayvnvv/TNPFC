import React, {useEffect} from 'react';
import StepNavigation from './step-navigation';
import { StyleSheet, Platform, Image } from 'react-native';
import { View, Text, DatePicker, Picker } from 'native-base';
import { CREATE_FD_STYLES } from './common-styles';
import { THEME } from '../../../config';
import FormItem from '../common/components/form-item';
import { createForm } from '../../lib/form';
import { TextInput } from 'react-native-gesture-handler';
import { REGEX } from '../../constants';
import moment from 'moment';
const TEXT_INPUT_TRIGGER = Platform.OS === 'web' ? 'onChange' : 'onChangeText';
class NomineeInfo extends React.Component {
    state = {
        isGuardian: false,
    }
    validateGuardianForm;
    componentDidMount() {
        this.initIsGuardian();
    }
    onDateChange = (v) => {
        const age = moment().diff(v, 'years');
        if(age < 18) {
            this.setState({isGuardian: true});
        }
    }
    initIsGuardian() {
        const {data: {is_guardian} = {}} = this.props;
        this.setState({isGuardian: is_guardian});
    }
    initGuardianFormValidate = validate => {
        this.validateGuardianForm = validate;
    }
    onFormSubmit = () => {
        const {
            form: {validateForm},
            onSubmit,
        } = this.props;
        let errs;   
        let values = {};
        validateForm((err1, values1) => {
            errs = err1;
            values['nominee'] = values1;
            values['is_guardian'] = this.state.isGuardian;
            if(this.state.isGuardian) {
                this.validateGuardianForm((err2, values2) => {
                    errs = err2;
                    values['guardian'] = values2;
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
    render() {
        const {
            onPreviousStep,
            relationships,
            data: {
                nominee,
                guardian,
            } = {},
            form: {
                createField, getFieldsValue, errors,
            }
        } = this.props;
        console.log('isGuardian', nominee, guardian);
        const {isGuardian} = this.state;
        return (
            <View style={styles.container}>
                <View style={CREATE_FD_STYLES.section}>
                    <Text style={CREATE_FD_STYLES.sectionTitle}>Nominee Details</Text>
                    <View style={CREATE_FD_STYLES.sectionContent}>
                        {createField('name', {
                            trigger: TEXT_INPUT_TRIGGER,
                            initialValue: nominee && nominee.name,
                            rules: [
                                {required: true, message: 'Name is required.'},
                                {pattern: REGEX.NAME_WITH_SPACE.PATTERN, message: REGEX.NAME_WITH_SPACE.MESSAGE('Name')}
                            ],
                            localData: {
                                label: 'Name',
                            }
                        })(<TextInput placeholder={'Enter Name'} />)}

                        {createField('dob', {
                            trigger: 'onDateChange',
                            initialValue: Platform.OS === 'web' ? new Date('05-29-2012') : (nominee && nominee.dob),
                            localData: {
                                label: 'DOB',
                            },
                            onValueChange: (v) => {
                                this.onDateChange(v);
                            },
                            rules: [
                                {required: true, message: 'DOB is required.'},
                            ],
                        })(
                            <DatePicker 
                                placeHolderText={nominee && nominee.dob ? moment(nominee.dob).format('DD/MM/YYYY') : 'Select Date'} 
                                placeHolderTextStyle={
                                Platform.OS !== 'web' ? {color: '#999'} : {}
                            }/>
                        )}

                        {createField('relationship', {
                            trigger: 'onValueChange',
                            initialValue: (nominee && nominee.relationship) || (relationships && relationships[0] && relationships[0].relationshipCode),
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
                    </View>
                </View>
                {isGuardian && (
                    <View style={CREATE_FD_STYLES.section}>
                        <Text style={CREATE_FD_STYLES.sectionTitle}>Guardian Details</Text>
                        <View style={CREATE_FD_STYLES.sectionContent}>
                            <GuardianForm 
                                data={guardian}
                                initGuardianFormValidate={this.initGuardianFormValidate}
                                relationships={relationships} />
                        </View>
                    </View>
                )}
                <StepNavigation 
                    nextBtn={'Next'} 
                    prevBtn={'Previous'}
                    onNext={this.onFormSubmit} 
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
})

export default createForm({
    showErrosOnInit: true,
    defaultValueProp: Platform.OS === 'web' ? 'value' : '=value',
    template: (field, input, form, data) => {
        const {error, touched, isSubmit} = field;
        return <FormItem 
                input={input} 
                onFocusOut={data.onFocusOut}
                label={data.label} 
                errText={(error) ? error[0].message : null}
                isErr={(error && (touched || isSubmit)) ? true : false}/>
    }
})(NomineeInfo);

const GuardianFormComponent = ({
    relationships,
    initGuardianFormValidate,
    data,
    form: {createField, getFieldsValue, validateForm},
}) => {
    useEffect(() => {
        initGuardianFormValidate(validateForm);
    }, []);
    return (
        <>
            {createField('name', {
                trigger: TEXT_INPUT_TRIGGER,
                initialValue: data && data.name,
                rules: [
                    {required: true, message: 'Name is required.'},
                    {pattern: REGEX.NAME_WITH_SPACE.PATTERN, message: REGEX.NAME_WITH_SPACE.MESSAGE('Name')}
                ],
                localData: {
                    label: 'Name',
                }
            })(<TextInput placeholder={'Enter Name'} />)}

            {createField('relationship', {
                trigger: 'onValueChange',
                initialValue: (data && data.relationship) || (relationships && relationships[0] && relationships[0].relationshipCode),
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
    )
}
const GuardianForm = createForm({
    showErrosOnInit: true,
    defaultValueProp: Platform.OS === 'web' ? 'value' : '=value',
    template: (field, input, form, data) => {
        const {error, touched, isSubmit} = field;
        return <FormItem 
                input={input} 
                onFocusOut={data.onFocusOut}
                label={data.label} 
                errText={(error) ? error[0].message : null}
                isErr={(error && (touched || isSubmit)) ? true : false}/>
    }
})(GuardianFormComponent);
