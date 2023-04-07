import React, { Component } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Event from "./Event";
import EventBooking from "./EventBooking";
import type { EventType } from "../index";
import commonStyles from "../../../../utils/commonStyles";
import { appColors, appNumbers } from "../../../../utils/constants";
import { NormalButton } from "../../../../common/NewButtons/NormalButton";

export default class Events extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: null,
    };
  }

  props: {
    events: ?Array<EventType>,
  };

  render() {
    const { events, onModalPress, navigation } = this.props;

    if (events === undefined || events.length === 0) {
      return (
        <View
          key={Math.floor(Date.now()) + Math.floor(Math.random() * 10000 + 1)}
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          <View style={styles.container}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View style={commonStyles.deadCenter}>
                  <Text style={{ color: appColors.solidWhite }}>
                    Ingen begivenhed fundet
                  </Text>

                  <NormalButton
                    onPress={() => onModalPress()}
                    containerStyle={[
                      commonStyles.deadCenterButton,
                      commonStyles.shadow,
                      styles.addButtonContainer,
                    ]}
                    iconRight={
                      <Ionicons
                        name="add-circle"
                        size={22}
                        color={appColors.granite}
                      />
                    }
                  >
                    <Text
                      style={{
                        color: appColors.solidWhite,
                        marginHorizontal: 10,
                      }}
                    >
                      Tilføj Begivenhed
                    </Text>
                  </NormalButton>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    } else {
      let temp = [];
      if (events[0].type === "Booking") {
        temp = events;
      } else {
        temp = [
          {
            id: events[0].id,
            type: events[0].type,
            date: events[0].date,
            details: [events[0].details],
          },
        ];
      }
      return (
        <View style={styles.container}>
          <ScrollView>
            {events &&
              temp[0].details.map((event) => {
                if (event.type === "Booking") {
                  return (
                    <EventBooking
                      event={event}
                      key={event.id}
                      navigation={navigation}
                    />
                  );
                } else {
                  return <Event event={event} key={event.id} />;
                }
              })}
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A5A5A5",
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  addButtonContainer: {
    paddingVertical: appNumbers.number_5,
    paddingHorizontal: appNumbers.number_10,
    borderRadius: appNumbers.number_10,
    backgroundColor: appColors.primary,
    marginVertical: appNumbers.number_10,
  },
});
