import React from 'react';
import {View, StyleSheet} from 'react-native';
import { THEME } from '../../../../config';
import ListItemPanel from '../../common/components/list-item-panel';
const Nominee = ({
    customerNominee
}) => {
    const {
        nomineeName,
        relationship,
        customerId
    } = customerNominee.length > 0 ? customerNominee[0] : {};
    return (
        <View>
            <View style={styles.container}>
                <View style={styles.section}>
                    <ListItemPanel 
                        itemWidth={'50%'}
                        noHoverEffect={true}
                        lists={[
                            ['Related Person Type', relationship, '100%'],
                            ['Nominee Name', nomineeName],
                            ['Gender', '--'],
                            ['Proof ID', customerId]
                        ]}
                        panelTitleLabel={'Nominee'}/>
                </View>
            </View>
        </View>
    ); 
} 

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: THEME.LAYOUT_PADDING,
    },
    section: {
        marginVertical: 0,
    }
});

export default Nominee;

