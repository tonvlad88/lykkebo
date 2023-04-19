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
import { Feather, Ionicons } from "@expo/vector-icons";
import { Icon, Col, Row, Grid } from "native-base";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SelectDropdown from "react-native-select-dropdown";

// Packages
import XDate from "xdate";
import TimePicker from "react-native-24h-timepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
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
import { NormalButton } from "../../../common/NewButtons/NormalButton";
import {
  appAlignment,
  appColors,
  appDirection,
  appNumbers,
  appStrings,
} from "../../../utils/constants";

class AddDailyNote extends Component {
  state = {
    startTime: XDate().toString("yyyy-MM-dd 08:00:00"),
    endTime: XDate().toString("yyyy-MM-dd 16:00:00"),
    breakTime: XDate().toString("yyyy-MM-dd 01:00:00"),
    total: "0:00",
    comment: "",
    clientID: 0,
    selectedBooking: {},
    loaded: false,
    internalOnly: false,
    showStartTime: false,
    showEndTime: false,
    showBreakTime: false,
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

  toggleStartTimePicker = () => {
    const { showStartTime } = this.state;
    this.setState({ showStartTime: !showStartTime });
  };

  toggleEndTimePicker = () => {
    const { showEndTime } = this.state;
    this.setState({ showEndTime: !showEndTime });
  };

  toggleBreakTimePicker = () => {
    const { showBreakTime } = this.state;
    this.setState({ showBreakTime: !showBreakTime });
  };

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
      showStartTime,
      showEndTime,
      showBreakTime,
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
          <Ionicons
            name="close"
            style={{ position: "absolute", right: 3, top: 0, zIndex: 1 }}
            onPress={() => this.props.closeModal()}
          />
          <View
            style={{
              height: 50,
              borderBottomWidth: 0.5,
              borderBottomColor: "#ccc",
              backgroundColor: "white",
              padding: 10,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {new XDate(selectedDate).toString("dd MMMM, yyyy")}
              </Text>
            </View>
          </View>

          {!internalOnly ? (
            <View
              style={[
                styles.dailyNoteItemContainer,
                { flexDirection: appDirection.row },
              ]}
            >
              <View style={styles.dailyNoteLabel}>
                <Text>{i18n.t("client")}:</Text>
              </View>
              <SelectDropdown
                defaultButtonText={i18n.t("pleaseSelectAClient")}
                data={clientList}
                onSelect={(selectedItem, index) => {
                  this.setState({
                    selected1: selectedItem.value,
                  });
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return selectedItem.value;
                }}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return item.value;
                }}
                defaultValueByIndex={0} // use default value by index or default value
                defaultValue={
                  Object.keys(selectedBooking).length === 0 &&
                  selectedBooking.constructor === Object
                    ? ""
                    : selectedBooking[0].customer_id
                }
                buttonStyle={{
                  backgroundColor: "#FFF",
                  borderWidth: 1,
                  borderColor: "#cccccc",
                  marginBottom: 5,
                }}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <Ionicons
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      color={"#444"}
                      size={18}
                    />
                  );
                }}
                dropdownIconPosition={"right"}
              />
              {/* <View style={styles.dailyNoteClock}>
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
              </View> */}
            </View>
          ) : null}

          <View
            style={[
              styles.dailyNoteItemContainer,
              { flexDirection: appDirection.row },
            ]}
          >
            <View style={styles.dailyNoteLabel}>
              <Text>{i18n.t("from")}:</Text>
            </View>
            <View style={styles.dailyNoteClock}>
              <NormalButton
                onPress={this.toggleStartTimePicker}
                containerStyle={{
                  flexDirection: appDirection.row,
                  alignItems: appAlignment.center,
                  borderWidth: appNumbers.number_1,
                  borderColor: appColors.solidGrey,
                  padding: appNumbers.number_10,
                }}
                iconRight={
                  <Feather
                    name={appStrings.icon.clock}
                    size={appNumbers.number_24}
                    color={appColors.lavaRed}
                  />
                }
              >
                <Text style={{ marginRight: appNumbers.number_15 }}>
                  {XDate(startTime).toString("HH:mm")}
                </Text>
              </NormalButton>
              {showStartTime && (
                <DateTimePicker
                  value={new Date(startTime)}
                  mode={appStrings.common.time}
                  onChange={(date) =>
                    console.log(
                      "date",
                      XDate(date.nativeEvent.timestamp).toString("HH:mm:ss")
                    )
                  }
                  display={appStrings.common.spinner}
                />
              )}

              {/* <View style={styles.dailyNoteClockIcon}>
                  <TouchableOpacity
                    onPress={() => this.TimePickerStartTime.open()}
                  >
                    <Ionicons name="clock" />
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
                </View> */}
            </View>
          </View>

          <View
            style={[
              styles.dailyNoteItemContainer,
              { flexDirection: appDirection.row },
            ]}
          >
            <View style={styles.dailyNoteLabel}>
              <Text>{i18n.t("to")}:</Text>
            </View>
            <View style={styles.dailyNoteClock}>
              <NormalButton
                onPress={this.toggleEndTimePicker}
                containerStyle={{
                  flexDirection: appDirection.row,
                  alignItems: appAlignment.center,
                  borderWidth: appNumbers.number_1,
                  borderColor: appColors.solidGrey,
                  padding: appNumbers.number_10,
                }}
                iconRight={
                  <Feather
                    name={appStrings.icon.clock}
                    size={appNumbers.number_24}
                    color={appColors.lavaRed}
                  />
                }
              >
                <Text style={{ marginRight: appNumbers.number_15 }}>
                  {XDate(endTime).toString("HH:mm")}
                </Text>
              </NormalButton>
              {showEndTime && (
                <DateTimePicker
                  value={new Date(endTime)}
                  mode={appStrings.common.time}
                  onChange={(date) =>
                    console.log(
                      "date",
                      XDate(date.nativeEvent.timestamp).toString("HH:mm:ss")
                    )
                  }
                  display={appStrings.common.spinner}
                />
              )}
            </View>
          </View>

          <View
            style={[
              styles.dailyNoteItemContainer,
              { flexDirection: appDirection.row },
            ]}
          >
            <View style={styles.dailyNoteLabel}>
              <Text>{i18n.t("break")}:</Text>
            </View>
            <View style={styles.dailyNoteClock}>
              <NormalButton
                onPress={this.toggleBreakTimePicker}
                containerStyle={{
                  flexDirection: appDirection.row,
                  alignItems: appAlignment.center,
                  borderWidth: appNumbers.number_1,
                  borderColor: appColors.solidGrey,
                  padding: appNumbers.number_10,
                }}
                iconRight={
                  <Feather
                    name={appStrings.icon.clock}
                    size={appNumbers.number_24}
                    color={appColors.lavaRed}
                  />
                }
              >
                <Text style={{ marginRight: appNumbers.number_15 }}>
                  {XDate(breakTime).toString("HH:mm")}
                </Text>
              </NormalButton>
              {showBreakTime && (
                <DateTimePicker
                  value={new Date(breakTime)}
                  mode={appStrings.common.time}
                  onChange={(date) =>
                    console.log(
                      "date",
                      XDate(date.nativeEvent.timestamp).toString("HH:mm:ss")
                    )
                  }
                  display={appStrings.common.spinner}
                />
              )}
            </View>
          </View>

          <View
            style={[
              styles.dailyNoteItemContainer,
              { flexDirection: appDirection.row },
            ]}
          >
            <View style={styles.dailyNoteLabel}>
              <Text>{i18n.t("total")}:</Text>
            </View>
            <View
              style={{
                flexDirection: appDirection.row,
                alignItems: appAlignment.center,
                borderWidth: appNumbers.number_1,
                borderColor: appColors.solidGrey,
                padding: appNumbers.number_10,
                backgroundColor: appColors.solidWhite,
                minWidth: appNumbers.number_101,
              }}
            >
              <Text style={{ marginRight: appNumbers.number_15 }}>{total}</Text>
            </View>
          </View>

          <View style={{ backgroundColor: "#FAF9FE", marginTop: 5 }}>
            <View style={styles.dailyNoteLabel}>
              <Text>{i18n.t("comment")}:</Text>
            </View>
            <View style={{ backgroundColor: "white" }}>
              <View style={styles.textAreaContainer}>
                <TextInput
                  style={styles.textArea}
                  underlineColorAndroid="transparent"
                  placeholder={i18n.t("typeyourcomment")}
                  placeholderTextColor="grey"
                  numberOfLines={10}
                  multiline={true}
                  onChangeText={(value) => this.setState({ comment: value })}
                />
              </View>

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
            </View>
          </View>

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
