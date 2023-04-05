// Components
import React, { Component } from 'react';
// import {
//   Container,
//   Header,
//   Title,
//   Content,
//   Button,
//   Icon,
//   CardItem,
//   Text,
//   Left,
//   Right,
//   Body,
//   H3,
//   DatePicker,
//   Tab,
//   Tabs,
//   Toast,
// } from 'native-base';

import {
  View,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Text
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helpers
import XDate from 'xdate';
import Modal from 'react-native-modal';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import axios from 'axios';
import { Dropdown } from 'react-native-material-dropdown-v2-fixed';
import { connect } from 'react-redux';
import moment from 'moment';

// Actions

// Localization
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { da, en } from '../../../services/translations';

// Global imports
import {
  toTimestampWithSeconds,
  toTimestamp,
  setDayStatus,
  jsUcfirst,
} from '../../../services/common';
import deviceStorage from '../../../services/deviceStorage';

// Local imports
import styles from './styles';
import TabTwo from '../WeeklyCalendar/index';
import CustomHeader from '../../../common/Header';
import NewHeader from '../../../common/NewHeader';

i18n.fallbacks = true;
i18n.translations = { da, en };
i18n.locale = Localization.locale;


class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { navigation } = this.props;

    return (
      <View style={styles.container}> 
        <NewHeader navigation={navigation} />
        <StatusBar hidden />
        <Text>Calendar</Text>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  tracker: state.tracker,
});

const mapDispatchToProps = dispatch => ({
  // getTracker: (userId, date) => dispatch(getTracker(userId, date)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen);
