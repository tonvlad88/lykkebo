import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  StatusBar,
  TextInput,
  ActivityIndicator
} from 'react-native';

// import {
//   H2,
//   Thumbnail,
//   Toast,
//   Textarea,
//   Icon,
// } from 'native-base';

import { Tooltip } from 'react-native-elements';

import axios from 'axios';
import base64 from 'base-64';

import {
  Input, Loading, Button,
} from '../../../common';

import { validateEmail } from '../../../services/common'

import deviceStorage from '../../../services/deviceStorage';

const cover = require('../../../../assets/logostreger.png');

class SignUpScreen extends Component {
  static navigationOptions = { header: null }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phoneNo: '',
      comment: '',
      error: '',
      message: '',
      loading: false,
    };

    this.signupUser = this.signupUser.bind(this);
    this.onSignupFail = this.onSignupFail.bind(this);
  }

  onSignupFail(error) {
    this.setState({
      // error: `Login Failed: ${error}`,
      // error: 'Login Failed: Please check your credentials',
      error: 'Login mislykkedes, prøv igen!',
      loading: false,
    });
  }

  signupUser() {
    const {
      name, email, phoneNo, comment,
    } = this.state;

    this.setState({ loading: true })
    if (!name) {
      this.setState({
        message: '',
        error: 'Navn er påkrævet!',
        loading: false,
      });
    } else if (!email) {
      this.setState({
        message: '',
        error: 'Email er påkrævet!',
        loading: false,
      });
    } else if (!phoneNo) {
      this.setState({
        message: '',
        error: 'Telefonnummer er påkrævet!',
        loading: false,
      });
    } else if (!validateEmail(email)) {
      this.setState({
        message: '',
        error: 'Ugyldig email',
        loading: false,
      });
    } else {
      // UNCOMMENT BELOW CODE IF FOR STAGING
      // const mode = 'http://';
      // const url = `${mode}lykkeboadm.typo3cms.dk/wp-json`;

      // UNCOMMENT BELOW CODE IF FOR PRODUCTION
      const mode = 'https://';
      const url = `${mode}lykkeboadm.dk/wp-json/lykkebo/v1/signup`;

      const postData = {
        name: `${name}`,
        email: `${email}`,
        phone: `${phoneNo}`,
        note: `${comment}`,
      };

      const axiosConfig = {
        headers: {},
      };

      axios.post(url, postData, axiosConfig)
        .then(() => {
          this.setState({
            error: '',
            message: 'Tak for din tilmelding. Venligst tjek din e-mail.',
            loading: false,
          });
        })
        .catch((error) => {
          Toast.show({
            text: error.message,
            position: 'top',
            duration: 5000,
          });
        });
    }
  }

  render() {
    const { navigation } = this.props;
    const {
      name, email, phoneNo, comment, error, loading, message
    } = this.state;
    const {
      form, section, errorTextStyle, successTextStyle,
    } = styles;

    return (
      <Text>Heyy</Text>
    )
    // return (
    //   <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
    //     <StatusBar hidden />
    //     <View style={{
    //       flex: 1,
    //       flexDirection: 'column',
    //       justifyContent: 'center',
    //       alignItems: 'stretch',
    //       backgroundColor: '#2E3D43',
    //       padding: 15,
    //     }}>
    //       <View style={{alignItems: 'center'}}>
    //         <Text style={{color: '#3BB966', fontWeight: 'bold', textAlign: 'center'}}>
    //           SIGNUP FOR LYKKEBO APP
    //         </Text>
    //         <Text style={{
    //           color: '#fff', fontSize: 12, padding: 10, textAlign: 'center', marginTop: 20, marginBottom: 20,
    //         }}>
    //           Udfyld nedenstående formular så får du adgang til lykkebo app  indenfor 48 timer
    //         </Text>

    //         <View style={form}>
    //           <View style={section}>
    //             <TextInput
    //               style={styles.signUpInputStyle}
    //               placeholder="Dit navn"
    //               placeholderTextColor="#B9B9B9"
    //               value={name}
    //               onChangeText={name2 => this.setState({ name: name2 })} />
    //             <Tooltip
    //               width={300}
    //               popover={<Text>Det navn vi skal oprette din bruger med</Text>}>
    //               {/* <Icon style={styles.info} name="information-circle-outline" /> */}
    //             </Tooltip>
    //           </View>

    //           <View style={section}>
    //             <TextInput
    //               style={styles.signUpInputStyle}
    //               placeholder="E-mail"
    //               placeholderTextColor="#B9B9B9"
    //               value={email}
    //               onChangeText={email2 => this.setState({ email: email2 })} />
    //             <Tooltip
    //               width={300}
    //               popover={<Text>Dette skal vi bruge til at kontakte dig på</Text>}>
    //               {/* <Icon style={styles.info} name="information-circle-outline" /> */}
    //             </Tooltip>
    //           </View>

    //           <View style={section}>
    //             <TextInput
    //               style={styles.signUpInputStyle}
    //               placeholder="Telefonnummer (+45)"
    //               placeholderTextColor="#B9B9B9"
    //               value={phoneNo}
    //               onChangeText={phoneNo2 => this.setState({ phoneNo: phoneNo2 })} />
    //             <Tooltip
    //               width={320}
    //               popover={<Text>Dette skal vi bruge til at kunne kontakte dig på</Text>}>
    //               {/* <Icon style={styles.info} name="information-circle-outline" /> */}
    //             </Tooltip>
    //           </View>

    //           <TextInput
    //             multiline
    //             numberOfLines={4}
    //             style={[section, {color: '#fff'}]}
    //             // rowSpan={5}
    //             bordered
    //             placeholder="Eventuelle bemærkninger"
    //             placeholderTextColor="#B9B9B9"
    //             onChangeText={comment2 => this.setState({ comment: comment2 })} />


    //           <Text style={errorTextStyle}>
    //             {error}
    //           </Text>

    //           <Text style={successTextStyle}>
    //             {message}
    //           </Text>

    //           {!loading
    //             ? (
    //               <Button onPress={this.signupUser}>
    //               SIGNUP
    //               </Button>
    //             ) : (
    //               <ActivityIndicator size="large" />
    //             )
    //           }
    //         </View>
    //       </View>
    //     </View>

    //     <View style={{
    //       height: 50,
    //       justifyContent: 'flex-end',
    //       backgroundColor: '#2E3D43',
    //       paddingBottom: 15,
    //     }}>
    //       <Text
    //         style={{textDecorationLine: 'underline', color: '#B9B9B9', textAlign: 'center'}}
    //         onPress={() => {
    //           // Linking.openURL('https://malerfirmaet-lykkebo.dk/appsignup');
    //           navigation.navigate('SignIn');
    //         }}>
    //           Log ind her
    //       </Text>
    //     </View>
    //   </KeyboardAvoidingView>

    // );
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
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
  successTextStyle: {
    textAlign: 'center',
    fontSize: 16,
    color: 'green',
  },
  signUpInputStyle: {
    color: '#fff',
    paddingRight: 15,
    paddingLeft: 15,
    fontSize: 15,
    flex: 3,
    height: 40,
  },
  info: {
    padding: 5,
    color: '#A6A6A6',
    fontSize: 25,
  },
});

export default SignUpScreen;
