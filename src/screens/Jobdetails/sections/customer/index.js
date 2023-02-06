import React, { Component } from 'react';
import { Linking } from 'react-native';

import {
  Content,
  ListItem,
  Text,
} from 'native-base';


import styles from '../../styles';

class CustomerSection extends Component {
  /**
   * function to link phone number and email
   * @param {string} url
   */
  linkingUrl = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (!supported) {
        // console.log('Can\'t handle url: ' + url);
        return;
      }
      Linking.openURL(url);
    }).catch(err => console.error('An error occurred', err));
  }

  render() {
    const { info } = this.props;

    return (
      <Content>
        <ListItem itemDivider>
          <Text style={{color: '#787878', fontWeight: 'bold'}}>Kundeoplysninger</Text>
        </ListItem>
        <ListItem style={styles.noMarginLeft}>
          <Text style={{width: '30%', paddingLeft: 18, color: '#7F7F7F'}}>Navn</Text>
          <Text style={{width: '70%'}}>{info.customer_info.name}</Text>
        </ListItem>
        <ListItem style={styles.noMarginLeft}>
          <Text style={{width: '30%', paddingLeft: 18, color: '#7F7F7F'}}>Adresse</Text>
          <Text style={{width: '70%'}}>
            {`${info.customer_info.road} ${info.customer_info.rodanr} ${info.customer_info.city} ${info.customer_info.zipcode}`}
          </Text>
        </ListItem>
        <ListItem style={styles.noMarginLeft}>
          <Text style={{width: '30%', paddingLeft: 18, color: '#7F7F7F'}}>Telefon</Text>
          <Text style={{width: '70%', textDecorationLine: 'underline'}} onPress={() => this.linkingUrl(`tel:${info.customer_info.phone}`)}>{info.customer_info.phone}</Text>
        </ListItem>
        <ListItem style={styles.noMarginLeft}>
          <Text style={{width: '30%', paddingLeft: 18, color: '#7F7F7F'}}>Email</Text>
          <Text style={{width: '70%'}}>{info.customer_info.email}</Text>
        </ListItem>
      </Content>
    );
  }
}

export default CustomerSection;
