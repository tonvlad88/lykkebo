// Main Components
import React, { Component } from "react";
import { View, Switch, Alert, TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Packages
import StepIndicator from "react-native-step-indicator";
import axios from "axios";
import Modal from "react-native-modal";
import { AirbnbRating } from "react-native-ratings";
import { connect } from "react-redux";
import { Tab, TabView } from "react-native-elements";

// Actions
import {
  getJobDetails,
  getJobDetailsNoLoading,
} from "../../../../redux/actions/jobDetails";

// Localization

// Global imports
import { getBookingStatus } from "../../../../services/common";

// Local imports
import UploadProofScreen from "../uploadProof";
import styles from "../../styles";
import { Ionicons } from "@expo/vector-icons";
import {
  appAlignment,
  appColors,
  appDirection,
  appNumbers,
  appStrings,
} from "../../../../utils/constants";

// Local constants
const labels = ["Ikke startet", "Kunde kontaktet", "Igangværende", "Færdig"];
const customStyles = {
  stepIndicatorSize: 35,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#fe7013",
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: "#fe7013",
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: "#fe7013",
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: "#fe7013",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "#fe7013",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 13,
  currentStepLabelColor: "#fe7013",
};

class TimelineSection extends Component {
  constructor(props) {
    super(props);

    const { info } = this.props;

    this.state = {
      currentPosition: getBookingStatus(Number(info.status)),
      // currentPosition: 1,
      isCustomerContacted: false,
      isJobOngoing: false,
      isJobDone: false,
      isCustomerContactedForDoneStatus: false,
      visibleConfirmModal: null,
      showUploadBeforePhoto: false,
      showUploadAfterPhoto: false,
      photo1UploadedBefore: false,
      photo2UploadedBefore: false,
      photo1UploadedAfter: false,
      photo2UploadedAfter: false,
      tabIndex: 0,
    };

    // this.updateJobStatusForward = this.updateJobStatusForward.bind(this);
    // this.updateJobStatusBackward = this.updateJobStatusBackward.bind(this);
    // this.customerContactedHandler = this.customerContactedHandler.bind(this);
    this.customerDoneContactedHandler =
      this.customerDoneContactedHandler.bind(this);
  }

  // updateJobStatusBackward() {
  //   const { currentPosition } = this.state;
  //
  //   if ((currentPosition - 1) < 1) {
  //     return;
  //   }
  //
  //   AsyncStorage.getItem('user_id').then((userId) => {
  //     AsyncStorage.getItem('token').then((token) => {
  //       AsyncStorage.getItem('baseUrl').then((baseUrl) => {
  //         AsyncStorage.getItem('selectedJobId').then((jobId) => {
  //           const postData = {
  //             user_id: `${userId}`,
  //             job_id: jobId,
  //             status: setBookingStatus(currentPosition - 1),
  //           };
  //
  //           const axiosConfig = {
  //             headers: {
  //               // 'Content-Type': 'application/json;charset=UTF-8',
  //               // 'Access-Control-Allow-Origin': '*',
  //               Authorization: `Bearer ${token}`,
  //             },
  //           };
  //
  //           axios.post(`http://${baseUrl}/lykkebo/v1/jobdetails/updateJobStatus`, postData, axiosConfig)
  //             .then((res) => {
  //               // console.log('res', res.data);
  //             })
  //             .catch((err) => {
  //               console.log("AXIOS ERROR: ", err);
  //             });
  //         });
  //       });
  //     });
  //   });
  //
  //   this.setState({currentPosition: currentPosition - 1});
  // }

  // updateJobStatusForward() {
  //   const { currentPosition } = this.state;
  //   AsyncStorage.getItem('user_id').then((userId) => {
  //     AsyncStorage.getItem('token').then((token) => {
  //       AsyncStorage.getItem('baseUrl').then((baseUrl) => {
  //         AsyncStorage.getItem('selectedJobId').then((jobId) => {
  //           if ((currentPosition + 1) > 3) {
  //             return;
  //           } else if ((currentPosition + 1) === 3) {
  //             console.log('DONE');
  //             this.setState({visibleConfirmModal: 1})
  //             return;
  //           }
  //
  //           const postData = {
  //             user_id: `${userId}`,
  //             job_id: jobId,
  //             status: setBookingStatus(currentPosition + 1),
  //           };
  //
  //           const axiosConfig = {
  //             headers: {
  //               // 'Content-Type': 'application/json;charset=UTF-8',
  //               // 'Access-Control-Allow-Origin': '*',
  //               Authorization: `Bearer ${token}`,
  //             },
  //           };
  //
  //           axios.post(`http://${baseUrl}/lykkebo/v1/jobdetails/updateJobStatus`, postData, axiosConfig)
  //             .then((res) => {
  //               this.setState({visibleConfirmModal: null})
  //               // console.log('res', res.data);
  //             })
  //             .catch((err) => {
  //               console.log("AXIOS ERROR: ", err);
  //             });
  //         });
  //       });
  //     });
  //   });
  //
  //   this.setState({currentPosition: currentPosition + 1});
  // }

  // customerContactedHandler(val) {
  //   if (val) {
  //     AsyncStorage.getItem('user_id').then((userId) => {
  //       AsyncStorage.getItem('token').then((token) => {
  //         AsyncStorage.getItem('baseUrl').then((baseUrl) => {
  //           AsyncStorage.getItem('selectedJobId').then((jobId) => {
  //             const postData = {
  //               user_id: `${userId}`,
  //               job_id: jobId,
  //               status: 5,
  //             };
  //
  //             const axiosConfig = {
  //               headers: {
  //                 // 'Content-Type': 'application/json;charset=UTF-8',
  //                 // 'Access-Control-Allow-Origin': '*',
  //                 Authorization: `Bearer ${token}`,
  //               },
  //             };
  //
  //             axios.post(`http://${baseUrl}/lykkebo/v1/jobdetails/updateJobStatus`, postData, axiosConfig)
  //               .then((res) => {
  //                 this.setState({currentPosition: 1});
  //               })
  //               .catch((err) => {
  //                 console.log("AXIOS ERROR: ", err);
  //               });
  //           });
  //         });
  //       });
  //     });
  //     this.setState({isCustomerContacted: val, currentPosition: 1});
  //   }
  // }

  customerDoneContactedHandler(val) {
    this.setState({
      isCustomerContactedForDoneStatus: val,
      currentPosition: 3,
    });
  }

  renderConfirmModalContent = () => {
    const { isCustomerContactedForDoneStatus } = this.state;
    const { getJobDetailsNoLoading } = this.props;

    return (
      <View style={{ height: 270, backgroundColor: "#fff" }}>
        <View
          style={{ padding: appNumbers.number_10, backgroundColor: "#eee" }}
        >
          <Text style={{ color: "#787878" }}>Job er færdig</Text>
        </View>
        <View
          style={{
            flexDirection: appDirection.row,
            padding: appNumbers.number_10,
            borderBottomWidth: 1,
            borderColor: "#ccc",
            justifyContent: appAlignment.center,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: appAlignment.center,
            }}
          >
            <Text>Er jobbet godkendt af kunden?</Text>
          </View>
          <View>
            <Switch
              value={isCustomerContactedForDoneStatus}
              onValueChange={this.customerDoneContactedHandler}
            />
          </View>
        </View>

        {/* <AirbnbRating defaultRating={5} /> */}

        <AirbnbRating
          count={5}
          reviews={["Terrible", "Bad", "Okay", "Good", "Fantastisk!"]}
          defaultRating={5}
        />

        <View style={{ height: 50, width: "100%", marginTop: 10 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 1, height: 50, paddingRight: 5 }}>
              <TouchableOpacity
                disabled={!isCustomerContactedForDoneStatus}
                style={{
                  backgroundColor: "green",
                  padding: appNumbers.number_10,
                }}
                onPress={() => {
                  if (!isCustomerContactedForDoneStatus) return;

                  AsyncStorage.getItem("user_id").then((userId) => {
                    AsyncStorage.getItem("token").then((token) => {
                      AsyncStorage.getItem("baseUrl").then((baseUrl) => {
                        AsyncStorage.getItem("selectedJobId").then((jobId) => {
                          const postData = {
                            user_id: `${userId}`,
                            job_id: jobId,
                            status: 2,
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
                              `${baseUrl}/lykkebo/v1/jobdetails/updateJobStatus`,
                              postData,
                              axiosConfig
                            )
                            .then(() => {
                              this.setState({
                                currentPosition: 3,
                                visibleConfirmModal: null,
                              });
                              getJobDetailsNoLoading(userId, jobId);
                            })
                            .catch(() => {
                              this.setState({
                                currentPosition: 3,
                                visibleConfirmModal: null,
                              });
                            });
                        });
                      });
                    });
                  });
                }}
              >
                <Text
                  style={{
                    color: appColors.solidWhite,
                    textAlign: appAlignment.center,
                  }}
                >
                  Proceed
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, height: 50, paddingLeft: 5 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#eee",
                  padding: appNumbers.number_10,
                }}
                onPress={() =>
                  this.setState({
                    visibleConfirmModal: null,
                    currentPosition: 2,
                    isJobDone: false,
                    isCustomerContactedForDoneStatus: false,
                  })
                }
              >
                <Text style={{ textAlign: appAlignment.center }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  renderBookingStatusQuestion = () => {
    const { currentPosition, isCustomerContacted, isJobOngoing, isJobDone } =
      this.state;

    const { user } = this.props;

    if (currentPosition === 0 && Number(user) < 3) {
      return (
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            borderTopWidth: 1,
            borderTopColor: appColors.solidGrey,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text>Er kunden kontaktet?</Text>
          </View>
          <View>
            <Switch
              value={isCustomerContacted}
              onValueChange={(val) => {
                if (val) {
                  this.setState({ isCustomerContacted: true });
                  AsyncStorage.getItem("user_id").then((userId) => {
                    AsyncStorage.getItem("token").then((token) => {
                      AsyncStorage.getItem("baseUrl").then((baseUrl) => {
                        AsyncStorage.getItem("selectedJobId").then((jobId) => {
                          const postData = {
                            user_id: `${userId}`,
                            job_id: jobId,
                            status: 5,
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
                              `${baseUrl}/lykkebo/v1/jobdetails/updateJobStatus`,
                              postData,
                              axiosConfig
                            )
                            .then(() => {
                              this.setState({
                                currentPosition: currentPosition + 1,
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
                  });
                  // this.setState({isCustomerContacted: val, currentPosition: 1});
                }
              }}
            />
          </View>
        </View>
      );
    } else if (currentPosition === 1 && Number(user) < 3) {
      return (
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            borderTopWidth: 1,
            borderTopColor: appColors.solidGrey,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text>Er jobbet igangsat?</Text>
          </View>
          <View>
            <Switch
              value={isJobOngoing}
              onValueChange={(val) => {
                this.setState({ isJobOngoing: true });
                if (val) {
                  Alert.alert(
                    "",
                    "Mindst 2 billeder. 1 fyldestgørende før billede + 1 billede af Lykkeboskilt synligt fra offentlig vej. Fortsæt?",
                    [
                      {
                        text: "Cancel",
                        onPress: () => this.setState({ isJobOngoing: false }),
                        style: "cancel",
                      },
                      {
                        text: "OK",
                        onPress: () => {
                          // this.props.navigation.navigate('uploadProof')
                          this.setState({
                            showUploadBeforePhoto: true,
                            isJobOngoing: true,
                          });
                        },
                      },
                    ],
                    { cancelable: false }
                  );

                  // this.setState({isJobOngoing: true});
                  // AsyncStorage.getItem('user_id').then((userId) => {
                  //   AsyncStorage.getItem('token').then((token) => {
                  //     AsyncStorage.getItem('baseUrl').then((baseUrl) => {
                  //       AsyncStorage.getItem('selectedJobId').then((jobId) => {
                  //         const postData = {
                  //           user_id: `${userId}`,
                  //           job_id: jobId,
                  //           status: 4,
                  //         };
                  //
                  //         const axiosConfig = {
                  //           headers: {
                  //             // 'Content-Type': 'application/json;charset=UTF-8',
                  //             // 'Access-Control-Allow-Origin': '*',
                  //             Authorization: `Bearer ${token}`,
                  //           },
                  //         };
                  //
                  //         axios.post(`${baseUrl}/lykkebo/v1/jobdetails/updateJobStatus`, postData, axiosConfig)
                  //           .then(() => {
                  //             this.setState({currentPosition: currentPosition + 1});
                  //           })
                  //           .catch((error) => {
                  //             Toast.show({
                  //               text: error.message,
                  //               position: 'top',
                  //               duration: 5000,
                  //             });
                  //           });
                  //       });
                  //     });
                  //   });
                  // });
                  // // this.setState({isCustomerContacted: val, currentPosition: 1});
                }
              }}
            />
          </View>
        </View>
      );
    } else if (currentPosition === 2 && Number(user) < 3) {
      return (
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            borderTopWidth: 1,
            borderTopColor: appColors.solidGrey,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text>Er jobbet færdigt?</Text>
          </View>
          <View>
            <Switch
              value={isJobDone}
              onValueChange={(val) => {
                if (val) {
                  Alert.alert(
                    "",
                    "Mindst 2 efter billeder af det færdige resultat. Fortsæt?",
                    [
                      {
                        text: "Cancel",
                        onPress: () => this.setState({ isJobOngoing: false }),
                        style: "cancel",
                      },
                      {
                        text: "OK",
                        onPress: () => {
                          // this.props.navigation.navigate('uploadProof')
                          this.setState({
                            showUploadAfterPhoto: true,
                            isJobDone: true,
                          });
                        },
                      },
                    ],
                    { cancelable: false }
                  );
                }
              }}
            />
          </View>
        </View>
      );
    } else {
      return <View />;
    }
  };

  uploadBeforePhoto = () => {
    const { currentPosition } = this.state;
    const { getJobDetailsNoLoading } = this.props;

    this.setState({ showUploadBeforePhoto: false });

    setTimeout(() => {
      AsyncStorage.getItem("user_id").then((userId) => {
        AsyncStorage.getItem("token").then((token) => {
          AsyncStorage.getItem("baseUrl").then((baseUrl) => {
            AsyncStorage.getItem("selectedJobId").then((jobId) => {
              const postData = {
                user_id: `${userId}`,
                job_id: jobId,
                status: 4,
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
                  `${baseUrl}/lykkebo/v1/jobdetails/updateJobStatus`,
                  postData,
                  axiosConfig
                )
                .then(() => {
                  this.setState({ currentPosition: currentPosition + 1 });
                  getJobDetailsNoLoading(userId, jobId);
                  this.setTabIndex(0);
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
      });
    }, 100);
  };

  uploadAfterPhoto = () => {
    this.setState({
      showUploadAfterPhoto: false,
    });
    setTimeout(() => {
      this.setState({ visibleConfirmModal: 1 });
    }, 500);
  };

  getJobDetailsHandler = () => {
    // console.log('tes1111111111t')
    const { getJobDetailsNoLoading } = this.props;

    AsyncStorage.getItem("user_id").then((userId) => {
      AsyncStorage.getItem("selectedJobId").then((jobId) => {
        getJobDetailsNoLoading(userId, jobId);
      });
    });
  };

  setTabIndex = (idx) => {
    this.setState({
      tabIndex: idx,
    });
  };
  render() {
    const {
      currentPosition,
      visibleConfirmModal,
      showUploadBeforePhoto,
      showUploadAfterPhoto,
      photo1UploadedBefore,
      photo2UploadedBefore,
      photo1UploadedAfter,
      photo2UploadedAfter,
      tabIndex,
    } = this.state;
    const { info } = this.props;

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.itemContainer,
            { backgroundColor: appColors.solidGrey },
          ]}
        >
          <Text style={styles.itemHeaderText}>Tidslinje</Text>
        </View>

        <View style={{ padding: 10 }}>
          <StepIndicator
            stepCount={4}
            customStyles={customStyles}
            currentPosition={currentPosition + 1}
            labels={labels}
          />

          {this.renderBookingStatusQuestion()}
        </View>

        <Modal
          isVisible={visibleConfirmModal === 1}
          backdropColor="#ccc"
          backdropOpacity={0.9}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
        >
          {this.renderConfirmModalContent()}
        </Modal>

        <Modal isVisible={showUploadBeforePhoto}>
          <View style={{ backgroundColor: "#2E3D43", flex: 1 }}>
            <View
              style={{
                height: 70,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity>
                <Ionicons
                  style={{ color: "#ffffff" }}
                  size={40}
                  name={appStrings.icon.chevronBack}
                  onPress={() => {
                    this.setState({
                      showUploadBeforePhoto: false,
                      isJobOngoing: false,
                    });
                  }}
                />
              </TouchableOpacity>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Text style={{ color: "#ffffff" }}>Upload billede</Text>
              </View>

              {info.booking_info.before_photos.length > 1 ? (
                <TouchableOpacity onPress={this.uploadBeforePhoto}>
                  <Text
                    style={{
                      marginRight: appNumbers.number_10,
                      color: "white",
                    }}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity>
                  <Text style={{ color: "#2E3D43" }}>Done</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Tab
                value={tabIndex}
                onChange={this.setTabIndex}
                indicatorStyle={{ backgroundColor: "#ccc" }}
              >
                <Tab.Item
                  title="Picture 1"
                  containerStyle={{ backgroundColor: "#243135" }}
                  titleStyle={{ color: "white" }}
                  icon={
                    photo1UploadedBefore
                      ? { name: "checkmark", type: "ionicon", color: "green" }
                      : {}
                  }
                  variant="primary"
                />
                <Tab.Item
                  title="Picture 2"
                  containerStyle={{ backgroundColor: "#243135" }}
                  titleStyle={{ color: "white" }}
                  icon={
                    photo2UploadedBefore
                      ? { name: "checkmark", type: "ionicon", color: "green" }
                      : {}
                  }
                  variant="primary"
                />
              </Tab>

              <TabView value={tabIndex} onChange={this.setTabIndex}>
                <TabView.Item style={{ width: "90%" }}>
                  <UploadProofScreen
                    imageType="before"
                    getJobDetails={this.getJobDetailsHandler}
                    goToPage={(page) => {
                      this.setState({ photo1UploadedBefore: true });
                      this.setTabIndex(page);
                      this.getJobDetailsHandler();
                    }}
                  />
                </TabView.Item>

                <TabView.Item style={{ width: "90%" }}>
                  <UploadProofScreen
                    imageType="before"
                    getJobDetails={this.getJobDetailsHandler}
                    goToPage={() => {
                      this.setState({ photo2UploadedBefore: true });
                    }}
                  />
                </TabView.Item>
              </TabView>
            </View>
          </View>
        </Modal>

        <Modal isVisible={showUploadAfterPhoto}>
          <View style={{ backgroundColor: "#2E3D43", flex: 1 }}>
            <View
              style={{
                height: 70,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity>
                <Ionicons
                  style={{ color: "#ffffff" }}
                  size={40}
                  name={appStrings.icon.chevronBack}
                  onPress={() => {
                    this.setState({
                      showUploadAfterPhoto: false,
                      isJobDone: false,
                    });
                  }}
                />
              </TouchableOpacity>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Text style={{ color: "#ffffff" }}>Upload billede</Text>
              </View>

              {info.booking_info.after_photos.length > 1 ? (
                <TouchableOpacity onPress={this.uploadAfterPhoto}>
                  <Text
                    style={{
                      marginRight: appNumbers.number_10,
                      color: "white",
                    }}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity>
                  <Text style={{ color: "#2E3D43" }}>Done</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Tab
                value={tabIndex}
                onChange={this.setTabIndex}
                indicatorStyle={{ backgroundColor: "#ccc" }}
              >
                <Tab.Item
                  title="Picture 1"
                  containerStyle={{ backgroundColor: "#243135" }}
                  titleStyle={{ color: "white" }}
                  icon={
                    photo1UploadedAfter
                      ? { name: "checkmark", type: "ionicon", color: "green" }
                      : {}
                  }
                  variant="primary"
                />
                <Tab.Item
                  title="Picture 2"
                  containerStyle={{ backgroundColor: "#243135" }}
                  titleStyle={{ color: "white" }}
                  icon={
                    photo2UploadedAfter
                      ? { name: "checkmark", type: "ionicon", color: "green" }
                      : {}
                  }
                  variant="primary"
                />
              </Tab>

              <TabView value={tabIndex} onChange={this.setTabIndex}>
                <TabView.Item style={{ width: "90%" }}>
                  <UploadProofScreen
                    imageType="after"
                    getJobDetails={this.getJobDetailsHandler}
                    goToPage={(page) => {
                      this.setState({ photo1UploadedAfter: true });
                      this.setTabIndex(page);
                    }}
                  />
                </TabView.Item>

                <TabView.Item style={{ width: "90%" }}>
                  <UploadProofScreen
                    imageType="after"
                    getJobDetails={this.getJobDetailsHandler}
                    goToPage={() => {
                      this.setState({ photo2UploadedAfter: true });
                    }}
                  />
                </TabView.Item>
              </TabView>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  jobDetails: state.jobDetails,
});

const mapDispatchToProps = (dispatch) => ({
  getJobDetails: (userId, jobId) => dispatch(getJobDetails(userId, jobId)),
  getJobDetailsNoLoading: (userId, jobId) =>
    dispatch(getJobDetailsNoLoading(userId, jobId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimelineSection);
