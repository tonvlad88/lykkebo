// PACKAGES
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// IMPORTS
import {
  appAlignment,
  appColors,
  appDirection,
  appNumbers,
  appStrings,
} from "../utils/constants";

const NewSinglePageHeader = (props) => {
  const {
    navigation,
    title = "Title",
    hasLeftIcon,
    leftIconName = appStrings.icon.chevronBack,
    leftIconPress,
    hasRightIcon,
    rightIconName = appStrings.icon.add,
    rightIconPress,
  } = props;
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {hasLeftIcon ? (
        <TouchableOpacity onPress={leftIconPress}>
          <Ionicons
            name={leftIconName}
            size={appNumbers.number_24}
            color={appColors.solidGrey}
          />
        </TouchableOpacity>
      ) : (
        <Ionicons name={leftIconName} size={24} color={appColors.primary} />
      )}

      <View style={styles.titleContainer}>
        <Text style={[styles.titleText]}>{title}</Text>
      </View>

      {hasRightIcon ? (
        <TouchableOpacity onPress={rightIconPress}>
          <Ionicons
            name={rightIconName}
            size={24}
            color={appColors.solidGrey}
          />
        </TouchableOpacity>
      ) : (
        <Ionicons name={rightIconName} size={24} color={appColors.primary} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: appDirection.row,
    backgroundColor: appColors.primary,
    paddingHorizontal: appNumbers.number_10,
    paddingVertical: appNumbers.number_16,
    alignItems: appAlignment.center,
  },
  titleContainer: {
    flex: appNumbers.number_1,
    alignItems: appAlignment.center,
  },
  titleText: {
    color: appColors.solidWhite,
    fontWeight: "600",
  },
});

export default NewSinglePageHeader;
