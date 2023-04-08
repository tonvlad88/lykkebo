import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Segment,
} from "native-base";

import { StatusBar, Text, TouchableOpacity, View } from "react-native";

import { Dropdown } from "react-native-material-dropdown-v2-fixed";

import WeeklySegment from "./Segments/WeeklySegment";
import MonthlySegment from "./Segments/MonthlySegment";
import YearlySegment from "./Segments/YearlySegment";
import NewHeader from "../../common/NewHeader";
import { appSideBar } from "../../utils/constants";

class AccountScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seg: 2,
      turnover: 1,
      refresh: 0,
    };
  }

  render() {
    const { navigation } = this.props;
    const { seg, turnover, refresh } = this.state;

    const searchBy = [
      { value: "1", label: "Kommende omsætning" },
      { value: "2", label: "Igangværende omsætning" },
      { value: "3", label: "Udført omsætning" },
    ];

    return (
      <View>
        <NewHeader title={appSideBar[4].name} navigation={navigation} />
        {/* <Segment style={{ backgroundColor: "#2E3D43" }}>
          <TouchableOpacity
            first
            active={seg === 1}
            onPress={() => this.setState({ seg: 1, refresh: refresh + 1 })}
          >
            <Text>År</Text>
          </TouchableOpacity>
          <TouchableOpacity
            active={seg === 2}
            onPress={() => this.setState({ seg: 2, refresh: refresh + 1 })}
          >
            <Text>Måned</Text>
          </TouchableOpacity>
          <TouchableOpacity
            last
            active={seg === 3}
            onPress={() => this.setState({ seg: 3, refresh: refresh + 1 })}
          >
            <Text>Uge</Text>
          </TouchableOpacity>
        </Segment> */}

        <Dropdown
          containerStyle={{ padding: 10 }}
          label="Omsætning"
          value="Kommende omsætning"
          data={searchBy}
          onChangeText={(val) =>
            this.setState({ turnover: val, refresh: refresh + 1 })
          }
        />
        {/* <View>
          {seg === 1 && (
            <YearlySegment key={refresh} period={seg} turnover={turnover} />
          )}
          {seg === 2 && (
            <MonthlySegment key={refresh} period={seg} turnover={turnover} />
          )}
          {seg === 3 && (
            <WeeklySegment key={refresh} period={seg} turnover={turnover} />
          )}
        </View> */}
      </View>
    );
  }
}

export default AccountScreen;
