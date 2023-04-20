import React, { Fragment } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Badge, Button } from "react-native-elements";

import { Constants } from "expo";
import DatePicker from "react-native-datepicker";
import axios from "axios";
import XDate from "xdate";
import Swipeout from "react-native-swipeout";

// or any pure javascript modules available in npm
import { Appbar, Colors, FAB } from "react-native-paper";
// import Icon from 'react-native-vector-icons/Ionicons';

import { convertSecondsToTime, toTimestamp } from "../../services/common";
import Stopwatch from "./stopwatch";
import styles from "./styles";
import {
  appAlignment,
  appColors,
  appDirection,
  appNumbers,
  appSideBar,
  appStrings,
} from "../../utils/constants";
import NewHeader from "../../common/NewHeader";
import NewSinglePageHeader from "../../common/NewSinglePageHeader";
import NewLoader from "../../common/NewLoader";
import commonStyles from "../../utils/commonStyles";

const cutout = require("../../../assets/cutout.png");

const convertTimeToSeconds = (time) => {
  const h = time.split(":");
  return Number(h[0]) * 3600 + Number(h[1]) * 60 + Number(h[2]);
};

const convetSecondsToTime = (sec) => {
  const date = new Date(null);
  date.setSeconds(sec); // specify value for SECONDS here
  return date.toISOString().substr(11, 8);
};

function convertTimestamp(timestamp, $format = "fullDate") {
  let d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
    yyyy = d.getFullYear(),
    mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
    dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
    hh = d.getHours(),
    h = hh,
    min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
    ampm = "AM",
    time;

  if (hh > 12) {
    h = hh - 12;
    ampm = "PM";
  } else if (hh === 12) {
    h = 12;
    ampm = "PM";
  } else if (hh === 0) {
    h = 12;
  }

  if ($format === "date") {
    time = `${yyyy}-${mm}-${dd}`;
  } else if ($format === "time") {
    time = `${h}:${min} ${ampm}`;
  } else if ($format === "militarytime") {
    time = `${hh}:${min}`;
  } else {
    time = `${yyyy}-${mm}-${dd}, ${h}:${min} ${ampm}`;
  }

  return time;
}

export interface Props {
  navigation: any;
}
export interface State {}

export default class TimeTrackerDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      stopwatchStart: false,
      stopwatchReset: false,
      dateTimeStart: "",
      totalWorkedHours: 0,
      jobDescriptionPlaceholder: "Please input note here...",
      jobDescription: "",
      inProgress: false,
      modalVisible: false,
      selectedDate: null,
      selectedDateForAPI: null,
      selectedDateFormatted: null,
      apiInProgress: false,
      showEditForm: false,
      currentTimeEntryID: null,
      currentTimeEntryNote: null,
      currentTimeEntryStartTime: null,
      currentTimeEntryEndTime: null,
    };
    // this.toggleTimer = this.toggleTimer.bind(this);
    // this.resetTimer = this.resetTimer.bind(this);
    // this.toggleStopwatch = this.toggleStopwatch.bind(this);
    // this.resetStopwatch = this.resetStopwatch.bind(this);
    this.workedHours = 0;
    this.currentTrackerUid = 0;
  }

  componentDidMount() {
    AsyncStorage.getItem("selectedTimeTrackerDetails").then(
      (selectedTimeTrackerDetails) => {
        AsyncStorage.getItem("selectedTimeTrackerDetailsDate").then(
          (selectedTimeTrackerDetailsDate) => {
            AsyncStorage.getItem("selectedTimeTrackerDetailsDateForAPI").then(
              (selectedTimeTrackerDetailsDateForAPI) => {
                AsyncStorage.getItem(
                  "selectedTimeTrackerDetailsDateFormatted"
                ).then((selectedTimeTrackerDetailsDateFormatted) => {
                  const data = JSON.parse(selectedTimeTrackerDetails);
                  console.log("data", data);
                  if (
                    data.time_entry_details.length > 0 &&
                    data.time_entry_details[data.time_entry_details.length - 1]
                      .status === "0"
                  ) {
                    this.setState({
                      dateTimeStart:
                        data.time_entry_details[
                          data.time_entry_details.length - 1
                        ].start,
                      inProgress: true,
                      stopwatchStart: true,
                      jobDescription:
                        data.time_entry_details[
                          data.time_entry_details.length - 1
                        ].description,
                    });
                    this.currentTrackerUid =
                      data.time_entry_details[
                        data.time_entry_details.length - 1
                      ].id;
                  }

                  this.setState({
                    data,
                    totalWorkedHours: Number(data.total_time),
                    selectedDate: selectedTimeTrackerDetailsDate,
                    selectedDateForAPI: selectedTimeTrackerDetailsDateForAPI,
                    selectedDateFormatted: new XDate(
                      selectedTimeTrackerDetailsDateForAPI * 1000
                    ).toString("yyyy-MM-dd"),
                    loaded: true,
                  });
                  // console.log('this.state AFTER', this.state)
                });
              }
            );
          }
        );
      }
    );
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  toggleStopwatch = () => {
    // START STOPWATCH
    const {
      stopwatchStart,
      data,
      jobDescription,
      totalWorkedHours,
      dateTimeStart,
      selectedDate,
      selectedDateForAPI,
      selectedDateFormatted,
    } = this.state;

    if (!stopwatchStart) {
      const date = new Date();
      const timestamp = date.getTime() / 1000;

      this.setState({
        stopwatchStart: true,
        stopwatchReset: false,
        apiInProgress: true,
      });

      AsyncStorage.getItem("user_id").then((userId) => {
        AsyncStorage.getItem("token").then((token) => {
          AsyncStorage.getItem("baseUrl").then((baseUrl) => {
            const [y, m, d] = new XDate(selectedDateForAPI * 1000)
              .toString("yyyy-MM-dd")
              .split("-");
            const [h, mi, s] = new XDate(timestamp * 1000)
              .toString("HH:mm:ss")
              .split(":");
            const newStartDate =
              new Date(y, m - 1, d, h, mi, s).getTime() / 1000;

            const postData = {
              user_id: userId,
              job_id: Number(data.job_id),
              day: new XDate(newStartDate * 1000).toString("yyyy-MM-dd"),
              start: new XDate(newStartDate * 1000).toString(
                "yyyy-MM-dd HH:mm:ss"
              ),
              status: 0,
              note: jobDescription,
            };

            // console.log('postData START', postData);

            this.setState({
              dateTimeStart: newStartDate,
            });

            const axiosConfig = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };

            return;

            axios
              .post(
                `${baseUrl}/lykkebo/v1/timerec/startTime`,
                postData,
                axiosConfig
              )
              .then((res) => {
                this.currentTrackerUid = res.data;
                // console.log(`${baseUrl}/lykkebo/v1/timerec/overview?user_id=${userId}&day=${selectedDateFormatted.replace(/"/gi, '')}`)
                fetch(
                  `${baseUrl}/lykkebo/v1/timerec/overview?user_id=${userId}&day=${selectedDateFormatted.replace(
                    /"/gi,
                    ""
                  )}`,
                  {
                    method: "GET",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                )
                  .then((response) => response.json())
                  .then((responseJson) => {
                    const tempData = responseJson.data.filter(
                      (data2) => data2.job_id === data.job_id
                    );
                    this.setState({
                      data: tempData[0],
                      apiInProgress: false,
                    });
                  })
                  .catch((error) => {
                    // Toast.show({
                    //   text: error.message,
                    //   position: "top",
                    //   duration: 5000,
                    // });
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
    } else {
      // STOP STOPWATCH
      const tempTotal = totalWorkedHours + this.workedHours;
      const date = new Date();
      const timestamp = date.getTime() / 1000;

      const [y, m, d] = new XDate(selectedDateForAPI * 1000)
        .toString("yyyy-MM-dd")
        .split("-");
      const [h, mi, s] = new XDate(timestamp * 1000)
        .toString("HH:mm:ss")
        .split(":");
      const newEndDate = new Date(y, m - 1, d, h, mi, s).getTime() / 1000;

      data.time_entry_details.push({
        id: this.currentTrackerUid,
        description: jobDescription,
        start: dateTimeStart,
        end: newEndDate,
        // total: this.workedHours,
        total: 1000,
        status: 1,
      });

      this.setState({
        stopwatchStart: false,
        stopwatchReset: true,
        jobDescription: "",
        inProgress: false,
        apiInProgress: true,
        totalWorkedHours: tempTotal,
      });

      AsyncStorage.getItem("user_id").then((userId) => {
        AsyncStorage.getItem("token").then((token) => {
          AsyncStorage.getItem("baseUrl").then((baseUrl) => {
            const postData = {
              user_id: userId,
              job_id: Number(data.job_id),
              // end_date_time: newEndDate,
              end_date_time: new XDate(newEndDate * 1000).toString(
                "yyyy-MM-dd HH:mm:ss"
              ),
              total_time:
                data.time_entry_details[data.time_entry_details.length - 1]
                  .total,
              status: 1,
              id: this.currentTrackerUid,
              note: jobDescription,
              day: new XDate(newEndDate * 1000).toString("yyyy-MM-dd"),
            };

            console.log("postData STOP", postData);

            const axiosConfig = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };

            // return;

            axios
              .post(
                `${baseUrl}/lykkebo/v1/timerec/stopTime`,
                postData,
                axiosConfig
              )
              .then(() => {
                // console.log(`${baseUrl}/lykkebo/v1/timerec/overview?user_id=${userId}&day=${selectedDateFormatted.replace(/"/gi, '')}`)
                fetch(
                  `${baseUrl}/lykkebo/v1/timerec/overview?user_id=${userId}&day=${selectedDateFormatted.replace(
                    /"/gi,
                    ""
                  )}`,
                  {
                    method: "GET",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                )
                  .then((response) => response.json())
                  .then((responseJson) => {
                    const tempData = responseJson.data.filter(
                      (data2) => data2.job_id === data.job_id
                    );
                    // console.log('tempData', tempData)
                    this.setState({
                      data: tempData[0],
                      apiInProgress: false,
                    });
                  })
                  .catch((error) => {
                    Toast.show({
                      text: error.message,
                      position: "top",
                      duration: 5000,
                    });
                  });
              })
              .catch((error) => {
                Toast.show({
                  text: error.message,
                  position: "top",
                  duration: 5000,
                });
              });
          });
        });
      });
    }
  };

  renderTimeStatusHandler = (status) => {
    if (Number(status) === 100) {
      return (
        <View>
          <Badge warning style={{ alignSelf: "flex-end" }}>
            <Text style={{ color: "white", textAlign: "center" }}>
              ikke angivet
            </Text>
          </Badge>
        </View>
      );
    } else if (Number(status) === 0) {
      return (
        <View style={{ alignItems: "flex-end" }}>
          <Badge warning style={{ alignSelf: "flex-end" }}>
            <Text style={{ color: "white", textAlign: "center" }}>
              Verserende
            </Text>
          </Badge>
        </View>
      );
    } else if (Number(status) === 1) {
      return (
        <View style={{ alignItems: "flex-end" }}>
          <Badge success style={{ alignSelf: "flex-end" }}>
            <Text style={{ color: "white", textAlign: "center" }}>
              godkendt
            </Text>
          </Badge>
        </View>
      );
    } else {
      return (
        <View style={{ alignItems: "flex-end" }}>
          <Badge danger style={{ alignSelf: "flex-end" }}>
            <Text style={{ color: "white", textAlign: "center" }}>afvist</Text>
          </Badge>
        </View>
      );
    }
  };

  // timeEntryDelete = (timeId) => {
  //
  //
  //   // return (
  //   //   Alert.alert(
  //   //     'Er du sikker på, at du vil fortsætte?',
  //   //     '',
  //   //     [
  //   //       {
  //   //         text: 'Ingen',
  //   //         onPress: () => console.log('Cancel Pressed'),
  //   //         style: 'cancel',
  //   //       },
  //   //       {
  //   //         text: 'Ja',
  //   //         onPress: () => {
  //   //           data.time_entry_details =
  //   //             data.time_entry_details.filter(data2 => data2.id === timeId);
  //   //         }
  //   //       },
  //   //     ],
  //   //     {cancelable: false},
  //   //   )
  //   // )
  // }

  timeSubmitHandler = () => {
    const { selectedDateForAPI, data, stopwatchStart } = this.state;
    const { navigation } = this.props;

    if (stopwatchStart) {
      return Alert.alert(
        "Tiden kører stadig!",
        "",
        [
          {
            text: "Ja",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }

    return Alert.alert(
      "Er jobbet færdigt for denne dato?",
      "",
      [
        {
          text: "Nej",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Ja",
          onPress: () => {
            AsyncStorage.getItem("user_id").then((userId) => {
              AsyncStorage.getItem("token").then((token) => {
                AsyncStorage.getItem("baseUrl").then((baseUrl) => {
                  const postData = {
                    user_id: Number(userId),
                    job: Number(data.job_id),
                    day: Number(selectedDateForAPI),
                  };
                  // console.log('postData', postData)
                  const axiosConfig = {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  };

                  axios
                    .post(
                      `${baseUrl}/lykkebo/v1/timerec/submit`,
                      postData,
                      axiosConfig
                    )
                    .then((res) => {
                      // console.log('res', res.data)
                      navigation.navigate("TimeTracker");
                    })
                    .catch((error) => {
                      Toast.show({
                        text: error.message,
                        position: "top",
                        duration: 5000,
                      });
                    });
                });
              });
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  setStartDateHandler = (date) => {
    const { selectedDateForAPI } = this.state;
    const [y, m, d] = new XDate(selectedDateForAPI * 1000)
      .toString("yyyy-MM-dd")
      .split("-");
    const tempDate = date.split(" ");
    const [hS, miS] = tempDate[1].split(":");
    const sS = "00";
    this.setState({
      currentTimeEntryStartTime:
        new Date(y, m - 1, d, hS, miS, sS).getTime() / 1000,
    });
  };

  setEndDateHandler = (date) => {
    const { selectedDateForAPI } = this.state;
    const [y, m, d] = new XDate(selectedDateForAPI * 1000)
      .toString("yyyy-MM-dd")
      .split("-");
    const tempDate = date.split(" ");
    const [hE, miE] = tempDate[1].split(":");
    const sE = "00";
    this.setState({
      currentTimeEntryEndTime:
        new Date(y, m - 1, d, hE, miE, sE).getTime() / 1000,
    });
  };

  updateTimeEntryHandler = () => {
    const {
      data,
      selectedDateForAPI,
      currentTimeEntryNote,
      currentTimeEntryStartTime,
      currentTimeEntryEndTime,
      currentTimeEntryID,
      selectedDateFormatted,
      totalWorkedHours,
    } = this.state;

    if (currentTimeEntryEndTime < currentTimeEntryStartTime) {
      alert("Ugyldigt datovalg. Prøv igen.");
      return;
    }

    AsyncStorage.getItem("user_id").then((userId) => {
      AsyncStorage.getItem("token").then((token) => {
        AsyncStorage.getItem("baseUrl").then((baseUrl) => {
          const tempTotal =
            totalWorkedHours +
            Math.floor(
              (currentTimeEntryEndTime - currentTimeEntryStartTime) / 60
            );
          // const postData = {
          //   user_id: userId,
          //   job_id: Number(data.job_id),
          //   day: selectedDateForAPI,
          //   // total: Math.floor((currentTimeEntryEndTime - currentTimeEntryStartTime) / 60),
          //   total: Math.floor(currentTimeEntryEndTime - currentTimeEntryStartTime),
          //   record_id: currentTimeEntryID,
          //   note: currentTimeEntryNote,
          //   start: currentTimeEntryStartTime,
          //   end: currentTimeEntryEndTime,
          // };

          const [y, m, d] = new XDate(selectedDateForAPI * 1000)
            .toString("yyyy-MM-dd")
            .split("-");
          const [hS, miS, sS] = new XDate(currentTimeEntryStartTime * 1000)
            .toString("HH:mm:ss")
            .split(":");
          const [hE, miE, sE] = new XDate(currentTimeEntryEndTime * 1000)
            .toString("HH:mm:ss")
            .split(":");
          const newStartDate =
            new Date(y, m - 1, d, hS, miS, sS).getTime() / 1000;
          const newEndDate =
            new Date(y, m - 1, d, hE, miE, sE).getTime() / 1000;

          const postData = {
            user_id: userId,
            job_id: Number(data.job_id),
            day: XDate(selectedDateForAPI * 1000).toString("yyyy-MM-dd"),
            // total: Math.floor((currentTimeEntryEndTime - currentTimeEntryStartTime) / 60),
            total: Math.floor(
              currentTimeEntryEndTime - currentTimeEntryStartTime
            ),
            record_id: currentTimeEntryID,
            note: currentTimeEntryNote,
            start: XDate(newStartDate * 1000).toString("yyyy-MM-dd HH:mm:00"),
            end: XDate(newEndDate * 1000).toString("yyyy-MM-dd HH:mm:00"),
          };

          // console.log('postData EDIT', postData)

          const axiosConfig = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          axios
            .post(`${baseUrl}/lykkebo/v1/timerec/update`, postData, axiosConfig)
            .then((res) => {
              this.currentTrackerUid = res.data;
              fetch(
                `${baseUrl}/lykkebo/v1/timerec/overview?user_id=${userId}&day=${selectedDateFormatted.replace(
                  /"/gi,
                  ""
                )}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
                .then((response) => response.json())
                .then((responseJson) => {
                  const tempData = responseJson.data.filter(
                    (data3) => data3.job_id === data.job_id
                  );
                  this.setState({
                    data: tempData[0],
                    showEditForm: false,
                    totalWorkedHours: tempData[0].total_time,
                  });
                })
                .catch((error) => {
                  Toast.show({
                    text: error.message,
                    position: "top",
                    duration: 5000,
                  });
                });
            })
            .catch((error) => {
              Toast.show({
                text: error.message,
                position: "top",
                duration: 5000,
              });
            });
        });
      });
    });
  };

  openBooking = () => {
    const { data } = this.state;
    const { navigation } = this.props;
    AsyncStorage.setItem("selectedJobId", JSON.stringify(data.job_id)).then(
      () => {
        AsyncStorage.setItem("isFromTimeRec", "1").then(() => {
          navigation.navigate("Jobdetails");
        });
      }
    );
  };

  render() {
    const { totalWorkedHours, data, loaded, selectedDate, apiInProgress } =
      this.state;
    // console.log('data', data)

    const { navigation } = this.props;

    const options = {
      container: {
        backgroundColor: "#2E3D43",
        height: 70,
        width: "100%",
      },
      text: {
        fontSize: 65,
        paddingBottom: 0,
        color: "red",
        fontWeight: "bold",
        textAlign: "center",
      },
    };

    if (loaded) {
      const {
        stopwatchStart,
        stopwatchReset,
        dateTimeStart,
        inProgress,
        jobDescriptionPlaceholder,
        jobDescription,
        modalVisible,
        selectedDateFormatted,
        currentTimeEntryNote,
        currentTimeEntryStartTime,
        currentTimeEntryEndTime,
        showEditForm,
      } = this.state;
      // console.log('data RENDER', data)
      return (
        <ScrollView
          conta
          contentContainerStyle={{ flexGrow: appNumbers.number_1 }}
          style={{ flex: appNumbers.number_1 }}
        >
          <NewSinglePageHeader
            title={new XDate(Number(selectedDate)).toString("dd MMMM, yyyy")}
            hasLeftIcon={true}
            leftIconName={appStrings.icon.chevronBack}
            leftIconPress={() => navigation.goBack()}
            hasRightIcon={true}
            rightIconName={appStrings.icon.camera}
            rightIconPress={() =>
              navigation.navigate(appStrings.mainStack.uploadImageScreen)
            }
          />
          <TouchableOpacity
            style={{
              backgroundColor: "#243135",
              borderBottomWidth: 0.5,
              borderColor: "#ccc",
              padding: appNumbers.number_10,
              borderTopWidth: appNumbers.number_2,
              borderBottomWidth: appNumbers.number_2,
            }}
            onPress={() => {}}
          >
            <Text
              style={{
                color: "#ffffff",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >{`BOOKING ${data.job_id} - ${data.customer_name}`}</Text>
          </TouchableOpacity>

          <View style={{ flex: appNumbers.number_1 }}>
            <View style={{ width: "100%" }}>
              <Stopwatch
                laps={false}
                // msecs
                start={stopwatchStart}
                reset={stopwatchReset}
                options={options}
                startTime={dateTimeStart}
                inProgress={inProgress}
                getTime={(time) => {
                  this.workedHours = convertTimeToSeconds(time);
                }}
              />
              <View
                style={{
                  backgroundColor: "#2E3D43",
                  paddingBottom: appNumbers.number_10,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    color: "#9DABF1",
                  }}
                >
                  Hours
                  {"                  "}
                  Minutes
                  {"                "}
                  Seconds
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#243135",
                }}
              />
            </View>
            {showEditForm ? (
              <View />
            ) : (
              <View>
                <TouchableOpacity
                  style={{
                    backgroundColor: stopwatchStart
                      ? appColors.lavaRed
                      : appColors.darkPastelGreen,
                    padding: appNumbers.number_14,
                  }}
                  onPress={this.toggleStopwatch}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      textAlign: appAlignment.center,
                    }}
                  >
                    {stopwatchStart ? "STOP" : "START"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={{ flex: appNumbers.number_1 }}>
              {showEditForm ? (
                <Fragment>
                  <View>
                    <View>
                      <Text>Note</Text>
                      <TextInput
                        onChangeText={(text) => {
                          this.setState({
                            currentTimeEntryNote: text,
                          });
                        }}
                        value={currentTimeEntryNote}
                        placeholder={jobDescriptionPlaceholder}
                      />
                    </View>
                    <View>
                      <Text>Time Start</Text>
                      {/* <DatePicker
                            style={{
                              width: "100%",
                              marginTop: 10,
                              marginBottom: 10,
                            }}
                            date={new Date(currentTimeEntryStartTime * 1000)}
                            mode="time"
                            placeholder="select start date time"
                            format="YYYY-MM-DD HH:mm"
                            confirmBtnText="Update"
                            cancelBtnText="Cancel"
                            customStyles={{
                              dateIcon: {
                                position: "absolute",
                                right: 0,
                                top: 4,
                                marginRight: 0,
                              },
                              dateInput: {
                                marginRight: 36,
                              },
                            }}
                            onDateChange={this.setStartDateHandler}
                          /> */}
                    </View>
                    <View>
                      <Text>Time End</Text>
                      {/* <DatePicker
                            style={{
                              width: "100%",
                              marginTop: 10,
                              marginBottom: 10,
                            }}
                            date={new Date(currentTimeEntryEndTime * 1000)}
                            mode="time"
                            placeholder="select end date time"
                            format="YYYY-MM-DD HH:mm"
                            confirmBtnText="Update"
                            cancelBtnText="Cancel"
                            customStyles={{
                              dateIcon: {
                                position: "absolute",
                                right: 0,
                                top: 4,
                                marginRight: 0,
                              },
                              dateInput: {
                                marginRight: 36,
                              },
                            }}
                            onDateChange={this.setEndDateHandler}
                          /> */}
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={this.updateTimeEntryHandler}
                    style={{
                      marginBottom: 5,
                      marginTop: 5,
                    }}
                  >
                    <Text style={{ color: "white" }}>opdatering</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.setState({ showEditForm: false })}
                  >
                    <Text>afbestille</Text>
                  </TouchableOpacity>
                </Fragment>
              ) : (
                data.time_entry_details.map((data2) => {
                  console.log("data2", data2);
                  if (data2.status === "0") {
                    return (
                      <Swipeout
                        key={data2.id}
                        autoClose
                        backgroundColor="transparent"
                      >
                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <View style={{ flex: 1, height: 30 }}>
                            <TextInput
                              onChangeText={(text) => {
                                this.setState({
                                  jobDescription: text,
                                });
                              }}
                              value={jobDescription}
                              placeholder={jobDescriptionPlaceholder}
                            />
                          </View>
                          <View style={{ width: 90, height: 30 }}>
                            <Text style={{ color: "red" }}>Igangværende</Text>
                          </View>
                        </View>
                      </Swipeout>
                    );
                  }
                  return (
                    <Swipeout
                      key={data2.id}
                      right={[
                        {
                          text: "Edit",
                          backgroundColor: "blue",
                          // underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                          onPress: () => {
                            this.setState({
                              currentTimeEntryID: data2.id,
                              currentTimeEntryNote: data2.description,
                              currentTimeEntryStartTime: data2.start,
                              currentTimeEntryEndTime: data2.end,
                              showEditForm: true,
                            });
                          },
                        },
                        {
                          text: "Delete",
                          backgroundColor: "red",
                          onPress: () => {
                            AsyncStorage.getItem("user_id").then((userId) => {
                              AsyncStorage.getItem("token").then((token) => {
                                AsyncStorage.getItem("baseUrl").then(
                                  (baseUrl) => {
                                    const postData = {
                                      user_id: userId,
                                      record_id: Number(data2.id),
                                    };

                                    const axiosConfig = {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                      },
                                    };

                                    axios
                                      .post(
                                        `${baseUrl}/lykkebo/v1/timerec/delete`,
                                        postData,
                                        axiosConfig
                                      )
                                      .then((res) => {
                                        this.currentTrackerUid = res.data;
                                        fetch(
                                          `${baseUrl}/lykkebo/v1/timerec/overview?user_id=${userId}&day=${selectedDateFormatted.replace(
                                            /"/gi,
                                            ""
                                          )}`,
                                          {
                                            method: "GET",
                                            headers: {
                                              Authorization: `Bearer ${token}`,
                                            },
                                          }
                                        )
                                          .then((response) => response.json())
                                          .then((responseJson) => {
                                            const tempData =
                                              responseJson.data.filter(
                                                (data3) =>
                                                  data3.job_id === data.job_id
                                              );
                                            this.setState({
                                              data: tempData[0],
                                              totalWorkedHours: Number(
                                                tempData[0].total_time
                                              ),
                                            });
                                          })
                                          .catch((error) => {
                                            Toast.show({
                                              text: error.message,
                                              position: "top",
                                              duration: 5000,
                                            });
                                          });
                                      })
                                      .catch((error) => {
                                        Toast.show({
                                          text: error.message,
                                          position: "top",
                                          duration: 5000,
                                        });
                                      });
                                  }
                                );
                              });
                            });
                          },
                        },
                      ]}
                      autoClose
                      backgroundColor="transparent"
                    >
                      {/* <View
                            style={{
                              borderBottomWidth: 0.5,
                              borderColor: "#ccc",
                            }}
                            roundAvatar
                            badge={{
                              value: `${convertSecondsToTime(
                                Number(data2.total)
                              )}`,
                              textStyle: { color: "white" },
                            }}
                            title={
                              data2.description !== ""
                                ? data2.description
                                : "<Ingen beskrivelse>"
                            }
                            titleStyle={{ marginLeft: 0, fontWeight: "bold" }}
                            hideChevron
                            subtitleStyle={{
                              marginLeft: 0,
                              fontSize: 12,
                              color: "#959595",
                            }}
                            subtitle={`${convertTimestamp(
                              Number(data2.start),
                              "militarytime"
                            )} to ${convertTimestamp(
                              Number(data2.end),
                              "militarytime"
                            )}`}
                          /> */}
                      <View
                        style={{
                          flexDirection: appDirection.row,
                          borderBottomWidth: appNumbers.number_1,
                          padding: appNumbers.number_10,
                          borderColor: appColors.solidGrey,
                          alignItems: appAlignment.center,
                        }}
                      >
                        <View style={{ flex: appNumbers.number_1 }}>
                          <Text>
                            {data2.description !== ""
                              ? data2.description
                              : "<Ingen beskrivelse>"}
                          </Text>
                          <Text>
                            {`${convertTimestamp(
                              new Date(data2.start).getTime(),
                              "militarytime"
                            )} to ${convertTimestamp(
                              new Date(data2.end).getTime(),
                              "militarytime"
                            )}`}
                          </Text>
                        </View>
                        <View>
                          <Text>
                            {convertSecondsToTime(Number(data2.total))}
                          </Text>
                        </View>
                      </View>
                    </Swipeout>
                  );
                })
              )}
            </View>

            <View
              style={{
                flexDirection: appDirection.row,
                backgroundColor: appColors.primary,
                borderTopLeftRadius: appNumbers.number_10,
                borderTopRightRadius: appNumbers.number_10,
                padding: appNumbers.number_10,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: "bold",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    color: appColors.solidWhite,
                  }}
                >
                  {convertSecondsToTime(totalWorkedHours)}
                </Text>
                <Text
                  style={{
                    fontSize: appNumbers.number_14,
                    color: "white",
                  }}
                >
                  Total Hours
                </Text>
              </View>
              <View>
                <Button
                  title="Done"
                  loading={false}
                  loadingProps={{ size: "small", color: "white" }}
                  buttonStyle={{
                    // backgroundColor: "rgba(111, 202, 186, 1)",
                    borderRadius: 5,
                  }}
                  titleStyle={{ fontWeight: "bold", fontSize: 23 }}
                  containerStyle={{
                    marginHorizontal: 50,
                    height: 50,
                    width: 200,
                    marginVertical: 10,
                  }}
                  disabled={data.time_entry_details.length < 1}
                  onPress={this.timeSubmitHandler}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      );
    }

    return (
      <View style={styles.container}>
        <NewSinglePageHeader
          title={""}
          hasLeftIcon={true}
          leftIconName={appStrings.icon.chevronBack}
          leftIconPress={() => {}}
          hasRightIcon={true}
          rightIconName={appStrings.icon.camera}
          rightIconPress={() =>
            navigation.navigate(appStrings.mainStack.uploadImageScreen)
          }
        />
        <View style={commonStyles.deadCenter}>
          <NewLoader />
        </View>
      </View>
    );
  }
}
