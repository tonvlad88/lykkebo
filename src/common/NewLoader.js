import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import commonStyles from "../utils/commonStyles";
import { appAlignment, appColors, appNumbers } from "../utils/constants";

const NewLoader = () => (
  <View style={commonStyles.deadCenter}>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Image
          source={require("../../assets/images/loader-transparent.gif")}
          style={{
            width: appNumbers.number_50,
            height: appNumbers.number_50,
          }}
        />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: appColors.solidWhite,
    borderRadius: 20,
    padding: 10,
    alignItems: appAlignment.center,
    shadowColor: appColors.solidBlack,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default NewLoader;
