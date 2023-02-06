import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
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
  ListItem,
  Badge,
  Content,
  Accordion,
  Toast,
} from 'native-base';

class TimeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentData: '',
      loaded: false,
      userRelation: 0,
    };
    this.renderContent = this.renderContent.bind(this);
  }

  componentDidMount() {
    AsyncStorage.getItem('user_id').then((userId) => {
      AsyncStorage.getItem('token').then((token) => {
        AsyncStorage.getItem('user_relation').then((userRelation) => {
          AsyncStorage.getItem('baseUrl').then((baseUrl) => {
            fetch(`${baseUrl}/lykkebo/v1/time/overview?user_id=${userId}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
                user_id: `${userId}`,
              },
            })
              .then(response => response.json())
              .then((responseJson) => {
                this.setState({
                  contentData: responseJson.weeks,
                  loaded: true,
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
  }

  openTimeDetails(details) {
    const { userRelation } = this.state;
    const { navigation } = this.props;
    AsyncStorage.setItem('selectedTimestamp', JSON.stringify(details.datestamp)).then(() => {
      if (Number(userRelation) === 1) {
        navigation.navigate('TimeDetailsResponsible');
      } else {
        navigation.navigate('TimeDetails');
      }
    });
  }

  renderHeader({week}) {
    return (
      <View
        style={{
          flexDirection: 'row', padding: 10, justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#324248', borderBottomWidth: 0.5, borderColor: '#ccc',
        }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#FFF' }}>
          {' '}
          {week}
        </Text>
      </View>
    );
  }

  renderBadge({status}) {
    if (status === 'ikke godkendt') {
      return (
        <Badge style={{ backgroundColor: '#C40000'}}>
          <Text style={{
            paddingLeft: 5, paddingRight: 5, marginTop: 3, color: '#fff',
          }}>
            {status}
          </Text>
        </Badge>
      );
    } else if (status === 'godkendt') {
      return (
        <Badge style={{ backgroundColor: '#006200'}}>
          <Text style={{
            paddingLeft: 5, paddingRight: 5, marginTop: 3, color: '#fff',
          }}>
            {status}
          </Text>
        </Badge>
      );
    } else {
      return (
        <Badge style={{ backgroundColor: '#333333'}}>
          <Text style={{
            paddingLeft: 5, paddingRight: 5, marginTop: 3, color: '#fff',
          }}>
            {status}
          </Text>
        </Badge>
      );
    }
  }

  renderContent({details}) {
    return details.map(data => (
      <TouchableOpacity key={data.datestamp}>
        <ListItem
          onPress={() => {
            this.openTimeDetails(data);
          }}
          style={{marginLeft: 0, borderBottomWidth: 0.5, borderColor: '#ccc'}}>
          <Body style={{marginLeft: 10, flex: 1}}>
            <Text>{`${data.day}, ${data.full_day}`}</Text>
          </Body>
          <Right style={{flex: 1}}>
            {this.renderBadge(data)}
          </Right>
        </ListItem>
      </TouchableOpacity>
    ));
  }

  render() {
    const {
      loaded,
      contentData,
      userRelation,
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
              <Title style={{color: '#ffffff'}}>Timer</Title>
            </Body>
            <Right style={{ flex: 1 }} />
          </Header>
          <View style={{
            width: '100%', height: 3, backgroundColor: '#323248', marginBottom: 1,
          }} />

          <Content
            style={{ backgroundColor: 'white' }}>
            <Accordion
              dataArray={contentData}
              renderHeader={this.renderHeader}
              renderContent={this.renderContent}
              animation={false}
              expanded={0} />
          </Content>

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
              <Title style={{color: '#ffffff'}}>Timer</Title>
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

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'red',
  },
  card: {
    // width: '100%',
    margin: 5,
    // height: 470,
    flex: 1,
    backgroundColor: '#C0C0C0',
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    borderWidth: 1,
    borderColor: 'blue',
  },
  card1: {
    backgroundColor: '#FE474C',
  },
  card2: {
    backgroundColor: '#FEB12C',
  },
  label: {
    lineHeight: 400,
    textAlign: 'center',
    fontSize: 55,
    fontFamily: 'System',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 220,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  orange: {
    width: 55,
    height: 55,
    borderWidth: 6,
    borderColor: 'rgb(246,190,66)',
    borderRadius: 55,
    marginTop: -15,
  },
  green: {
    width: 75,
    height: 75,
    backgroundColor: '#fff',
    borderRadius: 75,
    borderWidth: 6,
    borderColor: '#01df8a',
  },
  red: {
    width: 75,
    height: 75,
    backgroundColor: '#fff',
    borderRadius: 75,

    borderWidth: 6,
    borderColor: '#fd267d',
  },
  noMarginLeft: {
    marginLeft: 0,
  },
});

export default TimeScreen;
