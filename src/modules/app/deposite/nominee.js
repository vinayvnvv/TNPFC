import React from 'react';
import {View, StyleSheet} from 'react-native';
import { THEME } from '../../../../config';
import ListItemPanel from '../../common/components/list-item-panel';
const Nominee = ({
    fdSummary
}) => {
    const {
        nomineeName,
        nomineeRelationship,
        // customerId,
        guardianRelationship,
        guardianName,
        isNomineeMajor,
        nomineeDob,
        nomineeGuardianName,
        nomineeGuardianRelationship,
    } = fdSummary && fdSummary.length > 0 ? fdSummary[0] : {};
    const lists = [];
    lists.push(['Related Person Type', nomineeRelationship, '100%']);
    lists.push(['Nominee Name', nomineeName || '--']);
    if(isNomineeMajor === 'N') {
        lists.push(['Nominee DOB', nomineeDob]);
        lists.push(['Guardian Name', nomineeGuardianName]);
        lists.push(['Guardian Relationship', nomineeGuardianRelationship])
    }
    return (
        <View>
            <View style={styles.container}>
                <View style={styles.section}>
                    <ListItemPanel 
                        itemWidth={'50%'}
                        noHoverEffect={true}
                        lists={lists}
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

