import React, { Component } from 'react';
import {
  Content,
  Button,
  ListItem,
  Text,
  Left,
  Right,
  Body,
  Separator,
  Container,
  Footer,
  Toast,
} from 'native-base';

import {
  View,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Modal from 'react-native-modal';
import { fetchTryHttp } from '../../../services/common';

import styles from '../styles';

class YearlySegment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: null,
      loaded: false,
      selectedCustomerName: '',
      selectedCustomerAddress: '',
      selectedCustomerTelNo: '',
      selectedTotal: '',
      selectedJobLines: [],
      datas: [],
    };
  }

  componentDidMount() {
    const { turnover, period } = this.props;
    AsyncStorage.getItem('user_id').then((userId) => {
      AsyncStorage.getItem('token').then((token) => {
        AsyncStorage.getItem('baseUrl').then((baseUrl) => {
          fetch(`${baseUrl}/lykkebo/v1/account?user_id=${userId}&turnoverMode=${turnover}&period=${period}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then(response => response.json())
            .then((responseJson) => {
              const hasBookings = 'bookings' in responseJson.account;
              if (!hasBookings) {
                const emptyBooking = {
                  bookings: [],
                };
                this.setState({
                  datas: emptyBooking,
                  loaded: true,
                });
              } else {
                this.setState({
                  datas: responseJson.account,
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
  }

  renderModalContent = () => {
    const {
      selectedCustomerName,
      selectedCustomerTelNo,
      selectedCustomerAddress,
      selectedJobLines,
      selectedTotal,
    } = this.state;

    return (
      <Container style={styles.container}>
        <Content padder>
          <View style={{flex: 1, backgroundColor: '#fff'}}>
            <Separator bordered>
              <Text>Kunde Information</Text>
            </Separator>
            <ListItem style={styles.noMarginLeft}>
              <Text style={{width: '30%', paddingLeft: 18, color: '#7F7F7F'}}>Navm:</Text>
              <Text style={{width: '70%'}}>{selectedCustomerName}</Text>
            </ListItem>
            <ListItem style={styles.noMarginLeft}>
              <Text style={{width: '30%', paddingLeft: 18, color: '#7F7F7F'}}>Adresse:</Text>
              <Text style={{width: '70%'}}>{selectedCustomerAddress}</Text>
            </ListItem>
            <ListItem style={styles.noMarginLeft}>
              <Text style={{width: '30%', paddingLeft: 18, color: '#7F7F7F'}}>Telefon:</Text>
              <Text style={{width: '70%'}}>{selectedCustomerTelNo}</Text>
            </ListItem>

            <Separator bordered>
              <Text>Linjer</Text>
            </Separator>

            {selectedJobLines.map(job => (
              <ListItem
                style={styles.noMarginLeft}
                key={Math.floor(Date.now()) + Math.floor((Math.random() * 10000) + 1)}>
                <Text style={{width: '70%', paddingLeft: 18}}>{job.navn}</Text>
                <Text style={{width: '30%', textAlign: 'right'}}>{`${job.price} kr.`}</Text>
              </ListItem>
            ))}

            <ListItem style={[styles.noMarginLeft, {borderBottomWidth: 3}]}>
              <Text style={{width: '70%', paddingLeft: 18, fontWeight: 'bold'}}>Samlet akkord:</Text>
              <Text style={{width: '30%', textAlign: 'right'}}>{`${selectedTotal} kr.`}</Text>
            </ListItem>
          </View>
        </Content>

        <Footer style={{marginBottom: 5, backgroundColor: '#fff'}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1, height: 50, paddingLeft: 5}}>
              <Button
                full
                light
                style={styles.mt15}
                onPress={() => this.setState({ visibleModal: null })}>
                <Text>Close</Text>
              </Button>
            </View>
          </View>
        </Footer>
      </Container>
    );
  }

  render() {
    const { datas, visibleModal, loaded } = this.state;

    if (loaded) {
      return (
        <Content>
          {datas.bookings.map(data => (
            <ListItem
              key={Math.floor(Date.now()) + Math.floor((Math.random() * 10000) + 1)}
              onPress={() => this.setState({
                visibleModal: 1,
                selectedCustomerName: data.customer.name,
                selectedCustomerAddress: data.customer.address,
                selectedCustomerTelNo: data.customer.telephone,
                selectedTotal: data.total,
                selectedJobLines: data.joblines,
              })}>
              <Left style={{ flex: 1 }}>
                <Text numberOfLines={1} note>
                  {`${data.daterange}`}
                </Text>
              </Left>
              <Body style={{ flex: 1 }}>
                <Text>{`#${data.number}` }</Text>
                <Text>{`${data.total} kr.`}</Text>
              </Body>
              <Right style={{ flex: 1 }}>
                <Text style={{textAlign: 'right'}}>{data.status}</Text>
              </Right>
            </ListItem>
          ))}

          <Modal
            isVisible={visibleModal === 1}>
            {this.renderModalContent()}
          </Modal>
        </Content>
      );
    } else {
      return (
        <ActivityIndicator size="large" color="#2E3D43" style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}} />
      );
    }
  }
}

export default YearlySegment;
