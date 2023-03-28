import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import type Moment from 'moment';
import XDate from 'xdate';
import Date from './Date';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchTryHttp,
} from '../../../../services/common';

import {
  Loading,
} from '../../../../common';

// Localization
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { da, en } from '../../../../services/translations';

i18n.fallbacks = true;
i18n.translations = { da, en };
i18n.locale = Localization.locale;

const moment = require('moment');
moment.locale('da', {
  months: [i18n.t('january'), i18n.t('february'), i18n.t('march'), i18n.t('april'), i18n.t('may'), i18n.t('june'), i18n.t('july'), 'August', 'September', i18n.t('october'), 'November', 'December'],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', i18n.t('shortmay'), 'Jun', 'Jul', 'Aug', 'Sep', i18n.t('shortokt'), 'Nov', 'Dec'],
  weekdays: [i18n.t('sunday'), i18n.t('monday'), i18n.t('tuesday'), i18n.t('wednesday'), i18n.t('thursday'), i18n.t('friday'), i18n.t('saturday')],
  weekdaysShort: [i18n.t('sun'), i18n.t('mon'), i18n.t('tue'), i18n.t('wed'), i18n.t('thu'), i18n.t('fri'), i18n.t('sat')],
  weekdaysParseExact: true,
});

export default class Dates extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      baseData: {},
      loaded: false,
    };
  }

  componentDidMount() {
    // AsyncStorage.getItem('user_id').then((userId) => {
    //   AsyncStorage.getItem('token').then((token) => {
    //     AsyncStorage.getItem('baseUrl').then((baseUrl) => {
    //       fetchTryHttp(`${baseUrl}/lykkebo/v1/calender/overview?user_id=${userId}`, {
    //         method: 'GET',
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       })
    //         .then(response => response.json())
    //         .then((data) => {
    //           console.log('data', data);
    //           this.setState({
    //             baseData: data,
    //             loaded: true,
    //           });
    //         })
    //         .catch((error) => {
    //           console.log(error);
    //         });
    //     });
    //   });
    // });

    this.setState({
      loaded: true,
    });
  }

  props: {
    // Currently active date index
    currentDateIndex: ?number,
    // Array of dates to render
    dates: Array<Moment>,
    // Callback to handle date select
    onSelectDay: (index: number) => void,
    // Callback to handle date render
    onRenderDay: (index: number, width: number) => void,
  };

  render() {
    const {
      currentDateIndex,
      dates,
      onSelectDay,
      onRenderDay,
    } = this.props;

    const { loaded } = this.state;
    const { calendarData } = this.props;

    if (loaded) {
      return (
        <View style={styles.container}>
          {
            dates.map((date, index) => {
              const selectedDateData = calendarData.filter((data2) => {
                return data2.date === moment(date).format('YYYY-MM-DD');
              });

              return (
                <View key={index}>
                  <Date
                    date={date}
                    index={index}
                    isActive={index === currentDateIndex}
                    onPress={onSelectDay}
                    onRender={onRenderDay}
                    key={index}
                    statusData={selectedDateData} />
                </View>
              );
            })
          }
        </View>
      );
    } else {
      return (
        <ActivityIndicator size="small" />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#323248',
  },
});
