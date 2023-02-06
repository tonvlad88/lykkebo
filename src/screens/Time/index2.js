import React, { Component } from 'react';
import {
  Container,
  Header,
  Title,
  Button,
  DeckSwiper,
  Card,
  CardItem,
  Icon,
  Text,
  Left,
  Right,
  Body,
  Badge,
} from 'native-base';

import { View } from 'react-native';

import styles from './styles';

const data = [
  {
    relation: 'apprentice',
    data: [
      {
        name: 'Uge 9',
        details: [
          {
            id: 1, //should be the time id on the database
            day: 'Monday',
            date: '25. Feb',
            title: '#2981 Lars Soresen',
            time: 7.5,
            kilometer: 0,
            comment: 'done by Sneholt',
            status: 'done',
          },
          {
            id: 2, //should be the time id on the database
            day: 'Tuesay',
            date: '26. Feb',
            title: '#2981 Lars Soresen',
            time: 0,
            kilometer: 0,
            comment: '',
            status: 'not started',
          },
          {
            id: 3, //should be the time id on the database
            day: 'Wednesday',
            date: '27. Feb',
            title: '#2981 Lars Soresen',
            time: 0,
            kilometer: 0,
            comment: '',
            status: 'not started',
          },
          {
            id: 4, //should be the time id on the database
            day: 'Thursday',
            date: '28. Feb',
            title: '#2981 Lars Soresen',
            time: 0,
            kilometer: 0,
            comment: '',
            status: 'not started',
          },
          {
            id: 5, //should be the time id on the database
            day: 'Friday',
            date: '01. Mar',
            title: '#2981 Lars Soresen',
            time: 0,
            kilometer: 0,
            comment: '',
            status: 'not started',
          },
          {
            id: 6, //should be the time id on the database
            day: 'Saturday',
            date: '02. Mar',
            title: '#2981 Lars Soresen',
            time: 0,
            kilometer: 0,
            comment: '',
            status: 'not started',
          },
          {
            id: 7, //should be the time id on the database
            day: 'Sunday',
            date: '03. Mar',
            title: '#2981 Lars Soresen',
            time: 0,
            kilometer: 0,
            comment: '',
            status: 'not started',
          }
        ]
      },
    ]
  }
]
    name: 'Uge 50',
    details: [
      {
        day: 'Monday',
        date: '10. Dec',
        apprentice_info: [
          {
            id: 3,
            name: 'Luca Beckwith',
          },
        ],

      },
      {
        day: 'Tuesday',
        date: '11. Dec',
        value: 0,
      },
      {
        day: 'Wednesday',
        date: '12. Dec',
        value: 0,
      },
      {
        day: 'Thursday',
        date: '13. Dec',
        value: 0,
      },
      {
        day: 'Friday',
        date: '14. Dec',
        value: 0,
      },
      {
        day: 'Saturday',
        date: '15. Dec',
        value: 0,
      },
      {
        day: 'Sunday',
        date: '16. Dec',
        value: 0,
      },
    ],
  },
  {
    name: 'Uge 51',
    details: [
      {
        day: 'Monday',
        date: '17. Dec',
        value: 0,
      },
      {
        day: 'Tuesday',
        date: '18. Dec',
        value: 0,
      },
      {
        day: 'Wednesday',
        date: '19. Dec',
        value: 0,
      },
      {
        day: 'Thursday',
        date: '20. Dec',
        value: 0,
      },
      {
        day: 'Friday',
        date: '21. Dec',
        value: 0,
      },
      {
        day: 'Saturday',
        date: '22. Dec',
        value: 0,
      },
      {
        day: 'Sunday',
        date: '23. Dec',
        value: 0,
      },
    ],
  },
  {
    name: 'Uge 52',
    details: [
      {
        day: 'Monday',
        date: '24. Dec',
        value: 0,
      },
      {
        day: 'Tuesday',
        date: '25. Dec',
        value: 0,
      },
      {
        day: 'Wednesday',
        date: '26. Dec',
        value: 0,
      },
      {
        day: 'Thursday',
        date: '27. Dec',
        value: 0,
      },
      {
        day: 'Friday',
        date: '28. Dec',
        value: 0,
      },
      {
        day: 'Saturday',
        date: '29. Dec',
        value: 0,
      },
      {
        day: 'Sunday',
        date: '30. Dec',
        value: 0,
      },
    ],
  },
];

class TimeScreen extends Component {
  render() {
    return (
      <Container style={styles.container}>
        <Header style={{ backgroundColor: '#2E3D43' }}>
          <Left style={{ flex: 1 }}>
            <Button transparent>
              <Icon size={40} name="menu" onPress={() => this.props.navigation.openDrawer()} />
            </Button>
          </Left>
          <Body style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Title>Tid</Title>
          </Body>
          <Right style={{ flex: 1 }} />
        </Header>
        <View style={{
          width: '100%', height: 3, backgroundColor: '#323248', marginBottom: 1,
        }} />

        <View style={{ flex: 1, padding: 12 }}>
          <DeckSwiper
            ref={mr => (this._deckSwiper = mr)}
            dataSource={cards}
            looping
            renderEmpty={() => (
              <View style={{ alignSelf: 'center' }}>
                <Text>No more data...</Text>
              </View>)}
            renderItem={item => (
              <Card style={{ elevation: 3 }}>
                <CardItem header bordered>
                  <Text>
                    {item.name}
                  </Text>
                </CardItem>
                {item.details.map(item2 => (
                  <CardItem bordered>
                    <Text>
                      {`${item2.day}, ${item2.date}`}
                    </Text>
                    <Badge style={{backgroundColor: 'gray'}}>
                      <Text>  </Text>
                    </Badge>
                  </CardItem>
                ))}
              </Card>)} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            position: 'absolute',
            bottom: 50,
            left: 0,
            right: 0,
            justifyContent: 'space-between',
            padding: 15,
          }}>
          <Button iconLeft onPress={() => this._deckSwiper._root.swipeLeft()}>
            <Icon name="arrow-back" />
            <Text>Swipe Left</Text>
          </Button>
          <Button iconRight onPress={() => this._deckSwiper._root.swipeRight()}>
            <Text>Swipe Right</Text>
            <Icon name="arrow-forward" />
          </Button>
        </View>
      </Container>
    );
  }
}

export default TimeScreen;
