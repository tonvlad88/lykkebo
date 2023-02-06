import React from 'react'

import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import Modal from "react-native-modal";
import { LoadingStyle } from './Styles'

const CustomLoading = props => {
    return(
        <View>
            <Modal isVisible={props.showmodal} >
                <View style={LoadingStyle.modalLoading}>
                    <ActivityIndicator size="small" color="white" />
                    <Text style={LoadingStyle.colorWhite}>{props.msg}</Text>
                </View>
            </Modal>
        </View>
    )
}
export default CustomLoading
