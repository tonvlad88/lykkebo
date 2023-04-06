import { StyleSheet } from "react-native";
import { appAlignment, appNumbers, appStrings } from "./constants";

const commonStyles = StyleSheet.create({
  deadCenter: {
    flex: appNumbers.number_1,
    justifyContent: appAlignment.center,
    alignItems: appAlignment.center,
  },
});

export default commonStyles;
