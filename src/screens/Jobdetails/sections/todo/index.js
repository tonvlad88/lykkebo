import React, { Component } from 'react';
import {
  DeckSwiper,
  Card,
  CardItem,
  Text,
  ListItem,
  Toast,
} from 'native-base';

import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
import { Dropdown } from 'react-native-material-dropdown-v2-fixed';
import Swiper from 'react-native-swiper';

import styles from '../../styles';

const entryStatus = [
  {value: '0', label: 'Ikke startet'},
  {value: '1', label: 'Startet'},
  {value: '2', label: 'Udført'},
];

class TodoSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  updateTodoJobStatusHandler(value, item) {
    // const { info, setNewInfo } = this.props;

    AsyncStorage.getItem('user_id').then((userId) => {
      AsyncStorage.getItem('token').then((token) => {
        AsyncStorage.getItem('baseUrl').then((baseUrl) => {
          AsyncStorage.getItem('selectedJobId').then((jobId) => {
            const axiosConfig = {
              headers: {
                // 'Content-Type': 'application/json;charset=UTF-8',
                // 'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${token}`,
              },
            };

            axios.post(`${baseUrl}/lykkebo/v1/jobdetails/updateJobTodoStatus?user_id=${userId}&job_id=${jobId}&todo_id=${item.id}&status_id=${value}`, {}, axiosConfig)
              .then()
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
    });
  }

  render() {
    const { info, user } = this.props;
    const { is_responsible } = info.booking_info.todo_info;
    // console.log('info', info)
    // console.log('is_responsible', is_responsible)
    // console.log('the type', typeof user);
    // if (Number(user) === 5) {
    //   return <View />;
    // }

    return (
      <View>
        <ListItem itemDivider>
          <Text style={{color: '#787878', fontWeight: 'bold'}}>Tilbudslinjer</Text>
        </ListItem>
        <View style={[styles.noMarginLeft, {backgroundColor: '#595959', height: 30, padding: 5}]}>
          {Number(is_responsible) === 0 ? (
            <View />
          ) : (
            <Text style={{flex: 1, textAlign: 'right', color: '#fff'}}>{`Samlet akkord: ${info.booking_info.todo_info.total_akkord}kr`}</Text>
          )}

        </View>
        <ListItem itemDivider>
          <Swiper
            style={styles.wrapper}
            showsPagination
            paginationStyle={{borderColor: 'red'}}
            showsButtons={info.booking_info.todo_info.products.length !== 1}>
            {info.booking_info.todo_info.products.map((item) => {
              let tempStatus = '';
              if (Number(item.status) === 0) {
                tempStatus = 'Ikke startet';
              } else if (Number(item.status) === 1) {
                tempStatus = 'Startet';
              } else {
                tempStatus = 'Udført';
              }

              return (
                <Card style={{ elevation: 3 }} key={item.id}>
                  <View>
                    <CardItem bordered>
                      <Text style={{width: '30%', paddingLeft: 18, color: '#7F7F7F'}}>Titel</Text>
                      <Text style={{width: '70%'}}>
                        {item.title}
                      </Text>
                    </CardItem>

                    <CardItem bordered>
                      <Text style={{width: '30%', paddingLeft: 18, color: '#7F7F7F'}}>Antal</Text>
                      <Text numberOfLines={1} style={{width: '70%'}}>
                        {item.number}
                      </Text>
                    </CardItem>

                    <CardItem bordered>
                      <Text style={{width: '30%', paddingLeft: 18, color: '#7F7F7F'}}>Ansvarlig</Text>
                      <Text numberOfLines={1} style={{width: '70%'}}>
                        {item.responsible.name}
                      </Text>
                    </CardItem>

                    <CardItem bordered>
                      <Text style={{width: '30%', paddingLeft: 18, color: '#7F7F7F'}}>Akkord</Text>
                      <Text numberOfLines={1} style={{width: '70%'}}>
                        {item.akkord}
                      </Text>
                    </CardItem>

                    <CardItem bordered style={{paddingTop: 0, paddingBottom: 0}}>
                      <Text style={{width: '30%', paddingLeft: 18, color: '#7F7F7F'}}>Status</Text>
                      <View style={{width: '70%'}}>
                        {Number(is_responsible) === 0 ? (
                          <Text style={{padding: 10}}>{tempStatus}</Text>
                        ) : (
                          <Dropdown
                            label=""
                            labelHeight={0}
                            value={tempStatus}
                            containerStyle={{paddingLeft: 10, marginTop: 10}}
                            inputContainerStyle={{ borderBottomColor: 'transparent' }}
                            data={entryStatus}
                            onChangeText={value => this.updateTodoJobStatusHandler(value, item)} />
                        )}

                      </View>
                    </CardItem>
                  </View>
                </Card>
              );
            })

            }
            {/* <View style={styles.slide1}>
              <Text style={styles.text}>Hello Swiper</Text>
            </View>
            <View style={styles.slide2}>
              <Text style={styles.text}>Beautiful</Text>
            </View>
            <View style={styles.slide3}>
              <Text style={styles.text}>And simple</Text>
            </View> */}
          </Swiper>
        </ListItem>
        {/* <DeckSwiper
          ref={mr => (this._deckSwiper = mr)}
          dataSource={info.booking_info.todo_info.products}
          looping
          renderEmpty={() => (
            <View style={{ alignSelf: 'center' }}>
              <Text>No more data...</Text>
            </View>)}
          renderItem={(item) => {
            let tempStatus = '';
            if (Number(item.status) === 0) {
              tempStatus = 'Ikke startet';
            } else if (Number(item.status) === 1) {
              tempStatus = 'Startet';
            } else {
              tempStatus = 'Udført';
            }
            return (

            );
          }} /> */}
      </View>

    );
  }
}

export default TodoSection;
