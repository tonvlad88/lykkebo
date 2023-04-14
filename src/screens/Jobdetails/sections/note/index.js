import React, { Component } from "react";
import {
  Content,
  Button,
  Icon,
  ListItem,
  Left,
  Right,
  Body,
  Toast,
} from "native-base";

import { View, Switch, TextInput, TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Modal from "react-native-modal";
import axios from "axios";
import XDate from "xdate";
import { Dropdown } from "react-native-material-dropdown-v2-fixed";

import styles from "../../styles";
import { Ionicons } from "@expo/vector-icons";
import { appColors, appNumbers, appStrings } from "../../../../utils/constants";

const sendTo = [
  { value: "0", label: "All medarbejdere" },
  { value: "1", label: "Konsultent" },
];

class NoteSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: null,
      sendSMS: false,
      selectedRecepient: 0,
      textareaValue: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  onSendSMSToSelected(value) {
    this.setState({
      selectedRecepient: value,
    });
  }

  saveNoteInfoHandler = () => {
    const { info } = this.props;
    AsyncStorage.getItem("user_id").then((userId) => {
      AsyncStorage.getItem("token").then((token) => {
        AsyncStorage.getItem("baseUrl").then((baseUrl) => {
          AsyncStorage.getItem("selectedJobId").then((jobId) => {
            const { textareaValue, sendSMS, selectedRecepient } = this.state;

            const postData = {
              user_id: `${userId}`,
              job_id: jobId,
              note_body: textareaValue,
              sms: sendSMS,
              note_option: selectedRecepient,
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
                `${baseUrl}/lykkebo/v1/jobdetails/addJobNote`,
                postData,
                axiosConfig
              )
              .then((res) => {
                const insertData = {
                  id: res.data,
                  note: textareaValue,
                  datestamp: XDate().toString("dd. MMMM yyyy"),
                };

                info.booking_info.note.push(insertData);
                this.setState({
                  visibleModal: null,
                  selectedRecepient: 0,
                  sendSMS: false,
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
    });
  };

  handleChange(value) {
    this.setState({ textareaValue: value });
  }

  renderModalContent = () => {
    const { sendSMS } = this.state;
    return (
      <View style={{ height: 358, backgroundColor: "#fff" }}>
        <View itemDivider>
          <Text style={{ color: "#787878" }}>Skriv note</Text>
        </View>

        <TextInput
          returnKeyType="done"
          multiline
          autoFocus
          blurOnSubmit
          autoCorrect={false}
          maxLength={1000}
          numberOfLines={7}
          onChangeText={this.handleChange}
          placeholder="Skriv en note her..."
          style={{
            flex: 1,
            padding: 5,
            borderColor: "#ccc",
            borderWidth: 0.5,
          }}
          underlineColorAndroid="rgba(0,0,0,0)"
        />

        {/* <View style={styles.noMarginLeft}>
          <View>
            <Text>Send SMS?</Text>
          </View>
          <Right>
            <Switch value={sendSMS} onValueChange={val => this.setState({sendSMS: val})} />
          </Right>
        </View> */}

        {sendSMS ? (
          <Dropdown
            label=""
            labelHeight={0}
            value="All medarbejdere"
            containerStyle={{ paddingLeft: 10, marginTop: 25 }}
            inputContainerStyle={{ borderBottomColor: "transparent" }}
            data={sendTo}
            onChangeText={(value) => this.onSendSMSToSelected(value)}
          />
        ) : null}

        <View style={{ height: 50, width: "100%", marginTop: 10 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 1, height: 50, paddingRight: 5 }}>
              <TouchableOpacity
                full
                primary
                style={styles.mt15}
                onPress={this.saveNoteInfoHandler}
              >
                <Text>Gem</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, height: 50, paddingLeft: 5 }}>
              <TouchableOpacity
                full
                light
                style={styles.mt15}
                onPress={() =>
                  this.setState({
                    visibleModal: null,
                    selectedRecepient: 0,
                    sendSMS: false,
                  })
                }
              >
                <Text>Luk</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  renderAllNotesHandler = () => {
    const { info } = this.props;

    if (
      !Array.isArray(info.booking_info.note) ||
      !info.booking_info.note.length
    ) {
      return (
        <View style={[styles.noMarginLeft, { padding: appNumbers.number_10 }]}>
          <Text style={{ paddingLeft: 18 }} note>
            Ingen noter fundet
          </Text>
        </View>
      );
    } else {
      return info.booking_info.note.map((note) => (
        <View style={{ padding: appNumbers.number_10 }} avatar key={note.id}>
          <View>
            <Text>{note.datestamp}</Text>
            <Text note style={{ textAlign: "justify" }}>
              {note.note}
            </Text>
          </View>
        </View>
      ));
    }
  };

  render() {
    const { visibleModal } = this.state;
    const { info } = this.props;

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.itemContainer,
            { backgroundColor: appColors.solidGrey },
          ]}
        >
          <Text style={[styles.itemHeaderText, { flex: 1 }]}>Noter</Text>
          <TouchableOpacity
            transparent
            onPress={() => this.setState({ visibleModal: 1 })}
          >
            <Ionicons
              name={appStrings.icon.add}
              color={appColors.solidBlack}
              size={appNumbers.number_24}
            />
          </TouchableOpacity>
        </View>

        {this.renderAllNotesHandler()}

        <Modal
          isVisible={visibleModal === 1}
          style={{ justifyContent: "flex-end", margin: 0 }}
        >
          {this.renderModalContent()}
        </Modal>
      </View>
    );
  }
}

export default NoteSection;
