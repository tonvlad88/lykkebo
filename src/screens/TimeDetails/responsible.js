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
  ActivityIndicator,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Dropdown } from 'react-native-material-dropdown-v2-fixed';
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

class TimeDetailsResponsibleScreen extends Component {
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
              fetch(`${baseUrl}/lykkebo/v1/time/day/responsible/overview?user_id=${userId}&day=${timestamp}`, {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
                .then(response => response.json())
                .then((responseJson) => {
                  if (responseJson === null) {
                    this.setState({
                      datas: [],
                      user: userRelation,
                      loaded: true,
                    });
                  } else {
                    this.setState({
                      datas: responseJson,
                      user: userRelation,
                      loaded: true,
                    });
                  }
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
                <Text style={{color: 'white', textAlign: 'center'}}>Tid Indrejse</Text>
              </ListItem>
              {datas.length === 0 ? (
                <ListItem>
                  <Text>Ingen tidspost for denne dato</Text>
                </ListItem>
              ) : datas.map((client) => {
                if (Number(client.status) === 100) {
                  return (
                    <Card padder style={styles.mb} key={client.client_id}>
                      <CardItem header bordered first>
                        <Grid>
                          <Col>
                            <Text>{client.customer}</Text>
                          </Col>
                          {this.renderTimeEntryStatus(client.status_no)}
                        </Grid>
                      </CardItem>
                      <Item fixedLabel style={{paddingTop: 15, paddingBottom: 15}}>
                        <Label style={{paddingLeft: 5}}>Tid:</Label>
                        <Label>{client.workload}</Label>
                      </Item>
                      <Item fixedLabel style={{paddingTop: 15, paddingBottom: 15}}>
                        <Label style={{paddingLeft: 5}}>Kørsel km:</Label>
                        <Label>{client.kilometer}</Label>
                      </Item>
                      <Item fixedLabel style={{paddingTop: 15, paddingBottom: 15}}>
                        <Label style={{paddingLeft: 5}}>Kommentar:</Label>
                        <Label>{client.comment}</Label>
                      </Item>
                    </Card>
                  );
                } else {
                  return (
                    <Card padder style={styles.mb} key={client.client_id}>
                      <CardItem header bordered first>
                        <Grid>
                          <Col>
                            <Text>{client.customer}</Text>
                          </Col>
                          {this.renderTimeEntryStatus(client.status_no)}
                        </Grid>
                      </CardItem>
                      <Item fixedLabel style={{paddingTop: 15, paddingBottom: 15}}>
                        <Col>
                          <Label style={{paddingLeft: 5}}>Lærling:</Label>
                        </Col>
                        <Col>
                          <Text>{client.apprentice}</Text>
                        </Col>
                      </Item>
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
                          onChangeText={value => this.setState({selectedTimerValue: value})} />
                      </Item>
                      <Item fixedLabel style={{paddingTop: 15, paddingBottom: 15}}>
                        <Label style={{paddingLeft: 5}}>Kørsel km:</Label>
                        <TextInput
                          ref={(ref) => { this.kilometerInput2 = ref }}
                          style={{flex: 1}}
                          keyboardType="numeric"
                          onChangeText={val => this.setState({selectedKilometerValue: val})}
                          defaultValue={client.kilometer.toString()} />
                      </Item>
                      <Item fixedLabel last style={{paddingTop: 15, paddingBottom: 15}}>
                        <Label style={{paddingLeft: 5}}>Kommentar:</Label>
                        <TextInput
                          ref={(ref) => { this.commentInput2 = ref }}
                          style={{flex: 1}}
                          onChangeText={val => this.setState({selectedCommentValue: val})}
                          defaultValue={client.comment} />
                      </Item>

                      {client.client_id ? (
                        <View style={{flex: 1}}>
                          <Grid>
                            <Col>
                              <Button
                                full
                                success
                                onPress={() => {
                                  AsyncStorage.getItem('user_id').then((userId) => {
                                    AsyncStorage.getItem('token').then((token) => {
                                      AsyncStorage.getItem('baseUrl').then((baseUrl) => {
                                        AsyncStorage.getItem('selectedTimestamp').then((timestamp) => {
                                          const postData = {
                                            user_id: Number(userId),
                                            client_id: client.client_id,
                                            date: `${timestamp}`,
                                            approved: 1,
                                            job_id: client.booking_id,
                                            kilometer:
                                              selectedKilometerValue === ''
                                                ? Number(this.kilometerInput2._getText())
                                                :
                                                Number(selectedKilometerValue),
                                            // comment:
                                            //   selectedCommentValue === ''
                                            //     ? this.commentInput2._getText()
                                            //     :
                                            //     selectedCommentValue,
                                            workload: Number(selectedTimerValue),
                                          };

                                          // console.log('posta data', postData);

                                          const axiosConfig = {
                                            headers: {
                                              // 'Content-Type': 'application/json;charset=UTF-8',
                                              // 'Access-Control-Allow-Origin': '*',
                                              Authorization: `Bearer ${token}`,
                                            },
                                          };

                                          axios.post(`${baseUrl}/lykkebo/v1/time/ApproveTime`, postData, axiosConfig)
                                            .then((res) => {
                                              Alert.alert(
                                                'Tidspunktet',
                                                res.data.data.message,
                                                [
                                                  {
                                                    text: 'OK',
                                                    onPress: () => {
                                                      fetch(`${baseUrl}/lykkebo/v1/time/day/responsible/overview?user_id=${userId}&day=${timestamp}`, {
                                                        method: 'GET',
                                                        headers: {
                                                          Authorization: `Bearer ${token}`,
                                                        },
                                                      })
                                                        .then(response => response.json())
                                                        .then((responseJson) => {
                                                          this.setState({
                                                            datas: responseJson,
                                                            // user: userRelation,
                                                            // loaded: true,
                                                          });
                                                        })
                                                        .catch((error) => {
                                                          Toast.show({
                                                            text: error.message,
                                                            position: 'top',
                                                            duration: 5000,
                                                          });
                                                        });
                                                    },
                                                  },
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
                                style={{margin: 10}}>
                                <Text>Godkende</Text>
                              </Button>
                            </Col>
                            <Col>
                              <Button
                                full
                                danger
                                onPress={() => {
                                  AsyncStorage.getItem('user_id').then((userId) => {
                                    AsyncStorage.getItem('token').then((token) => {
                                      AsyncStorage.getItem('baseUrl').then((baseUrl) => {
                                        AsyncStorage.getItem('selectedTimestamp').then((timestamp) => {
                                          const postData = {
                                            user_id: userId,
                                            client_id: client.client_id,
                                            date: `${timestamp}`,
                                            approved: 2,
                                            job_id: client.booking_id,
                                          };

                                          const axiosConfig = {
                                            headers: {
                                              // 'Content-Type': 'application/json;charset=UTF-8',
                                              // 'Access-Control-Allow-Origin': '*',
                                              Authorization: `Bearer ${token}`,
                                            },
                                          };

                                          axios.post(`${baseUrl}/lykkebo/v1/time/ApproveTime`, postData, axiosConfig)
                                            .then((res) => {
                                              Alert.alert(
                                                'Tidspunktet',
                                                res.data.data.message,
                                                [
                                                  {
                                                    text: 'OK',
                                                    onPress: () => {
                                                      fetch(`${baseUrl}/lykkebo/v1/time/day/responsible/overview?user_id=${userId}&day=${timestamp}`, {
                                                        method: 'GET',
                                                        headers: {
                                                          Authorization: `Bearer ${token}`,
                                                        },
                                                      })
                                                        .then(response => response.json())
                                                        .then((responseJson) => {
                                                          this.setState({
                                                            datas: responseJson,
                                                            // user: userRelation,
                                                            // loaded: true,
                                                          });
                                                        })
                                                        .catch((error) => {
                                                          Toast.show({
                                                            text: error.message,
                                                            position: 'top',
                                                            duration: 5000,
                                                          });
                                                        });
                                                    },
                                                  },
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
                                style={{margin: 10}}>
                                <Text>Afvise</Text>
                              </Button>
                            </Col>
                          </Grid>
                        </View>
                      ) : (
                        <View style={{flex: 1, padding: 10, alignItems: 'center'}}>
                          <Text>{`${client.apprentice} har ikke angivet tid denne dag`}</Text>
                        </View>
                      )}
                    </Card>
                  );
                }
              })}
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

export default TimeDetailsResponsibleScreen;
