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
import { SafeAreaView } from "react-native-safe-area-context";

const NewHeader = ({ navigation, title = "", rightIcon }) => (
  <SafeAreaView
    edges={["top"]}
    style={[
      styles.mainContainer,
      Platform.OS === "android" ? { paddingTop: appNumbers.number_15 } : {},
    ]}
  >
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

      {rightIcon}
    </View>
    <View style={styles.headerBottomBorder} />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: appColors.primary,
  },
  container: {
    backgroundColor: appColors.primary,
    flexDirection: appDirection.row,
    paddingHorizontal: appNumbers.number_10,
    paddingBottom: appNumbers.number_16,
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
  headerBottomBorder: {
    height: appNumbers.number_3,
    backgroundColor: appColors.romance,
    marginBottom: appNumbers.number_1,
  },
});

export default NewHeader;
