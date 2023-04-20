// Main Packages
import React from "react";
import {
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Packages
import XDate from "xdate";
import { connect } from "react-redux";
import Carousel from "react-native-looped-carousel";
import Swipeout from "react-native-swipeout";
import * as Localization from "expo-localization";
import Modal from "react-native-modal";
import DateTimePicker from "react-native-modal-datetime-picker";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Moment from "moment";
import { extendMoment } from "moment-range";
import commonStyles from "../../../utils/commonStyles";

// Actions
import {
  saveDailyNote,
  getTracker,
  deleteNoteTrackerData,
  updateDailyNote,
} from "../../../redux/actions/tracker";

// Localization
import i18n from "i18n-js";
import { da, en } from "../../../services/translations";
i18n.fallbacks = true;
i18n.translations = { da, en };
i18n.locale = Localization.locale;

// Global imports
import CustomHeader from "../../../common/Header";
import CustomLoading from "../../../common/Loading";
// import { Input } from '../../common/Input';
import {
  convertSecondsToTime,
  toTimestampWithSeconds,
} from "../../../services/common";

// Local imports
import styles from "./styles";
import AddDailyNote from "../components/AddDailyNote";
import EditDailyNote from "../components/EditDailyNote";

// Global Declarations
const moment = extendMoment(Moment);
import "moment/locale/es";
import "moment/locale/da";
import NewHeader from "../../../common/NewHeader";
import {
  appAlignment,
  appColors,
  appNumbers,
  appSideBar,
  appStrings,
} from "../../../utils/constants";
moment.locale("es");
moment.locale("da");

const today = new Date().toISOString().slice(0, 10);
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

class TimeTrackerScreen extends React.Component {
  static navigationOptions = { header: null };

  state = {
    selectedDate: new Date(),
    isOpenModal: false,
    userId: 0,
    showAddDailyNoteModal: false,
    showEditDailyNoteModal: false,
    showEditBookingModal: false,
    userRelation: 0,
    selectedDateFormatted: null,
    selectedDateForAPI: null,
    selectedWithouJobTracker: {},
    isOpenNewCalendarModal: false,
    internalOnly: false,
    markedDates: {},
    selectedBooking: [],
  };

  componentDidMount() {
    this._setData();
  }

  _setData = () => {
    const { selectedDate } = this.state;
    AsyncStorage.getItem("user_id").then((userId) => {
      AsyncStorage.getItem("user_relation").then((userRelation) => {
        this.props
          .getTracker(userId, XDate(selectedDate).toISOString().slice(0, 10))
          .then((res) => {
            // console.log('res', res)
            this.setState({
              userId,
              userRelation,
              selectedDateForAPI: res.day,
              selectedDateFormatted: res.formatted,
            });
            this.getCalendarData(toTimestampWithSeconds(today), today);
          });
      });
    });
  };

  renderTimeStatusHandler = (status) => {
    if (Number(status) === 0) {
      return (
        <View
          style={{
            padding: appNumbers.number_10,
            backgroundColor: appColors.solidBlack,
            borderTopLeftRadius: appNumbers.number_8,
            borderBottomLeftRadius: appNumbers.number_8,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>
            ikke indsendt
          </Text>
        </View>
      );
    } else if (Number(status) === 5) {
      return (
        <View
          style={{
            padding: appNumbers.number_10,
            backgroundColor: appColors.solidBlack,
            borderTopLeftRadius: appNumbers.number_8,
            borderBottomLeftRadius: appNumbers.number_8,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>kontaktet</Text>
        </View>
      );
    } else if (Number(status) === 4) {
      return (
        <View
          style={{
            padding: appNumbers.number_10,
            backgroundColor: appColors.solidBlack,
            borderTopLeftRadius: appNumbers.number_8,
            borderBottomLeftRadius: appNumbers.number_8,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>
            igangværende
          </Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            padding: appNumbers.number_10,
            backgroundColor: appColors.solidBlack,
            borderTopLeftRadius: appNumbers.number_8,
            borderBottomLeftRadius: appNumbers.number_8,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>indsendt</Text>
        </View>
      );
    }
  };

  _renderBookings = (data) => (
    <View
      key={data.job_id}
      style={[
        styles.shadow,
        {
          marginBottom: 10,
          borderWidth: 0.5,
          borderColor: "#ccc",
        },
      ]}
    >
      <Swipeout
        right={[
          {
            text: i18n.t("add"),
            backgroundColor: "green",
            onPress: () => {
              this.setState({
                showAddDailyNoteModal: true,
                internalOnly: false,
                selectedBooking: [data],
              });
            },
          },
          {
            text: i18n.t("viewTracker"),
            backgroundColor: "#006AFF",
            onPress: () => {
              // this.setState({
              //   showEditBookingModal: true,
              //   selectedBooking: data,
              // });
              this.props.navigation.navigate(
                appStrings.mainStack.trackerDetailsScreen,
                {
                  selectedDate: this.state.selectedDate,
                  selectedTimeRec: data,
                  userId: this.state.userId,
                  job_id: data.job_id,
                  selectedDateForAPI: this.state.selectedDateForAPI,
                }
              );
            },
          },
        ]}
        autoClose
        backgroundColor={data.total_time > 0 ? "#72B565" : appColors.granite}
      >
        <View style={{ padding: 10 }}>
          <TouchableOpacity
            onPress={() => {
              // this.setState({
              //   showAddDailyNoteModal: true,
              //   internalOnly: false,
              //   selectedBooking: [data],
              // });
              this.openTimeDetails(data);
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ flex: 1, fontWeight: "bold" }}
                >{`BOOKING ${data.job_id}`}</Text>
              </View>
              <Ionicons
                name={appStrings.icon.chevronForward}
                size={appNumbers.number_24}
                color={appColors.primary}
              />
            </View>
          </TouchableOpacity>
          <View style={{}}>
            <View style={[{ justifyContent: "center", borderBottomWidth: 0 }]}>
              <Text style={{ fontSize: 10, color: "white" }}>Customer</Text>
              <Text note numberOfLines={1} style={{ color: "white" }}>
                {data.customer_name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignItems: appAlignment.center,
                borderColor: appColors.primary,
                borderRadius: appNumbers.number_10,
                backgroundColor: appColors.solidWhite,
              }}
            >
              <View style={{ flex: 1 }}>
                {this.renderTimeStatusHandler(data.time_rec_submitted)}
              </View>

              <View style={commonStyles.deadCenter}>
                <Text
                  style={[
                    {
                      fontSize: 17,
                      fontWeight: "bold",
                      color: appColors.solidBlack,
                    },
                  ]}
                >
                  {convertSecondsToTime(data.total_time)}
                </Text>
              </View>
            </View>
          </View>
          {/* <View style={{
              width: '100%', height: 7, backgroundColor: '#D8D8D8', marginBottom: 1,
            }} /> */}
        </View>
      </Swipeout>
    </View>
  );

  _renderDailyNotes = (data) => (
    <Swipeout
      key={data.id}
      right={[
        {
          text: i18n.t("edit"),
          backgroundColor: "#006AFF",
          onPress: () => {
            this.setState({
              showEditDailyNoteModal: true,
              selectedWithouJobTracker: data,
            });
          },
        },
        {
          text: i18n.t("delete"),
          backgroundColor: "red",
          onPress: () => {
            Alert.alert(
              "",
              `${i18n.t("condeleteclient")}?`,
              [
                {
                  text: i18n.t("cancel"),
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: i18n.t("delete"),
                  onPress: async () => {
                    const params = {
                      user_id: this.state.userId.toString(),
                      job_id: "0",
                      is_billable: "0",
                      day: Math.floor(this.state.selectedDate.getTime() / 1000),
                      record_id: data.id,
                    };
                    await this.props.deleteNoteTrackerData(params);
                    await this.props.getTracker(
                      this.state.userId,
                      XDate(this.state.selectedDate).toISOString().slice(0, 10)
                    );
                  },
                },
              ],
              { cancelable: false }
            );
          },
        },
      ]}
      autoClose
      backgroundColor="transparent"
    >
      <TouchableOpacity>
        <View>
          <View style={{ flex: 1 }}>
            <Text style={{ flex: 1, fontWeight: "bold" }}>{`${i18n.t(
              "internalTimeRecording"
            )} ${data.id}`}</Text>
          </View>
          {/* <Col style={{width: 50}}>
              <Icon
                onPress={() => {
                  this.setState({showAddDailyNoteModal: true});
                }}
                name="add"
                style={{fontSize: 17, color: '#BFBEC4', alignSelf: 'flex-end'}} />
            </Col> */}
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.noMarginLeft} avatar>
        <View />
        <View
          style={[
            styles.paddingLeft5,
            { justifyContent: "center", borderBottomWidth: 0 },
          ]}
        >
          <Text
            style={{ fontSize: 10, color: "#BFBEC4" }}
          >{`Time: ${data.start} - ${data.end}`}</Text>
          <Text style={{ fontSize: 10, color: "#BFBEC4" }}>
            {i18n.t("break")}: {data.break}
          </Text>
          <Text note numberOfLines={1}>
            {data.description}
          </Text>
        </View>
        <View
          style={{
            borderBottomWidth: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>{data.total}</Text>
        </View>
      </TouchableOpacity>
      <View
        style={{
          width: "100%",
          height: 7,
          backgroundColor: "#D8D8D8",
          marginBottom: 1,
        }}
      />
    </Swipeout>
  );

  openTimeDetails(details) {
    const { selectedDate, selectedDateFormatted, selectedDateForAPI } =
      this.state;
    const { navigation } = this.props;
    AsyncStorage.setItem(
      "selectedTimeTrackerDetails",
      JSON.stringify(details)
    ).then(() => {
      AsyncStorage.setItem(
        "selectedTimeTrackerDetailsDate",
        JSON.stringify(selectedDate.getTime())
      ).then(() => {
        AsyncStorage.setItem(
          "selectedTimeTrackerDetailsDateForAPI",
          JSON.stringify(selectedDateForAPI)
        ).then(() => {
          AsyncStorage.setItem(
            "selectedJobId",
            JSON.stringify(details.job_id)
          ).then(() => {
            AsyncStorage.setItem("isFromTimeRec", "1").then(() => {
              AsyncStorage.setItem(
                "selectedTimeTrackerDetailsDateFormatted",
                JSON.stringify(selectedDateFormatted)
              ).then(() => {
                navigation.navigate(appStrings.mainStack.trackerDetailsScreen);
              });
            });
          });
        });
      });
    });
  }

  onDayPress = (day) => {
    const { getTracker } = this.props;
    const { userId } = this.state;

    this.setState({
      selectedDate: day.dateString.toString(),
      isOpenNewCalendarModal: false,
    });

    console.log("onDayPress", day.dateString.toString());

    getTracker(userId, day.dateString.toString());
  };

  getCalendarData = async (dateParam, dateSelected) => {
    const { navigation } = this.props;
    const temp1 = [];
    const userId = await AsyncStorage.getItem("user_id");
    const token = await AsyncStorage.getItem("token");
    const baseUrl = await AsyncStorage.getItem("baseUrl");
    fetch(
      `${baseUrl}/lykkebo/v1/calendar/overview?user_id=${userId}&month=${dateParam}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if ("code" in data && data.code === "jwt_auth_invalid_token") {
          AsyncStorage.removeItem("token").then(
            AsyncStorage.clear().then(() => {
              navigation.navigate("Auth");
            })
          );
        }

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
          markedDates: markedDatesTemp,
        });
      })
      .catch((error) => {
        // Toast.show({
        //   text: error.message,
        //   position: "top",
        //   duration: 3000,
        // });
      });
  };

  render() {
    const { navigation, saveDailyNote, getTracker, updateDailyNote } =
      this.props;
    const { isLoading, trackerBookings, trackerDailyNotes } =
      this.props.tracker;

    const {
      selectedDate,
      isOpenModal,
      userId,
      userRelation,
      showAddDailyNoteModal,
      showEditDailyNoteModal,
      showEditBookingModal,
      selectedWithouJobTracker,
      isOpenNewCalendarModal,
      internalOnly,
      markedDates,
      selectedBooking,
    } = this.state;
    // console.log('selectedBooking', selectedBooking)

    return (
      <View>
        <StatusBar hidden />
        <CustomLoading showmodal={isLoading} msg="" />
        <DateTimePicker
          cancelTextIOS={i18n.t("cancel")}
          confirmTextIOS={i18n.t("confirm")}
          isVisible={isOpenModal}
          date={selectedDate}
          onConfirm={(date) => {
            this.setState({
              isOpenModal: false,
              selectedDate: date,
            });
            getTracker(userId, XDate(date).toISOString().slice(0, 10));
          }}
          onCancel={() => {
            this.setState({
              isOpenModal: false,
            });
          }}
        />

        <NewHeader
          title={appSideBar[3].name}
          navigation={navigation}
          rightIcon={
            <TouchableOpacity
              onPress={() => this.setState({ showAddDailyNoteModal: true })}
            >
              <Ionicons
                name="add"
                size={appNumbers.number_26}
                color={appColors.solidWhite}
              />
            </TouchableOpacity>
          }
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderColor: "#ccc",
          }}
        >
          <View style={styles.calendarArrow}>
            <TouchableOpacity
              onPress={() => {
                const tempDate = new Date(selectedDate);
                tempDate.setDate(tempDate.getDate() - 1);
                this.setState({
                  selectedDate: XDate(tempDate).toString("yyyy-MM-dd"),
                  selectedDateForAPI: Math.floor(tempDate.getTime() / 1000),
                });
                getTracker(userId, XDate(tempDate).toISOString().slice(0, 10));
              }}
            >
              <Ionicons
                size={appNumbers.number_24}
                name={appStrings.icon.chevronBack}
                style={{ color: "white" }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.calendarTitle}>
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                this.setState({
                  isOpenNewCalendarModal: true,
                });
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 20, color: "white" }}
              >
                {XDate(selectedDate).toString("dd MMMM yyyy")}
              </Text>
              <AntDesign
                name="calendar"
                size={30}
                color="white"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.calendarArrow}>
            <TouchableOpacity
              onPress={() => {
                const tempDate = new Date(selectedDate);
                tempDate.setDate(tempDate.getDate() + 1);
                this.setState({
                  selectedDate: XDate(tempDate).toString("yyyy-MM-dd"),
                });
                getTracker(userId, XDate(tempDate).toISOString().slice(0, 10));
              }}
            >
              <Ionicons
                size={appNumbers.number_24}
                name={appStrings.icon.chevronForward}
                style={{ color: "white" }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Modal isVisible={isOpenNewCalendarModal}>
          <View
            style={{
              // justifyContent: 'flex-end',
              zIndex: 100,
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "flex-end",
              width: 32,
              height: 32,
              borderTopRightRadius: 3,
              borderTopLeftRadius: 3,
              // borderRadius: 16
              // borderWidth: 1,
              marginRight: 0,
              paddingRight: 0,
            }}
          >
            <TouchableOpacity
              onPress={() => this.setState({ isOpenNewCalendarModal: false })}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{ padding: 5, backgroundColor: "white" }}>
            <Calendar
              style={{
                borderWidth: 1,
                borderColor: "gray",
                height: 380,
              }}
              rowHasChanged={(r1, r2) => r1.booking_id !== r2.booking_id}
              pastScrollRange={40}
              futureScrollRange={50}
              theme={{
                calendarBackground: "#333248",
                textSectionTitleColor: "white",
                dayTextColor: "white",
                todayTextColor: "red",
                selectedDayTextColor: "white",
                monthTextColor: "white",
                selectedDayBackgroundColor: "#333248",
                arrowColor: "white",
                // textDisabledColor: 'red',
                textMonthFontSize: 26,
                "stylesheet.calendar.header": {
                  week: {
                    marginTop: 5,
                    flexDirection: "row",
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
        </Modal>

        <Modal isVisible={showAddDailyNoteModal}>
          <AddDailyNote
            internalOnly={internalOnly}
            bookings={trackerBookings}
            selectedBooking={selectedBooking}
            selectedDate={XDate(selectedDate).toString("yyyy-MM-dd")}
            selectedDateFormatted={XDate(selectedDate).toString("dd MMMM yyyy")}
            userId={userId}
            saveDailyNoteProp={async (data) => {
              this.setState({
                showAddDailyNoteModal: false,
              });
              await saveDailyNote(
                data,
                XDate(selectedDate).toString("yyyy-MM-dd")
              );
              await getTracker(
                userId,
                XDate(selectedDate).toString("yyyy-MM-dd")
              );
            }}
            closeModal={() => this.setState({ showAddDailyNoteModal: false })}
          />
        </Modal>

        <Modal isVisible={showEditDailyNoteModal}>
          <EditDailyNote
            data={selectedWithouJobTracker}
            selectedDate={XDate(selectedDate).toString("yyyy-MM-dd")}
            selectedDateFormatted={XDate(selectedDate).toString("dd MMMM yyyy")}
            userId={userId}
            updateDailyNoteProp={async (data) => {
              this.setState({
                showEditDailyNoteModal: false,
              });
              await updateDailyNote(data);
              await getTracker(
                userId,
                XDate(selectedDate).toISOString().slice(0, 10)
              );
            }}
            closeModal={() => this.setState({ showEditDailyNoteModal: false })}
          />
        </Modal>

        {/*
        {userRelation <= 2 ? (
          <Content>
            <ScrollView>
              <View style={styles.contentContainer}>
                {trackerBookings.length > 0 ? trackerBookings.map(this._renderBookings) : (
                  <Button full transparent>
                    <Text style={{color: 'red'}}>{i18n.t('nobookings')}</Text>
                  </Button>)
                }
              </View>
              <View style={styles.addInternalTimeContainer}>
                {trackerDailyNotes.length > 0 ? trackerDailyNotes.map(this._renderDailyNotes) : (
                  <Button full transparent>
                    <Text style={{color: 'red'}}>{i18n.t('noNotesForThisDate')}</Text>
                  </Button>)
                }
              </View>
              <View style={styles.addButtonInternalTimeContainer}>
                <Button
                  full
                  success
                  onPress={() => {
                    this.setState({showAddDailyNoteModal: true});
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>{i18n.t('addInternalTimeRecordingButtonLabel')}</Text>
                </Button>
              </View>
            </ScrollView>
          </Content>
        ) : (
          <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text>Sorry, no data found...</Text>
            </View>
          </View>
        )}
        */}

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.contentContainer}>
            {trackerBookings.length > 0 ? (
              trackerBookings.map(this._renderBookings)
            ) : (
              <TouchableOpacity>
                <Text style={{ color: "red", textAlign: appAlignment.center }}>
                  {i18n.t("nobookings")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.addInternalTimeContainer}>
            {trackerDailyNotes.length > 0 ? (
              trackerDailyNotes.map(this._renderDailyNotes)
            ) : (
              <TouchableOpacity>
                <Text style={{ color: "red", textAlign: appAlignment.center }}>
                  {i18n.t("noNotesForThisDate")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.addButtonInternalTimeContainer}>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  showAddDailyNoteModal: true,
                  internalOnly: true,
                  selectedBooking: [],
                });
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: appAlignment.center,
                }}
              >
                {i18n.t("addInternalTimeRecordingButtonLabel")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  tracker: state.tracker,
  // loaded: state.tracker.loaded,
  // bookings: state.tracker.bookings,
  // isLoading: state.tracker.isLoading,
  // gettingTracker: state.tracker.gettingTracker,
});

const mapDispatchToProps = (dispatch) => ({
  getTracker: (userId, date) => dispatch(getTracker(userId, date)),
  saveDailyNote: (data, date) => dispatch(saveDailyNote(data, date)),
  deleteNoteTrackerData: (data) => dispatch(deleteNoteTrackerData(data)),
  updateDailyNote: (data) => dispatch(updateDailyNote(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimeTrackerScreen);
