// Packages
import React, { Component } from "react";
import {
  View,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Text,
  Dimensions,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import XDate from "xdate";
import Modal from "react-native-modal";
import { Calendar, LocaleConfig } from "react-native-calendars";
import axios from "axios";
import { connect } from "react-redux";
import moment from "moment";
import { showMessage } from "react-native-flash-message";
import { TabBar, SceneMap } from "react-native-tab-view";
import { Ionicons } from "@expo/vector-icons";
import { Tab, TabView } from "@rneui/themed";
import DatePicker from "react-native-datepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import SelectDropdown from "react-native-select-dropdown";

// Actions

// Localization
import * as Localization from "expo-localization";
import i18n from "i18n-js";
import { da, en } from "../../../services/translations";

// Global imports
import {
  toTimestampWithSeconds,
  toTimestamp,
  setDayStatus,
  jsUcfirst,
} from "../../../services/common";
import deviceStorage from "../../../services/deviceStorage";

// Local imports
import styles from "./styles";
import TabTwo from "../WeeklyCalendar/index";
import CustomHeader from "../../../common/Header";
import NewHeader from "../../../common/NewHeader";
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

i18n.fallbacks = true;
i18n.translations = { da, en };
i18n.locale = Localization.locale;

LocaleConfig.locales["dynamic"] = {
  monthNames: [
    i18n.t("january"),
    i18n.t("february"),
    i18n.t("march"),
    i18n.t("april"),
    i18n.t("may"),
    i18n.t("june"),
    i18n.t("july"),
    "August",
    "September",
    i18n.t("october"),
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    i18n.t("shortmay"),
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    i18n.t("shortokt"),
    "Nov",
    "Dec",
  ],
  dayNames: [
    i18n.t("sunday"),
    i18n.t("monday"),
    i18n.t("tuesday"),
    i18n.t("wednesday"),
    i18n.t("thursday"),
    i18n.t("friday"),
    i18n.t("saturday"),
  ],
  dayNamesShort: [
    i18n.t("sun"),
    i18n.t("mon"),
    i18n.t("tue"),
    i18n.t("wed"),
    i18n.t("thu"),
    i18n.t("fri"),
    i18n.t("sat"),
  ],
  amDesignator: "AM",
  pmDesignator: "PM",
};
LocaleConfig.defaultLocale = "dynamic";

const bookingStatusStyle0 = {
  key: "booking0",
  color: "#FF9F00",
  selectedDotColor: "blue",
};
const bookingStatusStyle1 = {
  key: "booking1",
  color: "#FF9F00",
  selectedDotColor: "blue",
};
const bookingStatusStyle2 = {
  key: "booking2",
  color: "#FF9F00",
  selectedDotColor: "blue",
};
const bookingStatusStyle3 = {
  key: "booking3",
  color: "#FF9F00",
  selectedDotColor: "blue",
};
const bookingStatusStyle4 = {
  key: "booking4",
  color: "#FF9F00",
  selectedDotColor: "blue",
};
const bookingStatusStyle5 = {
  key: "booking5",
  color: "#FF9F00",
  selectedDotColor: "blue",
};
const bookingStatusStyle6 = {
  key: "booking6",
  color: "#FF9F00",
  selectedDotColor: "blue",
};
const bookingStatusStyle7 = {
  key: "booking7",
  color: "#FF9F00",
  selectedDotColor: "blue",
};
const bookingStatusStyle8 = {
  key: "booking8",
  color: "#FF9F00",
  selectedDotColor: "blue",
};
const bookingStatusStyle9 = {
  key: "booking9",
  color: "#FF9F00",
  selectedDotColor: "blue",
};
const bookingStatusStyle10 = {
  key: "booking10",
  color: "#FF9F00",
  selectedDotColor: "blue",
};
const vacationStatusStyle = {
  key: "vacation",
  color: "#0000FF",
  selectedDotColor: "blue",
};
const sickStatusStyle = {
  key: "sick",
  color: "#FF0000",
  selectedDotColor: "blue",
};
const schoolStatusStyle = {
  key: "school",
  color: "#20FF20",
  selectedDotColor: "blue",
};
const otherStatusStyle = {
  key: "others",
  color: "#808000",
  selectedDotColor: "blue",
};

const entryStatus = [
  { value: "Ferie", label: "Ferie" },
  { value: "Sygdom", label: "Sygdom" },
  { value: "Skole", label: "Skole" },
  { value: "Andet", label: "Andet" },
];

const today = new Date().toISOString().slice(0, 10);

class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      index: 0,
      routes: [
        { key: "first", title: "Måned" },
        { key: "second", title: "Uge" },
      ],
      baseData: {},
      markedDates: {},
      selectedMarkedDateData: {},
      selectedDate: XDate(true).toString(appDateFormats.yyyyMMdd),
      refresh: 0,
      showStartDate: false,
      showEndDate: false,
      dateFrom: XDate(true).toString(appDateFormats.yyyyMMdd),
      dateEnd: XDate(true).toString(appDateFormats.yyyyMMdd),
      selected1: "Ferie",
    };
  }

  async componentDidMount() {
    await this.getCalendarData(toTimestampWithSeconds(today), today);
  }

  getCalendarData = async (dateParam, dateSelected) => {
    const { navigation } = this.props;
    const userId = await AsyncStorage.getItem("user_id");
    const token = await AsyncStorage.getItem("token");
    const baseUrl = await AsyncStorage.getItem("baseUrl");
    fetch(
      `${baseUrl}/lykkebo/v1/calendar/overview?user_id=${userId}&month=${dateParam}`,
      {
        method: appStrings.api.get.toUpperCase(),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log("data", data);
        if ("code" in data && data.code === "jwt_auth_invalid_token") {
          AsyncStorage.removeItem("token").then(
            AsyncStorage.clear().then(() => {
              navigation.navigate("Auth");
            })
          );
        }
        deviceStorage.saveKey("user_relation", data.user_relation);
        let i;
        const markedDatesTemp = data.days.reduce((acc, crr, idx) => {
          switch (crr.type) {
            case "Booking":
              let temp1 = [];
              for (i = 0; i < crr.details.length; i += 1) {
                switch (i) {
                  case 0:
                    temp1.push(bookingStatusStyle0);
                    break;
                  case 1:
                    temp1.push(bookingStatusStyle1);
                    break;
                  case 2:
                    temp1.push(bookingStatusStyle2);
                    break;
                  case 3:
                    temp1.push(bookingStatusStyle3);
                    break;
                  case 4:
                    temp1.push(bookingStatusStyle4);
                    break;
                  case 5:
                    temp1.push(bookingStatusStyle5);
                    break;
                  case 6:
                    temp1.push(bookingStatusStyle6);
                    break;
                  case 7:
                    temp1.push(bookingStatusStyle7);
                    break;
                  case 8:
                    temp1.push(bookingStatusStyle8);
                    break;
                  case 9:
                    temp1.push(bookingStatusStyle9);
                    break;
                  case 10:
                    temp1.push(bookingStatusStyle10);
                    break;
                  default:
                    temp1.push(bookingStatusStyle0);
                }
              }
              acc[crr.date] =
                dateSelected === crr.date
                  ? {
                      selected: true,
                      selectedColor: "#00ADF5",
                      type: "booking",
                      dots: temp1,
                    }
                  : { type: "booking", dots: temp1 };
              break;
            case "Ferie":
              acc[crr.date] =
                dateSelected === crr.date
                  ? {
                      selected: true,
                      selectedColor: "#00ADF5",
                      type: "vacation",
                      dots: [vacationStatusStyle],
                    }
                  : { type: "vacation", dots: [vacationStatusStyle] };
              break;
            case "Sygdom":
              acc[crr.date] =
                dateSelected === crr.date
                  ? {
                      selected: true,
                      selectedColor: "#00ADF5",
                      type: "sick",
                      dots: [sickStatusStyle],
                    }
                  : { type: "sick", dots: [sickStatusStyle] };
              break;
            case "Skole":
              acc[crr.date] =
                dateSelected === crr.date
                  ? {
                      selected: true,
                      selectedColor: "#00ADF5",
                      type: "school",
                      dots: [schoolStatusStyle],
                    }
                  : { type: "school", dots: [schoolStatusStyle] };
              break;
            case "Andet":
              acc[crr.date] =
                dateSelected === crr.date
                  ? {
                      selected: true,
                      selectedColor: "#00ADF5",
                      type: "other",
                      dots: [otherStatusStyle],
                    }
                  : { type: "other", dots: [otherStatusStyle] };
              break;
            default:
              acc[crr.date] = { type: "booking", dots: [bookingStatusStyle0] };
          }
          if (idx === 0) {
            const tempSelected = data.days.filter(
              (data2) => data2.date === dateSelected
            );
            if (tempSelected.length === 0) {
              acc[dateSelected] = { selected: true, selectedColor: "#00ADF5" };
            }
          }
          return acc;
        }, {});
        this.setState({
          baseData: data.days,
          markedDates: markedDatesTemp,
          loaded: true,
          selectedMarkedDateData: data.days.filter(
            (data2) => data2.date === dateSelected
          ),
        });
      })
      .catch((error) => {
        showMessage({
          message: error.message,
          type: appStrings.common.danger,
        });
      });
  };

  onMonthChange = (month) => {
    const { selectedDate } = this.state;
    this.getCalendarData(
      toTimestampWithSeconds(month.dateString),
      selectedDate
    );
  };

  openBooking(booking) {
    const { navigation } = this.props;
    AsyncStorage.setItem("selectedJobId", booking.id).then(() => {
      navigation.navigate(appStrings.mainStack.jobDetailsScreen);
    });
  }

  renderSelectedDateDetails() {
    const { selectedDate, selectedMarkedDateData, isFutureDate } = this.state;

    const filteredDataBooking = selectedMarkedDateData[0]?.details.filter(
      (data) => data.from === selectedDate || data.to === selectedDate
    );

    const filteredData = selectedMarkedDateData[0]?.details.filter(
      (data) =>
        data.formatted_from === XDate(selectedDate).toString("dd-MM-yyyy")
    );

    // console.log("selectedMarkedDateData", selectedMarkedDateData);
    // console.log("details", selectedMarkedDateData[0]?.details);
    // console.log("filteredDataBooking", filteredDataBooking);
    if (
      selectedMarkedDateData === undefined ||
      selectedMarkedDateData.length === 0
    ) {
      return (
        <View
          key={Math.floor(Date.now()) + Math.floor(Math.random() * 10000 + 1)}
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          <View style={{ flex: 1, padding: 10 }}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View
                style={{
                  flex: 1,
                  borderRightWidth: 2,
                  borderColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 80,
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  {XDate(selectedDate).toString("d")}
                </Text>
              </View>
              <View
                style={{
                  flex: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingLeft: 10,
                }}
              >
                <View
                  style={{ flex: 1, width: "100%", backgroundColor: "white" }}
                >
                  <View
                    style={{
                      width: "100%",
                      borderBottomWidth: 2,
                      borderColor: "#6C6C6C",
                      padding: appNumbers.number_14,
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>
                      Ingen begivenhed fundet
                    </Text>
                  </View>
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <TouchableOpacity
                      style={[
                        styles.mt15,
                        { padding: appNumbers.number_10, flexDirection: "row" },
                      ]}
                      onPress={() => this.setState({ visibleModal: 1 })}
                    >
                      <Ionicons
                        active
                        name="add-circle"
                        style={{ color: "#DD5044" }}
                        size={20}
                      />
                      <Text style={{ marginHorizontal: appNumbers.number_5 }}>
                        Tilføj Begivenhed
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    } else if (selectedMarkedDateData[0].type === "Booking") {
      return (
        <View
          key={Math.floor(Date.now()) + Math.floor(Math.random() * 10000 + 1)}
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          <View style={{ flex: 1, padding: 10 }}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View
                style={{
                  flex: 1,
                  borderRightWidth: 2,
                  borderColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 80,
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  {XDate(selectedDate).toString("d")}
                </Text>
              </View>
              <View
                style={{
                  flex: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingLeft: 10,
                }}
              >
                <View
                  style={{ flex: 1, width: "100%", backgroundColor: "white" }}
                >
                  <View
                    style={{
                      width: "100%",
                      borderBottomWidth: 2,
                      borderColor: "#6C6C6C",
                      padding: appNumbers.number_14,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: appNumbers.number_16,
                      }}
                    >
                      {jsUcfirst(selectedMarkedDateData[0].type)}
                    </Text>
                  </View>
                  <ScrollView style={{ flex: 1 }}>
                    <TouchableOpacity
                      style={[
                        styles.mt15,
                        {
                          alignItems: "center",
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "#FEFEFE",
                          padding: appNumbers.number_10,
                        },
                      ]}
                      onPress={() => this.setState({ visibleModal: 1 })}
                    >
                      <Ionicons
                        active
                        name="add-circle"
                        style={{ color: "#DD5044" }}
                        size={20}
                      />
                      <Text style={{ flex: 1 }}> Tilføj Begivenhed </Text>
                    </TouchableOpacity>
                    {filteredDataBooking &&
                      filteredDataBooking?.map((data) => (
                        <TouchableOpacity
                          key={
                            Math.floor(Date.now()) +
                            Math.floor(Math.random() * 10000 + 1)
                          }
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            padding: appNumbers.number_10,
                          }}
                          onPress={() => {
                            this.openBooking(data);
                            // onPress={() => navigation.navigate('Jobdetails')}
                          }}
                        >
                          <View style={{ flexDirection: "row", flex: 1 }}>
                            <Ionicons
                              name="build"
                              size={appNumbers.number_24}
                              color="#DD5044"
                            />
                            <View style={{ flex: 1 }}>
                              <Text numberOfLines={1}>{data.title}</Text>
                            </View>

                            <View>
                              <Ionicons
                                name="chevron-forward"
                                size={24}
                                color="#ccc"
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View
          key={Math.floor(Date.now()) + Math.floor(Math.random() * 10000 + 1)}
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          <View style={{ flex: 1, padding: 10 }}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View
                style={{
                  flex: 1,
                  borderRightWidth: 2,
                  borderColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 80,
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  {XDate(selectedDate).toString("d")}
                </Text>
              </View>
              <View
                style={{
                  flex: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingLeft: 10,
                }}
              >
                <View
                  style={{ flex: 1, width: "100%", backgroundColor: "white" }}
                >
                  <View
                    style={{
                      width: "100%",
                      flexDirection: appDirection.row,
                      borderBottomWidth: 2,
                      borderColor: "#6C6C6C",
                      padding: appNumbers.number_14,
                      alignItems: appAlignment.center,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: appNumbers.number_16,
                        flex: appNumbers.number_1,
                      }}
                    >
                      {jsUcfirst(selectedMarkedDateData[0].type)}
                    </Text>
                    <View>
                      <TouchableOpacity style={{ marginTop: -4 }}>
                        <Ionicons
                          style={{ color: "#2e3d43" }}
                          size={appNumbers.number_24}
                          onPress={() =>
                            this.setState({ visibleModal: 1, isUpdate: true })
                          }
                          name="md-open"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <ScrollView style={{ flex: 1 }}>
                    <TouchableOpacity
                      style={[
                        styles.mt15,
                        {
                          alignItems: "center",
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "#FEFEFE",
                          padding: appNumbers.number_10,
                        },
                      ]}
                      onPress={() => this.setState({ visibleModal: 1 })}
                    >
                      <Ionicons
                        active
                        name="add-circle"
                        style={{ color: "#DD5044" }}
                        size={20}
                      />
                      <Text style={{ flex: 1 }}> Tilføj Begivenhed </Text>
                    </TouchableOpacity>
                    <View
                      key={
                        Math.floor(Date.now()) +
                        Math.floor(Math.random() * 10000 + 1)
                      }
                      style={{ flex: 1 }}
                    >
                      <View
                        style={{
                          width: "100%",
                          justifyContent: "flex-start",
                          flexDirection: "row",
                          alignItems: appAlignment.center,
                          paddingHorizontal: appNumbers.number_10,
                        }}
                      >
                        <Ionicons
                          name="calendar"
                          size={appNumbers.number_20}
                          style={{ color: "#DD5044" }}
                        />
                        <Text
                          style={{ paddingHorizontal: appNumbers.number_5 }}
                        >
                          {`Fra: ${filteredData[0].formatted_from}`}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: "100%",
                          justifyContent: "flex-start",
                          flexDirection: "row",
                          alignItems: appAlignment.center,
                          paddingHorizontal: appNumbers.number_10,
                        }}
                      >
                        <Ionicons
                          size={appNumbers.number_20}
                          name="calendar"
                          style={{ color: "#DD5044" }}
                        />
                        <Text
                          style={{ paddingHorizontal: appNumbers.number_5 }}
                        >
                          {`Til: ${filteredData[0].formatted_to}`}
                        </Text>
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }
  }

  onDayPress = (day) => {
    this.createMarkedDates(day);
  };

  createMarkedDates = (day) => {
    const { baseData } = this.state;
    let i;
    const markedDatesTemp = baseData.reduce((acc, crr, idx) => {
      switch (crr.type) {
        case "Booking":
          let temp1 = [];
          for (i = 0; i < crr.details.length; i += 1) {
            switch (i) {
              case 0:
                temp1.push(bookingStatusStyle0);
                break;
              case 1:
                temp1.push(bookingStatusStyle1);
                break;
              case 2:
                temp1.push(bookingStatusStyle2);
                break;
              case 3:
                temp1.push(bookingStatusStyle3);
                break;
              case 4:
                temp1.push(bookingStatusStyle4);
                break;
              case 5:
                temp1.push(bookingStatusStyle5);
                break;
              case 6:
                temp1.push(bookingStatusStyle6);
                break;
              case 7:
                temp1.push(bookingStatusStyle7);
                break;
              case 8:
                temp1.push(bookingStatusStyle8);
                break;
              case 9:
                temp1.push(bookingStatusStyle9);
                break;
              case 10:
                temp1.push(bookingStatusStyle10);
                break;
              default:
                temp1.push(bookingStatusStyle0);
            }
          }
          acc[crr.date] =
            day.dateString === crr.date
              ? {
                  selected: true,
                  selectedColor: "#00ADF5",
                  type: "booking",
                  dots: temp1,
                }
              : { type: "booking", dots: temp1 };
          break;
        case "Ferie":
          acc[crr.date] =
            day.dateString === crr.date
              ? {
                  selected: true,
                  selectedColor: "#00ADF5",
                  type: "vacation",
                  dots: [vacationStatusStyle],
                }
              : { type: "vacation", dots: [vacationStatusStyle] };
          break;
        case "Sygdom":
          acc[crr.date] =
            day.dateString === crr.date
              ? {
                  selected: true,
                  selectedColor: "#00ADF5",
                  type: "sick",
                  dots: [sickStatusStyle],
                }
              : { type: "sick", dots: [sickStatusStyle] };
          break;
        case "Skole":
          acc[crr.date] =
            day.dateString === crr.date
              ? {
                  selected: true,
                  selectedColor: "#00ADF5",
                  type: "school",
                  dots: [schoolStatusStyle],
                }
              : { type: "school", dots: [schoolStatusStyle] };
          break;
        case "Andet":
          acc[crr.date] =
            day.dateString === crr.date
              ? {
                  selected: true,
                  selectedColor: "#00ADF5",
                  type: "other",
                  dots: [otherStatusStyle],
                }
              : { type: "other", dots: [otherStatusStyle] };
          break;
        default:
          acc[crr.date] = { type: "booking", dots: [bookingStatusStyle0] };
      }
      if (idx === 0) {
        const tempSelected = baseData.filter(
          (data2) => data2.date === day.dateString
        );
        if (tempSelected.length === 0) {
          acc[day.dateString] = { selected: true, selectedColor: "#00ADF5" };
        }
      }
      return acc;
    }, {});
    this.setState({
      markedDates: markedDatesTemp,
      selectedDate: day.dateString,
      dateFrom: day.dateString,
      dateEnd: day.dateString,
      selectedMarkedDateData: baseData.filter(
        (data2) => data2.date === day.dateString
      ),
    });
  };

  firstRoute = () => {
    const { markedDates } = this.state;
    return (
      <View
        style={[styles.scene, { backgroundColor: appColors.doveGrey, flex: 1 }]}
      >
        <Calendar
          style={{
            borderWidth: 1,
            borderColor: appColors.granite,
            height: 380,
          }}
          rowHasChanged={(r1, r2) => r1.booking_id !== r2.booking_id}
          pastScrollRange={40}
          futureScrollRange={50}
          theme={{
            calendarBackground: appColors.tuna,
            textSectionTitleColor: appColors.solidWhite,
            dayTextColor: appColors.solidWhite,
            todayTextColor: appColors.lavaRed,
            selectedDayTextColor: appColors.solidWhite,
            monthTextColor: appColors.solidWhite,
            selectedDayBackgroundColor: appColors.tuna,
            arrowColor: appColors.solidWhite,
            // textDisabledColor: appColors.lavaRed,
            textMonthFontSize: 26,
            "stylesheet.calendar.header": {
              week: {
                marginTop: 5,
                flexDirection: appDirection.row,
                justifyContent: "space-between",
                borderBottomWidth: 2,
                borderColor: "#D4D4D4",
              },
            },
          }}
          onDayPress={this.onDayPress}
          monthFormat="MMMM yyyy"
          onMonthChange={this.onMonthChange}
          hideArrows={false}
          hideExtraDays
          disableMonthChange={false}
          firstDay={1}
          hideDayNames={false}
          showWeekNumbers={false}
          onPressArrowLeft={(substractMonth) => substractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
          markedDates={markedDates}
          markingType="multi-dot"
        />

        <View
          style={{ width: "100%", height: 3, backgroundColor: "#6C6C6C" }}
        />
        {this.renderSelectedDateDetails()}
      </View>
    );
  };

  secondRoute = () => {
    const { refresh } = this.state;
    const { navigation } = this.props;

    return <TabTwo key={refresh} navigation={navigation} />;
  };

  setIndex = (idx) => {
    this.setState({ index: idx });
  };

  renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={{
          backgroundColor: appColors.solidWhite,
          height: appNumbers.number_5,
        }}
        style={{ backgroundColor: appColors.primary }}
      />
    );
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

  renderModalContent = () => {
    const {
      selectedDate,
      isFutureDate,
      dateFrom,
      dateEnd,
      showStartDate,
      showEndDate,
    } = this.state;

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
                {dateFrom}
              </Text>
            </NormalButton>
            {showStartDate && (
              <DateTimePicker
                value={new Date(dateFrom)}
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
                {dateEnd}
              </Text>
            </NormalButton>
            {showEndDate && (
              <DateTimePicker
                value={new Date(dateEnd)}
                mode={appStrings.common.date}
                onChange={this.setEndDate}
                display={appStrings.common.calendar}
                minimumDate={new Date(dateFrom)}
              />
            )}
          </View>
        </View>
        <View style={{ height: 50, width: "100%", marginTop: 10 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            {/* {!isFutureDate ? (
              <View />
            ) : (
              <View style={{flex: 1, height: 50, paddingRight: 5}}>
                <Button
                  primary
                  full
                  style={styles.mt15}
                  onPress={() => this.saveDayInfoHandler()}>
                  <Text>Save</Text>
                </Button>
              </View>
            )}

            {!isFutureDate ? (
              <View />
            ) : (
              <View style={{flex: 1, height: 50}}>
                <Button
                  danger
                  full
                  style={styles.mt15}
                  onPress={() => this.removeDayInfoHandler()}>
                  <Text>Remove</Text>
                </Button>
              </View>
            )} */}

            <View style={{ flex: 1, height: 50, paddingRight: 5 }}>
              <TouchableOpacity
                style={[styles.mt15, styles.buttonModal]}
                onPress={() => this.saveDayInfoHandler()}
              >
                <Text>{i18n.t("save")}</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, height: 50 }}>
              <TouchableOpacity
                style={[styles.mt15, styles.buttonModal]}
                onPress={() => this.removeDayInfoHandler()}
              >
                <Text>{i18n.t("delete")}</Text>
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

  saveDayInfoHandler() {
    const { dateFrom, dateEnd, selected1, selectedDate, isUpdate } = this.state;

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
            start_day: `${startDay}`,
            end_day: `${endDay}`,
          };

          console.log("postData", postData);
          const axiosConfig = {
            headers: {
              // 'Content-Type': 'application/json;charset=UTF-8',
              // 'Access-Control-Allow-Origin': '*',
              Authorization: `Bearer ${token}`,
            },
          };

          let url = `${baseUrl}/lykkebo/v1/calendar/create`;
          if (isUpdate) {
            url = `${baseUrl}/lykkebo/v1/calendar/update`;
          }

          axios
            .post(url, postData, axiosConfig)
            .then(async () => {
              await this.getCalendarData(
                toTimestampWithSeconds(today),
                selectedDate
              );
              this.setState({
                selected1: "Ferie",
                visibleModal: null,
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
  }

  removeDayInfoHandler() {
    const { selectedMarkedDateData, selectedDate } = this.state;
    AsyncStorage.getItem("user_id").then((userId) => {
      AsyncStorage.getItem("token").then((token) => {
        AsyncStorage.getItem("baseUrl").then((baseUrl) => {
          const postData = {
            // user_id: `${userId}`,
            // day_id: selectedMarkedDateData[0].id,
          };

          const axiosConfig = {
            headers: {
              // 'Content-Type': 'application/json;charset=UTF-8',
              // 'Access-Control-Allow-Origin': '*',
              Authorization: `Bearer ${token}`,
            },
          };

          axios
            .get(
              `${baseUrl}/lykkebo/v1/calendar/delete?user_id=${userId}&day_id=${selectedMarkedDateData[0].id}`,
              postData,
              axiosConfig
            )
            .then(async () => {
              await this.getCalendarData(
                toTimestampWithSeconds(today),
                selectedDate
              );
              this.setState({
                selected1: "Ferie",
                visibleModal: null,
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
  }

  render() {
    const { navigation } = this.props;
    const { loaded, index, visibleModal, showStartDate } = this.state;

    if (!loaded) {
      return (
        <View style={styles.container}>
          <NewHeader title={appSideBar[0].name} navigation={navigation} />
          <NewLoader />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <NewHeader title={appSideBar[0].name} navigation={navigation} />

        <Tab
          value={index}
          onChange={this.setIndex}
          indicatorStyle={{
            backgroundColor: appColors.solidWhite,
            height: 5,
          }}
          containerStyle={{ backgroundColor: appColors.primary }}
          titleStyle={{ color: appColors.solidWhite }}
        >
          <Tab.Item title="Måned" />
          <Tab.Item title="Uge" />
        </Tab>

        <TabView value={index} onChange={this.setIndex}>
          <TabView.Item
            style={{ backgroundColor: appColors.tuna, width: "100%" }}
          >
            {this.firstRoute()}
          </TabView.Item>
          <TabView.Item
            style={{ backgroundColor: appColors.tuna, width: "100%" }}
          >
            {this.secondRoute()}
          </TabView.Item>
        </TabView>

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
  }
}

const mapStateToProps = (state) => ({
  tracker: state.tracker,
});

const mapDispatchToProps = (dispatch) => ({
  // getTracker: (userId, date) => dispatch(getTracker(userId, date)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen);
