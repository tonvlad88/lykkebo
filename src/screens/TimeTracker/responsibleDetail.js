import React, { Component } from 'react';
import {
  Image,
  View,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Container,
  Header,
  Title,
  Button,
  Card,
  CardItem,
  Icon,
  Text,
  Left,
  Right,
  Body,
  Toast,
  Col,
  Badge,
  ListItem,
} from 'native-base';

import { convertSecondsToTime } from '../../services/common';

import styles from './styles';

const approve = require('../../../assets/green.png');
const reject = require('../../../assets/red.png');

class TimeTrackerResponsibleDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      loaded: false,
      userRelation: 0,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('user_id').then((userId) => {
      AsyncStorage.getItem('token').then((token) => {
        AsyncStorage.getItem('user_relation').then((userRelation) => {
          AsyncStorage.getItem('baseUrl').then((baseUrl) => {
            AsyncStorage.getItem('selectedTimeTrackerDetails').then((selectedTimeTrackerDetails) => {
              fetch(`${baseUrl}/lykkebo/v1/time/overview?user_id=${userId}`, {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
                .then(response => response.json())
                .then(() => {
                  this.setState({
                    data: JSON.parse(selectedTimeTrackerDetails),
                    loaded: true,
                    userRelation,
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
      });
    });
  }

  renderTimeStatusHandler = (status) => {
    if (Number(status) === 100) {
      return (
        <Col>
          <Badge warning style={{alignSelf: 'flex-end'}}>
            <Text style={{color: 'white', textAlign: 'center'}}>ikke angivet</Text>
          </Badge>
        </Col>
      );
    } else if (Number(status) === 0) {
      return (
        <Col style={{alignItems: 'flex-end'}}>
          <Badge warning style={{alignSelf: 'flex-end'}}>
            <Text style={{color: 'white', textAlign: 'center'}}>Verserende</Text>
          </Badge>
        </Col>
      );
    } else if (Number(status) === 1) {
      return (
        <Col style={{alignItems: 'flex-end'}}>
          <Badge success style={{alignSelf: 'flex-end'}}>
            <Text style={{color: 'white', textAlign: 'center'}}>godkendt</Text>
          </Badge>
        </Col>
      );
    } else {
      return (
        <Col style={{alignItems: 'flex-end'}}>
          <Badge danger style={{alignSelf: 'flex-end'}}>
            <Text style={{color: 'white', textAlign: 'center'}}>afvist</Text>
          </Badge>
        </Col>
      );
    }
  }

  render() {
    const {
      data,
      loaded,
      userRelation,
    } = this.state;
    const { navigation } = this.props;

    if (loaded) {
      return (
        <Container style={styles.container}>
          <StatusBar hidden />
          <Header style={{ backgroundColor: '#2E3D43' }}>
            <Left>
              <Button transparent>
                <Icon
                  style={{color: '#ffffff'}}
                  size={40}
                  name="arrow-back"
                  onPress={() => navigation.navigate('TimeTrackerResponsible')} />
              </Button>
            </Left>
            <Body>
              <Title style={{color: '#ffffff'}}>Tid</Title>
            </Body>
            <Right />
          </Header>

          <View style={{ flex: 1, padding: 12 }}>
            <Card>
              <CardItem header bordered>
                <Col><Text style={{flex: 1, fontWeight: 'bold'}}>{`BOOKING ${data.job_id}`}</Text></Col>
                {this.renderTimeStatusHandler(data.status)}
              </CardItem>
              <CardItem bordered>
                <Body style={{borderBottomWidth: 0}}>
                  <Text style={{fontSize: 12, color: '#000', fontWeight: 'bold'}}>Apprentice</Text>
                  <Text note numberOfLines={1} style={{color: '#000', fontWeight: 'bold'}}>{data.apprentice_name}</Text>
                </Body>
                <Right />
              </CardItem>
              {data.time_entry_details.map(data2 => (
                <CardItem bordered key={data2.job_id}>
                  <Body style={{borderBottomWidth: 0}}>
                    <Text note numberOfLines={1} style={{color: '#787683'}}>{data2.description}</Text>
                  </Body>
                  <Right style={{borderBottomWidth: 0}}>
                    <Text style={{fontSize: 17}}>{convertSecondsToTime(data2.time)}</Text>
                  </Right>
                </CardItem>
              ))}

              <CardItem footer bordered>
                <Body style={{borderBottomWidth: 0}}>
                  <Text style={{fontSize: 17, fontWeight: 'bold'}}>Total</Text>
                </Body>
                <Right style={{borderBottomWidth: 0}}>
                  <Text style={{fontSize: 17, fontWeight: 'bold'}}>{convertSecondsToTime(data.total_time)}</Text>
                </Right>
              </CardItem>
            </Card>
          </View>

          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              position: 'absolute',
              bottom: 50,
              left: 0,
              right: 0,
              justifyContent: 'space-between',
              padding: 15,
            }}>
            <Button iconLeft onPress={() => console.log('press approved')}>
              <Image
                style={{width: 120}}
                source={approve} />
            </Button>
            <Button iconRight onPress={() => console.log('press rejected')}>
              <Image
                style={{width: 120}}
                source={reject} />
            </Button>
          </View>
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
              <Title style={{color: '#ffffff'}}>Timer</Title>
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

export default TimeTrackerResponsibleDetailScreen;
