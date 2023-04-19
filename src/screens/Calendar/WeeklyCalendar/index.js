import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Button, H3, DatePicker, Toast } from "native-base";

import type Moment from "moment";
import XDate from "xdate";
import Modal from "react-native-modal";
import axios from "axios";
import { Dropdown } from "react-native-material-dropdown-v2-fixed";
import SelectDropdown from "react-native-select-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  toTimestampWithSeconds,
  toTimestamp,
  setDayStatus,
  jsUcfirst,
} from "../../../services/common";

import NewHeader from "../../../common/NewHeader";

import Calendar from "./calendar/Calendar";
import Events from "./events/Events";
import {
  appAlignment,
  appColors,
  appDateFormats,
  appDirection,
  appNumbers,
  appSideBar,
  appStrings,
} from "../../../utils/constants";
import NewLoader from "../../../common/NewLoader";
import { NormalButton } from "../../../common/NewButtons/NormalButton";
import { Ionicons } from "@expo/vector-icons";

// Localization
import * as Localization from "expo-localization";
import i18n from "i18n-js";
import { da, en } from "../../../services/translations";

const entryStatus = [
  { value: "Ferie", label: "Ferie" },
  { value: "Sygdom", label: "Sygdom" },
  { value: "Skole", label: "Skole" },
  { value: "Andet", label: "Andet" },
];

export type EventType = {
  date: Moment,
  title: string,
  from: string,
  to: string,
  id: string,
};

const today = new Date().toISOString().slice(0, 10);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      baseData: {},
      selectedMarkedDateData: [],
      visibleModal: null,
      selected1: "Ferie",
      selectedDate: XDate(true).toString("yyyy-MM-dd"),
      dateFrom: "",
      dateEnd: "",
      loaded: false,
      showStartDate: false,
      showEndDate: false,
      dateFrom: XDate(true).toString(appDateFormats.yyyyMMdd),
      dateEnd: XDate(true).toString(appDateFormats.yyyyMMdd),
      selected1: "Ferie",
    };
    this.onSelectDate = this.onSelectDate.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
  }

  componentDidMount() {
    AsyncStorage.getItem("user_id").then((userId) => {
      AsyncStorage.getItem("token").then((token) => {
        AsyncStorage.getItem("baseUrl").then((baseUrl) => {
          fetch(`${baseUrl}/lykkebo/v1/calendar/overview?user_id=${userId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              this.setState({
                baseData: data.days,
                selectedMarkedDateData: data.days.filter(
                  (data2) => data2.date === today
                ),
                loaded: true,
              });
            })
            .catch((error) => {
              // Toast.show({
              //   text: error.message,
              //   position: 'top',
              //   duration: 5000,
              // });
            });
        });
      });
    });
  }

  onValueChange(value: string) {
    this.setState({
      selected1: value,
    });
  }

  onSelectDate = (date2) => {
    AsyncStorage.getItem("user_id").then((userId) => {
      AsyncStorage.getItem("token").then((token) => {
        AsyncStorage.getItem("baseUrl").then((baseUrl) => {
          fetch(
            `${baseUrl}/lykkebo/v1/calendar/overview?user_id=${userId}&month=${toTimestampWithSeconds(
              new Date(date2).toISOString().slice(0, 10)
            )}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
            .then((response) => response.json())
            .then((data) => {
              const tempDate2 = new Date(date2).toISOString().slice(0, 10);
              const temp = data.days.filter(
                (data2) => data2.date === tempDate2
              );
              // console.log('temp', temp)
              // console.log('baseData', data.days)

              this.setState({
                baseData: data.days,
                selectedDate: tempDate2,
                selectedMarkedDateData: temp,
              });
            })
            .catch((error) => {
              // Toast.show({
              //   text: error.message,
              //   position: "top",
              //   duration: 5000,
              // });
            });
        });
      });
    });
  };

  getDates(startDate, endDate) {
    var dates = [],
      currentDate = startDate,
      addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
    while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = addDays.call(currentDate, 1);
    }
    return dates;
  }

  startDatePickedHandler = (date) => {
    // const date2 = new Date(date);
    // const timestamp = date2.getTime() / 1000;
    this.setState({
      dateFrom: XDate(date).toString("yyyy-MM-dd"),
    });
  };

  endDatePickedHandler = (date) => {
    // const date2 = new Date(date);
    // const timestamp = date2.getTime() / 1000;
    this.setState({
      dateEnd: XDate(date).toString("yyyy-MM-dd"),
    });
  };

  saveDayInfoHandler = () => {
    const { dateFrom, dateEnd, selected1, selectedDate, baseData } = this.state;

    AsyncStorage.getItem("user_id").then((userId) => {
      AsyncStorage.getItem("token").then((token) => {
        AsyncStorage.getItem("baseUrl").then((baseUrl) => {
          const tempReason = setDayStatus(selected1);
          const startDay =
            dateFrom !== ""
              ? toTimestamp(new Date(dateFrom))
              : toTimestamp(new Date(selectedDate));
          const endDay =
            dateEnd !== ""
              ? toTimestamp(new Date(dateEnd))
              : toTimestamp(new Date(selectedDate));

          const postData = {
            user_id: `${userId}`,
            reason: `${tempReason}`,
            start_day: `${toTimestamp(new Date(selectedDate))}`,
            end_day: `${toTimestamp(new Date(selectedDate))}`,
          };

          console.log("postData", postData);
          // return;
          const axiosConfig = {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${token}`,
            },
          };

          axios
            .post(
              `${baseUrl}/lykkebo/v1/calendar/create`,
              postData,
              axiosConfig
            )
            .then((res) => {
              let i;
              const dates = this.getDates(
                new Date(selectedDate),
                new Date(selectedDate)
              );

              dates.forEach((date) => {
                const dayData = {
                  date: XDate(date).toString("yyyy-MM-dd"),
                  type: jsUcfirst(selected1),
                  details: {
                    id: res.data.entry,
                    type: jsUcfirst(selected1),
                    from: XDate(selectedDate).toString("yyyy-MM-dd"),
                    to: XDate(selectedDate).toString("yyyy-MM-dd"),
                  },
                };

                // delete from base Array
                for (i = 0; i < baseData.length; i += 1) {
                  if (baseData[i].date === XDate(date).toString("yyyy-MM-dd")) {
                    baseData.splice(i, 1);
                    break;
                  }
                }
                baseData.push(dayData);
              });

              // store data to selectedMarkedDateData
              const dayData2 = [
                {
                  date: selectedDate,
                  type: selected1,
                  details: {
                    id: res.data.entry,
                    type: jsUcfirst(selected1),
                    from: XDate(selectedDate).toString("yyyy-MM-dd"),
                    to: XDate(selectedDate).toString("yyyy-MM-dd"),
                  },
                },
              ];

              this.setState({
                baseData,
                selected1: "Ferie",
                visibleModal: null,
                selectedMarkedDateData: dayData2,
              });
            })
            .catch((error) => {
              // Toast.show({
              //   text: error.message,
              //   position: "top",
              //   duration: 5000,
              // });
            });
        });
      });
    });
  };

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
      selectedDate: XDate(selectedDate).toString("yyyy-MM-dd"),
    });
  };

  setEndDate = (event, selectedDate) => {
    if (Platform.OS === "android") {
      this.setState({ showEndDate: false });
    }
    this.setState({
      selectedDate: XDate(selectedDate).toString("yyyy-MM-dd"),
    });
  };

  renderModalContent = () => {
    const {
      selectedDate,
      isFutureDate,
      dateFrom,
      dateEnd,
      showStartDate,
      showEndDate,
    } = this.state;

    // return (
    //   <View
    //     style={{
    //       flexDirection: "column",
    //       backgroundColor: "white",
    //       padding: 22,
    //       justifyContent: "center",
    //       alignItems: "center",
    //       borderRadius: 4,
    //       borderColor: "rgba(0, 0, 0, 0.1)",
    //     }}
    //   >
    //     <View
    //       style={{
    //         height: 50,
    //         width: "100%",
    //         borderBottomWidth: 1,
    //         borderColor: "#ccc",
    //       }}
    //     >
    //       <View style={{ flex: 1, flexDirection: "row" }}>
    //         <View
    //           style={{
    //             width: 90,
    //             height: 50,
    //             paddingTop: 10,
    //             justifyContent: "center",
    //           }}
    //         >
    //           <Text style={styles.mb10}>Grund</Text>
    //         </View>
    //         <View style={{ flex: 1, height: 50 }}>
    //           <Dropdown
    //             label=""
    //             labelHeight={0}
    //             fontSize={20}
    //             containerStyle={{ paddingLeft: 10 }}
    //             inputContainerStyle={{ borderBottomColor: "transparent" }}
    //             value="Ferie"
    //             data={entryStatus}
    //             onChangeText={this.onValueChange}
    //           />
    //         </View>
    //       </View>
    //     </View>
    //     <View
    //       style={{
    //         height: 50,
    //         width: "100%",
    //         borderBottomWidth: 1,
    //         borderColor: "#ccc",
    //       }}
    //     >
    //       <View style={{ flex: 1, flexDirection: "row" }}>
    //         <View
    //           style={{
    //             width: 90,
    //             height: 50,
    //             paddingTop: 10,
    //             justifyContent: "center",
    //           }}
    //         >
    //           <Text style={styles.mb10}>Fra</Text>
    //         </View>
    //         <View style={{ flex: 1, height: 50 }}>
    //           {/* <DatePicker
    //             defaultDate={new Date(selectedDate)}
    //             // minimumDate={new Date(2018, 1, 1)}
    //             // maximumDate={new Date(2018, 12, 31)}
    //             locale="en"
    //             timeZoneOffsetInMinutes={undefined}
    //             modalTransparent={false}
    //             animationType="fade"
    //             androidMode="default"
    //             // placeHolderText="Select start date"
    //             textStyle={{ color: "#000" }}
    //             placeHolderTextStyle={{ color: "#ccc" }}
    //             onDateChange={this.startDatePickedHandler}
    //           /> */}
    //         </View>
    //       </View>
    //     </View>
    //     <View
    //       style={{
    //         height: 50,
    //         width: "100%",
    //         borderBottomWidth: 1,
    //         borderColor: "#ccc",
    //       }}
    //     >
    //       <View style={{ flex: 1, flexDirection: "row" }}>
    //         <View
    //           style={{
    //             width: 90,
    //             height: 50,
    //             paddingTop: 10,
    //             justifyContent: "center",
    //           }}
    //         >
    //           <Text style={styles.mb10}>Til</Text>
    //         </View>
    //         <View style={{ flex: 1, height: 50 }}>
    //           {/* <DatePicker
    //             defaultDate={new Date(selectedDate)}
    //             // minimumDate={new Date(2018, 1, 1)}
    //             // maximumDate={new Date(2018, 12, 31)}
    //             locale="en"
    //             timeZoneOffsetInMinutes={undefined}
    //             modalTransparent={false}
    //             animationType="fade"
    //             androidMode="default"
    //             // placeHolderText="Select end date"
    //             textStyle={{ color: "#000" }}
    //             placeHolderTextStyle={{ color: "#ccc" }}
    //             onDateChange={this.endDatePickedHandler}
    //           /> */}
    //         </View>
    //       </View>
    //     </View>
    //     <View style={{ height: 50, width: "100%", marginTop: 10 }}>
    //       <View style={{ flex: 1, flexDirection: "row" }}>
    //         <View style={{ flex: 1, height: 50, paddingRight: 5 }}>
    //           <TouchableOpacity
    //             full
    //             light
    //             style={styles.mt15}
    //             onPress={this.saveDayInfoHandler}
    //           >
    //             <Text>Save</Text>
    //           </TouchableOpacity>
    //         </View>
    //         <View style={{ flex: 1, height: 50, paddingLeft: 5 }}>
    //           <TouchableOpacity
    //             full
    //             light
    //             style={styles.mt15}
    //             onPress={() => this.setState({ visibleModal: null })}
    //           >
    //             <Text>Luk</Text>
    //           </TouchableOpacity>
    //         </View>
    //       </View>
    //     </View>
    //     {/* {this.renderButton('Close', () => this.setState({ visibleModal: null }))} */}
    //   </View>
    // );

    return (
      <View
        style={{
          flexDirection: "column",
          backgroundColor: "white",
          padding: 22,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 4,
          borderColor: "rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* {isFutureDate ? (
          <View />
        ) : (
          <View style={{height: 50, width: '100%', marginTop: 10}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{
                flex: 1, height: 50, paddingRight: 5, borderWidth: 0.5, borderColor: '#E2B838', backgroundColor: '#FFFCBF', justifyContent: 'center',
              }}>
                <Text style={{textAlign: 'center'}}>Du kan ikke melde fravær tilbage i tiden.</Text>
              </View>
            </View>
          </View>
        )} */}
        <View
          style={{
            height: 50,
            width: "100%",
            borderBottomWidth: 1,
            borderColor: "#ccc",
          }}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                width: 90,
                justifyContent: "center",
              }}
            >
              <Text style={[styles.mb10, { color: "#ccc" }]}>Grund</Text>
            </View>
            <View style={{}}>
              {/* <Dropdown
                label=""
                labelHeight={0}
                fontSize={20}
                containerStyle={{ paddingLeft: 10 }}
                inputContainerStyle={{ borderBottomColor: "transparent" }}
                value="Ferie"
                data={entryStatus}
                onChangeText={this.onValueChange}
                icon="chevron-down"
              /> */}
              <SelectDropdown
                data={entryStatus}
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
                defaultValue={"Ferie"}
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
            </View>
          </View>
        </View>
        <View
          style={{
            height: 50,
            width: "100%",
            borderBottomWidth: 1,
            borderColor: "#ccc",
          }}
        >
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 90,
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#ccc" }}>Fra</Text>
            </View>

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
                {selectedDate}
              </Text>
            </NormalButton>
            {showStartDate && (
              <DateTimePicker
                value={new Date(selectedDate)}
                mode={appStrings.common.date}
                onChange={this.setStartDate}
                display={appStrings.common.calendar}
              />
            )}
          </View>
        </View>
        <View
          style={{
            height: 50,
            width: "100%",
            borderBottomWidth: 1,
            borderColor: "#ccc",
          }}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                width: 90,
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#ccc" }}>Fra</Text>
            </View>

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
                {selectedDate}
              </Text>
            </NormalButton>
            {showEndDate && (
              <DateTimePicker
                value={new Date(selectedDate)}
                mode={appStrings.common.date}
                onChange={this.setEndDate}
                display={appStrings.common.calendar}
              />
            )}
          </View>
        </View>
        <View style={{ height: 50, width: "100%", marginTop: 10 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 1, height: 50, paddingRight: 5 }}>
              <TouchableOpacity
                style={[styles.mt15, styles.buttonModal]}
                onPress={() => this.saveDayInfoHandler()}
              >
                <Text>{i18n.t("save")}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, height: 50, paddingLeft: 5 }}>
              <TouchableOpacity
                style={[styles.mt15, styles.buttonModal]}
                onPress={() => this.setState({ visibleModal: null })}
              >
                <Text>{i18n.t("cancel")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* {this.renderButton('Close', () => this.setState({ visibleModal: null }))} */}
      </View>
    );
  };

  render() {
    const { selectedMarkedDateData, baseData, loaded, visibleModal } =
      this.state;

    const { navigation } = this.props;

    if (!loaded) {
      return (
        <View style={styles.container}>
          <NewLoader />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Calendar
          showDaysAfterCurrent={30}
          onSelectDate={this.onSelectDate}
          calendarData={baseData}
        />
        <Events
          navigation={navigation}
          events={selectedMarkedDateData}
          onModalPress={() => {
            this.setState({ visibleModal: 1 });
          }}
        />

        <Modal
          isVisible={visibleModal === 1}
          backdropColor="#ccc"
          backdropOpacity={0.9}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
        >
          {this.renderModalContent()}
        </Modal>
      </View>
    );

    // if (loaded) {
    //   return (
    //     <View style={styles.container}>
    //       <Calendar
    //         showDaysAfterCurrent={30}
    //         onSelectDate={this.onSelectDate}
    //         calendarData={baseData}
    //       />
    //       <Events
    //         navigation={navigation}
    //         events={selectedMarkedDateData}
    //         onModalPress={() => {
    //           this.setState({ visibleModal: 1 });
    //         }}
    //       />

    //       <Modal
    //         isVisible={visibleModal === 1}
    //         backdropColor="#ccc"
    //         backdropOpacity={0.9}
    //         animationIn="zoomInDown"
    //         animationOut="zoomOutUp"
    //         animationInTiming={1000}
    //         animationOutTiming={1000}
    //         backdropTransitionInTiming={1000}
    //         backdropTransitionOutTiming={1000}
    //       >
    //         {this.renderModalContent()}
    //       </Modal>
    //     </View>
    //   );
    // } else {
    //   return (
    //     <ActivityIndicator
    //       size="large"
    //       color="#0000ff"
    //       style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
    //     />
    //   );
    // }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#323248",
    paddingTop: 20,
  },
  buttonModal: {
    borderWidth: appNumbers.number_1,
    borderColor: appColors.solidGrey,
    padding: appNumbers.number_10,
    borderRadius: appNumbers.number_5,
    justifyContent: appAlignment.center,
    alignItems: appAlignment.center,
  },
});
