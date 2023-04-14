import React, { Component } from "react";
import { Linking, View, Text, StyleSheet } from "react-native";

// import styles from "../../styles";
import {
  appAlignment,
  appColors,
  appDirection,
  appNumbers,
} from "../../../../utils/constants";

class CustomerSection extends Component {
  /**
   * function to link phone number and email
   * @param {string} url
   */
  linkingUrl = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          // console.log('Can\'t handle url: ' + url);
          return;
        }
        Linking.openURL(url);
      })
      .catch((err) => console.error("An error occurred", err));
  };

  render() {
    const { info } = this.props;

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.itemContainer,
            { backgroundColor: appColors.solidGrey },
          ]}
        >
          <Text style={styles.itemHeaderText}>Kundeoplysninger</Text>
        </View>
        <View style={styles.itemContainer}>
          <Text style={styles.itemLabel}>Navn</Text>
          <Text>{info.customer_info.name}</Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemLabel}>Adresse</Text>
          <Text>
            {`${info.customer_info.road} ${info.customer_info.rodanr} ${info.customer_info.city} ${info.customer_info.zipcode}`}
          </Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemLabel}>Telefon</Text>
          <Text>{info.customer_info.phone}</Text>
        </View>

        <View style={styles.itemContainer}>
          <Text style={styles.itemLabel}>Email</Text>
          <Text>{info.customer_info.email}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: appNumbers.number_5,
    borderWidth: appNumbers.number_1,
    borderColor: appColors.solidGrey,
  },
  itemContainer: {
    flexDirection: appDirection.row,
    paddingVertical: appNumbers.number_10,
    paddingHorizontal: appNumbers.number_5,
    alignItems: appAlignment.center,
    borderBottomWidth: 0.5,
    borderBottomColor: appColors.solidGrey,
  },
  itemHeaderText: {
    paddingHorizontal: appNumbers.number_10,
    color: "#787878",
    fontWeight: "bold",
  },
  itemLabel: {
    color: "#7F7F7F",
    paddingLeft: appNumbers.number_10,
    width: "25%",
  },
});
export default CustomerSection;
