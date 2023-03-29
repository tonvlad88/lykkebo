import * as React from 'react';
import FlashMessage from 'react-native-flash-message';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator';
import store from './src/redux/store';

export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <AppNavigator />
        <FlashMessage position="bottom" />
      </Provider>
    </NavigationContainer>
  );
}
