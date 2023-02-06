import React, { Component } from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  List,
  ListItem,
  Text,
  Left,
  Right,
  Body,
  Toast,
} from 'native-base';

import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
} from 'react-native';

import { fetchTryHttp } from '../../services/common';
import styles from './styles';

class JobsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: {},
      loaded: false,
    };
  }

  componentDidMount() {
    // const userEmail = deviceStorage.getItem('user_email');
    AsyncStorage.getItem('user_id').then((userId) => {
      AsyncStorage.getItem('token').then((token) => {
        AsyncStorage.getItem('baseUrl').then((baseUrl) => {
          fetch(`${baseUrl}/lykkebo/v1/overview?user_id=${userId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              user_id: `${userId}`,
            },
          })
            .then(response => response.json())
            .then((responseJson) => {
              this.setState({
                datas: responseJson,
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
  }

  openOverviewDetails(overview) {
    const { navigation } = this.props;
    AsyncStorage.setItem('selectedOverviewDatestamp', JSON.stringify(overview.stamp)).then(() => {
      AsyncStorage.setItem('selectedOverviewTitle', overview.date).then(() => {
        navigation.navigate('OverviewDetails');
      });
    });
  }

  render() {
    const { datas, loaded } = this.state;
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
              <Title style={{color: '#ffffff'}}>Oversigt</Title>
            </Body>
            <Right style={{ flex: 1 }} />
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
                    style={{marginLeft: 0}}
                    onPress={() => {
                      this.openOverviewDetails(data);
                    }}>
                    <Body>
                      <Text numberOfLines={1}>
                        {data.date}
                      </Text>
                      <Text numberOfLines={1} note>
                        {`${data.workload} timer ${data.kilometer} km`}
                      </Text>
                    </Body>
                    <Right>
                      <Text>
                        {data.status}
                      </Text>
                    </Right>
                  </ListItem>
                </TouchableOpacity>
              )} />
          </Content>
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
              <Title style={{color: '#ffffff'}}>Oversigt</Title>
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

export default JobsScreen;
