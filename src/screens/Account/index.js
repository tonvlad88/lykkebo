import React, { Component } from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Left,
  Right,
  Body,
  Segment,
} from 'native-base';

import { StatusBar } from 'react-native';

import { Dropdown } from 'react-native-material-dropdown-v2-fixed';

import WeeklySegment from './Segments/WeeklySegment';
import MonthlySegment from './Segments/MonthlySegment';
import YearlySegment from './Segments/YearlySegment';

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
    const {
      seg, turnover, refresh,
    } = this.state;

    const searchBy = [
      {value: '1', label: 'Kommende omsætning'},
      {value: '2', label: 'Igangværende omsætning'},
      {value: '3', label: 'Udført omsætning'},
    ];

    return (
      <Container>
        <StatusBar hidden />
        <Header hasSegment style={{ backgroundColor: '#2E3D43' }}>
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
            <Title style={{color: '#ffffff'}}>Konto</Title>
          </Body>
          <Right style={{ flex: 1 }} />
        </Header>

        <Segment style={{ backgroundColor: '#2E3D43' }}>
          <Button
            first
            active={seg === 1}
            onPress={() => this.setState({ seg: 1, refresh: refresh + 1 })}>
            <Text>År</Text>
          </Button>
          <Button
            active={seg === 2}
            onPress={() => this.setState({ seg: 2, refresh: refresh + 1 })}>
            <Text>Måned</Text>
          </Button>
          <Button
            last
            active={seg === 3}
            onPress={() => this.setState({ seg: 3, refresh: refresh + 1 })}>
            <Text>Uge</Text>
          </Button>
        </Segment>

        <Dropdown
          containerStyle={{padding: 10}}
          label="Omsætning"
          value="Kommende omsætning"
          data={searchBy}
          onChangeText={val => this.setState({turnover: val, refresh: refresh + 1})} />
        <Content padder>
          {seg === 1 && <YearlySegment key={refresh} period={seg} turnover={turnover} />}
          {seg === 2 && <MonthlySegment key={refresh} period={seg} turnover={turnover} />}
          {seg === 3 && <WeeklySegment key={refresh} period={seg} turnover={turnover} />}
        </Content>
      </Container>
    );
  }
}

export default AccountScreen;
