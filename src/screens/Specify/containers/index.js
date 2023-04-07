// Components
import React, { Component } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Tab,
  Tabs,
  Grid,
  Col,
  Row,
  Card,
  CardItem,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Helpers
import XDate from "xdate";
import { connect } from "react-redux";
import * as SecureStore from "expo-secure-store";
import * as Localization from "expo-localization";
import Modal from "react-native-modal";
import moment from "moment";

// Actions

// Localization
import i18n from "i18n-js";
import { da, en } from "../../../services/translations";
i18n.fallbacks = true;
i18n.translations = { da, en };
i18n.locale = Localization.locale;

// Global imports
import CustomHeader from "../../../common/Header";
import CustomLoading from "../../../common/Loading";
import { Input } from "../../../common/Input";

// Local imports
import DateView from "../components/DateView";
import TodoRowItem from "../components/TodoRowItem";
import SpecifyDatePicker from "../components/SpecifyDatePicker";
import styles from "./styles";

class SpecifyScreen extends Component {
  render() {
    const { specify, navigation } = this.props;
    const { isLoading, bookingData } = specify;

    if (!isLoading) {
      return (
        <View>
          <CustomHeader title="Specify" />
          <CustomLoading showmodal={true} />
        </View>
      );
    }

    return (
      <View>
        <StatusBar hidden />
        <CustomHeader
          leftIconName="menu"
          onPressLeftIcon={() => navigation.openDrawer()}
          title="Specify"
        />
        <View style={styles.container}>
          <View style={styles.header}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                flexDirection: "row",
                backgroundColor: "#506273",
                padding: 5,
              }}
            >
              <SpecifyDatePicker />
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "white" }}> - </Text>
              </View>
              <SpecifyDatePicker />
            </View>
            <TouchableOpacity
              full
              primary
              style={{ backgroundColor: "#2D3640", width: 60 }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>GO</Text>
            </TouchableOpacity>
          </View>
          {/* <FlatList
            data={bookingData}
            keyExtractor={todo => todo.uid}
            enableEmptySections={true}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({item, index}) => (
              <TodoRowItem
                booking={{...item}}
                index={index}
                time={moment().startOf('hour').fromNow()}
              />
            )}
           /> */}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  // bcInfo: state.bookingConfirmation.bcInfo,
  specify: state.specify,
  // showUploading: state.bookingConfirmation.showUploading,
});

const mapDispatchToProps = (dispatch) => ({
  // getQuestions: () => dispatch(getQuestions()),
  // fetchBookingConfirmation: () => dispatch(fetchBookingConfirmation()),
  // uploadSignatureToServer: (formData) => dispatch(uploadSignatureToServer(formData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SpecifyScreen);
