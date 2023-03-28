import React, { Component } from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Left,
  Right,
  Text,
  Body,
  Icon,
  Toast,
  List,
  ListItem,
  Footer,
} from 'native-base';

import {
  View,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTryHttp } from '../../services/common';

import styles from './styles';

export interface Props {
  navigation: any;
}
export interface State {}

class OverviewDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: {},
      loaded: false,
      overviewTitle: '',
      totalKilometer: 0,
      totalWorkload: 0,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('user_id').then((userId) => {
      AsyncStorage.getItem('token').then((token) => {
        AsyncStorage.getItem('baseUrl').then((baseUrl) => {
          AsyncStorage.getItem('userRelation').then((userRelation) => {
            AsyncStorage.getItem('selectedOverviewDatestamp').then((timestamp) => {
              AsyncStorage.getItem('selectedOverviewTitle').then((overviewTitle) => {
                // fetchTryHttp(`${baseUrl}/lykkebo/v1/overview/daily?user_id=${userId}&week=${timestamp}`, {
                fetch(`${baseUrl}/lykkebo/v1/overview/daily?user_id=${userId}&week=${timestamp}`, {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                  .then(response => response.json())
                  .then((responseJson) => {
                    this.setState({
                      // datas: responseJson[0].week.day,
                      datas: responseJson[0].week.day,
                      overviewTitle,
                      totalKilometer: responseJson[0].week.total_kilometer,
                      totalWorkload: responseJson[0].week.total_workload,
                      loaded: true,
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
    });
  }

  render() {
    const {
      datas, loaded, overviewTitle, totalKilometer, totalWorkload,
    } = this.state;
    const { navigation } = this.props;

    if (loaded) {
      return (
        <Container style={styles.container}>
          <StatusBar hidden />
          <Header style={{ backgroundColor: '#2E3D43' }}>
            <Left style={{flex: 1}}>
              <Button transparent>
                <Icon
                  style={{color: '#ffffff'}}
                  size={40}
                  name="arrow-back"
                  onPress={() => navigation.navigate('Overview')} />
              </Button>
            </Left>
            <Body style={{flex: 3}}>
              <Title style={{color: '#ffffff'}}>{`${overviewTitle}`}</Title>
            </Body>
          </Header>
          <View style={{
            width: '100%', height: 3, backgroundColor: '#323248', marginBottom: 1,
          }} />

          <Content>
            <List
              dataArray={datas}
              renderRow={data => (
                <TouchableOpacity>
                  <ListItem
                    style={{marginLeft: 0}}>
                    <Body>
                      <Text numberOfLines={1}>
                        {data.date}
                      </Text>

                      {((Array.isArray(data.details[0]) || data.details[0]))
                        ? (
                          <Text numberOfLines={1} note>
                            {`${data.details[0].workload} timer ${data.details[0].kilometer} km`}
                          </Text>
                        ) : (
                          <Text numberOfLines={1} note>0 timer 0 km</Text>
                        )
                      }
                    </Body>
                    <Right>
                      {((Array.isArray(data.details[0]) || data.details[0]))
                        ? (
                          <Text numberOfLines={1} note>
                            {`${data.details[0].status}`}
                          </Text>
                        ) : (
                          <Text numberOfLines={1} note>Mangler</Text>
                        )
                      }
                    </Right>
                  </ListItem>
                </TouchableOpacity>
              )} />
          </Content>

          <Footer>
            <Text style={{
              textAlign: 'center',
              color: '#fff',
              fontWeight: 'bold',
              backgroundColor: '#2E3D43',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 12,
            }}>
              {`Total: ${totalWorkload} timer ${totalKilometer} km `}
            </Text>
          </Footer>
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
                  name="arrow-back"
                  onPress={() => navigation.navigate('Overview')} />
              </Button>
            </Left>
            <Body style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Title />
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

export default OverviewDetailsScreen;
