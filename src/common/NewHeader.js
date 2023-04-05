import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { appColors } from '../utils/constants';

const NewHeader = ({navigation}) => {
  console.log('navigation', navigation)
  return (
    <View style={{backgroundColor: appColors.primary}}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Entypo name="menu" size={24} color="#000" />
      </TouchableOpacity>
      <Text>Header111</Text>
    </View>
  );
};

export default NewHeader;
