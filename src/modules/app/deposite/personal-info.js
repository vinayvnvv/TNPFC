import React from 'react';
import {View, StyleSheet} from 'react-native';
import { THEME } from '../../../../config';
import ListItemPanel from '../../common/components/list-item-panel';
import utils from '../../../services/utils';
const PersonalInfo = ({
    userDetails: {
        customerName,
        dob,
        mobileNumber,
        emailId,
        street,
        maritalStatus,
        resident,
    } = {},
}) => (
    <View>
        <View style={styles.container}>
            <View style={styles.section}>
                <ListItemPanel 
                    itemWidth={'50%'}
                    noHoverEffect={true}
                    lists={[
                        ['First Depositor Name', customerName],
                        ['Date of Birth', utils.getAppCommonDateFormat(dob)],
                        ['Gender', 'Male'],
                        ['Married Status', maritalStatus || '-'],
                        ['Mobile Number', mobileNumber],
                        ['Email ID', emailId || '-'],
                        ['Address', street],
                        ['Residential Type', resident]
                    ]}
                    panelTitleLabel={'First Depositor'}/>
            </View>
            <View style={styles.section}>
                <ListItemPanel 
                    itemWidth={'50%'}
                    noHoverEffect={true}
                    lists={[
                        ['Second Depositor Name', 'Pramod Kumar'],
                        ['Date of Birth', '12-22-2222'],
                        ['Gender', 'Male'],
                        ['Married Status', 'Married'],
                        ['Mobile Number', '2342342343'],
                        ['Email ID', 'Adsads@ssd.sdas'],
                        ['Address', 'Chennai'],
                        ['Residential Type', 'Own House']
                    ]}
                    panelTitleLabel={'Second Depositor (Hard Coded)'}/>
            </View>
        </View>
    </View>
);  

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: THEME.LAYOUT_PADDING,
    },
    section: {
        marginVertical: 0,
    }
});

export default PersonalInfo;

