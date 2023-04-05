/* eslint-disable react/react-in-jsx-scope */
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import React from 'react';
import {View, Text, Image} from 'react-native';

import styles from './style';

const drawerImage = require('../../../assets/logo.jpg');

const NewSideBar = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.sidebarImageContainer}>
        <Image square style={styles.drawerImage} source={drawerImage} />
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default NewSideBar;
