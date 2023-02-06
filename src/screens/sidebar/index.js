import React, { Component } from 'react';
import { Image, View, AsyncStorage } from 'react-native';
import {
  Content,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  Left,
  Right,
  Badge,
} from 'native-base';
import styles from './style';

// const drawerCover = require('../../../assets/drawer-cover.png');
const drawerImage = require('../../../assets/logo.jpg');

const datas = [
  {
    name: 'Kalender',
    route: 'Calendar',
    icon: 'calendar',
    bg: '#C5F442',
  },
  {
    name: 'Jobs',
    route: 'Jobs',
    icon: 'home',
    bg: '#AB6AED',
    // types: "3"
  },
  // {
  //   name: 'Specify',
  //   route: 'Specify',
  //   icon: 'switch',
  //   bg: '#AB6AED',
  //   // types: "3"
  // },
  {
    name: 'Tid(Lærling)',
    route: 'Time',
    icon: 'clock',
    bg: '#C5F442',
  },
  {
    name: 'Tid Rec',
    route: 'TimeTracker',
    icon: 'clock',
    bg: '#C5F442',
  },
  // {
  //   // name: 'Oversigt',
  //   // route: 'Overview',
  //   // icon: 'grid',
  //   // bg: '#AB6AED',
  // },
  {
    name: 'Konto',
    route: 'Account',
    icon: 'person',
    bg: '#C5F442',
  },
  {
    name: 'Logout',
    route: 'Auth',
    icon: 'power',
    bg: '#AB6AED',
    // types: "3"
  },
];

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDisplayName: '',
      userDisplayEmail: '',
      userRelation: null,
      loaded: false,
    };
  }

  componentDidMount() {
    // const userEmail = deviceStorage.getItem('user_email');
    AsyncStorage.getItem('user_email').then((email) => {
      AsyncStorage.getItem('user_display_name').then((name) => {
        AsyncStorage.getItem('user_relation').then((userRelation) => {
          this.setState({
            userDisplayName: name,
            userDisplayEmail: email,
            userRelation,
            loaded: true,
          });
        });
      });
    });
  }

  render() {
    const {
      userDisplayName, userDisplayEmail, userRelation, loaded,
    } = this.state;
    const { navigation } = this.props;

    if (loaded) {
      return (
        <Container>
          <Content
            bounces={false}
            style={{ flex: 1, backgroundColor: '#fff', top: -1 }}>
            <View style={styles.drawerCover}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 18}}>
                {userDisplayName}
              </Text>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 12}}>
                {userDisplayEmail}
              </Text>
            </View>
            <Image square style={styles.drawerImage} source={drawerImage} />

            <List
              keyExtractor={(item, index) => index.toString()}
              dataArray={datas}
              renderRow={(data) => {
                // if (data.name === 'Tid' && Number(userRelation) !== 5) {
                //   return <View />;
                // }

                if (data.name === 'Tid Rec' && Number(userRelation) === 5) {
                  return <View />;
                }
                return (
                  <ListItem
                    style={{marginLeft: 0, paddingLeft: 17}}
                    button
                    bordered
                    onPress={() => {
                      if (data.name === 'Logout') {
                        AsyncStorage.removeItem('token')
                          .then(
                            AsyncStorage.clear().then(() => {
                              navigation.navigate('Auth');
                            })
                          );
                      } else {
                        navigation.navigate(data.route);
                      }
                    }
                    }>
                    <Left>
                      <Icon
                        active
                        name={data.icon}
                        style={{ color: '#777', fontSize: 26, width: 30 }} />
                      <Text style={styles.text}>
                        {data.name}
                      </Text>
                    </Left>
                    {data.types
                      && (
                        <Right style={{ flex: 1 }}>
                          <Badge
                            style={{
                              borderRadius: 3,
                              height: 25,
                              width: 72,
                              backgroundColor: data.bg,
                            }}>
                            <Text
                              style={styles.badgeText}>
                              {`${data.types} Types`}
                            </Text>
                          </Badge>
                        </Right>
                      )}
                  </ListItem>);
              }} />
          </Content>
        </Container>
      );
    } else {
      return <View />;
    }
  }
}

export default SideBar;
