import React, { Component } from "react";
import { DeckSwiper, Card, CardItem, ListItem, Toast } from "native-base";

import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import { Dropdown } from "react-native-material-dropdown-v2-fixed";
import Swiper from "react-native-swiper";

import styles from "../../styles";
import { appColors } from "../../../../utils/constants";

const entryStatus = [
  { value: "0", label: "Ikke startet" },
  { value: "1", label: "Startet" },
  { value: "2", label: "Udført" },
];

class TodoSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  updateTodoJobStatusHandler(value, item) {
    // const { info, setNewInfo } = this.props;

    AsyncStorage.getItem("user_id").then((userId) => {
      AsyncStorage.getItem("token").then((token) => {
        AsyncStorage.getItem("baseUrl").then((baseUrl) => {
          AsyncStorage.getItem("selectedJobId").then((jobId) => {
            const axiosConfig = {
              headers: {
                // 'Content-Type': 'application/json;charset=UTF-8',
                // 'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${token}`,
              },
            };

            axios
              .post(
                `${baseUrl}/lykkebo/v1/jobdetails/updateJobTodoStatus?user_id=${userId}&job_id=${jobId}&todo_id=${item.id}&status_id=${value}`,
                {},
                axiosConfig
              )
              .then()
              .catch((error) => {
                // Toast.show({
                //   text: error.message,
                //   position: 'top',
                //   duration: 3000,
                // });
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
      <View style={styles.container}>
        <View
          style={[
            styles.itemContainer,
            { backgroundColor: appColors.solidGrey },
          ]}
        >
          <Text style={styles.itemHeaderText}>Tilbudslinjer</Text>
        </View>

        <View
          style={[
            styles.noMarginLeft,
            {
              backgroundColor: appColors.davyGrey,
              height: 30,
              padding: 5,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: appColors.davyGrey,
            },
          ]}
        >
          {Number(is_responsible) === 0 ? (
            <View />
          ) : (
            <Text
              style={{
                flex: 1,
                textAlign: "right",
                color: "#fff",
              }}
            >{`Samlet akkord: ${info.booking_info.todo_info.total_akkord}kr`}</Text>
          )}
        </View>
        <View>
          <Swiper
            style={styles.wrapper}
            showsPagination
            paginationStyle={{ borderColor: "red" }}
            showsButtons={info.booking_info.todo_info.products.length !== 1}
          >
            {info.booking_info.todo_info.products.map((item) => {
              let tempStatus = "";
              if (Number(item.status) === 0) {
                tempStatus = "Ikke startet";
              } else if (Number(item.status) === 1) {
                tempStatus = "Startet";
              } else {
                tempStatus = "Udført";
              }

              return (
                <View style={{ elevation: 3 }} key={item.id}>
                  <View>
                    <View style={styles.itemContainer}>
                      <Text style={styles.itemLabel}>Titel</Text>
                      <Text style={{ width: "70%" }}>{item.title}</Text>
                    </View>

                    <View style={styles.itemContainer}>
                      <Text style={styles.itemLabel}>Antal</Text>
                      <Text numberOfLines={1} style={{ width: "70%" }}>
                        {item.number}
                      </Text>
                    </View>

                    <View style={styles.itemContainer}>
                      <Text style={styles.itemLabel}>Ansvarlig</Text>
                      <Text numberOfLines={1} style={{ width: "70%" }}>
                        {item.responsible.name}
                      </Text>
                    </View>

                    <View style={styles.itemContainer}>
                      <Text style={styles.itemLabel}>Akkord</Text>
                      <Text numberOfLines={1} style={{ width: "70%" }}>
                        {item.akkord}
                      </Text>
                    </View>

                    <View style={styles.itemContainer}>
                      <Text style={styles.itemLabel}>Status</Text>
                      <View style={{ width: "70%" }}>
                        {Number(is_responsible) === 0 ? (
                          <Text style={{ padding: 10 }}>{tempStatus}</Text>
                        ) : (
                          <Dropdown
                            label=""
                            labelHeight={0}
                            value={tempStatus}
                            containerStyle={{ paddingLeft: 10, marginTop: 10 }}
                            inputContainerStyle={{
                              borderBottomColor: "transparent",
                            }}
                            data={entryStatus}
                            onChangeText={(value) =>
                              this.updateTodoJobStatusHandler(value, item)
                            }
                          />
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
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
        </View>
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
