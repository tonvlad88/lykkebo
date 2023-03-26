import React, { Fragment } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

// import {
//   H1,
//   Thumbnail,
//   Toast,
// } from 'native-base';

import axios from 'axios';
import base64 from 'base-64';

import {
  Input, Button,
} from '../../common';

import deviceStorage from '../../services/deviceStorage';

const cover = require('../../../assets/logostreger.png');

class SignInScreen extends React.Component {
  static navigationOptions = { header: null }

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
      loading: false,
    };

    this.loginUser = this.loginUser.bind(this);
    this.onLoginFail = this.onLoginFail.bind(this);
  }

  onLoginFail() {
    this.setState({
      // error: `Login Failed: ${error}`,
      // error: 'Login Failed: Please check your credentials',
      error: 'Login mislykkedes, prøv igen!',
      loading: false,
    });
  }

  loginUser() {
    const { email, password } = this.state;
    const { navigation } = this.props;

    // UNCOMMENT BELOW CODE IF FOR STAGING
    // const mode = 'http://';
    // const url = `${mode}lykkeboadm.typo3cms.dk/wp-json`;

    // UNCOMMENT BELOW CODE IF FOR PRODUCTION
    const mode = 'https://';
    const url = `${mode}lykkeboadm.dk/wp-json`;

    const up = `${email}:${password}`;
    const encoded = base64.encode(up);

    this.setState({ error: '', loading: true });

    // NOTE Post to HTTPS only in production
    axios.post(`${url}/jwt-auth/v1/token`, {
      username: email,
      password,
      // username: '00665',
      // password: '25336683',
      // username: '00584',
      // password: '53638358',
      // username: '02461 ',
      // password: '12345678',
      // username: '02463',
      // password: '12345678',
    })
      .then((response) => {
        fetch(`${url}/lykkebo/v1/employees/relation?user_id=${response.data.user_id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${response.data.token}`,
            user_id: `${response.data.user_id}`,
          },
        })
          .then(response2 => response2.json())
          .then((responseJson2) => {
            deviceStorage.saveKey('token', response.data.token);
            deviceStorage.saveKey('baseUrl', url);
            deviceStorage.saveKey('encoded', encoded);
            deviceStorage.saveKey('user_id', response.data.user_id);
            deviceStorage.saveKey('user_email', response.data.user_email);
            deviceStorage.saveKey('user_nicename', response.data.user_nicename);
            deviceStorage.saveKey('user_display_name', response.data.user_display_name);
            deviceStorage.saveKey('user_relation', JSON.stringify(responseJson2.userRelation));
            navigation.navigate('App');
          })
          .catch((error) => {
            Toast.show({
              text: error.message,
              position: 'top',
              duration: 5000,
            });
          });
      })
      .catch((error) => {
        this.onLoginFail(error);
      });
  }

  render() {
    const { navigation } = this.props;
    const {
      email, password, error, loading,
    } = this.state;
    const { form, section, errorTextStyle } = styles;

    return (
      <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
        <StatusBar hidden />
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <Text>hey</Text>
          {/* <View style={{
            flex: 1, backgroundColor: '#2E3D43', alignItems: 'center', justifyContent: 'center',
          }}>
            <Thumbnail style={{width: 150, height: 150, borderRadius: 150 / 2}} source={cover} />
            <H1 style={{color: '#fff', fontWeight: 'bold'}}>Lykkebo App</H1>
          </View> */}
          {/* <View style={{flex: 1, backgroundColor: '#2E3D43', padding: 15}}>
            <Fragment>
              <View style={form}>
                <View style={section}>
                  <Input
                    label="Bruger Id"
                    value={email}
                    onChangeText={email2 => this.setState({ email: email2 })} />
                </View>

                <View style={section}>
                  <Input
                    secureTextEntry
                    label="kodeord"
                    value={password}
                    onChangeText={password2 => this.setState({ password: password2 })} />
                </View>

                <Text style={errorTextStyle}>
                  {error}
                </Text>

                {!loading
                  ? (
                    <Button onPress={this.loginUser}>
                    Log Ind
                    </Button>
                  ) : (
                    <ActivityIndicator size="small" />
                  )
                }

              </View>
              <View style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
                <Text
                  style={{textDecorationLine: 'underline', color: '#B9B9B9', textAlign: 'center'}}
                  onPress={() => {
                    // Linking.openURL('https://malerfirmaet-lykkebo.dk/appsignup');
                    navigation.navigate('SignUp');
                  }}>
                  Tilmeld dig her
                </Text>
              </View>

            </Fragment>
          </View> */}
        </View>
      </KeyboardAvoidingView>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    width: '100%',
    // borderTopWidth: 1,
    // borderColor: '#ddd',
  },
  section: {
    marginTop: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgb(106,123,131)',
    borderRadius: 25,
    backgroundColor: 'rgba(106,123,131,0.5)',
  },
  errorTextStyle: {
    alignSelf: 'center',
    fontSize: 18,
    color: 'red',
  },
});

export default SignInScreen;
