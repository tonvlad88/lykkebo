import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

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
  Picker,
  H3,
  DatePicker,
  Tab,
  Tabs,
} from 'native-base';

import Event from './Event';
import EventBooking from './EventBooking';
import type { EventType } from '../index';

export default class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: null,
    }
  }

  props: {
    events: ?Array<EventType>,
  };

  render() {
    const { events, onModalPress, navigation } = this.props;
    // console.log('events', events);
    if (events === undefined || events.length === 0) {
      return (
        <View
          key={Math.floor(Date.now()) + Math.floor((Math.random() * 10000) + 1)}
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'stretch',
          }}>
          <View style={styles.container}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{
                flex: 1, justifyContent: 'center', alignItems: 'center',
              }}>
                <CardItem
                  header
                  style={{
                    width: '100%', borderBottomColor: 'rgba(255, 255, 255, 0.1)', borderBottomWidth: StyleSheet.hairlineWidth, backgroundColor: '#A5A5A5',
                  }}>
                  <Body>
                    <Text style={{color: 'white'}}>Ingen begivenhed fundet</Text>
                  </Body>
                </CardItem>
                <CardItem style={{flex: 1, backgroundColor: '#A5A5A5'}}>
                  <Body>
                    <Button
                      full
                      light
                      style={styles.mt15}
                      onPress={() => onModalPress()}>
                      <Icon
                        active
                        name="ios-add-circle"
                        style={{ color: '#DD5044' }} />
                      <Text> Tilføj Begivenhed </Text>
                    </Button>
                  </Body>
                </CardItem>
              </View>
            </View>
          </View>
        </View>
      );
    } else {
      let temp = [];
      if (events[0].type === 'Booking') {
        temp = events;
      } else {
        temp = [{
          id: events[0].id,
          type: events[0].type,
          date: events[0].date,
          details: [events[0].details],
        }];
      }
      return (
        <View style={styles.container}>
          <ScrollView>
            {events && temp[0].details.map((event) => {
              if (event.type === 'Booking') {
                return (<EventBooking event={event} key={event.id} navigation={navigation} />);
              } else {
                return (<Event event={event} key={event.id} />);
              }
            })}
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A5A5A5',
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
