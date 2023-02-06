import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
} from 'react-native';

import { Icon } from 'native-base';

import type { EventType } from '../index';

export default class EventBooking extends Component {
  props: {
    event: EventType,
  };

  render() {
    const { event } = this.props;
    const { title } = event;
    return (
      <View style={styles.container}>
        <Icon
          active
          name="ios-construct"
          style={{ color: '#DD5044' }} />
        <View style={styles.textContainer}>
          <Text style={[styles.text, styles.title]}>{title}</Text>
        </View>
        <Icon
          onPress={() => {
            const { navigation } = this.props;
            AsyncStorage.setItem('selectedJobId', event.id).then(() => {
              navigation.navigate('Jobdetails');
            });
          }}
          name="arrow-forward"
          style={{ color: '#DADADA' }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 0.5,
  },
  imageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: 15,
    width: 90,
    height: 90,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 20,
  },
  image: {
    width: 89,
    height: 89,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  title: {
    color: '#000000',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
