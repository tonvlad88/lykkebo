import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import moment from 'moment';
import XDate from 'xdate';
import styles from './styles/DateViewStyles';

export default class DateView extends Component {

  // constructor(props) {
  //   super(props);
  //   this.day = moment().format('ddd');
  //   this.date = moment().format('D');
  //   this.month = moment().format('MMMM');
  // };

  render() {
    const { date } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.day}>{XDate(date).toString('ddd')}</Text>
        <Text style={styles.date}>{XDate(date).toString('d')}</Text>
        <Text style={styles.month}>{XDate(date).toString('MMMM')}</Text>
      </View>
    );
  };
};
