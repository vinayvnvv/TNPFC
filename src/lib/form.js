import React from 'react';
import schema from 'async-validator';

const DEFAULT_TRIGGER = 'onChange';
const defaultFieldOptions = {
    valueProp: 'value', // if value prop is `-` then it takes direct value instead of e.target.value
    onValueChange: null,
    trigger: 'onChange',
}
function createForm(formOptions = {}) {
    return WrappedComponent => {
        return class Form extends React.Component {
            formValues = {};
            rules = {};
            localData = {};
            errors = {};
            fieldErrInit = {};
            initValidate = formOptions.showErrosOnInit ? true : false;
            defaultValueProp = formOptions.defaultValueProp ? formOptions.defaultValueProp : null;
            instance = {};
            addField = (name, options) => {
                this.formValues[name] = options && options.initialValue ? options.initialValue : '';
                if(options && options.rules) this.rules[name] = options.rules;
                if(options && options.localData) this.localData[name] = options.localData;
            }
            onFormChange = (field, options, e) => {
                const valueProp = this.parseValueProp(options, 'get');
                const defaultValueProp = this.parseValueProp({valueProp: this.defaultValueProp}, 'get');
                const value = valueProp ? 
                                    valueProp === '-' ? e : e.target[valueProp] : 
                                    defaultValueProp ? (
                                        defaultValueProp === '-' ? e : e.target[defaultValueProp]
                                    ) : e.target.value;
                this.formValues[field] = value;
                if(options && options.onValueChange) options.onValueChange(value);
                this.forceUpdate();
                if(this.initValidate) this.setErrors(field);
                if(formOptions && formOptions.onValueChanges) {
                    formOptions.onValueChanges({[field]: value}, this.formValues, {...this.props});
                }
            }
            setErrors = (field) => {
                var validator = new schema(this.rules);
                validator.validate(this.formValues, (err, fields) => {
                    if(field) {
                        if(fields[field]) this.errors[field] = fields[field];
                        else this.errors[field] = null;
                    } else {
                        this.errors = fields;
                    }
                    this.forceUpdate();
                });
            }
            createField(_this, name, options = defaultFieldOptions) {
                if(!_this.formValues.hasOwnProperty(name)) {
                    _this.addField(name, options);
                }
                const valueProp = _this.parseValueProp(
                    options && options.valueProp ? options : {valueProp: _this.defaultValueProp} , 
                    'set'
                );
                console.log('valueProp', valueProp)
                const props = {
                    [options && options.trigger ? options.trigger : DEFAULT_TRIGGER]: (e) => {
                        _this.onFormChange(name, options, e);
                    },
                    [valueProp ? valueProp : 'value']: _this.formValues[name],
                }
                return ele => {
                    return formOptions && formOptions.template ? 
                                (formOptions.template(name, React.cloneElement(ele, {...props}), this.getProps(), this.localData[name])) :
                                React.cloneElement(ele, {...props})
                }
            }

            parseValueProp = (options, type) => {
                if(options && options.valueProp) {
                    const prop = options.valueProp;
                    if(prop.indexOf('=') === 0) {
                        const realProp = prop.substring(1);
                        if(type === 'set') return realProp;
                        else return '-';
                    } else {
                        return prop;
                    }
                } else {
                    return null;
                }
                
            }

            getFieldsValue = field => {
                if(field) return this.formValues[field];
                return this.formValues;
            }

            resetFields = fields => {
                if(!fields || fields.length === 0) {
                    Object.keys(this.formValues).forEach(k=>{
                        this.formValues[k] = '';
                    })
                } else {
                    fields.forEach(k => {
                        this.formValues[k] = '';
                    });
                }
                this.forceUpdate();
            }

            validateForm = callback => {
                var validator = new schema(this.rules);
                validator.validate(this.formValues, (err, fields) => {
                    if(!this.initValidate) {
                        this.initValidate = true;
                    }
                    this.setErrors();
                    callback(err, this.formValues);
                });
            }

            setFieldValue = (field, v) => {
                if(this.formValues.hasOwnProperty(field)) {
                    this.formValues[field] = v;
                    this.forceUpdate();
                }
            }

            getProps = () => {
                return {
                        createField: (name, options) => this.createField(this, name, options),
                        getFieldsValue: this.getFieldsValue,
                        validateForm: this.validateForm,
                        resetFields: this.resetFields,
                        errors: this.errors,
                        setFieldValue: this.setFieldValue
                    }
            }
            render() {
                const newProps = this.getProps();
                return <WrappedComponent {...this.props} form={newProps}/>
            }
        }
    }
}
export {createForm};