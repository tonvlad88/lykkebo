// Components
import React, { Component } from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  CardItem,
  Text,
  Left,
  Right,
  Body,
  H3,
  DatePicker,
  Tab,
  Tabs,
  Toast,
} from 'native-base';

import {
  View,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
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

i18n.fallbacks = true;
i18n.translations = { da, en };
i18n.locale = Localization.locale;

LocaleConfig.locales['dynamic'] = {
  monthNames: [i18n.t('january'), i18n.t('february'), i18n.t('march'), i18n.t('april'), i18n.t('may'), i18n.t('june'), i18n.t('july'), 'August', 'September', i18n.t('october'), 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', i18n.t('shortmay'), 'Jun', 'Jul', 'Aug', 'Sep', i18n.t('shortokt'), 'Nov', 'Dec'],
  dayNames: [i18n.t('sunday'), i18n.t('monday'), i18n.t('tuesday'), i18n.t('wednesday'), i18n.t('thursday'), i18n.t('friday'), i18n.t('saturday')],
  dayNamesShort: [i18n.t('sun'), i18n.t('mon'), i18n.t('tue'), i18n.t('wed'), i18n.t('thu'), i18n.t('fri'), i18n.t('sat')],
  amDesignator: 'AM',
  pmDesignator: 'PM',
};
LocaleConfig.defaultLocale = 'dynamic';

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

const bookingStatusStyle0 = {key: 'booking0', color: '#FF9F00', selectedDotColor: 'blue'};
const bookingStatusStyle1 = {key: 'booking1', color: '#FF9F00', selectedDotColor: 'blue'};
const bookingStatusStyle2 = {key: 'booking2', color: '#FF9F00', selectedDotColor: 'blue'};
const bookingStatusStyle3 = {key: 'booking3', color: '#FF9F00', selectedDotColor: 'blue'};
const bookingStatusStyle4 = {key: 'booking4', color: '#FF9F00', selectedDotColor: 'blue'};
const bookingStatusStyle5 = {key: 'booking5', color: '#FF9F00', selectedDotColor: 'blue'};
const bookingStatusStyle6 = {key: 'booking6', color: '#FF9F00', selectedDotColor: 'blue'};
const bookingStatusStyle7 = {key: 'booking7', color: '#FF9F00', selectedDotColor: 'blue'};
const bookingStatusStyle8 = {key: 'booking8', color: '#FF9F00', selectedDotColor: 'blue'};
const bookingStatusStyle9 = {key: 'booking9', color: '#FF9F00', selectedDotColor: 'blue'};
const bookingStatusStyle10 = {key: 'booking10', color: '#FF9F00', selectedDotColor: 'blue'};
const vacationStatusStyle = {key: 'vacation', color: '#0000FF', selectedDotColor: 'blue'};
const sickStatusStyle = {key: 'sick', color: '#FF0000', selectedDotColor: 'blue'};
const schoolStatusStyle = {key: 'school', color: '#20FF20', selectedDotColor: 'blue'};
const otherStatusStyle = {key: 'others', color: '#808000', selectedDotColor: 'blue'};

const today = new Date().toISOString().slice(0, 10);

const entryStatus = [
  {value: 'Ferie', label: 'Ferie'},
  {value: 'Sygdom', label: 'Sygdom'},
  {value: 'Skole', label: 'Skole'},
  {value: 'Andet', label: 'Andet'},
];

const _format = 'YYYY-MM-DD'
const _today = moment().format(_format)
const _maxDate = moment().add(15, 'days').format(_format)

class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseData: {},
      markedDates: {},
      selectedMarkedDateData: {},
      loaded: false,
      visibleModal: null,
      isUpdate: false,
      selected1: 'Ferie',
      selectedDate: XDate(true).toString('yyyy-MM-dd'),
      dateFrom: '',
      dateEnd: '',
      refresh: 0,
      isFutureDate: true,
    };
  }

  async componentDidMount() {
    await this.getCalendarData(toTimestampWithSeconds(today), today);
  }

  onValueChange = (value: string) => {
    this.setState({
      selected1: value,
    });
  }

  onDayPress = (day) => {
    this.createMarkedDates(day);
  }

  getCalendarData = async (dateParam, dateSelected) => {
    const { navigation } = this.props;
    const temp1 = [];
    const userId = await AsyncStorage.getItem('user_id');
    const token = await AsyncStorage.getItem('token');
    const baseUrl = await AsyncStorage.getItem('baseUrl');
    fetch(`${baseUrl}/lykkebo/v1/calendar/overview?user_id=${userId}&month=${dateParam}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then((data) => {
        if ('code' in data && data.code === 'jwt_auth_invalid_token') {
          AsyncStorage.removeItem('token')
            .then(
              AsyncStorage.clear().then(() => {
                navigation.navigate('Auth');
              })
            );
        }

        deviceStorage.saveKey('user_relation', data.user_relation);
        let i;
        const markedDatesTemp = data.days.reduce((acc, crr, idx) => {
          switch (crr.type) {
          case 'Booking':
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
            acc[crr.date] = (dateSelected === crr.date) ? {
              selected: true, selectedColor: '#00ADF5', type: 'booking', dots: temp1,
            } : {type: 'booking', dots: temp1};

            break;
          case 'Ferie':
            acc[crr.date] = (dateSelected === crr.date) ? {
              selected: true, selectedColor: '#00ADF5', type: 'vacation', dots: [vacationStatusStyle],
            } : { type: 'vacation', dots: [vacationStatusStyle]};
            break;
          case 'Sygdom':
            acc[crr.date] = (dateSelected === crr.date) ? {
              selected: true, selectedColor: '#00ADF5', type: 'sick', dots: [sickStatusStyle],
            } : {type: 'sick', dots: [sickStatusStyle]};
            break;
          case 'Skole':
            acc[crr.date] = (dateSelected === crr.date) ? {
              selected: true, selectedColor: '#00ADF5', type: 'school', dots: [schoolStatusStyle],
            } : {type: 'school', dots: [schoolStatusStyle]};
            break;
          case 'Andet':
            acc[crr.date] = (dateSelected === crr.date) ? {
              selected: true, selectedColor: '#00ADF5', type: 'other', dots: [otherStatusStyle],
            } : {type: 'other', dots: [otherStatusStyle]};
            break;
          default:
            acc[crr.date] = {type: 'booking', dots: [bookingStatusStyle0]};
          }
          if (idx === 0) {
            const tempSelected = data.days.filter(data2 => data2.date === dateSelected);
            if (tempSelected.length === 0) {
              acc[dateSelected] = {selected: true, selectedColor: '#00ADF5'};
            }
          }
          return acc;
        }, {});

        this.setState({
          baseData: data.days,
          markedDates: markedDatesTemp,
          loaded: true,
          selectedMarkedDateData: data.days.filter(data2 => data2.date === dateSelected),
        });
      })
      .catch((error) => {
        Toast.show({
          text: error.message,
          position: 'top',
          duration: 3000,
        });
      });
  }

  getDates(startDate, endDate) {
    var dates = [],
    currentDate = startDate,
    addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
    while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = addDays.call(currentDate, 1);
    }
    return dates;
  }

  createMarkedDates = (day) => {
    const { baseData } = this.state;
    // console.log('baseData', baseData)
    let i;
    const markedDatesTemp = baseData.reduce((acc, crr, idx) => {
      switch (crr.type) {
      case 'Booking':
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
        acc[crr.date] = (day.dateString === crr.date) ? {
          selected: true, selectedColor: '#00ADF5', type: 'booking', dots: temp1,
        } : {type: 'booking', dots: temp1};
        break;
      case 'Ferie':
        acc[crr.date] = (day.dateString === crr.date) ? {
          selected: true, selectedColor: '#00ADF5', type: 'vacation', dots: [vacationStatusStyle],
        } : { type: 'vacation', dots: [vacationStatusStyle]};
        break;
      case 'Sygdom':
        acc[crr.date] = (day.dateString === crr.date) ? {
          selected: true, selectedColor: '#00ADF5', type: 'sick', dots: [sickStatusStyle],
        } : {type: 'sick', dots: [sickStatusStyle]};
        break;
      case 'Skole':
        acc[crr.date] = (day.dateString === crr.date) ? {
          selected: true, selectedColor: '#00ADF5', type: 'school', dots: [schoolStatusStyle],
        } : {type: 'school', dots: [schoolStatusStyle]};
        break;
      case 'Andet':
        acc[crr.date] = (day.dateString === crr.date) ? {
          selected: true, selectedColor: '#00ADF5', type: 'other', dots: [otherStatusStyle],
        } : {type: 'other', dots: [otherStatusStyle]};
        break;
      default:
        acc[crr.date] = {type: 'booking', dots: [bookingStatusStyle0]};
      }
      if (idx === 0) {
        const tempSelected = baseData.filter(data2 => data2.date === day.dateString);
        if (tempSelected.length === 0) {
          acc[day.dateString] = {selected: true, selectedColor: '#00ADF5'};
        }
      }
      return acc;
    }, {});
    this.setState({
      markedDates: markedDatesTemp,
      selectedDate: day.dateString,
      selectedMarkedDateData: baseData.filter(data2 => data2.date === day.dateString),
    });
  }

  startDatePickedHandler = (date) => {
    // const date2 = new Date(date);
    // const timestamp = date2.getTime() / 1000;
    this.setState({
      dateFrom: XDate(date).toString('yyyy-MM-dd'),
      // dateFromTimestamp: timestamp,
    });
  };

  endDatePickedHandler = (date) => {
    // const date2 = new Date(date);
    // const timestamp = date2.getTime() / 1000;
    this.setState({
      dateEnd: XDate(date).toString('yyyy-MM-dd'),
      // dateEndTimestamp: timestamp,
    });
  };

  onMonthChange = (month) => {
    const { selectedDate } = this.state;
    this.getCalendarData(toTimestampWithSeconds(month.dateString), selectedDate);
  }

  saveDayInfoHandler() {
    const {
      dateFrom, dateEnd, selected1, selectedDate, isUpdate,
    } = this.state;

    AsyncStorage.getItem('user_id').then((userId) => {
      AsyncStorage.getItem('token').then((token) => {
        AsyncStorage.getItem('baseUrl').then((baseUrl) => {
          const tempReason = setDayStatus(selected1);
          const startDay = dateFrom !== '' ? toTimestamp(new Date(dateFrom)) : toTimestamp(new Date(selectedDate));
          const endDay = dateEnd !== '' ? toTimestamp(new Date(dateEnd)) : toTimestamp(new Date(selectedDate));

          const postData = {
            user_id: `${userId}`,
            reason: `${tempReason}`,
            start_day: `${startDay}`,
            end_day: `${endDay}`,
          };

          const axiosConfig = {
            headers: {
              // 'Content-Type': 'application/json;charset=UTF-8',
              // 'Access-Control-Allow-Origin': '*',
              Authorization: `Bearer ${token}`,
            },
          };

          let url = `${baseUrl}/lykkebo/v1/calendar/create`;
          if (isUpdate) {
            url = `${baseUrl}/lykkebo/v1/calendar/update`;
          }

          axios.post(url, postData, axiosConfig)
            .then(async () => {
              await this.getCalendarData(toTimestampWithSeconds(today), selectedDate);
              this.setState({
                selected1: 'Ferie',
                visibleModal: null,
              });
            })
            .catch((error) => {
              Toast.show({
                text: error.message,
                position: 'top',
                duration: 5000,
              });
            });
        });
      });
    });
  }

  removeDayInfoHandler() {
    const { selectedMarkedDateData, selectedDate } = this.state;
    AsyncStorage.getItem('user_id').then((userId) => {
      AsyncStorage.getItem('token').then((token) => {
        AsyncStorage.getItem('baseUrl').then((baseUrl) => {
          const postData = {
            // user_id: `${userId}`,
            // day_id: selectedMarkedDateData[0].id,
          };

          const axiosConfig = {
            headers: {
              // 'Content-Type': 'application/json;charset=UTF-8',
              // 'Access-Control-Allow-Origin': '*',
              Authorization: `Bearer ${token}`,
            },
          };

          axios.get(`${baseUrl}/lykkebo/v1/calendar/delete?user_id=${userId}&day_id=${selectedMarkedDateData[0].id}`, postData, axiosConfig)
            .then(async () => {
              await this.getCalendarData(toTimestampWithSeconds(today), selectedDate);
              this.setState({
                selected1: 'Ferie',
                visibleModal: null,
              });
            })
            .catch((error) => {
              Toast.show({
                text: error.message,
                position: 'top',
                duration: 5000,
              });
            });
        });
      });
    });
  }

  openBooking(booking) {
    const { navigation } = this.props;
    AsyncStorage.setItem('selectedJobId', booking.id).then(() => {
      navigation.navigate('Jobdetails');
    });
  }

  renderSelectedDateDetails() {
    const { selectedDate, selectedMarkedDateData, isFutureDate } = this.state;
    // console.log('selectedMarkedDateData', selectedMarkedDateData)
    if (selectedMarkedDateData === undefined || selectedMarkedDateData.length === 0) {
      return (
        <View
          key={Math.floor(Date.now()) + Math.floor((Math.random() * 10000) + 1)}
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'stretch',
          }}>
          <View style={{flex: 1, padding: 10}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{
                flex: 1, borderRightWidth: 2, borderColor: '#fff', justifyContent: 'center', alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 80, color: '#fff', fontWeight: 'bold',
                }}>
                  {XDate(selectedDate).toString('d')}
                </Text>
              </View>
              <View style={{
                flex: 2, justifyContent: 'center', alignItems: 'center', paddingLeft: 10,
              }}>
                <CardItem header style={{width: '100%', borderBottomWidth: 2, borderColor: '#6C6C6C'}}>
                  <Body>
                    <Text>Ingen begivenhed fundet</Text>
                  </Body>
                </CardItem>
                <CardItem style={{flex: 1}}>
                  <Body>
                    <Button
                      full
                      light
                      style={[styles.mt15, {alignItems: 'center'}]}
                      onPress={() => this.setState({visibleModal: 1})}>
                      <Icon
                        active
                        name="ios-add-circle"
                        style={{ color: '#DD5044' }} />
                      <Text style={{flex: 1}}> Tilføj Begivenhed </Text>
                    </Button>
                  </Body>
                </CardItem>
              </View>
            </View>
          </View>
        </View>
      );
    } else if (selectedMarkedDateData[0].type === 'Booking') {
      return (
        <View
          key={Math.floor(Date.now()) + Math.floor((Math.random() * 10000) + 1)}
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'stretch',
          }}>
          <View style={{flex: 1, padding: 10}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{
                flex: 1, borderRightWidth: 2, borderColor: '#fff', justifyContent: 'center', alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 80, color: '#fff', fontWeight: 'bold',
                }}>
                  {XDate(selectedDate).toString('d')}
                </Text>
              </View>
              <View style={{
                flex: 2, justifyContent: 'center', alignItems: 'center', paddingLeft: 10,
              }}>
                <View style={{flex: 1, width: '100%', backgroundColor: 'white'}}>
                  <CardItem header style={{width: '100%', borderBottomWidth: 2, borderColor: '#6C6C6C'}}>
                    <Text style={{fontWeight: 'bold'}}>
                      {jsUcfirst(selectedMarkedDateData[0].type)}
                    </Text>
                  </CardItem>
                  <ScrollView style={{flex: 1}}>
                    <Button
                      full
                      light
                      style={[styles.mt15, {alignItems: 'center'}]}
                      onPress={() => this.setState({visibleModal: 1})}>
                      <Icon
                        active
                        name="ios-add-circle"
                        style={{ color: '#DD5044' }} />
                      <Text style={{flex: 1}}> Tilføj Begivenhed </Text>
                    </Button>
                    {selectedMarkedDateData.map((booking) => {
                      if (booking.type !== 'Booking') {
                        return (
                          <TouchableOpacity
                            style={{flex: 1}}
                            onPress={() => {
                              this.openBooking(booking);
                              // onPress={() => navigation.navigate('Jobdetails')}
                            }}
                            key={Math.floor(Date.now()) + Math.floor((Math.random() * 10000) + 1)}>
                            <CardItem>
                              <Left>
                                <Icon
                                  active
                                  name="ios-construct"
                                  style={{ color: '#DD5044' }} />
                                <Text numberOfLines={1}>
                                  {booking.details[0].title}
                                </Text>
                              </Left>
                              <Right>
                                <Icon name="arrow-forward" />
                              </Right>
                            </CardItem>
                          </TouchableOpacity>
                        );
                      } else {
                        return (
                          <View key={Math.floor(Date.now()) + Math.floor((Math.random() * 10000) + 1)}>
                            {
                              booking.details.map(data => (
                                <TouchableOpacity
                                  style={{flex: 1}}
                                  onPress={() => {
                                    this.openBooking(data);
                                    // onPress={() => navigation.navigate('Jobdetails')}
                                  }}
                                  key={Math.floor(Date.now()) + Math.floor((Math.random() * 10000) + 1)}>
                                  <CardItem>
                                    <Left>
                                      <Icon
                                        active
                                        name="ios-construct"
                                        style={{ color: '#DD5044' }} />
                                      <Text numberOfLines={1}>
                                        {data.title}
                                      </Text>
                                    </Left>
                                    <Right>
                                      <Icon name="arrow-forward" />
                                    </Right>
                                  </CardItem>
                                </TouchableOpacity>
                              ))}
                          </View>
                        );
                      }
                    })}
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View
          key={Math.floor(Date.now()) + Math.floor((Math.random() * 10000) + 1)}
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'stretch',
          }}>
          <View style={{flex: 1, padding: 10}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{
                flex: 1, borderRightWidth: 2, borderColor: '#fff', justifyContent: 'center', alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 80, color: '#fff', fontWeight: 'bold',
                }}>
                  {XDate(selectedDate).toString('d')}
                </Text>
              </View>
              <View style={{
                flex: 2, justifyContent: 'center', alignItems: 'center', paddingLeft: 10,
              }}>
                <View style={{flex: 1, width: '100%', backgroundColor: 'white'}}>
                  <CardItem header style={{width: '100%', borderBottomWidth: 2, borderColor: '#6C6C6C'}}>
                    <Left>
                      <Text style={{fontWeight: 'bold'}}>
                        {jsUcfirst(selectedMarkedDateData[0].type)}
                      </Text>
                    </Left>
                    <Right>
                      <TouchableOpacity style={{marginTop: -4}}>
                        <Icon
                          style={{color: '#2e3d43'}}
                          active
                          onPress={() => this.setState({visibleModal: 1, isUpdate: true})}
                          name="md-open" />
                      </TouchableOpacity>
                    </Right>
                  </CardItem>
                  <ScrollView style={{flex: 1}}>
                    <Button
                      full
                      light
                      style={[styles.mt15, {alignItems: 'center'}]}
                      onPress={() => this.setState({visibleModal: 1})}>
                      <Icon
                        active
                        name="ios-add-circle"
                        style={{ color: '#DD5044' }} />
                      <Text style={{flex: 1}}> Tilføj Begivenhed </Text>
                    </Button>
                    <View
                      key={Math.floor(Date.now()) + Math.floor((Math.random() * 10000) + 1)}
                      style={{flex: 1}}>
                      <CardItem style={{width: '100%', justifyContent: 'flex-start'}}>
                        <Left>
                          <Icon
                            active
                            name="calendar"
                            style={{ color: '#DD5044' }} />
                          <Text>
                            {`Fra: ${selectedMarkedDateData[0].details[0].formatted_from}`}
                          </Text>
                        </Left>
                      </CardItem>
                      <CardItem style={{width: '100%', justifyContent: 'flex-start'}}>
                        <Left>
                          <Icon
                            active
                            name="calendar"
                            style={{ color: '#DD5044' }} />
                          <Text>
                            {`Til: ${selectedMarkedDateData[0].details[0].formatted_to}`}
                          </Text>
                        </Left>
                      </CardItem>
                    </View>
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }
  }

  renderModalContent = () => {
    const { selectedDate, isFutureDate } = this.state;

    return (
      <View style={{
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
      }}>
        {/* {isFutureDate ? (
          <View />
        ) : (
          <View style={{height: 50, width: '100%', marginTop: 10}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{
                flex: 1, height: 50, paddingRight: 5, borderWidth: 0.5, borderColor: '#E2B838', backgroundColor: '#FFFCBF', justifyContent: 'center',
              }}>
                <Text style={{textAlign: 'center'}}>Du kan ikke melde fravær tilbage i tiden.</Text>
              </View>
            </View>
          </View>
        )} */}
        <View style={{
          height: 50, width: '100%', borderBottomWidth: 1, borderColor: '#ccc',
        }}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{
              width: 90, height: 50, paddingTop: 10, justifyContent: 'center',
            }}>
              <H3 style={[styles.mb10, {color: '#ccc'}]}>Grund</H3>
            </View>
            <View style={{flex: 1, height: 50}}>
              <Dropdown
                label=""
                labelHeight={0}
                fontSize={20}
                containerStyle={{paddingLeft: 10}}
                inputContainerStyle={{ borderBottomColor: 'transparent' }}
                value="Ferie"
                data={entryStatus}
                onChangeText={this.onValueChange} />
            </View>
          </View>
        </View>
        <View style={{
          height: 50, width: '100%', borderBottomWidth: 1, borderColor: '#ccc',
        }}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{
              width: 90, height: 50, paddingTop: 10, justifyContent: 'center',
            }}>
              <H3 style={[styles.mb10, {color: '#ccc'}]}>Fra</H3>
            </View>
            <View style={{flex: 1, height: 50}}>
              <DatePicker
                defaultDate={new Date(selectedDate)}
                // minimumDate={new Date(2018, 1, 1)}
                // maximumDate={new Date(2018, 12, 31)}
                locale="en"
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType="fade"
                androidMode="default"
                // placeHolderText="Select start date"
                textStyle={{ color: '#000' }}
                placeHolderTextStyle={{ color: '#ccc' }}
                onDateChange={this.startDatePickedHandler} />
            </View>
          </View>
        </View>
        <View style={{
          height: 50, width: '100%', borderBottomWidth: 1, borderColor: '#ccc',
        }}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{
              width: 90, height: 50, paddingTop: 10, justifyContent: 'center',
            }}>
              <H3 style={[styles.mb10, {color: '#ccc'}]}>Til</H3>
            </View>
            <View style={{flex: 1, height: 50}}>
              <DatePicker
                defaultDate={new Date(selectedDate)}
                // minimumDate={new Date(2018, 1, 1)}
                // maximumDate={new Date(2018, 12, 31)}
                locale="en"
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType="fade"
                androidMode="default"
                // placeHolderText="Select end date"
                textStyle={{ color: '#000' }}
                placeHolderTextStyle={{ color: '#ccc' }}
                onDateChange={this.endDatePickedHandler} />
            </View>
          </View>
        </View>
        <View style={{height: 50, width: '100%', marginTop: 10}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            {/* {!isFutureDate ? (
              <View />
            ) : (
              <View style={{flex: 1, height: 50, paddingRight: 5}}>
                <Button
                  primary
                  full
                  style={styles.mt15}
                  onPress={() => this.saveDayInfoHandler()}>
                  <Text>Save</Text>
                </Button>
              </View>
            )}

            {!isFutureDate ? (
              <View />
            ) : (
              <View style={{flex: 1, height: 50}}>
                <Button
                  danger
                  full
                  style={styles.mt15}
                  onPress={() => this.removeDayInfoHandler()}>
                  <Text>Remove</Text>
                </Button>
              </View>
            )} */}

            <View style={{flex: 1, height: 50, paddingRight: 5}}>
              <Button
                primary
                full
                style={styles.mt15}
                onPress={() => this.saveDayInfoHandler()}>
                <Text>{i18n.t('save')}</Text>
              </Button>
            </View>

            <View style={{flex: 1, height: 50}}>
              <Button
                danger
                full
                style={styles.mt15}
                onPress={() => this.removeDayInfoHandler()}>
                <Text>{i18n.t('delete')}</Text>
              </Button>
            </View>

            <View style={{flex: 1, height: 50, paddingLeft: 5}}>
              <Button
                full
                light
                style={styles.mt15}
                onPress={() => this.setState({ visibleModal: null })}>
                <Text>{i18n.t('cancel')}</Text>
              </Button>
            </View>
          </View>
        </View>
        {/* {this.renderButton('Close', () => this.setState({ visibleModal: null }))} */}
      </View>
    );
  };

  renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    const {
      loaded, markedDates, visibleModal, refresh,
    } = this.state;
    const { navigation } = this.props;

    if (loaded) {
      return (
        <Container style={styles.container}>
          <StatusBar hidden />
          <Header style={{ backgroundColor: '#2E3D43' }}>
            <Left style={{ flex: 1 }}>
              <Button transparent>
                <Icon
                  style={{color: '#ffffff'}}
                  size={40}
                  name="menu"
                  onPress={() => navigation.openDrawer()} />
              </Button>
            </Left>
            <Body style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Title style={{color: '#ffffff'}}>{i18n.t('calendar')}</Title>
            </Body>
            <Right style={{ flex: 1 }} />
          </Header>
          <View style={{
            width: '100%', height: 3, backgroundColor: '#323248', marginBottom: 1,
          }} />
          <Tabs tabBarUnderlineStyle={{backgroundColor: 'white'}}>
            <Tab
              heading="Måned"
              tabStyle={{backgroundColor: '#314148'}}
              textStyle={{color: '#fff'}}
              activeTabStyle={{backgroundColor: '#314148'}}
              activeTextStyle={{color: '#fff', fontWeight: 'bold'}}>
              <Content
                contentContainerStyle={{flex: 1, backgroundColor: '#A5A5A5'}}>
                <Calendar
                  style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    height: 380,
                  }}
                  rowHasChanged={(r1, r2) => r1.booking_id !== r2.booking_id}
                  pastScrollRange={40}
                  futureScrollRange={50}
                  theme={{
                    calendarBackground: '#333248',
                    textSectionTitleColor: 'white',
                    dayTextColor: 'white',
                    todayTextColor: 'red',
                    selectedDayTextColor: 'white',
                    monthTextColor: 'white',
                    selectedDayBackgroundColor: '#333248',
                    arrowColor: 'white',
                    // textDisabledColor: 'red',
                    textMonthFontSize: 26,
                    'stylesheet.calendar.header': {
                      week: {
                        marginTop: 5,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderBottomWidth: 2,
                        borderColor: '#D4D4D4',
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
                  onPressArrowLeft={substractMonth => substractMonth()}
                  onPressArrowRight={addMonth => addMonth()}
                  markedDates={markedDates}
                  markingType="multi-dot" />
                <View style={{width: '100%', height: 3, backgroundColor: '#6C6C6C'}} />
                { this.renderSelectedDateDetails() }

                <Modal
                  isVisible={visibleModal === 1}
                  backdropColor="#ccc"
                  backdropOpacity={0.9}
                  animationIn="zoomInDown"
                  animationOut="zoomOutUp"
                  animationInTiming={1000}
                  animationOutTiming={1000}
                  backdropTransitionInTiming={1000}
                  backdropTransitionOutTiming={1000}>
                  {this.renderModalContent()}
                </Modal>

              </Content>
            </Tab>
            <Tab heading="Uge" tabStyle={{backgroundColor: '#314148'}} textStyle={{color: '#fff'}} activeTabStyle={{backgroundColor: '#314148'}} activeTextStyle={{color: '#fff', fontWeight: 'bold'}}>
              <TabTwo key={refresh} navigation={navigation} />
            </Tab>
          </Tabs>
        </Container>
      );
    } else {
      return (
        <Container style={styles.container}>
          <StatusBar hidden />
          <Header style={{ backgroundColor: '#2E3D43' }}>
            <Left style={{ flex: 1 }}>
              <Button transparent>
                <Icon
                  style={{color: '#ffffff'}}
                  size={40}
                  name="menu"
                  onPress={() => navigation.openDrawer()} />
              </Button>
            </Left>
            <Body style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Title style={{color: '#ffffff'}}>Kalender</Title>
            </Body>
            <Right style={{ flex: 1 }} />
          </Header>
          <View style={{
            width: '100%', height: 3, backgroundColor: '#323248', marginBottom: 1,
          }} />
          <ActivityIndicator size="large" color="#2E3D43" style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}} />
        </Container>
      );
    }
  }
}

const mapStateToProps = state => ({
  tracker: state.tracker,
});

const mapDispatchToProps = dispatch => ({
  // getTracker: (userId, date) => dispatch(getTracker(userId, date)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen);
