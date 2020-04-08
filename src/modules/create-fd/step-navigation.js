import React from 'react';
import { View, Button, Text, Icon } from 'native-base';
import { StyleSheet } from 'react-native';
import { THEME } from '../../../config';

const StepNavigation = ({
    nextBtn,
    nextBtnProps = {},
    onNext,
    prevBtn,
    prevBtnProps = {},
    onPrev,
    disableNext,
}) => {
    return (
        <View style={styles.container}>
            {prevBtn && (
                <Button style={styles.btn} transparent onPress={onPrev} {...prevBtnProps}>
                    <Text>{prevBtn}</Text>
                </Button>
            )}
            {nextBtn && (
                <Button 
                    style={[
                        styles.btn,
                        disableNext ? styles.disableBtn : {}
                    ]} 
                    disabled={disableNext} 
                    iconRight 
                    onPress={onNext} {...nextBtnProps}>
                    <Text>{nextBtn}</Text>
                    <Icon name='arrow-forward' />
                </Button>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: -THEME.LAYOUT_PADDING,
        marginTop: 11,
    },
    btn: {
        flexGrow: 1,
        flex: 1,
        marginHorizontal: THEME.LAYOUT_PADDING
    },
    disableBtn: {
        opacity: 0.5
    }
});

export default StepNavigation;