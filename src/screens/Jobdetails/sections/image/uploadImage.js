// Main Packages
import React, { Component, useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  Platform,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Packages
import { Ionicons } from "@expo/vector-icons";
import { showMessage } from "react-native-flash-message";
import * as ImagePicker from "expo-image-picker";
// import CameraRoll from "@react-native-community/cameraroll";

// Global Imports

// Local Imports
import PhotoGrid from "./PhotoGrid";
import {
  appAlignment,
  appColors,
  appDirection,
  appNumbers,
  appStrings,
} from "../../../../utils/constants";
const notAvailable = require("../../../../../assets/images/na.gif");

export default class UploadImage extends Component {
  state = {
    hasAccessGalery: false,
    hasAccessCamera: false,
    image: null,
    uploading: false,
    isFromTimeRec: 0,
    images: [],
    theJobId: "",
    theCustomerName: "",
  };

  async componentDidMount() {
    AsyncStorage.getItem("isFromTimeRec").then((isFromTimeRec) => {
      AsyncStorage.getItem("user_id").then((userId) => {
        AsyncStorage.getItem("token").then((token) => {
          AsyncStorage.getItem("baseUrl").then((baseUrl) => {
            AsyncStorage.getItem("selectedTimeTrackerDetails").then(
              (details) => {
                AsyncStorage.getItem("selectedJobId").then((jobId) => {
                  const data = JSON.parse(details);
                  fetch(
                    `${baseUrl}/lykkebo/v1/jobdetails/overview?user_id=${userId}&job_id=${jobId}`,
                    {
                      method: "GET",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                      params: {
                        user_id: `${userId}`,
                        job_id: `${jobId}`,
                      },
                    }
                  )
                    .then((response) => response.json())
                    .then((responseJson) => {
                      const temp = [];
                      responseJson.booking.booking_info.images.forEach(
                        (item) => {
                          temp.push(item.image);
                        }
                      );

                      this.setState({
                        images: temp,
                        isFromTimeRec,
                        theJobId: jobId,
                        theCustomerName:
                          responseJson.booking.customer_info.name,
                        // hasAccessGalery: statusGallery === 'granted',
                        // hasAccessCamera: statusCamera === 'granted',
                      });
                    })
                    .catch((error) => {
                      showMessage({
                        message: error.message,
                        type: appStrings.common.danger,
                      });
                    });
                });
              }
            );
          });
        });
      });
    });
  }

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      this.setState({ image: result.assets[0].uri });
    }
  };

  openBooking = () => {
    const { theJobId } = this.state;
    const { navigation } = this.props;
    AsyncStorage.setItem("selectedJobId", theJobId).then(() => {
      navigation.navigate("Jobdetails");
    });
  };

  takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowEditing: false,
      exif: true,
      base64: true,
    });

    if (!result.canceled) {
      this.setState({ image: result.assets[0].uri });
    }
  };

  uploadPhoto = async () => {
    const { image } = this.state;

    if (image === null) {
      return;
    }

    this.setState({ uploading: true });

    AsyncStorage.getItem("user_id").then((userId) => {
      AsyncStorage.getItem("token").then((token) => {
        AsyncStorage.getItem("baseUrl").then((baseUrl) => {
          AsyncStorage.getItem("selectedJobId").then((jobId) => {
            const formData = new FormData();
            // Add your input data
            formData.append("user_id", userId);
            formData.append("job_id", jobId);

            // Add your photo
            // this, retrive the file extension of your photo
            const uriPart = image.split(".");
            const fileExtension = uriPart[uriPart.length - 1];

            formData.append("photo", {
              uri: image,
              name: `photo.${fileExtension}`,
              type: `image/${fileExtension}`,
              user_id: `${userId}`,
              job_id: jobId,
            });

            // axios.post('http://lykkeboadm.typo3cms.dk/wp-json/lykkebo/v1/jobdetails/uploadImage', postData, axiosConfig)
            // fetch('http://192.168.254.111/lykkebo/upload.php', {
            fetch(`${baseUrl}/lykkebo/v1/jobdetails/uploadImage`, {
              method: "POST",
              headers: {
                "Content-Type": "multipart/form-data",
              },
              body: formData,
            })
              .then(() => {
                fetch(
                  `${baseUrl}/lykkebo/v1/jobdetails/overview?user_id=${userId}&job_id=${jobId}`,
                  {
                    method: "GET",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                    params: {
                      user_id: `${userId}`,
                      job_id: `${jobId}`,
                    },
                  }
                )
                  .then((response) => response.json())
                  .then((responseJson) => {
                    // console.log('responseJson', responseJson);
                    const temp = [];
                    responseJson.booking.booking_info.images.forEach((item) => {
                      temp.push(item.image);
                    });
                    this.setState({
                      images: temp,
                      uploading: false,
                    });
                    showMessage({
                      message: "Opdateret succesfuldt",
                      type: appStrings.common.success,
                    });
                  })
                  .catch((error) => {
                    showMessage({
                      message: error.message,
                      type: appStrings.common.danger,
                    });
                  });
              })
              .catch((error) => {
                this.setState({ uploading: false });
                showMessage({
                  message: error.message,
                  type: appStrings.common.danger,
                });
              });
          });
        });
      });
    });
  };

  render() {
    const {
      isFromTimeRec,
      theJobId,
      theCustomerName,
      images,
      image,
      uploading,
    } = this.state;

    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: appDirection.row,
            backgroundColor: appColors.primary,
            paddingHorizontal: appNumbers.number_10,
            paddingVertical: appNumbers.number_16,
            alignItems: appAlignment.center,
          }}
        >
          {Number(isFromTimeRec) === 1 ? (
            <TouchableOpacity>
              <Ionicons
                style={{ color: "#ffffff" }}
                size={40}
                name="arrow-back"
                onPress={() => {
                  AsyncStorage.setItem("isFromTimeRec", "0").then(() => {
                    navigation.navigate("TimeTrackerDetail");
                  });
                }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Ionicons
                style={{ color: "#ffffff" }}
                size={40}
                name={appStrings.icon.chevronBack}
                onPress={() =>
                  navigation.navigate(appStrings.mainStack.jobDetailsScreen)
                }
              />
            </TouchableOpacity>
          )}

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Text
              style={{
                color: "#ffffff",
                fontWeight: "600",
                fontSize: appNumbers.number_20,
              }}
            >
              Upload billede
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#243135",
            borderBottomWidth: 0.5,
            borderColor: "#ccc",
            padding: appNumbers.number_10,
          }}
          onPress={this.openBooking}
        >
          <Text
            style={{
              color: "#ffffff",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {theJobId !== "" ? `BOOKING ${theJobId} - ${theCustomerName}` : ""}
          </Text>
        </TouchableOpacity>

        <View style={{ flex: appNumbers.number_1 }}>
          <View style={{ flex: 2, flexDirection: "column" }}>
            <Image
              source={image !== null ? { uri: image } : notAvailable}
              style={{
                marginVertical: appNumbers.number_15,
                width: 200,
                height: 200,
                resizeMode: "cover",
                alignSelf: "center",
              }}
            />
            <TouchableOpacity
              style={{
                marginVertical: appNumbers.number_5,
                borderWidth: 1,
                width: "80%",
                alignSelf: appAlignment.center,
                backgroundColor: appColors.primary,
                padding: appNumbers.number_10,
                borderRadius: appNumbers.number_10,
                alignItems: appAlignment.center,
              }}
              onPress={this.pickImage}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Vælg fra Galleri
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                marginVertical: appNumbers.number_5,
                borderWidth: 1,
                width: "80%",
                alignSelf: appAlignment.center,
                backgroundColor: appColors.primary,
                padding: appNumbers.number_10,
                borderRadius: appNumbers.number_10,
                alignItems: appAlignment.center,
              }}
              onPress={this.takePhoto}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Tag et Billed
              </Text>
            </TouchableOpacity>

            {!uploading ? (
              <TouchableOpacity
                style={{
                  marginVertical: appNumbers.number_5,
                  borderWidth: 1,
                  width: "80%",
                  alignSelf: appAlignment.center,
                  backgroundColor: appColors.primary,
                  padding: appNumbers.number_10,
                  borderRadius: appNumbers.number_10,
                  alignItems: appAlignment.center,
                }}
                onPress={this.uploadPhoto}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Upload Billed
                </Text>
              </TouchableOpacity>
            ) : (
              <ActivityIndicator
                size="large"
                color="#2E3D43"
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              />
            )}
          </View>
          <View style={{ flex: appNumbers.number_1 }}>
            <PhotoGrid source={images} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: appNumbers.number_1,
  },
});
