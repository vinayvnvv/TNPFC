import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Item, Input, Text, Label } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CheckBox from './checkbox';
import RadioBtnGroup from './radio-btn-grp';
import utils from '../../../services/utils';
import { THEME } from '../../../../config';
import update from 'immutability-helper';
import moment from 'moment';
import PropTypes from 'prop-types';


const CATEGORY = {
    GENERAL: 'GENERAL_CATEGORY',
    SENIOR: 'SENIOR_CITIZENS'
};
const schemeOptions = [
    {label: 'RIPS', value: 'rips'},
    {label: 'CIPS', value: 'cips'},
];
const periodOptions = [
    {label: '12', value: 12},
    {label: '24', value: 24},
    {label: '36', value: 36},
    {label: '48', value: 48},
    {label: '60', value: 60},
];
const interestOptions = [
    {label: 'Monthly', value: 'month'},
    {label: 'Quarterly', value: 'quarter'},
    {label: 'Annually', value: 'Annual'},
    {label: 'On Maturity', value: 'maturity'},
];

export const getFdCalcInitValues = () => ({
    isSenior: false,
    scheme: schemeOptions[0].value,
    period: periodOptions[0].value,
    interest: interestOptions[0].value,
    amount: '25000',
});

export const getInterestPayment = payment => {
    if(payment === interestOptions[0].value) return 12;
    if(payment === interestOptions[1].value) return 90;
    if(payment === interestOptions[2].value) return 360;
    if(payment === interestOptions[3].value) return 0;
}
        

class FDCalculater extends React.Component {
    state = {
        form: getFdCalcInitValues(),
        amountErr: false,
        periodOptionsData: periodOptions,
        interestOptionsData: interestOptions,
    }
    ROI;

    componentDidMount() {
        this.selectScheme(schemeOptions[0].value);
    }

    componentWillReceiveProps(prevProps) {
        if(this.props.productDetails !== prevProps.productDetails) {
            this.selectScheme(schemeOptions[0].value);
        }
    }

    onFormChange = (field, value, callback) => {
        this.setState(update(this.state, {
            form: {
                [field]: {
                    $set: value,
                }
            }
        }), () => {
            if(callback) callback();
        });
     }

    onSeniorChange = v => {
        this.onFormChange('isSenior', !this.state.form.isSenior, () => {
            this.calculateMaturity();
        });
    }

    onAmountChange = v => {
        this.onFormChange('amount', v);
        const amount = parseInt(v);
        let err = false;
        if(amount%1000 !== 0) {
            err = 'Amount should be multiple of 1000';
        } else if(amount < 25000) {
            err = 'Amount should be more than of 25,000';
        } else {
            err = false;
        }
        this.setState({amountErr: err}, () => {
            // this.callToParent();
            this.calculateMaturity();
        });
        
    }

    selectScheme = type => {
        if(type === schemeOptions[0].value) {
            this.onFormChange('scheme', type, () => {
                let periodOptionsData = periodOptions;
                periodOptionsData[0]['disabled'] = true;
                this.setState({
                    periodOptionsData,
                }, () => {
                    this.selectPeriod(periodOptions[1].value);
                })
            });
        } else {
            this.onFormChange('scheme', type, () => {
                let periodOptionsData = periodOptions;
                delete periodOptionsData[0]['disabled'];
                this.setState({periodOptionsData}, () => {
                    this.selectPeriod(periodOptions[0].value);
                });
            });  
        }
    }
    selectPeriod = type => {
        let interestOptionsData = interestOptions; 
        let selectInterestType;
        if(this.state.form.scheme === schemeOptions[0].value) {
            if(type > 24) {
                // interestOptionsData = interestOptions;
                delete interestOptionsData[0]['disabled'];
                delete interestOptionsData[1]['disabled'];
                delete interestOptionsData[2]['disabled'];
                interestOptionsData[3]['disabled'] = true;
                selectInterestType = interestOptions[0].value;
                // this.setState({interestOptionsData}, () => {
                //     this.selectInterest(interestOptions[0].value);
                // });
                

            } else {
                // interestOptionsData = interestOptions;
                interestOptionsData[0]['disabled'] = true;
                delete interestOptionsData[1]['disabled'];
                interestOptionsData[2]['disabled'] = true;
                interestOptionsData[3]['disabled'] = true;
                selectInterestType = interestOptions[1].value;
                // this.setState({interestOptionsData}, () => {
                //     this.selectInterest(interestOptions[1].value);
                // });
            }
        } else {
            // interestOptionsData = interestOptions;
            delete interestOptionsData[3]['disabled'];
            interestOptionsData[0]['disabled'] = true;
            interestOptionsData[1]['disabled'] = true;
            interestOptionsData[2]['disabled'] = true;
            selectInterestType = interestOptions[3].value;
            // this.setState({interestOptionsData}, () => {
            //     this.selectInterest(interestOptions[3].value);
            // });   
        }
        this.setState({interestOptionsData}, () => {
            this.onFormChange('period', type, () => {
                this.selectInterest(selectInterestType);
            });
        });
    }
    selectInterest = type => {
        console.log('selectInterest', type);
        this.onFormChange('interest', type, () => {
            this.calculateMaturity();
        });
    }

    calculateMaturity = () => {
        const {productDetails} = this.props;
        if(!(productDetails && productDetails.length > 0 && Array.isArray(productDetails))) return;
        let productName = this.state.form.scheme;
        if(productName === schemeOptions[0].value) {
            productName = 'RIPS'
        } else {
            productName = 'CIPS I'
        }
        let category = this.state.isSenior ? CATEGORY.SENIOR : CATEGORY.GENERAL;
        let period = this.state.form.period;
        let depositAmount = this.state.form.amount;
        let interestPayment = this.state.form.interest;
        let selectedProduct = productDetails.find((product) => {
            if (product.categoryId === category 
              && product.productAliasName === productName
              &&  product.tenure === period ) {
                return true;
            }
        });
        this.selectedProduct = selectedProduct;
        if(!selectedProduct) return;
        let ROI = 0;
        if (interestPayment === 'month') {
            ROI = selectedProduct.monthlyIntRate;
        } else if (interestPayment === 'quarter') {
            ROI = selectedProduct.quarterlyIntRate;
        } else if (interestPayment === 'annual') {
            ROI = selectedProduct.yearlyIntRate;
        } else if (interestPayment === 'maturity') {
            ROI = selectedProduct && selectedProduct["onMaturityRate "] ? 
                    selectedProduct["onMaturityRate "] : 0;
        }
        this.ROI = ROI;
        let maturityAmount = 0;
        if (productName === 'RIPS') {
            let interestAmount = ((Number(depositAmount) * Number(ROI)/1200))* Number(selectedProduct.tenure);
            maturityAmount = Math.floor(Number(depositAmount) + interestAmount);
        } else {
            let tenure = selectedProduct.tenure / 12;
            maturityAmount = Number(depositAmount) * Math.pow(1 + (Number(ROI) / (12 * 100)), 12 *  tenure);
            maturityAmount = Math.floor(Number(maturityAmount));
        }
        console.log('maturityAmount', maturityAmount);
        this.setState({
            maturityAmount,
        }, () => {
            this.callToParent();
        });
    }

    getMaturityDate = () => {
        const {form: {period}} = this.state;
        let currentDate = new Date();
        let maturityDate =  currentDate.setMonth(currentDate.getMonth() + period );
        return moment(maturityDate).format('DD/MM/YYYY');
    }

    callToParent = () => {
        console.log('callToParent', this.props);
        const {onChange} = this.props;
        if(onChange) {
            onChange(this.state.form, this.state.maturityAmount, this.state.amountErr, this.getMaturityDate(), this.ROI);
        }
    }

    render() {
        const {
            form: {
                isSenior,
                scheme,
                period,
                interest,
                amount,
            },
            periodOptionsData,
            interestOptionsData,
            amountErr,
        } = this.state;
        const {noMargin, seniorFreeSelect} = this.props;
        return (
            <View style={[
                    styles.calc,
                    noMargin ? {margin: 0} : {},
                ]}>
                <View style={styles.formRH}>
                    <View style={styles.formRHF}>
                        <CheckBox 
                            onChange={()=> {
                                if(seniorFreeSelect) this.onSeniorChange();
                            }}
                            checked={isSenior}/>
                    </View>
                    <View style={styles.formRHL}>
                        <TouchableOpacity 
                            onPress={()=> {
                                if(seniorFreeSelect) this.onFormChange('isSenior', !isSenior)
                            }}
                        >
                            <Text style={styles.formRLT}>Senior Citizen</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.formR}>
                    {/* <View style={styles.formRL}>
                        <Text style={styles.formRLT}>Enter Amount</Text>
                    </View> */}
                    <View style={styles.formRF}>
                        <Item fixedLabel>
                            <Label style={[styles.formRLT, {fontSize: 15}]}>Enter Amount:</Label>
                            <Input 
                                onChangeText={(v) => this.onAmountChange(v)} 
                                value={amount}/>
                        </Item>
                    </View>
                    {amountErr && (
                        <Text style={styles.formErr}>
                            {amountErr}
                        </Text>
                    )}
                </View>

                <View style={styles.formR}>
                    <View style={styles.formRL}>
                        <Text style={styles.formRLT}>Scheme</Text>
                    </View>
                    <View style={styles.formRF}>
                        <RadioBtnGroup 
                            selected={scheme}
                            onChange={(v) => this.selectScheme(v)}
                            data={schemeOptions} />
                    </View>
                </View>

                <View style={styles.formR}>
                    <View style={styles.formRL}>
                        <Text style={styles.formRLT}>Period (Months)</Text>
                    </View>
                    <View style={styles.formRF}>
                        <RadioBtnGroup 
                            selected={period}
                            onChange={(v) => this.selectPeriod(v)}
                            data={periodOptionsData} />
                    </View>
                </View>

                <View style={styles.formR}>
                    <View style={styles.formRL}>
                        <Text style={styles.formRLT}>Interest Payment</Text>
                    </View>
                    <View style={styles.formRF}>
                        <RadioBtnGroup 
                            selected={interest}
                            onChange={(v) => this.selectInterest(v)}
                            data={interestOptionsData} />
                    </View>
                </View>
            </View>
        )
        
    }
}


const styles = StyleSheet.create({
    calc: {
        ...utils.getBoxShadow(7, '#777'),
        backgroundColor: '#fff',
        padding: 16,
        borderWidth: 1,
        borderColor: '#d9d9d999',
        borderStyle: 'solid',
        borderRadius: 9,
        marginHorizontal: 6,
        marginTop: 3,
    },
    formRH: {
        flexDirection: 'row',
        marginVertical: 13,
        alignItems: "center"
    },
    formRHF: {
        minWidth: 40,  
    },
    formRHL: {
        flexGrow: 1,
        flex: 1,
    },
    formRLT: {
        color: '#111',
        fontWeight: '700',
        fontSize: 13,
    },
    formR: {
        marginVertical: 13,
    },
    formRF: {

    },
    formRL: {
        marginBottom: 9,
    },
    formErr: {
        color: THEME.DANGER,
        fontWeight: '600',
        marginTop: 3,
    },
})

FDCalculater.propTypes = {
    noMargin: PropTypes.bool,
    productDetails: PropTypes.array,
    seniorFreeSelect: PropTypes.bool,
};

export default FDCalculater;