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
import { appStrings } from "../../../../utils/constants";
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
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
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
    const result = await ImagePicker.launchCameraAsync({
      allowEditing: false,
      exif: true,
      base64: true,
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }

    // CameraRoll.save(result.uri);
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
        <StatusBar hidden />
        <View style={{ backgroundColor: "#2E3D43" }}>
          <View style={{ flex: 1 }}>
            {Number(isFromTimeRec) === 1 ? (
              <TouchableOpacity>
                <Ionic
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
                  name="arrow-back"
                  onPress={() => navigation.navigate("Jobdetails")}
                />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: "#ffffff" }}>Upload billede</Text>
          </View>
          <View style={{ flex: 1 }} />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#243135",
            borderBottomWidth: 0.5,
            borderColor: "#ccc",
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

        <View padder>
          <View style={styles.mb}>
            <View>
              <View style={{ flex: 1, flexDirection: "column" }}>
                <Image
                  source={image !== null ? { uri: image } : notAvailable}
                  style={{
                    marginBottom: 15,
                    width: 200,
                    height: 200,
                    resizeMode: "cover",
                    alignSelf: "center",
                  }}
                />
                <TouchableOpacity
                  style={{ marginBottom: 15 }}
                  onPress={this.pickImage}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Vælg fra Galleri
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ marginBottom: 15 }}
                  onPress={this.takePhoto}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Tag et Billed
                  </Text>
                </TouchableOpacity>

                {!uploading ? (
                  <TouchableOpacity
                    style={{ marginBottom: 15 }}
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
            </View>
          </View>

          <PhotoGrid source={images} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
