// Main Packages
import React, { Component } from "react";

// Packages
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { createDrawerNavigator } from "@react-navigation/drawer";

import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

// import {
//   createStackNavigator, createSwitchNavigator, createAppContainer, createDrawerNavigator,
// } from 'react-navigation';

import SignInScreen from "../screens/Signin";
import SignUpScreen from "../screens/Signin/containers/Signup";

import CalendarScreen from "../screens/Calendar/MonthlyCalendar/Calendar";
import NewSideBar from "../screens/sidebar/NewSideBar";
import { appStrings } from "../utils/constants";
import JobsScreen from "../screens/Jobs";
import JobdetailsScreen from "../screens/Jobdetails";
import TimeScreen from "../screens/Time";
// import TimeDetailsScreen from '../screens/TimeDetails';
// import TimeDetailsResponsibleScreen from '../screens/TimeDetails/responsible';
// // import TimeNewScreen from '../screens/TimeTracker/index';
// import OverviewScreen from '../screens/Overview';
// import OverviewDetailsScreen from '../screens/OverviewDetails';
import AccountScreen from "../screens/Account";
// import SideBarScreen from '../screens/sidebar';
import UploadImageScreen from "../screens/Jobdetails/sections/image/uploadImage";
// import UploadProofScreen from '../screens/Jobdetails/sections/uploadProof';
import TimeTrackerScreen from "../screens/TimeTracker/container/index";
import TrackerDetailsScreen from "../screens/TimeTracker/details";
// import TimeTrackerResponsibleDetailScreen from '../screens/TimeTracker/responsibleDetail';

// import TrackerDetails from '../screens/TimeTracker/container/TrackerDetails';

// // SPECIFY
import SpecifyScreen from "../screens/Specify/containers/index";

class AuthLoadingScreen extends Component {
  // Fetch the token from storage then navigate to our appropriate place
  async componentDidMount() {
    const { navigation } = this.props;
    const userToken = await AsyncStorage.getItem("token");
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    navigation.navigate(!userToken ? "SignInScreen" : "AppStack");
  }

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

// const Drawer = createDrawerNavigator(
//   {
//     Calendar: { screen: CalendarScreen },
//     Jobs: { screen: JobsScreen },
//     Specify: { screen: SpecifyScreen },
//     Time: { screen: TimeScreen },
//     TimeTracker: { screen: TimeTrackerScreen },
//     Overview: { screen: OverviewScreen},
//     Account: { screen: AccountScreen},
//     UploadImage: { screen: UploadImageScreen},
//   },
//   {
//     initialRouteName: 'Calendar',
//     contentOptions: {
//       activeTintColor: '#e91e63',
//     },
//     navigationOptions: {
//       headerVisible: false,
//       header: null,
//     },
//     contentComponent: props => <SideBarScreen {...props} />,
//   }
// );

// const AppStack = createStackNavigator({ Drawer });
// const AuthStack = createStackNavigator({ SignIn: SignInScreen });

// export default createAppContainer(createSwitchNavigator(
//   {
//     AuthLoading: AuthLoadingScreen,
//     App: AppStack,
//     Auth: AuthStack,
//     Jobdetails: { screen: JobdetailsScreen },
//     OverviewDetails: { screen: OverviewDetailsScreen },
//     UploadImage: { screen: UploadImageScreen },
//     UploadProof: { screen: UploadProofScreen },
//     TimeDetails: { screen: TimeDetailsScreen },
//     TimeTrackerDetail: { screen: TimeTrackerDetailScreen },
//     TrackerDetails: { screen: TrackerDetails },
//     TimeDetailsResponsible: { screen: TimeDetailsResponsibleScreen },
//     TimeTrackerResponsibleDetail: { screen: TimeTrackerResponsibleDetailScreen },
//     SignUp: { screen: SignUpScreen },
//   },
//   {
//     initialRouteName: 'AuthLoading',
//     navigationOptions: {
//       headerVisible: false,
//       header: null,
//     },
//   }
// ));

// function HomeScreen(props) {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Home Screen</Text>
//       <TouchableOpacity onPress={() => props.navigation.navigate('DetailScreen')}>
//         <Text>goooo</Text>
//       </TouchableOpacity>
//       <Image source={require('../../assets/images/loader2.gif')} style={{width: 50, height: 50}} />
//     </View>
//   );
// }

const Drawer = createDrawerNavigator();

function AppStack() {
  return (
    <Drawer.Navigator
      initialRouteName={appStrings.appStack.calendar}
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={(props) => <NewSideBar {...props} />}
    >
      <Drawer.Screen
        name={appStrings.appStack.da.calendar}
        component={CalendarScreen}
      />
      <Drawer.Screen
        name={appStrings.appStack.da.jobs}
        component={JobsScreen}
      />
      <Drawer.Screen
        name={appStrings.appStack.da.time}
        component={TimeScreen}
      />
      <Drawer.Screen
        name={appStrings.appStack.da.timeTracker}
        component={TimeTrackerScreen}
      />
      <Drawer.Screen
        name={appStrings.appStack.da.account}
        component={AccountScreen}
      />
    </Drawer.Navigator>
  );
}

const Stack = createSharedElementStackNavigator();

const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      gestureEnabled: false,
      // gestureDirection: 'horizontal',
      cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
      headerMode: false,
    }}
    initialRouteName={appStrings.mainStack.authLoadingScreen}
  >
    <Stack.Screen
      name={appStrings.mainStack.authLoadingScreen}
      component={AuthLoadingScreen}
    />
    <Stack.Screen
      name={appStrings.mainStack.signInScreen}
      component={SignInScreen}
    />
    <Stack.Screen
      name={appStrings.mainStack.signUpScreen}
      component={SignUpScreen}
    />
    <Stack.Screen
      name={appStrings.mainStack.jobDetailsScreen}
      component={JobdetailsScreen}
    />
    <Stack.Screen
      name={appStrings.mainStack.uploadImageScreen}
      component={UploadImageScreen}
    />
    <Stack.Screen
      name={appStrings.mainStack.trackerDetailsScreen}
      component={TrackerDetailsScreen}
    />
    <Stack.Screen name={appStrings.mainStack.appStack} component={AppStack} />
  </Stack.Navigator>
);

const App = () => <MainStack />;

export default App;
