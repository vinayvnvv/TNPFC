import React, {useState} from 'react';
import { Text, View } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import SelectAccount from './select-account';


const TaxForm = ({
    depositeList,
    userDetails,
}) => {
    const {select, setSelect} = useState(false);
    return (
        select ? (
            <ScrollView>
                <Text>Hello</Text>
            </ScrollView>
        ) : (
            <View>
                <SelectAccount />
            </View>
        )
    );
}

export default TaxForm;