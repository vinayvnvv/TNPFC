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
    textError: {
        color: THEME.DANGER,
        fontSize: 12,
        fontWeight: '700',
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
    modalHeader: {
        backgroundColor: THEME.PRIMARY,
        paddingHorizontal: THEME.LAYOUT_PADDING,
        paddingVertical: 11,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between'
    },
    modalHeaderText: {
        color: THEME.PRIMARY_INVERT,
        fontWeight: '700',
    },
    modalHeaderIcon: {
        color: THEME.PRIMARY_INVERT,
    },
    modalBody: {
        padding: 15,
    },
    modalActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    modalActionsBtn: {
        flex: 1,
        flexGrow: 1,
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
    },
    uploaderHelpText: {
        marginTop: 11,
        color: '#555',
        fontSize: 12,
        textAlign: "center"
    },
    uploadList: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#d9d9d9',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 5,
    },
    uploadListType: {
        width: 60,
        height: 60,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#d9d9d9',
        borderRightWidth: 1,
    },
    uploadListTypeImage: {
        width: 50,
        height: 50,
    },
    uploadListAction: {
        width: 60,
        height: 60,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center',
        padding: 10,
        borderColor: '#d9d9d9',
        borderLeftWidth: 1,
    },
    uploadListText: {
        flexGrow: 1,
        flexWrap: 'nowrap',
        paddingHorizontal: 21,
        overflow: "hidden",
        color: THEME.SUCCESS,
    },
    uploadListActionClose: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center'
    },
    uploadListActionCloseIcon: {
        fontSize: 28,
        color: '#555'
    },
    uploader: {
        borderStyle: 'dotted',
        borderColor: '#d9d9d9',
        borderRadius: 9,
        borderWidth: 2,
        padding: 21,
        minHeight: 100,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0"
    },
    uploaderIcon: {
        marginBottom: 11,
        color: "#555",
        fontSize: 33,
    },
    uploaderText: {
        fontSize: 21,
        color: '#444',
    },


})