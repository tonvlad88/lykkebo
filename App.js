import React from 'react';
import { View } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <View style={{flex: 1}}>
      <AppNavigator />
      <FlashMessage position="bottom" />
    </View>
  );
}
