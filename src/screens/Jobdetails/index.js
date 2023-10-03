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
  ScrollView,
  StyleSheet,
} from "react-native";
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
// import styles from "./styles";
import NewSinglePageHeader from "../../common/NewSinglePageHeader";
import NewLoader from "../../common/NewLoader";
import { appColors, appNumbers, appStrings } from "../../utils/constants";
import { Ionicons } from "@expo/vector-icons";
import ProofPicturesSection from "./sections/proofPictures";

class JobdetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      userRelation: 0,
      isFromTimeRec: 0,
      showSpecifyModal: false,
      userId: 0,
      data: {},
    };
  }

  componentDidMount() {
    this.getJobDetailsHandler();
  }

  getJobDetailsHandler = async () => {
    const userId = await AsyncStorage.getItem("user_id");
    const selectedJobId = await AsyncStorage.getItem("selectedJobId");
    const userRelation = await AsyncStorage.getItem("user_relation");
    const data = await this.props.getJobDetails(userId, selectedJobId);
    this.setState({
      userId,
      userRelation,
      data,
      loaded: true,
    });
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    const {
      userRelation,
      isFromTimeRec,
      showSpecifyModal,
      userId,
      loaded,
      data,
    } = this.state;
    const { navigation, updateWorkingDay } = this.props;
    const { isLoading, datas, isLoadingToggle } = this.props.jobDetails;
    if (!loaded) {
      return (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <NewSinglePageHeader
            title={""}
            hasLeftIcon={true}
            leftIconName={appStrings.icon.chevronBack}
            leftIconPress={this.goBack}
            hasRightIcon={true}
            rightIconName={appStrings.icon.camera}
          />
          <NewLoader />
        </ScrollView>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* MODALS */}
        <Modal isVisible={showSpecifyModal}>
          <View
            style={{ borderRadius: 5, flex: 1, backgroundColor: "#E8E8E8" }}
          >
            <View
              style={{
                backgroundColor: "#F0F0F0",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: appColors.primary,
                paddingVertical: appNumbers.number_10,
                paddingHorizontal: appNumbers.number_5,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setState({ showSpecifyModal: false });
                }}
              >
                <Ionicons
                  name={appStrings.icon.chevronBack}
                  size={appNumbers.number_24}
                  color={appColors.solidWhite}
                />
              </TouchableOpacity>

              <Text
                style={{
                  textAlign: "center",
                  width: "100%",
                  fontWeight: "bold",
                  fontSize: 25,
                  color: appColors.solidWhite,
                }}
              >
                Arbejdsdage
              </Text>

              <View />
            </View>

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
        {/* END OF MODALS */}

        <NewSinglePageHeader
          title={data?.booking?.title}
          hasLeftIcon={true}
          leftIconName={appStrings.icon.chevronBack}
          leftIconPress={this.goBack}
          hasRightIcon={true}
          rightIconName={appStrings.icon.camera}
          rightIconPress={() =>
            navigation.navigate(appStrings.mainStack.uploadImageScreen)
          }
        />
        <View style={styles.content}>
          <View style={styles.sectionSeparator} />
          <CustomerSection info={data.booking} />
          <BookingSection
            info={data.booking}
            user={userRelation}
            showSpecifyModal={(isShow) => {
              this.setState({ showSpecifyModal: isShow });
            }}
          />
          <ApprenticeSection info={data.booking} user={userRelation} />
          <TimelineSection
            info={datas.booking}
            user={userRelation}
            navigation={navigation}
          />
          <TodoSection info={data.booking} user={userRelation} />
          <NoteSection info={data.booking} />
          <ImageSection
            showCameraIcon
            title={i18n.t("pictures")}
            info={data.booking.booking_info.images}
            isAttachment={false}
            navigation={navigation}
            reloadScreen={this.getJobDetailsHandler}
          />
          <ProofPicturesSection
            navigation={navigation}
            pictures={data.booking.booking_info.before_photos}
            title="Før billeder"
          />
          <ProofPicturesSection
            navigation={navigation}
            pictures={data.booking.booking_info.after_photos}
            title="Efter billeder"
          />
        </View>
      </ScrollView>
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

const styles = StyleSheet.create({
  container: { flexGrow: appNumbers.number_1 },
  content: { flex: appNumbers.number_1 },
});

export default connect(mapStateToProps, mapDispatchToProps)(JobdetailsScreen);
