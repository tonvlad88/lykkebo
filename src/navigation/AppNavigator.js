import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {
  createStackNavigator, createSwitchNavigator, createAppContainer, createDrawerNavigator,
} from 'react-navigation';

import SignInScreen from '../screens/Signin';
import SignUpScreen from '../screens/Signin/containers/Signup';

import CalendarScreen from '../screens/Calendar/MonthlyCalendar/Calendar';
import JobsScreen from '../screens/Jobs';
import JobdetailsScreen from '../screens/Jobdetails';
import TimeScreen from '../screens/Time';
import TimeDetailsScreen from '../screens/TimeDetails';
import TimeDetailsResponsibleScreen from '../screens/TimeDetails/responsible';
// import TimeNewScreen from '../screens/TimeTracker/index';
import OverviewScreen from '../screens/Overview';
import OverviewDetailsScreen from '../screens/OverviewDetails';
import AccountScreen from '../screens/Account';
import SideBarScreen from '../screens/sidebar';
import UploadImageScreen from '../screens/Jobdetails/sections/image/uploadImage';
import UploadProofScreen from '../screens/Jobdetails/sections/uploadProof';
import TimeTrackerScreen from '../screens/TimeTracker/container/index';
import TimeTrackerDetailScreen from '../screens/TimeTracker/details';
import TimeTrackerResponsibleDetailScreen from '../screens/TimeTracker/responsibleDetail';

import TrackerDetails from '../screens/TimeTracker/container/TrackerDetails';

// SPECIFY
import SpecifyScreen from '../screens/Specify/containers/index';


class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this.bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('token');
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

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

const Drawer = createDrawerNavigator(
  {
    Calendar: { screen: CalendarScreen },
    Jobs: { screen: JobsScreen },
    Specify: { screen: SpecifyScreen },
    Time: { screen: TimeScreen },
    TimeTracker: { screen: TimeTrackerScreen },
    Overview: { screen: OverviewScreen},
    Account: { screen: AccountScreen},
    UploadImage: { screen: UploadImageScreen},
  },
  {
    initialRouteName: 'Calendar',
    contentOptions: {
      activeTintColor: '#e91e63',
    },
    navigationOptions: {
      headerVisible: false,
      header: null,
    },
    contentComponent: props => <SideBarScreen {...props} />,
  }
);

const AppStack = createStackNavigator({ Drawer });
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
    Jobdetails: { screen: JobdetailsScreen },
    OverviewDetails: { screen: OverviewDetailsScreen },
    UploadImage: { screen: UploadImageScreen },
    UploadProof: { screen: UploadProofScreen },
    TimeDetails: { screen: TimeDetailsScreen },
    TimeTrackerDetail: { screen: TimeTrackerDetailScreen },
    TrackerDetails: { screen: TrackerDetails },
    TimeDetailsResponsible: { screen: TimeDetailsResponsibleScreen },
    TimeTrackerResponsibleDetail: { screen: TimeTrackerResponsibleDetailScreen },
    SignUp: { screen: SignUpScreen },
  },
  {
    initialRouteName: 'AuthLoading',
    navigationOptions: {
      headerVisible: false,
      header: null,
    },
  }
));
