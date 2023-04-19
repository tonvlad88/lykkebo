import { appColors, appNumbers } from "../../../utils/constants";

export default {
  container: {
    backgroundColor: "#FFF",
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
  alignItemsToLeft: {
    alignItems: "left",
  },
  paddingLeft5: {
    paddingLeft: 5,
  },
  paddingLeft10: {
    paddingLeft: 10,
  },
  paddingLeft15: {
    paddingLeft: 15,
  },
  subtext: {
    fontStyle: "italic",
    color: "#6e6e6e",
  },
  time: {
    fontSize: 12,
    color: "#595656",
  },
  cancellation: {
    fontSize: 12,
    color: "#595656",
  },
  cancellationDate: {
    marginLeft: 20,
  },
  booking: {
    fontSize: 12,
  },
  name: {
    fontSize: 16,
  },
  address: {
    fontSize: 14,
    color: "#9a9a9a",
  },
  phone: {
    fontSize: 14,
    color: "#9a9a9a",
  },
  icon: {
    fontSize: 14,
    color: "#000",
  },
  quoteItems: {
    fontSize: 12,
  },
  quoteItem: {
    padding: 5,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#b6b6b6",
  },
  quoteItemLast: {
    padding: 5,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#b6b6b6",
  },
  quoteItemHeader: {
    padding: 5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#b6b6b6",
  },
  quoteItemHeaderLast: {
    padding: 5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#b6b6b6",
  },
  fieldKey: {
    color: "#6e6e6e",
    fontSize: 12,
  },
  fieldValue: {
    color: "#111111",
    fontSize: 12,
  },
  ListItem: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingLeft: 0,
  },
  mainView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  headerView: {
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 10,
    height: 55,
    backgroundColor: "#3F51B5",
    justifyContent: "center",
  },
  headerViewText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  jobsView: {
    borderWidth: 1,
    borderColor: "red",
    flex: 2,
  },
  trackerItemsContainer: {
    borderWidth: 0.5,
    borderRadius: 2,
    borderColor: "#ccc",
    borderBottomWidth: 0.5,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 1,
    marginLeft: 2,
    marginRight: 2,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
    marginBottom: 5,
  },
  appbar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 56,
    flexDirection: "row",
  },
  piece: {
    flex: 1,
    backgroundColor: "#2E3D43",
  },
  right: {
    justifyContent: "flex-end",
  },
  cutout: {
    height: 56,
    width: 80,
    tintColor: "#2E3D43",
    // backgroundColor: '#ffffff',
    // elevation: 4,
  },
  fabStart: {
    position: "absolute",
    margin: 12,
    bottom: 15,
    backgroundColor: "green",
  },
  fabStop: {
    position: "absolute",
    margin: 12,
    bottom: 15,
    backgroundColor: "red",
  },
  contentContainer: {
    margin: 5,
    marginTop: 20,
    // borderWidth: 0.5,
    // borderColor: '#ccc',
    width: "95%",
    alignSelf: "center",
    backgroundColor: appColors.solidWhite,
    padding: appNumbers.number_10,
    borderWidth: appNumbers.number_1,
    borderColor: appColors.solidGrey,
  },
  addInternalTimeContainer: {
    marginHorizontal: appNumbers.number_5,
    marginTop: 20,
    // borderWidth: 0.5,
    // borderColor: '#ccc',
    width: "95%",
    alignSelf: "center",
    borderWidth: 1,
    padding: appNumbers.number_10,
    backgroundColor: appColors.solidWhite,
    borderColor: appColors.solidGrey,
  },
  addButtonInternalTimeContainer: {
    width: "95%",
    alignSelf: "center",
    backgroundColor: appColors.primary,
    padding: appNumbers.number_10,
  },
  contentHeader: {
    position: "absolute",
    top: -18,
    right: 20,
    backgroundColor: "#2E3D43",
    padding: 5,
    borderRadius: 5,
  },
  contentHeaderText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
  },
  calendarArrow: {
    width: 50,
    height: 50,
    backgroundColor: "#212C30",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarTitle: {
    flex: 1,
    height: 50,
    backgroundColor: "#212C30",
    justifyContent: "center",
    alignItems: "center",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
};
