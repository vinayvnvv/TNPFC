import React, {useState} from 'react';
import {View, StyleSheet, Alert, Platform} from 'react-native';
import { THEME } from '../../../../config';
import ListItemPanel from '../../common/components/list-item-panel';
import { Toast, Button, Text, Icon, Item, Input, Spinner } from 'native-base';
import utils from '../../../services/utils';
import SuccessScreen from '../../common/components/success-screen';
const Loans = ({
    fdSummary,
    fdLoans,
    applyLoan,
    status,
}) => {
    const {
        interestAmount,
        depositAmount,
        productDesc,
        interestPaid,
        maturityDate,
        interestRatePercent,
        intpayFrequency,
        maturityAmount,
        openDate,
        tenure,
        accountNumber,
        isLoanEligible,
    } = fdSummary.length > 0 ? fdSummary[0] : {};
    const {
        loanEligibleAmount,
        loanInterestRate,
        loanClosureDueDate,
    } = fdLoans && fdLoans.length > 0 ? fdLoans[0] : {};
    const [applyLoanScreen, setApplyLoanScreen] = useState(false);
    const [amountValue, setAmountValue] = useState('');
    const [showError, setShowError] = useState(false);
    const onApplyLoan = () => {
        if(isLoanEligible !== 'Y') {
            console.log('on apply loan')
            Toast.show({
                text: "Loan is not Eligible for this Deposit!",
                buttonText: "Okay",
                duration: 3000,
                type: "warning"
            })
        } else {    
            setApplyLoanScreen(true);
        }
    }
    const confirmApply = () => {
        applyLoan(amountValue);
    }
    const onApply = () => {
        if(amountValue !== '') {
            if(!isNaN(parseFloat(amountValue)) && isFinite(amountValue)) {
                setShowError(false);
                console.log('on Apply', Platform.OS);
                if(Platform.OS === 'web') confirmApply();
                Alert.alert(
                    'Confirm to apply?',
                    'Please press confirm to proceed.',
                    [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'Confirm', onPress: () => confirmApply()},
                    ]
                );
            } else {
                setShowError('Enter amount in number!')
            }
        } else {
            setShowError('Enter Amount!');
        }
    }
    const successData = status && status.data;
    console.log("loans------>", status);
    return (
        <View>
            {status && status.type === 'applyLoan' && status.status === 'success' ? (
                <SuccessScreen 
                    successText={'Your Loan request has been submitted successfully'} 
                    refNumber={successData && successData.ACK_ID}/>
            ) : (
                !applyLoanScreen ? (
                    <View style={styles.container}>
                        <View style={styles.section}>
                            <ListItemPanel 
                                itemWidth={'50%'}
                                noHoverEffect={true}
                                lists={[
                                    ['Account No', accountNumber],
                                    ['Start Date', utils.getAppCommonDateFormat(openDate)],
                                    ['Maturity Date', utils.getAppCommonDateFormat(maturityDate)],
                                    ['Interest Payment', intpayFrequency],
                                    ['Deposit Amount', utils.convertToINRFormat(depositAmount)],
                                    ['Maturity Amount', utils.convertToINRFormat(maturityAmount)],
                                    ['Interest Rate', interestRatePercent + '%'],
                                    ['Duration (Months)', tenure]
                                ]}
                                panelTitleLabel={'Scheme Name'}
                                panelTitleValue={productDesc}/>
                        </View>
                        <View style={styles.actions}>
                            <View style={{flexGrow: 1}}>
                                <Button 
                                    primary  
                                    onPress={onApplyLoan}
                                    block>
                                    <Text>Apply Loan</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.container}>
                        <View style={styles.applyTopActions}>
                            <Button iconLeft light small rounded onPress={() => setApplyLoanScreen(false)}>
                                <Icon name='arrow-back' />
                                <Text>Back</Text>
                            </Button>
                        </View>
                        <View style={styles.applyLoanCard}>
                            <View style={styles.hdrSection}>
                                <Text style={styles.hdrSectionTitle}>Loan Details</Text>
                            </View>
                            <View style={styles.applyLoanDContent}>
                                <View style={styles.applyLoanDR}>
                                    <Text style={styles.applyLoanDRL}>Eligibility Amount</Text>
                                    <View style={styles.applyLoanDRV}>
                                        <Text style={styles.applyLoanDRVText}>{loanEligibleAmount}</Text>
                                    </View>
                                </View>
                                <View style={styles.applyLoanDR}>
                                    <Text style={styles.applyLoanDRL}>Rate of Interest(%)</Text>
                                    <View style={styles.applyLoanDRV}>
                                        <Text style={styles.applyLoanDRVText}>{loanInterestRate}</Text>
                                    </View>
                                </View>
                                <View style={styles.applyLoanDR}>
                                    <Text style={styles.applyLoanDRL}>Loan Closure Due Date</Text>
                                    <View style={styles.applyLoanDRV}>
                                        <Text style={styles.applyLoanDRVText}>{utils.getAppCommonDateFormat(loanClosureDueDate)}</Text>
                                    </View>
                                </View>
                                <View style={styles.applyLoanDR}>
                                    <Text style={styles.applyLoanDRL}>Loan Amount</Text>
                                    <View style={styles.applyLoanDRV}>
                                        <Item inlineLabel>
                                            <Input 
                                                onChangeText={
                                                    (v)=> {
                                                        setAmountValue(v);
                                                        setShowError(false);
                                                    }
                                                }
                                                value={amountValue}
                                                style={{fontSize: 15, height: 31,}} 
                                                placeholder="Enter amount" />
                                        </Item>
                                        {showError && <Text style={styles.errText}>{showError}</Text>}
                                    </View>
                                </View>
                            </View>
                            <View style={styles.applyLoanActions}>
                            {status && status.type === 'applyLoan' && status.status === 'loading' ? (
                                    <Spinner />
                                ):(
                                    <Button 
                                        onPress={onApply}
                                        primary 
                                        block><Text>Apply</Text></Button>
                            )} 
                            </View>
                        </View>
                    </View>
                )
            )}
            
        </View>
    )
};  

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: THEME.LAYOUT_PADDING,
    },
    section: {
        marginVertical: 0,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: 9,
    },
    applyTopActions: {
        flexDirection: 'row'
    },
    applyLoanCard: {
        ...utils.getBoxShadow(5, '#000'),
        backgroundColor: '#fff',
        marginBottom: 21
    },
    hdrSection: {
        height: 40,
        backgroundColor: THEME.PRIMARY,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 13
    },
    hdrSectionTitle: {
        color: '#fff'
    },
    applyTopActions: {
        flexDirection: 'row',
        marginBottom: 13,
    },
    applyLoanDContent: {
        paddingHorizontal: 13,
        paddingVertical: 7
    },
    applyLoanDR: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 7,
    },
    applyLoanDRL: {
        width: '45%',
        fontSize: 13,
        color: '#444'
    },
    applyLoanDRV: {
        width: '55%',
        paddingLeft: 8
    },
    applyLoanDRVText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#444'
    },
    applyLoanActions: {
        marginVertical: 11,
        width: '100%',
        paddingHorizontal: 21
    },
    errText: {
        color: '#cc0000',
        fontSize: 11,
        fontWeight: '700',
        marginHorizontal: 5,
    }
});

export default Loans;

