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
    },
    modalContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 999,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 3,
    },
    envInfo: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        paddingVertical: 5,
        paddingHorizontal: 11,
        backgroundColor: THEME.ORANGE,
        zIndex: 88,
    },
    envInfoText: {
        fontSize: 10,
        fontWeight: '600'
    }
})