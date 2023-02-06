import { StyleSheet, Platform } from 'react-native'
const platform = Platform.OS;

export const HeaderStyle = StyleSheet.create({
    HeaderHolder: {
        paddingTop: platform === 'ios' ? 0 : 25,
        paddingBottom: platform === 'ios' ? 0 : 25,
        paddingLeft: 10,
        height: 55,
        backgroundColor: '#2E3D43',
        justifyContent: 'center',
        elevation:4,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: "black",
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    f1: {
        flex: 1
    },
    HeaderIconColor: {
        color: '#ffffff'
    },
    HeaderTitle: {
        alignSelf:'center',
        color: '#ffffff'
    },
    cWhite: {
        color: 'white'
    },
    prpl10: {
        paddingLeft:10,
        paddingRight:10
    }
})

export const LoadingStyle = StyleSheet.create({
    modalLoading: {
        backgroundColor: 'transparent',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)'
    },
    colorWhite: {
        color:'white'
    }
})
