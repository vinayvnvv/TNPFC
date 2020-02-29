import {Platform, StatusBar, StyleSheet} from 'react-native'

export const COMMON_STYLES = StyleSheet.create({
    mainContainer: {
        flex: 1,
        ...Platform.select({
            android: {
                marginTop: StatusBar.currentHeight
            }
        })
    }
})