import { appAlignment, appColors, appNumbers } from "../../../utils/constants";

export default {
  // container: {
  //   backgroundColor: '#fff',
  // },
  mb: {
    marginBottom: 10,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  mb10: {
    marginBottom: 10,
  },
  calendar: {
    borderTopWidth: 1,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: "#eee",
    height: 350,
  },
  text: {
    textAlign: "center",
    borderColor: "#bbb",
    padding: 10,
    backgroundColor: "#eee",
  },
  container: {
    flex: 1,
    // backgroundColor: 'gray'
  },
  buttonModal: {
    borderWidth: 1,
    borderColor: appColors.solidGrey,
    padding: appNumbers.number_10,
    borderRadius: appNumbers.number_5,
    justifyContent: appAlignment.center,
    alignItems: appAlignment.center,
  },
};
