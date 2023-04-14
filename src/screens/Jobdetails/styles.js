import {
  appAlignment,
  appColors,
  appDirection,
  appNumbers,
} from "../../utils/constants";

export default {
  container: {
    backgroundColor: "#FFF",
    margin: appNumbers.number_5,
    borderWidth: appNumbers.number_1,
    borderColor: appColors.solidGrey,
  },
  text: {
    alignSelf: "center",
    marginBottom: 7,
  },
  mb: {
    marginBottom: 15,
  },
  noPaddingLeft: {
    paddingLeft: 0,
  },
  noMarginLeft: {
    marginLeft: 0,
  },
  textToLeft: {
    textAlign: "left",
  },
  wrapper: {
    height: 350,
  },
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB",
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CAE5",
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#92BBD9",
  },
  paginationStyle: {
    borderColor: "red",
    borderWidth: "1",
  },
  sectionSeparator: {
    width: "100%",
    height: 5,
    backgroundColor: "#E8E8E8",
    marginBottom: 1,
  },
  itemContainer: {
    flexDirection: appDirection.row,
    paddingVertical: appNumbers.number_10,
    paddingHorizontal: appNumbers.number_5,
    alignItems: appAlignment.center,
    borderBottomWidth: 0.5,
    borderBottomColor: appColors.solidGrey,
  },
  itemHeaderText: {
    paddingHorizontal: appNumbers.number_10,
    color: "#787878",
    fontWeight: "bold",
  },
  itemLabel: {
    color: "#7F7F7F",
    paddingLeft: appNumbers.number_10,
    width: "25%",
  },
};
