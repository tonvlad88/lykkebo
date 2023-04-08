const React = require("react-native");
const { Platform, Dimensions } = React;
import { appColors, appNumbers } from "../../utils/constants";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  drawerCover: {
    alignSelf: "stretch",
    height: deviceHeight / 3.5,
    width: null,
    position: "relative",
    marginBottom: 10,
    backgroundColor: "#2E3D43",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: 5,
  },
  drawerImage: {
    // position: "absolute",
    // left: Platform.OS === "android" ? deviceWidth / 10 : deviceWidth / 9,
    // top: Platform.OS === "android" ? deviceHeight / 13 : deviceHeight / 12,
    width: 210,
    height: 75,
    // resizeMode: "cover"
  },
  text: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 16,
    marginLeft: 20,
  },
  badgeText: {
    fontSize: Platform.OS === "ios" ? 13 : 11,
    fontWeight: "400",
    textAlign: "center",
    marginTop: Platform.OS === "android" ? -3 : undefined,
  },
  sidebarImageContainer: {
    backgroundColor: appColors.primary,
    height: deviceHeight / 3.5,
    marginTop: -appNumbers.number_10,
    padding: appNumbers.number_5,
  },
  logoutContainer: { marginHorizontal: appNumbers.number_10 },
  logoutButton: { padding: appNumbers.number_10 },
  logoutText: { color: appColors.boulder, fontWeight: appNumbers.number_500 },
  userNameText: {
    fontSize: appNumbers.number_18,
    fontWeight: appNumbers.number_600,
    color: appColors.solidWhite,
  },
  userEmailText: {
    fontSize: appNumbers.number_14,
    color: appColors.solidWhite,
  },
};
