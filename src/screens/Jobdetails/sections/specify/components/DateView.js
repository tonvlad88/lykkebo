import React, { Component } from 'react';
import { View, Text } from 'react-native';

import XDate from 'xdate';
import styles from './styles/DateViewStyles';

export default class DateView extends Component {
  render() {
    const { date } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.day}>{XDate(date * 1000).toString('ddd')}</Text>
        <Text style={styles.date}>{XDate(date * 1000).toString('d')}</Text>
        <Text style={styles.month}>{XDate(date * 1000).toString('MMMM')}</Text>
      </View>
    );
  }
}
