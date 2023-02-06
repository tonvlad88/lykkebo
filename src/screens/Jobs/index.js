// Components
import React, { Component } from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
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
  AsyncStorage,
  ActivityIndicator,
  StatusBar,
  FlatList,
} from 'react-native';

// Helpers
import * as Localization from 'expo-localization';

// Actions


// Localization
import i18n from 'i18n-js';
import { da, en } from '../../services/translations';

i18n.fallbacks = true;
i18n.translations = { da, en };
i18n.locale = Localization.locale;

// Global imports
import { fetchTryHttp } from '../../services/common';

// Local imports
import styles from './styles';

export interface Props {
  navigation: any;
}
export interface State {}

const EmptyComponent = ({ title }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>
      {i18n.t('noJobsFound')}
    </Text>
  </View>

);

class JobsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: [],
      loaded: false,
    };
  }

  componentDidMount() {
    // const userEmail = deviceStorage.getItem('user_email');
    AsyncStorage.getItem('user_id').then((userId) => {
      AsyncStorage.getItem('token').then((token) => {
        AsyncStorage.getItem('baseUrl').then((baseUrl) => {
          fetch(`${baseUrl}/lykkebo/v1/jobs/overview?user_id=${userId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              user_id: `${userId}`,
            },
          })
            .then(response => response.json())
            .then((responseJson) => {
              this.setState({
                datas: responseJson.bookings,
                loaded: true,
              });
            })
            .catch((error) => {
              Toast.show({
                text: error.message,
                position: 'top',
                duration: 3000,
              });
            });
        });
      });
    });
  }

  openBooking(booking) {
    const { navigation } = this.props;
    AsyncStorage.setItem('selectedJobId', JSON.stringify(booking.id)).then(() => {
      navigation.navigate('Jobdetails');
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
              <Title style={{color: '#ffffff'}}>Jobs</Title>
            </Body>
            <Right style={{ flex: 1 }} />
          </Header>
          <View style={{
            width: '100%', height: 3, backgroundColor: '#323248', marginBottom: 1,
          }} />

          <Content>
            <FlatList
              contentContainerStyle={[{ flex: 1, flexGrow: 1 }, datas.length ? null : { justifyContent: 'center', alignItems: 'center'}]}
              ListEmptyComponent={
                <EmptyComponent />
              }
              keyExtractor={(item, index) => index.toString()}
              data={datas}
              renderItem={({item}) => (
                <TouchableOpacity>
                  <ListItem
                    style={{marginLeft: 0}}
                    onPress={() => {
                      this.openBooking(item);
                    }}>
                    <Body>
                      <Text numberOfLines={1}>
                        #
                        {`${item.id} ${item.kunde.name}`}
                      </Text>
                      <Text numberOfLines={1} note>
                        {`${item.start} - ${item.end}`}
                      </Text>
                    </Body>
                    <Right>
                      <Icon name="arrow-forward" onPress={() => this.openBooking(item)} />
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
              <Title style={{color: '#ffffff'}}>Jobs</Title>
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
