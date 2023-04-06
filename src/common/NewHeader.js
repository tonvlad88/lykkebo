import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  appAlignment,
  appColors,
  appDirection,
  appNumbers,
  appStrings,
} from "../utils/constants";

const NewHeader = ({ navigation, title = "" }) => (
  <View style={styles.container}>
    <StatusBar hidden />
    <View style={styles.hamburgerContainer}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Feather
          name={appStrings.common.menu}
          size={appNumbers.number_24}
          color={appColors.solidWhite}
        />
      </TouchableOpacity>
    </View>

    <View style={styles.headerTitleContainer}>
      <Text style={styles.headerTitleText}>{title}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.primary,
    flexDirection: appDirection.row,
    paddingHorizontal: appNumbers.number_10,
    paddingVertical: appNumbers.number_16,
  },
  headerTitleContainer: {
    flex: appNumbers.number_1,
    alignItems: appAlignment.center,
  },
  headerTitleText: {
    marginLeft: -appNumbers.number_26,
    fontWeight: appNumbers.number_600.toString(),
    color: appColors.solidWhite,
    fontSize: appNumbers.number_18,
  },
  hamburgerContainer: {
    marginLeft: appNumbers.number_5,
  },
});

export default NewHeader;
