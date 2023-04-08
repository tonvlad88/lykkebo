/* eslint-disable react/react-in-jsx-scope */
// PACKAGES
import React, { Component } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Text, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// IMPORTS
import styles from "./style";
import commonStyles from "../../utils/commonStyles";
import { appStrings } from "../../utils/constants";

const drawerImage = require("../../../assets/logo.jpg");

class NewSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDisplayName: "",
      userDisplayEmail: "",
    };
  }

  async componentDidMount() {
    const userDisplayEmail = await AsyncStorage.getItem("user_email");
    const userDisplayName = await AsyncStorage.getItem("user_display_name");

    this.setState({
      userDisplayName,
      userDisplayEmail,
    });
  }

  logout = () => {
    const { navigation } = this.props;
    AsyncStorage.removeItem("token").then(
      AsyncStorage.clear().then(() => {
        navigation.navigate(appStrings.mainStack.signInScreen);
      })
    );
    navigation.closeDrawer();
  };

  render() {
    const { userDisplayEmail, userDisplayName } = this.state;

    return (
      <DrawerContentScrollView {...this.props}>
        <View style={styles.sidebarImageContainer}>
          <View style={commonStyles.deadCenter}>
            <Image square style={styles.drawerImage} source={drawerImage} />
          </View>
          <Text style={styles.userNameText}>{userDisplayName}</Text>
          <Text style={styles.userEmailText}>{userDisplayEmail}</Text>
        </View>
        <DrawerItemList {...this.props} />
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={this.logout}>
            <Text style={styles.logoutText}>
              {appStrings.common.logout.charAt(0).toUpperCase() +
                appStrings.common.logout.slice(1)}
            </Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    );
  }
}

export default NewSideBar;
