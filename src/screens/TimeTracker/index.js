import React, { Component } from 'react';
import {
  Text,
  View,
  AsyncStorage,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from 'react-native';

import {
  Container,
  Header,
  Title,
  Button,
  Icon,
  Left,
  Right,
  Body,
  List,
  ListItem,
  Badge,
  Content,
  Toast,
  Grid,
  Col,
} from 'native-base';

import XDate from 'xdate';
import Carousel from 'react-native-looped-carousel';

import styles from './styles';
import { convertSecondsToTime, getListDateInTimeStamp } from '../../services/common';

class TimeTrackerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobTimeData: '',
      loaded: false,
      userRelation: 0,
      isWaiting: false,
      currentDatePage: 30,
      headersData: null,
      selectedDate: new Date(),
      selectedDateFormatted: null,
      selectedDateForAPI: null,
    };
  }

  componentDidMount() {
    this.setState({
      loaded: true,
      headersData: getListDateInTimeStamp(XDate(true).toString('yyyy-MM-dd'), 1, 30),
    });
  }

  renderJobTimeDataHandler = data => (
    <List key={data.job_id}>
      <ListItem
        onPress={() => {
          this.openTimeDetails(data);
        }}
        itemDivider>
        <Grid>
          <Col><Text style={{flex: 1, fontWeight: 'bold'}}>{`BOOKING ${data.job_id}`}</Text></Col>
          <Col>
            <Icon
              name="arrow-forward"
              style={{fontSize: 15, color: '#BFBEC4', alignSelf: 'flex-end'}} />
          </Col>
        </Grid>
      </ListItem>
      <ListItem style={styles.noMarginLeft} avatar>
        <Left style={[styles.paddingLeft5, {justifyContent: 'center'}]}>
          {this.renderTimeStatusHandler(data.time_rec_submitted)}
        </Left>
        <Body style={[styles.paddingLeft5, {justifyContent: 'center', borderBottomWidth: 0}]}>
          <Text style={{fontSize: 10, color: '#BFBEC4'}}>Customer</Text>
          <Text note numberOfLines={1}>{data.customer_name}</Text>
        </Body>

        <Right style={{borderBottomWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{fontSize: 17, fontWeight: 'bold'}}>{convertSecondsToTime(data.total_time)}</Text>
        </Right>
      </ListItem>
      <View style={{
        width: '100%', height: 7, backgroundColor: '#D8D8D8', marginBottom: 1,
      }} />
    </List>
  );

  renderTimeStatusHandler = (status) => {
    if (Number(status) === 0) {
      return (
        <Badge
          // info
          style={{
            minWidth: 100,
            // width: 20,
            // height: 20,
            // borderRadius: 20 / 2,
            // marginTop: 10,
            alignSelf: 'center',
            backgroundColor: 'black',
          }}>
          <Text style={{textAlign: 'center', color: 'white'}}>ikke indsendt</Text>
        </Badge>
      );
    // } else if (Number(status) === 5) {
    //   return (
    //     <Badge
    //       warning
    //       style={{
    //         minWidth: 100,
    //         // width: 20,
    //         // height: 20,
    //         // borderRadius: 20 / 2,
    //         // marginTop: 10,
    //         alignSelf: 'center',
    //       }}>
    //       <Text style={{textAlign: 'center', color: 'white'}}>kontaktet</Text>
    //     </Badge>
    //   );
    // } else if (Number(status) === 4) {
    //   return (
    //     <Badge
    //       primary
    //       style={{
    //         minWidth: 100,
    //         // width: 20,
    //         // height: 20,
    //         // borderRadius: 20 / 2,
    //         // marginTop: 10,
    //         alignSelf: 'center',
    //       }}>
    //       <Text style={{textAlign: 'center', color: 'white'}}>igangværende</Text>
    //     </Badge>
    //   );
    } else {
      return (
        <Badge
          success
          style={{
            minWidth: 100,
            // width: 20,
            // height: 20,
            // borderRadius: 20 / 2,
            // marginTop: 10,
            alignSelf: 'center',
          }}>
          <Text style={{textAlign: 'center', color: 'white'}}>indsendt</Text>
        </Badge>
      );
    }
  }

  openTimeDetails(details) {
    const { selectedDate, selectedDateFormatted, selectedDateForAPI } = this.state;
    const { navigation } = this.props;

    AsyncStorage.setItem('selectedTimeTrackerDetails', JSON.stringify(details)).then(() => {
      AsyncStorage.setItem('selectedTimeTrackerDetailsDate', JSON.stringify(selectedDate)).then(() => {
        AsyncStorage.setItem('selectedTimeTrackerDetailsDateForAPI', JSON.stringify(selectedDateForAPI)).then(() => {
          AsyncStorage.setItem('selectedJobId', JSON.stringify(details.job_id)).then(() => {
            AsyncStorage.setItem('isFromTimeRec', '1').then(() => {
              AsyncStorage.setItem('selectedTimeTrackerDetailsDateFormatted', JSON.stringify(selectedDateFormatted)).then(() => {
                navigation.navigate('TimeTrackerDetail');
              });
            });
          });
        });
      });
    });
  }

  render() {
    const {
      jobTimeData,
      loaded,
      userRelation,
      currentDatePage,
      isWaiting,
      headersData,
    } = this.state;
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
              <Carousel
                style={{ height: 50, width: 180 }}
                leftArrowText="＜"
                leftArrowStyle={{color: 'white', fontSize: 22, margin: 5}}
                rightArrowText="＞"
                rightArrowStyle={{color: 'white', fontSize: 22, margin: 5}}
                // pageInfo
                arrows={!isWaiting}
                currentPage={currentDatePage}
                onPageBeingChanged={() => this.setState({currentDatePage: 20})}
                isLooped={false}
                autoplay={false}
                onAnimateNextPage={(p) => {
                  AsyncStorage.getItem('user_id').then((userId) => {
                    AsyncStorage.getItem('token').then((token) => {
                      AsyncStorage.getItem('user_relation').then((userRelation) => {
                        AsyncStorage.getItem('baseUrl').then((baseUrl) => {
                          fetch(`${baseUrl}/lykkebo/v1/timerec/overview?user_id=${userId}&day=${new XDate(headersData[p]).toString('yyyy-MM-dd')}`, {
                            method: 'GET',
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          })
                            .then(response => response.json())
                            .then((responseJson) => {
                              // console.log('responseJson', responseJson)
                              // const temp = responseJson.formatted.split('-');
                              this.setState({
                                selectedDate: headersData[p],
                                selectedDateForAPI: responseJson.day,
                                jobTimeData: responseJson.data,
                                selectedDateFormatted: responseJson.formatted,
                                // selectedDateFormatted: `${temp[0]}-${temp[2]}-${temp[1]}`,
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
                }}>
                {headersData.map(item => (
                  <View
                    style={[{
                      backgroundColor: '#2E3D43', flex: 1, height: 40, paddingTop: 10, justifyContent: 'center', alignItems: 'center',
                    }]}
                    key={item}>
                    <Title style={{color: '#ffffff'}}>{new XDate(item).toString('dd MMMM, yyyy')}</Title>
                  </View>
                ))}
              </Carousel>
            </Body>
            <Right style={{ flex: 1 }} />
          </Header>
          <View style={{
            width: '100%', height: 7, backgroundColor: '#243135', marginBottom: 1,
          }} />

          {userRelation <= 2 ? (
            <Content>
              <ScrollView>
                {jobTimeData.length > 0 ? jobTimeData.map(this.renderJobTimeDataHandler) : (
                  <Button full warning>
                    <Text style={{color: 'white'}}>ngen jobs idag</Text>
                  </Button>)
                }
              </ScrollView>
            </Content>
          ) : (
            <View style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Sorry, no data found...</Text>
              </View>
            </View>
          )
          }
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
              <Carousel
                style={{ height: 50, width: 180 }}
                leftArrowText="＜"
                leftArrowStyle={{color: 'white', fontSize: 22, margin: 5}}
                rightArrowText="＞"
                rightArrowStyle={{color: 'white', fontSize: 22, margin: 5}}
                // pageInfo
                arrows={!isWaiting}
                currentPage={currentDatePage}
                isLooped={false}
                autoplay={false}>
                <View
                  style={[{
                    backgroundColor: '#2E3D43', flex: 1, height: 40, paddingTop: 10, justifyContent: 'center', alignItems: 'center',
                  }]}
                  key="scheduled" />
              </Carousel>
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


export default TimeTrackerScreen;
