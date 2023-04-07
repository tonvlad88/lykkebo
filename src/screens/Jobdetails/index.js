// Components
import React, { Component } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Platform,
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
  TabHeading,
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
import {
  getJobDetails,
  updateWorkingDay,
} from "../../redux/actions/jobDetails";

// Localization
import i18n from "i18n-js";
import { da, en } from "../../services/translations";
i18n.fallbacks = true;
i18n.translations = { da, en };
i18n.locale = Localization.locale;

// Global imports
import CustomHeader from "../../common/Header";
import CustomLoading from "../../common/Loading";
import { Input } from "../../common/Input";

// Local imports
import ApprenticeSection from "./sections/apprentice";
import BookingSection from "./sections/booking";
import CustomerSection from "./sections/customer";
import TimelineSection from "./sections/timeline";
import TodoSection from "./sections/todo";
import NoteSection from "./sections/note";
import ImageSection from "./sections/image";
import SpecifySection from "./sections/specify/containers";
import styles from "./styles";

class JobdetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      userRelation: 0,
      isFromTimeRec: 0,
      showSpecifyModal: false,
      userId: 0,
    };
  }

  async componentDidMount() {
    const userId = await AsyncStorage.getItem("user_id");
    const selectedJobId = await AsyncStorage.getItem("selectedJobId");
    const userRelation = await AsyncStorage.getItem("user_relation");
    this.props.getJobDetails(userId, selectedJobId);
    this.setState({
      userId,
      userRelation,
    });
  }

  render() {
    const { userRelation, isFromTimeRec, showSpecifyModal, userId } =
      this.state;
    const { navigation, updateWorkingDay } = this.props;
    const { isLoading, datas, isLoadingToggle } = this.props.jobDetails;

    if (isLoading) {
      return (
        <View>
          <CustomHeader />
          <CustomLoading showmodal />
        </View>
      );
    }

    // console.log('datas.booking', datas.booking)

    return (
      <Container style={styles.container}>
        <StatusBar hidden />
        <Header style={{ backgroundColor: "#2E3D43" }}>
          <Left>
            {Number(isFromTimeRec) === 1 ? (
              <Button transparent>
                <Icon
                  style={{ color: "#ffffff" }}
                  size={40}
                  name="arrow-back"
                  onPress={() => {
                    AsyncStorage.setItem("isFromTimeRec", "0").then(() => {
                      navigation.navigate("TimeTrackerDetail");
                    });
                  }}
                />
              </Button>
            ) : (
              <Button transparent>
                <Icon
                  style={{ color: "#ffffff" }}
                  size={40}
                  name="arrow-back"
                  onPress={() => navigation.navigate("Jobs")}
                />
              </Button>
            )}
          </Left>
          <Body style={{ flex: 1 }}>
            <Title
              numberOfLines={1}
              style={{ textAlign: "center", color: "white" }}
            >
              {datas.booking.title}
            </Title>
          </Body>
          <Right>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("UploadImage");
              }}
            >
              <Icon name="camera" style={{ color: "white" }} />
            </TouchableOpacity>
          </Right>
        </Header>
        <View
          style={{
            width: "100%",
            height: 3,
            backgroundColor: "#323248",
            marginBottom: 1,
          }}
        />

        <Content>
          <View style={styles.sectionSeparator} />
          <CustomerSection info={datas.booking} />

          <View style={styles.sectionSeparator} />
          <BookingSection
            info={datas.booking}
            user={userRelation}
            showSpecifyModal={(isShow) => {
              this.setState({ showSpecifyModal: isShow });
            }}
          />

          <View style={styles.sectionSeparator} />
          <ApprenticeSection info={datas.booking} user={userRelation} />

          <View style={styles.sectionSeparator} />
          <TimelineSection
            info={datas.booking}
            user={userRelation}
            navigation={navigation}
          />

          <View style={styles.sectionSeparator} />
          <TodoSection info={datas.booking} user={userRelation} />

          <View style={styles.sectionSeparator} />
          <NoteSection info={datas.booking} />

          <View style={styles.sectionSeparator} />
          <ImageSection
            showCameraIcon
            title={i18n.t("pictures")}
            info={datas.booking.booking_info.images}
            isAttachment={false}
            navigation={navigation}
          />

          <View style={styles.sectionSeparator} />
          <ImageSection
            showCameraIcon={false}
            title={`${i18n.t("ongoingjob")} ${i18n.t("pictures")}`}
            info={datas.booking.booking_info.before_photos}
            isAttachment
            navigation={navigation}
          />

          <View style={styles.sectionSeparator} />
          <ImageSection
            showCameraIcon={false}
            title={`${i18n.t("done")} ${i18n.t("pictures")}`}
            isAttachment
            info={datas.booking.booking_info.after_photos}
            navigation={navigation}
          />

          <View style={styles.sectionSeparator} />

          <Modal isVisible={showSpecifyModal}>
            <View
              style={{ borderRadius: 5, flex: 1, backgroundColor: "#E8E8E8" }}
            >
              <Header noShadow noRight style={{ backgroundColor: "#F0F0F0" }}>
                <Left style={{ flex: 1 }}>
                  <Button
                    transparent
                    onPress={() => {
                      this.setState({ showSpecifyModal: false });
                    }}
                  >
                    <Icon name="arrow-back" style={{ color: "black" }} />
                  </Button>
                </Left>
                <Body style={{ flex: 3 }}>
                  <Text
                    style={{
                      textAlign: "center",
                      width: "100%",
                      fontWeight: "bold",
                      fontSize: 25,
                    }}
                  >
                    Arbejdsdage
                  </Text>
                </Body>
                <Right />
              </Header>
              <View style={styles.sectionSeparator} />
              {isLoadingToggle ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator size="small" />
                  <Text>Processing...</Text>
                </View>
              ) : (
                <SpecifySection
                  workingDays={datas.booking.workingDays}
                  toggleWorkingDay={(val, datestamp) => {
                    const data = {
                      user_id: userId,
                      job_id: datas.booking.job_id,
                      date: datestamp,
                      toggle: val,
                    };
                    updateWorkingDay(data);
                  }}
                />
              )}
            </View>
          </Modal>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  jobDetails: state.jobDetails,
});

const mapDispatchToProps = (dispatch) => ({
  getJobDetails: (userId, jobId) => dispatch(getJobDetails(userId, jobId)),
  updateWorkingDay: (data) => dispatch(updateWorkingDay(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(JobdetailsScreen);
