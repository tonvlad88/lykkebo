// PACKAGES
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
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
import { SafeAreaView } from "react-native-safe-area-context";

const NewSinglePageHeader = (props) => {
  const {
    navigation,
    title = "",
    hasLeftIcon,
    leftIconName = appStrings.icon.chevronBack,
    leftIconPress,
    hasRightIcon,
    rightIconName = appStrings.icon.add,
    rightIconPress,
  } = props;
  return (
    <SafeAreaView
      edges={["top"]}
      style={[
        styles.mainContainer,
        Platform.OS === "android" ? { paddingTop: appNumbers.number_15 } : {},
      ]}
    >
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: appColors.primary,
  },
  container: {
    flexDirection: appDirection.row,
    backgroundColor: appColors.primary,
    paddingHorizontal: appNumbers.number_10,
    paddingBottom: appNumbers.number_16,
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
