import React from 'react';
import { View, Text } from 'native-base';
import StepNavigation from './step-navigation';

const AddressInfo = ({
    onPreviousStep,
}) => {
    return (
        <View>
            <Text>Address Info</Text>
            <StepNavigation nextBtn={'Next'} prevBtn={'Previous'} onPrev={onPreviousStep}/>
        </View>
    )
}

export default AddressInfo;