import React, { Component } from "react";
import { Content, ListItem, Toast, Icon } from "native-base";

import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import XDate from "xdate";
// import DatePicker from "react-native-datepicker";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { showMessage } from "react-native-flash-message";
// import styles from "../../styles";

import { toTimestamp } from "../../../../services/common";
import {
  appAlignment,
  appColors,
  appDateFormats,
  appDirection,
  appNumbers,
  appStrings,
} from "../../../../utils/constants";
import { NormalButton } from "../../../../common/NewButtons/NormalButton";

class BookingSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingStartDate: null,
      bookingEndDate: null,
      showStartDate: false,
      showEndDate: false,
      dateFrom: XDate(true).toString(appDateFormats.yyyyMMdd),
      dateEnd: XDate(true).toString(appDateFormats.yyyyMMdd),
    };
    this.setStartDateHandler = this.setStartDateHandler.bind(this);
    this.setEndDateHandler = this.setEndDateHandler.bind(this);
  }

  componentDidMount() {
    const { info } = this.props;

    this.setState({
      bookingStartDate: info.start_date,
      bookingEndDate: info.end_date,
    });
  }

  setStartDateHandler(event, newDate) {
    if (Platform.OS === "android") {
      this.setState({ showStartDate: false });
    }
    const { info } = this.props;

    this.setState({
      bookingStartDate: toTimestamp(XDate(newDate).toString("yyyy-MM-dd")),
      bookingEndDate: toTimestamp(XDate(newDate).toString("yyyy-MM-dd")),
    });

    AsyncStorage.getItem("user_id").then((userId) => {
      AsyncStorage.getItem("token").then((token) => {
        AsyncStorage.getItem("baseUrl").then((baseUrl) => {
          AsyncStorage.getItem("selectedJobId").then((jobId) => {
            const postData = {
              user_id: `${userId}`,
              job_id: jobId,
              start: toTimestamp(XDate(newDate).toString("yyyy-MM-dd")),
              end: toTimestamp(XDate(newDate).toString("yyyy-MM-dd")),
            };

            const axiosConfig = {
              headers: {
                // 'Content-Type': 'application/json;charset=UTF-8',
                // 'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${token}`,
              },
            };

            axios
              .post(
                `${baseUrl}/lykkebo/v1/jobdetails/updateJobDates`,
                postData,
                axiosConfig
              )
              .then(() => {
                showMessage({
                  message: "Opdateret succesfuldt",
                  type: appStrings.common.success,
                });
              })
              .catch((error) => {
                showMessage({
                  message: error.message,
                  type: appStrings.common.danger,
                });
              });
          });
        });
      });
    });
  }

  setEndDateHandler(newDate) {
    if (Platform.OS === "android") {
      this.setState({ showEndDate: false });
    }
    const { info } = this.props;
    this.setState({
      bookingEndDate: toTimestamp(newDate),
    });

    AsyncStorage.getItem("user_id").then((userId) => {
      AsyncStorage.getItem("token").then((token) => {
        AsyncStorage.getItem("baseUrl").then((baseUrl) => {
          AsyncStorage.getItem("selectedJobId").then((jobId) => {
            const postData = {
              user_id: `${userId}`,
              job_id: jobId,
              start: info.start_date,
              end: toTimestamp(newDate),
            };

            const axiosConfig = {
              headers: {
                // 'Content-Type': 'application/json;charset=UTF-8',
                // 'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${token}`,
              },
            };

            axios
              .post(
                `${baseUrl}/lykkebo/v1/jobdetails/updateJobDates`,
                postData,
                axiosConfig
              )
              .then(() => {
                // Toast.show({
                //   text: 'Opdateret succesfuldt',
                //   position: 'bottom',
                //   duration: 5000,
                //   buttonText: 'Okay',
                //   type: 'success',
                // });
              })
              .catch((error) => {
                // Toast.show({
                //   text: error.message,
                //   position: 'top',
                //   duration: 5000,
                //   type: 'error',
                // });
              });
          });
        });
      });
    });
  }

  toggleStartDateDatePicker = () => {
    const { showStartDate } = this.state;
    this.setState({ showStartDate: !showStartDate });
  };

  toggleEndDateDatePicker = () => {
    const { showEndDate } = this.state;
    this.setState({ showEndDate: !showEndDate });
  };

  setStartDate = (event, selectedDate) => {
    if (Platform.OS === "android") {
      this.setState({ showStartDate: false });
    }
    this.setState({
      dateFrom: XDate(selectedDate).toString("yyyy-MM-dd"),
      dateEnd: XDate(selectedDate).toString("yyyy-MM-dd"),
    });
  };

  setEndDate = (event, selectedDate) => {
    if (Platform.OS === "android") {
      this.setState({ showEndDate: false });
    }
    this.setState({
      dateEnd: XDate(selectedDate).toString("yyyy-MM-dd"),
    });
  };

  render() {
    const { info, user, showSpecifyModal } = this.props;
    const {
      bookingStartDate,
      bookingEndDate,
      dateFrom,
      dateEnd,
      showStartDate,
      showEndDate,
    } = this.state;
    // console.log('user', user)
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.itemContainer,
            { backgroundColor: appColors.solidGrey },
          ]}
        >
          <Text style={styles.itemHeaderText}>Bookingoplysninger</Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemLabel}>Startdato</Text>
          <View style={{ width: "70%", alignItems: "flex-start" }}>
            {Number(user) === 1 || Number(user) === 2 ? (
              // <DatePicker
              //   date={new Date(bookingStartDate * 1000)}
              //   mode="date"
              //   placeholder="select date"
              //   format="YYYY-MM-DD"
              //   confirmBtnText="Update"
              //   cancelBtnText="Cancel"
              //   customStyles={{
              //     dateIcon: {
              //       position: "absolute",
              //       right: 0,
              //       top: 4,
              //       marginRight: 0,
              //     },
              //     dateInput: {
              //       marginRight: 36,
              //     },
              //   }}
              //   onDateChange={this.setStartDateHandler}
              // />
              <>
                <NormalButton
                  onPress={this.toggleStartDateDatePicker}
                  containerStyle={{
                    flexDirection: appDirection.row,
                    alignItems: appAlignment.center,
                    borderWidth: appNumbers.number_1,
                    borderColor: appColors.solidGrey,
                    padding: appNumbers.number_10,
                  }}
                  iconRight={
                    <Ionicons
                      name={appStrings.icon.calendar}
                      size={appNumbers.number_24}
                      color={appColors.lavaRed}
                    />
                  }
                >
                  <Text style={{ marginRight: appNumbers.number_15 }}>
                    {XDate(bookingStartDate * 1000).toString("yyyy-MM-dd")}
                  </Text>
                </NormalButton>
                {showStartDate && (
                  <DateTimePicker
                    value={new Date(bookingStartDate * 1000)}
                    mode={appStrings.common.date}
                    onChange={this.setStartDateHandler}
                    display={appStrings.common.calendar}
                  />
                )}
              </>
            ) : (
              <Text style={{ alignSelf: "flex-start" }}>
                {XDate(new Date(info.start_date * 1000)).toString(
                  "yyyy-MMMM-dd"
                )}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemLabel}>Slutdato</Text>
          <View style={{ width: "70%", alignItems: "flex-start" }}>
            {Number(user) === 1 || Number(user) === 2 ? (
              // <DatePicker
              //   date={new Date(bookingEndDate * 1000)}
              //   mode="date"
              //   placeholder="select date"
              //   format="YYYY-MM-DD"
              //   confirmBtnText="Update"
              //   cancelBtnText="Cancel"
              //   customStyles={{
              //     dateIcon: {
              //       position: "absolute",
              //       right: 0,
              //       top: 4,
              //       marginRight: 0,
              //     },
              //     dateInput: {
              //       marginRight: 36,
              //     },
              //   }}
              //   onDateChange={this.setEndDateHandler}
              // />
              <>
                <NormalButton
                  onPress={this.toggleEndDateDatePicker}
                  containerStyle={{
                    flexDirection: appDirection.row,
                    alignItems: appAlignment.center,
                    borderWidth: appNumbers.number_1,
                    borderColor: appColors.solidGrey,
                    padding: appNumbers.number_10,
                  }}
                  iconRight={
                    <Ionicons
                      name={appStrings.icon.calendar}
                      size={appNumbers.number_24}
                      color={appColors.lavaRed}
                    />
                  }
                >
                  <Text style={{ marginRight: appNumbers.number_15 }}>
                    {XDate(bookingEndDate * 1000).toString("yyyy-MM-dd")}
                  </Text>
                </NormalButton>
                {showEndDate && (
                  <DateTimePicker
                    value={new Date(bookingEndDate * 1000)}
                    mode={appStrings.common.date}
                    onChange={this.setEndDateHandler}
                    display={appStrings.common.calendar}
                  />
                )}
              </>
            ) : (
              <Text style={{ alignSelf: "flex-start" }}>
                {XDate(new Date(info.end_date * 1000)).toString("yyyy-MMMM-dd")}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.itemContainer}>
          <Text style={[styles.itemLabel, { width: "40%" }]}>Arbejdsdage</Text>

          <TouchableOpacity
            style={{ padding: 0 }}
            transparent
            onPress={() => {
              showSpecifyModal(true);
            }}
          >
            {/* <Icon name="switch" style={{ color: "black" }} /> */}
            <FontAwesome
              name={appStrings.icon.toggleOn}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemLabel}>Konsulent</Text>

          <Text style={{ width: "70%" }}>
            {info.booking_info.consultant !== ""
              ? info.booking_info.consultant.name
              : ""}
          </Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemLabel}>Ansvarlig</Text>
          <Text style={{ width: "70%" }}>
            {info.booking_info.responsible.length !== ""
              ? info.booking_info.responsible.name
              : ""}
          </Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemLabel}>Medarbejdere</Text>
          <Text style={{ width: "70%" }}>
            {info.booking_info.employee.length !== ""
              ? info.booking_info.employee.name
              : ""}
          </Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemLabel}>Beskrivelse</Text>
          <Text style={{ width: "70%" }}>{info.description}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: appNumbers.number_5,
    borderWidth: appNumbers.number_1,
    borderColor: appColors.solidGrey,
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
});

export default BookingSection;
