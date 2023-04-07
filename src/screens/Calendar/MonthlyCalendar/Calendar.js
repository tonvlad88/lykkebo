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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import XDate from "xdate";
import Modal from "react-native-modal";
import { Calendar, LocaleConfig } from "react-native-calendars";
import axios from "axios";
import { Dropdown } from "react-native-material-dropdown-v2-fixed";
import { connect } from "react-redux";
import moment from "moment";
import { showMessage } from "react-native-flash-message";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";

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
  appColors,
  appDateFormats,
  appDirection,
  appNumbers,
  appSideBar,
  appStrings,
} from "../../../utils/constants";
import NewLoader from "../../../common/NewLoader";

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
      markedDates: {},
      selectedMarkedDateData: {},
      selectedDate: XDate(true).toString(appDateFormats.yyyyMMdd),
      refresh: 0,
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
        console.log("data", data);
        // if ("code" in data && data.code === "jwt_auth_invalid_token") {
        //   AsyncStorage.removeItem("token").then(
        //     AsyncStorage.clear().then(() => {
        //       navigation.navigate("Auth");
        //     })
        //   );
        // }
        // deviceStorage.saveKey("user_relation", data.user_relation);
        // let i;
        // const markedDatesTemp = data.days.reduce((acc, crr, idx) => {
        //   switch (crr.type) {
        //     case "Booking":
        //       let temp1 = [];
        //       for (i = 0; i < crr.details.length; i += 1) {
        //         switch (i) {
        //           case 0:
        //             temp1.push(bookingStatusStyle0);
        //             break;
        //           case 1:
        //             temp1.push(bookingStatusStyle1);
        //             break;
        //           case 2:
        //             temp1.push(bookingStatusStyle2);
        //             break;
        //           case 3:
        //             temp1.push(bookingStatusStyle3);
        //             break;
        //           case 4:
        //             temp1.push(bookingStatusStyle4);
        //             break;
        //           case 5:
        //             temp1.push(bookingStatusStyle5);
        //             break;
        //           case 6:
        //             temp1.push(bookingStatusStyle6);
        //             break;
        //           case 7:
        //             temp1.push(bookingStatusStyle7);
        //             break;
        //           case 8:
        //             temp1.push(bookingStatusStyle8);
        //             break;
        //           case 9:
        //             temp1.push(bookingStatusStyle9);
        //             break;
        //           case 10:
        //             temp1.push(bookingStatusStyle10);
        //             break;
        //           default:
        //             temp1.push(bookingStatusStyle0);
        //         }
        //       }
        //       acc[crr.date] =
        //         dateSelected === crr.date
        //           ? {
        //               selected: true,
        //               selectedColor: "#00ADF5",
        //               type: "booking",
        //               dots: temp1,
        //             }
        //           : { type: "booking", dots: temp1 };
        //       break;
        //     case "Ferie":
        //       acc[crr.date] =
        //         dateSelected === crr.date
        //           ? {
        //               selected: true,
        //               selectedColor: "#00ADF5",
        //               type: "vacation",
        //               dots: [vacationStatusStyle],
        //             }
        //           : { type: "vacation", dots: [vacationStatusStyle] };
        //       break;
        //     case "Sygdom":
        //       acc[crr.date] =
        //         dateSelected === crr.date
        //           ? {
        //               selected: true,
        //               selectedColor: "#00ADF5",
        //               type: "sick",
        //               dots: [sickStatusStyle],
        //             }
        //           : { type: "sick", dots: [sickStatusStyle] };
        //       break;
        //     case "Skole":
        //       acc[crr.date] =
        //         dateSelected === crr.date
        //           ? {
        //               selected: true,
        //               selectedColor: "#00ADF5",
        //               type: "school",
        //               dots: [schoolStatusStyle],
        //             }
        //           : { type: "school", dots: [schoolStatusStyle] };
        //       break;
        //     case "Andet":
        //       acc[crr.date] =
        //         dateSelected === crr.date
        //           ? {
        //               selected: true,
        //               selectedColor: "#00ADF5",
        //               type: "other",
        //               dots: [otherStatusStyle],
        //             }
        //           : { type: "other", dots: [otherStatusStyle] };
        //       break;
        //     default:
        //       acc[crr.date] = { type: "booking", dots: [bookingStatusStyle0] };
        //   }
        //   if (idx === 0) {
        //     const tempSelected = data.days.filter(
        //       (data2) => data2.date === dateSelected
        //     );
        //     if (tempSelected.length === 0) {
        //       acc[dateSelected] = { selected: true, selectedColor: "#00ADF5" };
        //     }
        //   }
        //   return acc;
        // }, {});
        this.setState({
          // baseData: data.days,
          // markedDates: markedDatesTemp,
          loaded: true,
          // selectedMarkedDateData: data.days.filter(
          //   (data2) => data2.date === dateSelected
          // ),
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

  render() {
    const { navigation } = this.props;
    const { loaded } = this.state;

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
        <TabView
          navigationState={this.state}
          renderScene={SceneMap({
            first: this.firstRoute,
            second: this.secondRoute,
          })}
          onIndexChange={this.setIndex}
          initialLayout={{
            width: Dimensions.get(appStrings.common.window).width,
          }}
          style={styles.container}
          renderTabBar={this.renderTabBar}
        />
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
