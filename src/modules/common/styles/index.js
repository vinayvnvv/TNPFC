import {Platform, StatusBar, StyleSheet} from 'react-native'
import { THEME } from '../../../../config'

export const COMMON_STYLES = StyleSheet.create({
    mainContainer: {
        flex: 1,
        ...Platform.select({
            android: {
                marginTop: StatusBar.currentHeight
            }
        })
    },
    spinnerContainerFullScreen: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    spinnerContainerFullScreenText: {
        marginTop: 9,
        fontSize: 16,
    },
    textPrimary: {
        color: THEME.PRIMARY,
    }
})