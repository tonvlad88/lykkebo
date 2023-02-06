import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, Switch } from 'react-native';

// import config from '../config';

import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles/TodoRowItemStyles';
import DateView from './DateView';

export default class TodoRowItem extends Component {

  render() {
    const {booking, time} = this.props;
    const {name, date} = booking;

    return (
      <View style={styles.row} key={booking.uid}>
        <View style={styles.timelineDate}>
          <DateView date={date} />
        </View>
        <View style={styles.timeline}>
          <View style={styles.timelineVerticalLink} />
          <Icon
             style={styles.icon}
             name={'circle'}
             size={'6'}
           />
        </View>
        <View style={styles.content}>
          <Text style={styles.text}>{name}</Text>
          <Text style={styles.time}>Arbejde</Text>
        </View>
        <View style={styles.switch}>
          <Switch
            // onValueChange = {props.toggleSwitch1}
            value = {true}
          />
        </View>
      </View>
    );
  };
};
