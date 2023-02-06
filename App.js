// import React from 'react';
// import {
//   StyleSheet, View,
// } from 'react-native';
// import {
//   AppLoading, Asset, Font, Icon,
// } from 'expo';
// import { Root } from 'native-base';
// import AppNavigator from './src/navigation/AppNavigator';

// console.disableYellowBox = true;

// // const roboto = require('native-base/Fonts/Roboto.ttf');
// // const robotoMedium = require('native-base/Fonts/Roboto_medium.ttf');
// // const ionicons = require('@expo/vector-icons/website/src/fonts/Ionicons.ttf');

// const robotDev = require('./assets/images/robot-dev.png');
// const robotProd = require('./assets/images/robot-prod.png');

// import { Provider } from 'react-redux';
// import store from './src/redux/store';

// export default class App extends React.Component {
//   state = {
//     isLoadingComplete: false,
//   };

//   loadResourcesAsync = async () => {
//     return Promise.all([
//       Asset.loadAsync([
//         robotDev,
//         robotProd,
//       ]),
//       Font.loadAsync({
//         // This is the font that we are using for our tab bar
//         ...Icon.Ionicons.font,
//         // We include SpaceMono because we use it in HomeScreen.js. Feel free
//         // to remove this if you are not using it in your app
//         // 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
//         Roboto: roboto,
//         Roboto_medium: robotoMedium,
//         Ionicons: ionicons,
//       }),
//     ]);
//   };

//   handleLoadingError = (error) => {
//     // In this case, you might want to report the error to your error
//     // reporting service, for example Sentry
//     console.warn(error);
//   };

//   handleFinishLoading = () => {
//     this.setState({ isLoadingComplete: true });
//   };

//   render() {
//     const { isLoadingComplete } = this.state;
//     const { skipLoadingScreen } = this.props;
//     if (!isLoadingComplete && !skipLoadingScreen) {
//       return (
//         <AppLoading
//           startAsync={this.loadResourcesAsync}
//           onError={this.handleLoadingError}
//           onFinish={this.handleFinishLoading} />
//       );
//     } else {
//       return (
//         <View style={styles.container}>
//           <Root>
//             <Provider store={store}>
//               <AppNavigator />
//             </Provider>
//           </Root>
//         </View>
//       );
//     }
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
// });


// Main Components
import React, { useState } from 'react';
import {
  StyleSheet, View,
} from 'react-native';

// Packages
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { Root } from 'native-base';
import { MenuProvider } from 'react-native-popup-menu';

// Actions

// Localization

// Global imports
import { Provider } from 'react-redux';
import store from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';

// Local imports

// Local constants


export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        <Root>
          <Provider store={store}>
            <MenuProvider>
              <AppNavigator />
            </MenuProvider>
          </Provider>
        </Root>
      </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    // Asset.loadAsync([
    //   require('./assets/images/robot-dev.png'),
    //   require('./assets/images/robot-prod.png'),
    // ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      // 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      // 'robotoslab-bold': require('./assets/fonts/RobotoSlab-Bold.ttf'),
      // 'robotoslab-light': require('./assets/fonts/RobotoSlab-Light.ttf'),
      // 'robotoslab-regular': require('./assets/fonts/RobotoSlab-Regular.ttf'),
      // 'robotoslab-thin': require('./assets/fonts/RobotoSlab-Thin.ttf'),
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    }),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});