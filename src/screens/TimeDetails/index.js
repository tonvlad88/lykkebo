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
  Card,
  CardItem,
  ListItem,
  Item,
  Label,
  Grid,
  Col,
  Toast,
  Badge,
} from 'native-base';

import {
  View,
  AsyncStorage,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

import { Dropdown } from 'react-native-material-dropdown';
import axios from 'axios';

import styles from './styles';

export interface Props {
  navigation: any;
}
export interface State {}

const timerValue = [
  {label: '0', value: '0'},
  {label: '0.5', value: '0.5'},
  {label: '1', value: '1'},
  {label: '1.5', value: '1.5'},
  {label: '2', value: '2'},
  {label: '2.5', value: '2.5'},
  {label: '3', value: '3'},
  {label: '3.5', value: '3.5'},
  {label: '4', value: '4'},
  {label: '4.5', value: '4.5'},
  {label: '5', value: '5'},
  {label: '5.5', value: '5.5'},
  {label: '6', value: '6'},
  {label: '6.5', value: '6.5'},
  {label: '7', value: '7'},
  {label: '7.5', value: '7.5'},
  {label: '8', value: '8'},
  {label: '8.5', value: '8.5'},
  {label: '9', value: '9'},
  {label: '9.5', value: '9.5'},
  {label: '10', value: '10'},
  {label: '10.5', value: '10.5'},
  {label: '11', value: '11'},
  {label: '11.5', value: '11.5'},
  {label: '12', value: '12'},
  {label: '12.5', value: '12.5'},
  {label: '13', value: '13'},
  {label: '13.5', value: '13.5'},
  {label: '14', value: '14'},
  {label: '14.5', value: '14.5'},
  {label: '15', value: '15'},
  {label: '15.5', value: '15.5'},
  {label: '16', value: '16'},
];

class TimeDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: {},
      loaded: false,
      user: 0,
      selectedTimerValue: '7.5',
      selectedKilometerValue: '',
      selectedCommentValue: '',
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('user_id').then((userId) => {
      AsyncStorage.getItem('token').then((token) => {
        AsyncStorage.getItem('baseUrl').then((baseUrl) => {
          AsyncStorage.getItem('user_relation').then((userRelation) => {
            AsyncStorage.getItem('selectedTimestamp').then((timestamp) => {
              fetch(`${baseUrl}/lykkebo/v1/time/day/overview?user_id=${userId}&day=${timestamp}`, {
              // fetch(`lykkeboadm.dk/wp-json/lykkebo/v1/time/day/overview?user_id=${userId}&day=${timestamp}`, {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
                .then(response => response.json())
                .then((responseJson) => {
                  this.setState({
                    datas: responseJson.day,
                    user: userRelation,
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
  }

  renderTimeEntryStatus(status) {
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
      datas,
      loaded,
      user,
      selectedCommentValue,
      selectedKilometerValue,
      selectedTimerValue,
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
                  onPress={() => navigation.navigate('Time')} />
              </Button>
            </Left>
            <Body style={{flex: 3}}>
              <Title style={{color: '#ffffff'}}>Tid</Title>
            </Body>
          </Header>
          <View style={{
            width: '100%', height: 3, backgroundColor: '#323248', marginBottom: 1,
          }} />

          <Content padder>
            <ScrollView>
              <ListItem itemDivider style={{backgroundColor: '#445A62'}}>
                <Text style={{color: 'white', textAlign: 'center'}}>Timer denne dag</Text>
              </ListItem>
              {datas.clients.length === 0 ? (
                <ListItem>
                  <Text>Ingen timer denne dag</Text>
                </ListItem>
              ) : datas.clients.map(client => (
                <Card padder style={styles.mb} key={client.client_id}>
                  <CardItem header bordered first>
                    <Grid>
                      <Col>
                        <Text>{client.client_name}</Text>
                      </Col>
                      {this.renderTimeEntryStatus(client.status)}
                    </Grid>
                  </CardItem>
                  <Item fixedLabel style={{paddingTop: 15, paddingBottom: 15}}>
                    <Label style={{paddingLeft: 5}}>Tid:</Label>
                    <Dropdown
                      label=""
                      labelHeight={0}
                      value={Number(client.workload) === 0 ? '7.5' : client.workload}
                      containerStyle={{flex: 1, marginLeft: 5}}
                      inputContainerStyle={{borderBottomColor: 'transparent'}}
                      data={timerValue}
                      itemTextStyle={{textAlign: 'right'}}
                      onChangeText={(value) => {
                        this.setState({selectedTimerValue: value});
                      }} />
                  </Item>
                  <Item fixedLabel style={{paddingTop: 15, paddingBottom: 15}}>
                    <Label style={{paddingLeft: 5}}>Kørsel km:</Label>
                    <TextInput
                      ref={(ref) => { this.kilometerInput = ref }}
                      style={{flex: 1}}
                      keyboardType="numeric"
                      onChangeText={val => this.setState({selectedKilometerValue: val})}
                      defaultValue={client.kilometer.toString()} />
                  </Item>
                  <Item fixedLabel last style={{paddingTop: 15, paddingBottom: 15}}>
                    <Label style={{paddingLeft: 5}}>Kommentar:</Label>
                    <TextInput
                      ref={(ref) => { this.commentInput = ref }}
                      style={{flex: 1}}
                      onChangeText={val => this.setState({selectedCommentValue: val})}
                      defaultValue={client.comment} />
                  </Item>

                  <Button
                    onPress={() => {
                      AsyncStorage.getItem('user_id').then((userId) => {
                        AsyncStorage.getItem('token').then((token) => {
                          AsyncStorage.getItem('baseUrl').then((baseUrl) => {
                            AsyncStorage.getItem('selectedTimestamp').then((timestamp) => {
                              const postData = {
                                user_id: userId,
                                client_id: client.client_id,
                                date: `${timestamp}`,
                                kilometer:
                                  selectedKilometerValue === ''
                                    ? this.kilometerInput._getText()
                                    :
                                    selectedKilometerValue,
                                comment:
                                  selectedCommentValue === ''
                                    ? this.commentInput._getText()
                                    :
                                    selectedCommentValue,
                                workload: selectedTimerValue,
                                job_id: client.booking_id,
                              };

                              const axiosConfig = {
                                headers: {
                                  // 'Content-Type': 'application/json;charset=UTF-8',
                                  // 'Access-Control-Allow-Origin': '*',
                                  Authorization: `Bearer ${token}`,
                                },
                              };

                              // axios.post(`http://${baseUrl}/lykkebo/v1/time/AddTime?user_id=${userId}&client_id=${client.client_id}&date=${timestamp}&kilometer=${selectedKilometerValue}&comment=${selectedCommentValue}&workload=${selectedTimerValue}&job_id=${client.booking_id}`, {}, axiosConfig)
                              axios.post(`${baseUrl}/lykkebo/v1/time/AddTime`, postData, axiosConfig)
                                .then(() => {
                                  Alert.alert(
                                    'Tidspunktet',
                                    'Opdateret med succes!',
                                    [
                                      {text: 'OK', onPress: () => console.log('OK Pressed')},
                                    ],
                                    { cancelable: false }
                                  );
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
                    }}
                    style={{margin: 10, alignSelf: 'center'}}>
                    <Text>Opdatering</Text>
                  </Button>
                </Card>
              ))}

              <ListItem itemDivider style={{backgroundColor: '#445A62'}}>
                <Text style={{color: 'white', textAlign: 'center'}}>Bookings</Text>
              </ListItem>

              {datas.bookings.length === 0 ? (
                <ListItem>
                  <Text>Ingen bookinger for denne dato</Text>
                </ListItem>
              ) : datas.bookings.map(booking => (
                <Card padder style={styles.mb} key={booking.booking_id}>
                  <CardItem header bordered first>
                    <Grid>
                      <Col>
                        <Text>{booking.text}</Text>
                      </Col>
                    </Grid>
                  </CardItem>
                  <Item fixedLabel style={{paddingTop: 15, paddingBottom: 15}}>
                    <Label style={{paddingLeft: 5}}>Tid:</Label>
                    <Dropdown
                      label=""
                      labelHeight={0}
                      value="7.5"
                      containerStyle={{flex: 1, marginLeft: 5}}
                      inputContainerStyle={{borderBottomColor: 'transparent'}}
                      data={timerValue}
                      itemTextStyle={{textAlign: 'right'}}
                      onChangeText={(value) => {
                        this.setState({selectedTimerValue: value});
                      }} />
                  </Item>
                  <Item fixedLabel style={{paddingTop: 15, paddingBottom: 15}}>
                    <Label style={{paddingLeft: 5}}>Kørsel km:</Label>
                    <TextInput
                      ref={(ref) => { this.kilometerInput2 = ref }}
                      style={{flex: 1}}
                      keyboardType="numeric"
                      onChangeText={val => this.setState({selectedKilometerValue: val})}
                      defaultValue="0" />
                  </Item>
                  <Item fixedLabel last style={{paddingTop: 15, paddingBottom: 15}}>
                    <Label style={{paddingLeft: 5}}>Kommentar:</Label>
                    <TextInput
                      ref={(ref) => { this.commentInput2 = ref }}
                      style={{flex: 1}}
                      onChangeText={val => this.setState({selectedCommentValue: val})}
                      defaultValue="" />
                  </Item>

                  <Button
                    onPress={() => {
                      AsyncStorage.getItem('user_id').then((userId) => {
                        AsyncStorage.getItem('token').then((token) => {
                          AsyncStorage.getItem('baseUrl').then((baseUrl) => {
                            AsyncStorage.getItem('selectedTimestamp').then((timestamp) => {
                              const postData = {
                                user_id: userId,
                                // client: client.client_id,
                                date: `${timestamp}`,
                                kilometer:
                                  selectedKilometerValue === ''
                                    ? this.kilometerInput2._getText()
                                    :
                                    selectedKilometerValue,
                                comment:
                                  selectedCommentValue === ''
                                    ? this.commentInput2._getText()
                                    :
                                    selectedCommentValue,
                                workload: selectedTimerValue,
                                job_id: booking.booking_id,
                              };

                              const axiosConfig = {
                                headers: {
                                  // 'Content-Type': 'application/json;charset=UTF-8',
                                  // 'Access-Control-Allow-Origin': '*',
                                  Authorization: `Bearer ${token}`,
                                },
                              };

                              // axios.post(`http://${baseUrl}/lykkebo/v1/time/AddTime?user_id=${userId}&client_id=${client.client_id}&date=${timestamp}&kilometer=${selectedKilometerValue}&comment=${selectedCommentValue}&workload=${selectedTimerValue}&job_id=${client.booking_id}`, {}, axiosConfig)
                              axios.post(`${baseUrl}/lykkebo/v1/time/AddTime`, postData, axiosConfig)
                                .then(() => {
                                  Alert.alert(
                                    'Tidspunktet',
                                    'Indsendt succesfuldt!',
                                    [
                                      {text: 'OK', onPress: () => console.log('OK Pressed')},
                                    ],
                                    { cancelable: false }
                                  );

                                  fetch(`${baseUrl}/lykkebo/v1/time/day/overview?user_id=${userId}&day=${timestamp}`, {
                                    method: 'GET',
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  })
                                    .then(response => response.json())
                                    .then((responseJson) => {
                                      this.setState({
                                        datas: responseJson.day,
                                      });
                                    })
                                    .catch((error) => {
                                      Toast.show({
                                        text: error.message,
                                        position: 'top',
                                        duration: 5000,
                                      });
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
                    }}
                    style={{margin: 10, alignSelf: 'center'}}>
                    <Text>Gem</Text>
                  </Button>
                </Card>
              ))}
            </ScrollView>
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
                  name="arrow-back"
                  onPress={() => navigation.navigate('Time')} />
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

export default TimeDetailsScreen;
