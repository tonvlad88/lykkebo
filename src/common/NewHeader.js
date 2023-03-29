import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import { Entypo } from '@expo/vector-icons';
import { appColors } from '../utils/constants';

const NewHeader = ({navigation}) => {
  return (
    <View style={{backgroundColor: appColors.primary}}>
        <TouchableOpacity onPress={() => navigation.openDrawwer()}>
            <Entypo name="menu" size={24} color={appColors.primary} />
        </TouchableOpacity>
      <Text>Header</Text>
    </View>
  )
}

export default NewHeader;