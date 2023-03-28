import React, { Component } from 'react';
import {
  Content,
  ListItem,
  Text,
  Toast,
  Icon,
} from 'native-base';

import { View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import XDate from 'xdate';
import DatePicker from 'react-native-datepicker';

import styles from '../../styles';

import {
  toTimestamp,
} from '../../../../services/common';

class BookingSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingStartDate: null,
      bookingEndDate: null,
    }
    this.setStartDateHandler = this.setStartDateHandler.bind(this);
    this.setEndDateHandler = this.setEndDateHandler.bind(this);
  }

  componentDidMount() {
    const { info } = this.props;

    this.setState({
      bookingStartDate: info.start_date,
      bookingEndDate: info.end_date,
    })
  }

  setStartDateHandler(newDate) {
    const { info } = this.props;

    this.setState({
      bookingStartDate: toTimestamp(newDate),
    });

    AsyncStorage.getItem('user_id').then((userId) => {
      AsyncStorage.getItem('token').then((token) => {
        AsyncStorage.getItem('baseUrl').then((baseUrl) => {
          AsyncStorage.getItem('selectedJobId').then((jobId) => {
            const postData = {
              user_id: `${userId}`,
              job_id: jobId,
              start: toTimestamp(newDate),
              end: info.end_date,
            };

            const axiosConfig = {
              headers: {
                // 'Content-Type': 'application/json;charset=UTF-8',
                // 'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${token}`,
              },
            };

            axios.post(`${baseUrl}/lykkebo/v1/jobdetails/updateJobDates`, postData, axiosConfig)
              .then(() => {
                Toast.show({
                  text: 'Opdateret succesfuldt',
                  position: 'bottom',
                  duration: 5000,
                  buttonText: 'Okay',
                  type: 'success',
                });
              })
              .catch((error) => {
                Toast.show({
                  text: error.message,
                  position: 'top',
                  duration: 5000,
                  type: 'error',
                });
              });
          });
        });
      });
    });
  }

  setEndDateHandler(newDate) {
    const { info } = this.props;
    this.setState({
      bookingEndDate: toTimestamp(newDate),
    });

    AsyncStorage.getItem('user_id').then((userId) => {
      AsyncStorage.getItem('token').then((token) => {
        AsyncStorage.getItem('baseUrl').then((baseUrl) => {
          AsyncStorage.getItem('selectedJobId').then((jobId) => {
            const postData = {
              user_id: `${userId}`,
              job_id: jobId,
              start: info.start_date,
              end: toTimestamp(newDate),
            };

            const axiosConfig = {
              headers: {
                // 'Content-Type': 'application/json;charset=UTF-8',
                // 'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${token}`,
              },
            };

            axios.post(`${baseUrl}/lykkebo/v1/jobdetails/updateJobDates`, postData, axiosConfig)
              .then(() => {
                Toast.show({
                  text: 'Opdateret succesfuldt',
                  position: 'bottom',
                  duration: 5000,
                  buttonText: 'Okay',
                  type: 'success',
                });
              })
              .catch((error) => {
                Toast.show({
                  text: error.message,
                  position: 'top',
                  duration: 5000,
                  type: 'error',
                });
              });
          });
        });
      });
    });
  }

  render() {
    const { info, user, showSpecifyModal } = this.props;
    const { bookingStartDate, bookingEndDate } = this.state;
    // console.log('user', user)
    return (
      <Content>
        <ListItem itemDivider>
          <Text style={{color: '#787878', fontWeight: 'bold'}}>Bookingoplysninger</Text>
        </ListItem>
        <ListItem style={styles.noMarginLeft}>
          <Text style={{width: '30%', paddingLeft: 18, color: '#7F7F7F'}}>Startdato</Text>
          <View style={{width: '70%', alignItems: 'flex-start'}}>
            {(Number(user) === 1 || Number(user) === 2)  ? (
              <DatePicker
                date={new Date(bookingStartDate * 1000)}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                confirmBtnText="Update"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    right: 0,
                    top: 4,
                    marginRight: 0,
                  },
                  dateInput: {
                    marginRight: 36,
                  },
                }}
                onDateChange={this.setStartDateHandler} />
            ) : (
              <Text style={{alignSelf: 'flex-start'}}>{XDate(new Date(info.start_date * 1000)).toString('yyyy-MMMM-dd')}</Text>
            )}
          </View>
        </ListItem>
        <ListItem style={styles.noMarginLeft}>
          <Text style={{width: '30%', paddingLeft: 18, color: '#7F7F7F'}}>Slutdato</Text>
          <View style={{width: '70%', alignItems: 'flex-start'}}>
            {(Number(user) === 1 || Number(user) === 2)  ? (
              <DatePicker
                date={new Date(bookingEndDate * 1000)}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                confirmBtnText="Update"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    right: 0,
                    top: 4,
                    marginRight: 0,
                  },
                  dateInput: {
                    marginRight: 36,
                  },
                }}
                onDateChange={this.setEndDateHandler} />
            ) : (
              <Text style={{alignSelf: 'flex-start'}}>{XDate(new Date(info.end_date * 1000)).toString('yyyy-MMMM-dd')}</Text>
            )}
          </View>
        </ListItem>
        <ListItem style={styles.noMarginLeft}>
          <Text style={{width: '40%', paddingLeft: 18, color: '#7F7F7F'}}>Arbejdsdage</Text>
          <TouchableOpacity
            style={{padding: 0}}
            transparent
            onPress={() => {
              showSpecifyModal(true);
            }}>
            <Icon name="switch" style={{color: 'black'}} />
          </TouchableOpacity>
        </ListItem>
        <ListItem style={styles.noMarginLeft}>
          <Text style={{width: '30%', paddingLeft: 18, color: '#7F7F7F'}}>Konsulent</Text>
          <Text style={{width: '70%'}}>{info.booking_info.consultant !== '' ? info.booking_info.consultant.name : ''}</Text>
        </ListItem>
        <ListItem style={styles.noMarginLeft}>
          <Text style={{width: '30%', paddingLeft: 18, color: '#7F7F7F'}}>Ansvarlig</Text>
          <Text style={{width: '70%'}}>{info.booking_info.responsible.length !== '' ? info.booking_info.responsible.name : ''}</Text>
        </ListItem>
        <ListItem style={styles.noMarginLeft}>
          <Text style={{width: '30%', paddingLeft: 18, color: '#7F7F7F'}}>Medarbejdere</Text>
          <Text style={{width: '70%'}}>{info.booking_info.employee.length !== '' ? info.booking_info.employee.name : ''}</Text>
        </ListItem>
        <ListItem style={styles.noMarginLeft}>
          <Text style={{width: '30%', paddingLeft: 18, color: '#7F7F7F'}}>Beskrivelse</Text>
          <Text style={{width: '70%'}}>{info.description}</Text>
        </ListItem>
      </Content>
    );
  }
}

export default BookingSection;
