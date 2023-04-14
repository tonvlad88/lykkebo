import React, { Component } from "react";
import { View, Text, Switch } from "react-native";

// import config from '../config';

import styles from "./styles/TodoRowItemStyles";
import DateView from "./DateView";
import { Ionicons } from "@expo/vector-icons";
import { appStrings } from "../../../../../utils/constants";

export default class TodoRowItem extends Component {
  render() {
    const { booking } = this.props;
    const { date, workload } = booking;

    return (
      <View style={styles.row} key={booking.uid}>
        <View style={styles.timelineDate}>
          <DateView date={date} />
        </View>
        <View style={styles.timeline}>
          <View style={styles.timelineVerticalLink} />
          <Ionicons
            style={styles.icon}
            name={appStrings.icon.informationCircle}
            size={24}
            color="black"
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.text}>Arbejdstid</Text>
          <Text style={styles.time}>{workload}</Text>
        </View>
        <View style={styles.switch}>
          <Switch
            onValueChange={(val) => {
              this.props.workingDaysHandler(val, date);
            }}
            value={Number(workload) > 0 ? true : false}
          />
        </View>
      </View>
    );
  }
}
