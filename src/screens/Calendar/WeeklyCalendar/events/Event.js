import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Icon} from 'native-base';

import type { EventType } from '../index';

export default class Event extends Component {
  props: {
    event: EventType,
  };

  render() {
    const { event } = this.props;

    const {
      type,
      formatted_from,
      formatted_to,
    } = event[0];
    return (
      <View style={styles.container}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{width: '80%', height: 90}}>
            <View style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}>
              <View style={{width: '100%', height: 30}}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                  {type}
                </Text>
              </View>
              <View style={{width: '100%', height: 30}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{width: '20%', height: 30, paddingLeft: 10}}>
                    <Icon
                      active
                      name="calendar"
                      style={{ color: '#DD5044' }} />
                  </View>
                  <View style={{width: '80%', height: 30, paddingTop: 5}}>
                    <Text>{`Fra: ${formatted_from}`}</Text>
                  </View>
                </View>
              </View>
              <View style={{width: '100%', height: 30}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <View style={{width: '20%', height: 30, paddingLeft: 10}}>
                    <Icon
                      active
                      name="calendar"
                      style={{ color: '#DD5044' }} />
                  </View>
                  <View style={{width: '80%', height: 30, paddingTop: 5}}>
                    <Text>{`Til: ${formatted_to}`}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
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
    backgroundColor: 'white',
    padding: 15,
  },
  imageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: StyleSheet.hairlineWidth,
    // marginRight: 15,
    paddingTop: 35,
    width: 35,
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
    // color: 'rgba(255, 255, 255, 0.75)',
    color: '#000000',
  },
  title: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
