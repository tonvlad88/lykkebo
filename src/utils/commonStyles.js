import { StyleSheet } from "react-native";
import { appAlignment, appColors, appDirection, appNumbers } from "./constants";

const commonStyles = StyleSheet.create({
  deadCenter: {
    flex: appNumbers.number_1,
    justifyContent: appAlignment.center,
    alignItems: appAlignment.center,
  },
  deadCenterButton: {
    justifyContent: appAlignment.center,
    alignItems: appAlignment.center,
    flexDirection: appDirection.row,
  },
  shadow: {
    shadowColor: appColors.solidBlack,
    shadowOffset: {
      width: 0,
      height: appNumbers.number_2,
    },
    shadowOpacity: appNumbers.number_0_25,
    shadowRadius: appNumbers.number_3_84,
    elevation: appNumbers.number_5,
  },
});

export default commonStyles;
