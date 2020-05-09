import React from 'react';
import {StyleSheet} from 'react-native';
import { Container, Icon, Text, Button, View } from 'native-base';
import { THEME } from '../../../../config';

const SuccessScreen = ({
    refNumber,
    successText,
    warning,
}) => {
    return (
        <Container>
            <View style={styles.container}>
                <View style={[
                        styles.iconContainer, 
                        warning ? styles.iconContainerWarning : {}
                    ]}>
                    {warning ? (
                        <Icon style={[styles.icon, {color: THEME.ORANGE}]} name={'ios-information'}/>) : (
                        <Icon style={styles.icon} name={'checkmark'}/>
                    )}
                </View>
                <Text style={styles.successText}>{successText}</Text>
                {refNumber && (
                    <>
                        <Text style={styles.refText}>Your reference number</Text>
                        <Text style={styles.refNum}>{refNumber}</Text>
                    </>
                )}
                <Button style={styles.btn} success block>
                    <Text>OK</Text>
                </Button>
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        paddingHorizontal: 13,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 62,
        height: 62,
        borderColor: THEME.SUCCESS,
        borderWidth: 3,
        borderStyle: 'solid',
        borderRadius: 62,
    },
    iconContainerWarning: {
        borderColor: THEME.ORANGE,
    },
    icon: {
        color: THEME.SUCCESS,
        fontSize: 42,
    },
    successText: {
        marginVertical: 27,
        fontSize: 18,
        maxWidth: '80%',
        textAlign: 'center'
    },
    refText: {
        color: THEME.PRIMARY,
        fontSize: 17
    },
    refNum: {
        fontSize: 24,
        marginVertical: 6,
    },
    btn: {
        marginTop: 21,
    }
});

export default SuccessScreen;