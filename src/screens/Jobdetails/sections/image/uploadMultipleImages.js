import React, { useState } from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import {
  appAlignment,
  appColors,
  appDirection,
  appNumbers,
  appStrings,
} from "../../../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { showMessage } from "react-native-flash-message";

const UploadMultipleImages = ({ navigation }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedCounter, setUploadedCounter] = useState(0);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      console.log("result", result.assets);
      setSelectedImages(result.assets);
    }
  };

  const takePhoto = async () => {
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
      setSelectedImages(result.assets);
    }
  };

  uploadImages = async () => {
    if (selectedImages.length < 1) {
      return;
    }

    setUploading(true);

    AsyncStorage.getItem("user_id").then((userId) => {
      AsyncStorage.getItem("token").then((token) => {
        AsyncStorage.getItem("baseUrl").then((baseUrl) => {
          AsyncStorage.getItem("selectedJobId").then((jobId) => {
            selectedImages.forEach((image, index) => {
              //  formData.append(`image${index}`, {
              //    uri: image,
              //    name: `image${index}.jpg`,
              //    type: "image/jpg",
              //  });
              const formData = new FormData();
              // Add your input data
              formData.append("user_id", userId);
              formData.append("job_id", jobId);

              // Add your photo
              // this, retrive the file extension of your photo
              const uriPart = image.uri.split(".");
              const fileExtension = uriPart[uriPart.length - 1];

              formData.append("photo", {
                uri: image.uri,
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
                      setUploadedCounter(uploadedCounter + 1);
                      if (selectedImages.length - 1 === index) {
                        setUploading(false);
                        showMessage({
                          message: "Opdateret succesfuldt",
                          type: appStrings.common.success,
                        });
                        setTimeout(() => {
                          navigation.navigate(
                            appStrings.mainStack.jobDetailsScreen
                          );
                        }, 1000);
                      }
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
    });
  };

  // const uploadImages = async () => {
  //   try {
  //     const formData = new FormData();
  //     selectedImages.forEach((image, index) => {
  //       formData.append(`image${index}`, {
  //         uri: image,
  //         name: `image${index}.jpg`,
  //         type: "image/jpg",
  //       });
  //     });

  //     const response = await axios.post("YOUR_UPLOAD_ENDPOINT", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     console.log("Upload response:", response.data);
  //     // Handle the response from the server if needed.
  //   } catch (error) {
  //     console.error("Error uploading images:", error);
  //   }
  // };

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
        <Pressable>
          <Ionicons
            style={{ color: "#ffffff" }}
            size={40}
            name={appStrings.icon.chevronBack}
            onPress={() =>
              navigation.navigate(appStrings.mainStack.jobDetailsScreen)
            }
          />
        </Pressable>

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

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        {selectedImages.length > 0 ? (
          selectedImages.map(({ uri }, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={{ width: 200, height: 200, margin: 5 }}
            />
          ))
        ) : (
          <FontAwesome
            name="photo"
            size={appNumbers.number_100}
            color={appColors.primary}
          />
        )}
      </ScrollView>

      <TouchableOpacity onPress={pickImage} style={styles.uploadButtons}>
        <Text style={{ color: appColors.solidWhite, fontSize: 20 }}>
          Vælg fra Galleri
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={takePhoto} style={styles.uploadButtons}>
        <Text style={{ color: appColors.solidWhite, fontSize: 20 }}>
          Tag et Billed
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={uploadImages}
        style={[styles.uploadButtons, { marginBottom: appNumbers.number_10 }]}
      >
        {uploading ? (
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
        ) : (
          <Text style={{ color: appColors.solidWhite, fontSize: 20 }}>
            Upload Billed
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: appNumbers.number_1,
  },
  uploadButtons: {
    marginHorizontal: appNumbers.number_10,
    marginTop: appNumbers.number_5,
    padding: appNumbers.number_5,
    borderRadius: appNumbers.number_10,
    backgroundColor: appColors.primary,
    justifyContent: appAlignment.center,
    alignItems: appAlignment.center,
    minHeight: appNumbers.number_50,
  },
});

export default UploadMultipleImages;
