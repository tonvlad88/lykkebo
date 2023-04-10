// Components
import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Keyboard,
  ScrollView,
} from "react-native";
import { Icon, Col, Row, Grid } from "native-base";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Packages
import XDate from "xdate";
import TimePicker from "react-native-24h-timepicker";
import moment from "moment";
import * as Localization from "expo-localization";
import {
  KeyboardAccessoryView,
  KeyboardAccessoryNavigation,
} from "react-native-keyboard-accessory";
// import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import { Dropdown } from "react-native-material-dropdown-v2-fixed";

// Actions

// Localization
import i18n from "i18n-js";
import { da, en } from "../../../services/translations";
i18n.fallbacks = true;
i18n.translations = { da, en };
i18n.locale = Localization.locale;

// Global imports
import {
  convertTimeToSeconds,
  getTimeInterval,
  toTimestamp,
} from "../../../services/common";

// Local imports
import styles from "./styles/AddDailyNoteStyle";

class AddDailyNote extends Component {
  state = {
    startTime: "8:00",
    endTime: "16:00",
    breakTime: "1:00",
    total: "0:00",
    comment: "",
    clientID: 0,
    selectedBooking: {},
    loaded: false,
    internalOnly: false,
  };

  async componentDidMount() {
    const { startTime, endTime, breakTime } = this.state;
    // const clockStartTime = await AsyncStorage.getItem('@DeskmaAppV2:clockStartTime');
    // const clockEndTime = await AsyncStorage.getItem('@DeskmaAppV2:clockEndTime');
    // const breakTimeTemp = await AsyncStorage.getItem('@DeskmaAppV2:breakTime');

    const total = getTimeInterval(
      startTime,
      endTime,
      convertTimeToSeconds(breakTime)
    );
    console.log("selectedBooking", this.props.selectedBooking);
    this.setState({
      total,
      selectedBooking:
        this.props.selectedBooking === undefined ||
        this.props.selectedBooking.length == 0
          ? {}
          : this.props.selectedBooking,
      clientID:
        this.props.selectedBooking === undefined ||
        this.props.selectedBooking.length == 0
          ? 0
          : this.props.selectedBooking[0].customer_id,
      internalOnly: this.props.internalOnly,
      loaded: true,
    });
  }

  onCancelStartTime() {
    this.TimePickerStartTime.close();
  }

  onConfirmStartTime(hour, minute) {
    const { endTime, breakTime } = this.state;
    this.setState({ startTime: `${hour}:${minute}` });

    if (endTime !== "0:00") {
      const total = getTimeInterval(
        `${hour}:${minute}`,
        endTime,
        convertTimeToSeconds(breakTime)
      );
      this.setState({
        total,
      });
    }

    this.TimePickerStartTime.close();
  }

  onCancelEndTime() {
    this.TimePickerEndTime.close();
  }

  onConfirmEndTime(hour, minute) {
    const { startTime, breakTime } = this.state;
    this.setState({ endTime: `${hour}:${minute}` });

    if (startTime !== "0:00") {
      const total = getTimeInterval(
        startTime,
        `${hour}:${minute}`,
        convertTimeToSeconds(breakTime)
      );
      this.setState({
        total,
      });
    }

    this.TimePickerEndTime.close();
  }

  onConfirmBreak(hour, minute) {
    const { startTime, endTime } = this.state;
    this.setState({ breakTime: `${hour}:${minute}` });

    const total = getTimeInterval(
      startTime,
      endTime,
      convertTimeToSeconds(`${hour}:${minute}`)
    );
    this.setState({
      total,
    });

    this.TimePickerBreak.close();
  }

  render() {
    const {
      selectedDate,
      selectedDateFormatted,
      userId,
      internalOnly,
      bookings,
    } = this.props;
    const {
      startTime,
      endTime,
      total,
      comment,
      loaded,
      breakTime,
      selectedBooking,
    } = this.state;

    if (!loaded) return <View />;

    // console.log('bookings', bookings)

    let clientList = [];
    bookings.forEach((booking) => {
      const data = {
        value: booking.customer_id,
        label: `${booking.customer_name} (${booking.job_id})`,
      };
      clientList.push(data);
    });

    const startTimeHourMin = startTime.split(":");
    const endTimeHourMin = endTime.split(":");
    const breakTimeHourMin = breakTime.split(":");

    return (
      <View style={styles.container}>
        <ScrollView>
          {/* <Icon
            name="close-circle"
            style={{position: 'absolute', right: 3, top: 0, zIndex: 1}}
            onPress={() => this.props.closeModal()}
          /> */}
          <Row
            style={{
              height: 50,
              borderBottomWidth: 0.5,
              borderBottomColor: "#ccc",
              backgroundColor: "white",
              padding: 10,
            }}
          >
            <Col>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {new XDate(selectedDate).toString("dd MMMM, yyyy")}
              </Text>
            </Col>
          </Row>

          {!internalOnly ? (
            <Row style={styles.dailyNoteItemContainer}>
              <Col style={styles.dailyNoteLabel}>
                <Text>{i18n.t("client")}:</Text>
              </Col>
              <Col style={styles.dailyNoteClock}>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <Dropdown
                    // label={props.label}
                    fontSize={16}
                    value={
                      Object.keys(selectedBooking).length === 0 &&
                      selectedBooking.constructor === Object
                        ? ""
                        : selectedBooking[0].customer_id
                    }
                    // containerStyle={{flex: 1}}
                    inputContainerStyle={{
                      borderBottomColor: "transparent",
                      borderBottomWidth: 0,
                    }}
                    containerStyle={{ flex: 1, marginTop: -17, marginLeft: 20 }}
                    data={clientList}
                    onChangeText={(clientID) => {
                      const bookingData = bookings.filter((booking) => {
                        return booking.customer_id === clientID;
                      });
                      this.setState({
                        clientID: bookingData[0].customer_id,
                        selectedBooking: bookingData,
                      });
                    }}
                    placeholder={i18n.t("pleaseSelectAClient")}
                  />
                </View>
              </Col>
            </Row>
          ) : null}

          <Row style={styles.dailyNoteItemContainer}>
            <Col style={styles.dailyNoteLabel}>
              <Text>{i18n.t("from")}:</Text>
            </Col>
            <Col style={styles.dailyNoteClock}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={styles.dailyNoteTime}>
                  <Text
                    onPress={() => this.TimePickerStartTime.open()}
                    style={{ fontWeight: "bold", fontSize: 18 }}
                  >
                    {startTime}
                  </Text>
                </View>
                <View style={styles.dailyNoteClockIcon}>
                  <TouchableOpacity
                    onPress={() => this.TimePickerStartTime.open()}
                  >
                    <Icon name="clock" />
                  </TouchableOpacity>
                  <TimePicker
                    minuteInterval={15}
                    selectedHour={Number(startTimeHourMin[0]).toString()}
                    selectedMinute={`${startTimeHourMin[1]}`}
                    ref={(ref) => {
                      this.TimePickerStartTime = ref;
                    }}
                    onCancel={() => this.onCancelStartTime()}
                    onConfirm={(hour, minute) =>
                      this.onConfirmStartTime(hour, minute)
                    }
                  />
                </View>
              </View>
            </Col>
          </Row>

          <Row style={styles.dailyNoteItemContainer}>
            <Col style={styles.dailyNoteLabel}>
              <Text>{i18n.t("to")}:</Text>
            </Col>
            <Col style={styles.dailyNoteClock}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={styles.dailyNoteTime}>
                  <Text
                    onPress={() => this.TimePickerEndTime.open()}
                    style={{ fontWeight: "bold", fontSize: 18 }}
                  >
                    {endTime}
                  </Text>
                </View>
                <View style={styles.dailyNoteClockIcon}>
                  <TouchableOpacity
                    onPress={() => this.TimePickerEndTime.open()}
                  >
                    <Icon name="clock" />
                  </TouchableOpacity>
                  <TimePicker
                    minuteInterval={15}
                    selectedHour={Number(endTimeHourMin[0]).toString()}
                    selectedMinute={`${endTimeHourMin[1]}`}
                    ref={(ref) => {
                      this.TimePickerEndTime = ref;
                    }}
                    onCancel={() => this.onCancelEndTime()}
                    onConfirm={(hour, minute) =>
                      this.onConfirmEndTime(hour, minute)
                    }
                  />
                </View>
              </View>
            </Col>
          </Row>

          <Row style={styles.dailyNoteItemContainer}>
            <Col style={styles.dailyNoteLabel}>
              <Text>{i18n.t("break")}:</Text>
            </Col>
            <Col style={styles.dailyNoteClock}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={styles.dailyNoteTime}>
                  <Text
                    onPress={() => this.TimePickerBreak.open()}
                    style={{ fontWeight: "bold", fontSize: 18 }}
                  >
                    {breakTime}
                  </Text>
                </View>
                <View style={styles.dailyNoteClockIcon}>
                  <TouchableOpacity onPress={() => this.TimePickerBreak.open()}>
                    <Icon name="clock" />
                  </TouchableOpacity>
                  <TimePicker
                    selectedHour={Number(breakTimeHourMin[0]).toString()}
                    selectedMinute={`${breakTimeHourMin[1]}`}
                    minuteInterval={15}
                    ref={(ref) => {
                      this.TimePickerBreak = ref;
                    }}
                    onCancel={() => this.onCancelBreak()}
                    onConfirm={(hour, minute) =>
                      this.onConfirmBreak(hour, minute)
                    }
                  />
                </View>
              </View>
            </Col>
          </Row>

          <Row style={styles.dailyNoteItemContainer}>
            <Col style={styles.dailyNoteLabel}>
              <Text>{i18n.t("total")}:</Text>
            </Col>
            <Col style={styles.dailyNoteClock}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={styles.dailyNoteTime}>
                  <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                    {total}
                  </Text>
                </View>
                <View style={styles.dailyNoteClockIcon} />
              </View>
            </Col>
          </Row>

          <Row
            style={{ height: 150, backgroundColor: "#FAF9FE", marginTop: 5 }}
          >
            <Col style={styles.dailyNoteLabel}>
              <Text>{i18n.t("comment")}:</Text>
            </Col>
            <Col style={{ backgroundColor: "white" }}>
              {/* <View style={styles.textAreaContainer} >
                <TextInput
                  style={styles.textArea}
                  underlineColorAndroid="transparent"
                  placeholder={i18n.t('typeyourcomment')}
                  placeholderTextColor="grey"
                  numberOfLines={10}
                  multiline={true}
                  onChangeText={(value) => this.setState({comment: value})}
                />
              </View> */}

              {/* <AutoGrowingTextInput
                // minHeight={100}
                blurOnSubmit
                style={styles.textAreaContainer}
                underlineColorAndroid="transparent"
                value={comment}
                onChangeText={(text) => {
                  this.setState({
                    comment: text,
                  });
                }}
                placeholder={i18n.t("typeyourcomment")}
              /> */}
            </Col>
          </Row>

          <View
            style={{
              height: 5,
              borderBottomWidth: 0.5,
              borderBottomColor: "#ccc",
              padding: 10,
            }}
          />

          <Button
            buttonStyle={{ margin: 10, height: 46, backgroundColor: "#1C323A" }}
            title={i18n.t("save")}
            titleStyle={{ fontWeight: "bold" }}
            onPress={() => {
              const data = {
                user_id: userId,
                day: selectedDate,
                start: `${selectedDate} ${startTime}:00`,
                end: `${selectedDate} ${endTime}:00`,
                total: convertTimeToSeconds(`${total}:00`),
                is_billable: internalOnly ? "0" : "1",
                client_id:
                  Object.keys(selectedBooking).length === 0 &&
                  selectedBooking.constructor === Object
                    ? ""
                    : selectedBooking[0].customer_id,
                job_id:
                  Object.keys(selectedBooking).length === 0 &&
                  selectedBooking.constructor === Object
                    ? ""
                    : selectedBooking[0].job_id,
                comment,
                break: breakTime,
              };
              console.log("dataaaaaa", data);
              this.props.saveDailyNoteProp(data);
            }}
          />

          <Button
            buttonStyle={{
              margin: 10,
              marginTop: 0,
              height: 46,
              backgroundColor: "#1C323A",
            }}
            onPress={() => this.props.closeModal()}
            titleStyle={{ fontWeight: "bold" }}
            title={i18n.t("cancel")}
          />
        </ScrollView>

        {Platform.OS === "ios" ? (
          <KeyboardAccessoryNavigation
            avoidKeyboard
            nextHidden
            previousHidden
            inSafeAreaView="true"
            onDone={Keyboard.dismiss}
          />
        ) : (
          <View />
        )}
      </View>
    );
  }
}

export default AddDailyNote;
