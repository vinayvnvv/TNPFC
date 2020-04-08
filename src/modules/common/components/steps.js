import React from 'react';
import { View, Icon, Text, Col } from 'native-base';
import { StyleSheet } from 'react-native'; 
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { THEME } from '../../../../config';
import utils from '../../../services/utils';

const Steps = ({
    steps = [],
    currentStep = 0,
    hideLabel = false,
    noShadow = false,
    numberIndication = false,
}) => {
    return (
        <View style={styles.container}>
            {steps.map((item, idx) => 
                <View style={styles.item} key={'steps-' + idx}>
                    <View style={styles.itemInner}>
                        <View style={styles.itemT}>
                            {idx !== 0 && (
                                <View 
                                    style={[
                                            styles.itemBar,
                                            styles.itemBarLeft,
                                            currentStep >= idx ? styles.itemBarActive : {},
                                        ]}/>
                            )}
                            
                            <View 
                                style={[
                                        !noShadow ? {...utils.getBoxShadow(9, '#000')} : {},
                                        styles.itemIconC,
                                        currentStep === idx ? styles.itemIconCActive : {},
                                        currentStep > idx ? styles.itemIconCComplete : {},
                                        numberIndication ? styles.itemIconCIsNumber : {},
                                    ]}>
                                        {currentStep > idx && (
                                            <Icon name={'checkmark'} style={[
                                                styles.itemIcon,
                                                numberIndication ? styles.itemIconIsNumber : {},
                                            ]}/>
                                        )}
                                        {!(currentStep > idx) && numberIndication && (
                                            <Text style={[
                                                styles.number,
                                                {color: '#fff'}
                                            ]}>{idx + 1}</Text>
                                        )}
                            </View>
                            {idx !== (steps.length - 1) && (
                                <View 
                                    style={[
                                            styles.itemBar,
                                            styles.itemBarRight,
                                            currentStep > idx ? styles.itemBarActive : {},
                                        ]}/>
                            )}
                            
                        </View>
                        {!hideLabel && (
                            <View style={styles.itemB}>
                                <Text 
                                    style={[
                                            styles.itemLabel,
                                            currentStep === idx ? styles.itemLabelActive : {},
                                            currentStep > idx ? styles.itemLabelComplete : {},
                                        ]}>
                                        {item.label}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            )}
        </View>
    )
}
const stepDefaultColor = '#999';
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    item: {
        flexGrow: 1,
    },
    itemInner: {
        flexDirection: 'column',
        justifyContent: 'center'
    },
    itemT: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        height: 32,
    },
    itemB: {
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'relative',
        alignItems: 'center',
        height: 28,
    },
    itemBar: {
        position: 'absolute',
        top: '50%',
        height: 3,
        backgroundColor: stepDefaultColor,
        zIndex: 1,
        marginTop: -1
    },
    itemBarActive: {
        backgroundColor: THEME.PRIMARY,
    },
    itemBarLeft: {
        width: '50%',
        left: 0,
    },
    itemBarRight: {
        width: '50%',
        right: 0,
    },
    itemIconC: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: 18,
        height: 18,
        backgroundColor: stepDefaultColor,
        borderRadius: 22,
        zIndex: 2,
    },
    itemIconCIsNumber:{
        width: 28,
        height: 28,   
    },
    number: {
        fontSize: 16,
        fontWeight: '700',
    },
    itemIconCComplete: {
        backgroundColor: THEME.SUCCESS,
    },
    itemIconCActive: {
        backgroundColor: THEME.PRIMARY,
    },
    itemIcon: {
        fontSize: 12,
        color: THEME.PRIMARY_INVERT
    },
    itemIconIsNumber: {
        fontSize: 16,
    },
    itemLabel: {
        fontWeight: '700',
        color: '#999',
        fontSize: 13,
    },
    itemLabelActive: {
        color: THEME.PRIMARY
    },
    itemLabelComplete: {
        color: THEME.SUCCESS,
    }
});


Steps.propTypes = {
    steps: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        icon: PropTypes.string,
    })),
    currentStep: PropTypes.number,
}

export default Steps;