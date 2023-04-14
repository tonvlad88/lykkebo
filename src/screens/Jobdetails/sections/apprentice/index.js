import React, { Component } from "react";
import { Content, Button, Icon, ListItem, Toast } from "native-base";

import { View, TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import Modal from "react-native-modal";
import axios from "axios";
import { Dropdown } from "react-native-material-dropdown-v2-fixed";

import styles from "../../styles";
import {} from "react-native-gesture-handler";
import { appColors, appNumbers, appStrings } from "../../../../utils/constants";

class ApprenticeSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: null,
      selectedApprentice: 0,
      isDropdownLoaded: false,
    };
  }

  onApprenticeSelected(value) {
    this.setState({
      selectedApprentice: value,
    });
  }

  insertApprenticeHandler = () => {
    AsyncStorage.getItem("user_id").then((userId) => {
      AsyncStorage.getItem("token").then((token) => {
        AsyncStorage.getItem("baseUrl").then((baseUrl) => {
          AsyncStorage.getItem("selectedJobId").then((jobId) => {
            const { selectedApprentice } = this.state;

            const postData = {
              user_id: `${userId}`,
              job_id: jobId,
              employee_id: selectedApprentice,
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
                `${baseUrl}/lykkebo/v1/jobdetailes/addJobApprentice`,
                postData,
                axiosConfig
              )
              .then(() => {
                const { info } = this.props;
                const data = info.apprentices.filter(
                  (apprentice) =>
                    apprentice.medarbejder_id === selectedApprentice
                );

                const insertData = {
                  id: data[0].medarbejder_id,
                  name: data[0].medarbejder_navn,
                };

                info.booking_info.apprentice.push(insertData);
                this.setState({ visibleModal: null });
              })
              .catch((error) => {
                Toast.show({
                  text: error.message,
                  position: "top",
                  duration: 3000,
                });
              });
          });
        });
      });
    });
  };

  renderModalContent = () => {
    const { info } = this.props;

    const apprenticeArray = [];
    info.apprentices.forEach((apprentice) => {
      const data = {
        value: apprentice.medarbejder_id,
        label: apprentice.medarbejder_navn,
      };
      return apprenticeArray.push(data);
    });

    // console.log('apprenticeArray', apprenticeArray)

    // const newApprentice = info.apprentices.filter(apprentice => apprentice.medarbejder_id
    //   !== info.booking_info.apprentice[0].id);
    return (
      <View style={{ height: 185, backgroundColor: "#fff" }}>
        <View>
          <Text style={{ color: "#787878" }}>Tilføj en lærling</Text>
        </View>

        <Dropdown
          label=""
          labelHeight={0}
          fontSize={20}
          value={apprenticeArray[0].label}
          containerStyle={{ paddingLeft: 10, marginTop: 25 }}
          inputContainerStyle={{ borderBottomColor: "transparent" }}
          data={apprenticeArray}
          onChangeText={(value) => this.onApprenticeSelected(value)}
        />

        <View style={{ height: 50, width: "100%", marginTop: 10 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 1, height: 50, paddingRight: 5 }}>
              <TouchableOpacity
                full
                light
                style={styles.mt15}
                onPress={this.insertApprenticeHandler}
              >
                <Text>Gem</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, height: 50, paddingLeft: 5 }}>
              <TouchableOpacity
                full
                light
                style={styles.mt15}
                onPress={() => this.setState({ visibleModal: null })}
              >
                <Text>Luk</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const { visibleModal } = this.state;
    const { info, user } = this.props;

    return (
      <View style={styles.container}>
        <View itemDivider style={{ paddingTop: 0, paddingBottom: 0 }}>
          <View
            style={[
              styles.itemContainer,
              { backgroundColor: appColors.solidGrey },
            ]}
          >
            <Text style={styles.itemHeaderText}>Lærling</Text>
          </View>
          {Number(user) === 1 ? (
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              transparent
              onPress={() => this.setState({ visibleModal: 1 })}
            >
              <Ionicons
                name={appStrings.icon.add}
                size={appNumbers.number_24}
                color={appColors.solidBlack}
              />
            </TouchableOpacity>
          ) : (
            <View style={{ height: 50 }} />
          )}
        </View>

        <View
          style={{
            height: 0,
            marginLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
            paddingBottom: 0,
          }}
        />

        {info.booking_info.apprentice.map((apprentice) => (
          <View style={styles.noMarginLeft} key={apprentice.id}>
            <Text style={{ paddingLeft: 18 }}>{apprentice.name}</Text>
          </View>
        ))}

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

export default ApprenticeSection;
