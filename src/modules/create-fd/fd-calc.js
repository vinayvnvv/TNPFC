import React, {useState, useEffect} from 'react';
import { View, Text, Button } from 'native-base';
import { StyleSheet } from 'react-native';
import FDCalculater, { getFdCalcInitValues } from './../common/components/fd-calculater';
import { THEME } from '../../../config';
import ListItemPanel from '../common/components/list-item-panel';
import utils from '../../services/utils';
import moment from 'moment';

const FDCalc = ({
    productDetails,
    onSubmit,
}) => {
    const [form, setFormValues] = useState(getFdCalcInitValues());
    const [calcValues, setCalcValues] = useState({});
    const onFDCalcValueChange = (form, maturityAmount, formErr, maturityDate) => {
        console.log(form, maturityAmount, formErr, maturityDate);
        setFormValues(form);
        setCalcValues({maturityAmount, formErr, maturityDate});
    }
    const validate = callback => {
        const otherValues = {
            maturityAmount: calcValues.maturityAmount,
            maturityDate: calcValues.maturityDate,
        }
        callback(calcValues.formErr, {
            ...form,
            ...otherValues,
        });
    }
    const onFDCalcSubmit = () => {
        onSubmit(validate);
    }
    return (
        <View style={styles.container}>
            <FDCalculater 
                productDetails={productDetails} 
                seniorFreeSelect
                onChange={onFDCalcValueChange}
                noMargin/>
            <View style={{height: 9}}/>
            <ListItemPanel 
                itemWidth={'50%'}
                noHoverEffect
                borderRadius={9}
                lists={[
                    ['Deposit Amount', utils.convertToINRFormat(form.amount)],
                    ['Maturity Amount', utils.convertToINRFormat(calcValues.maturityAmount)], 
                    ['Start Date', moment(new Date()).format('DD/MM/YYYY')],
                    ['Maturity Date', calcValues.maturityDate],
                    ['Interest Payment', (calcValues.maturityAmount - form.amount)],
                    ['Months', form.period],
                ]}
                panelTitleLabel={'Deposit Info'}/>
            <Button 
                disabled={calcValues.formErr} 
                block 
                onPress={onFDCalcSubmit}
                style={{opacity: calcValues.formErr ? 0.5 : 1}}>
                    <Text>Next</Text>
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: THEME.LAYOUT_PADDING,
        marginTop: 7,
        paddingBottom: THEME.LAYOUT_PADDING,
    }
});

export default FDCalc;