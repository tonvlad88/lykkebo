import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  Image,
  Modal,
} from "react-native";
import {
  appAlignment,
  appColors,
  appDirection,
  appNumbers,
} from "../../../../utils/constants";
import ImageViewer from "react-native-image-zoom-viewer";
import { Ionicons } from "@expo/vector-icons";

const ProofPicturesSection = ({
  title = "Before Photos",
  pictures = [],
  navigation,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [flatPictures, setFlatPictures] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    function flatPicturesHandler() {
      let result = [];
      pictures.forEach((arrItem) => {
        const data = {
          url: arrItem.attachment,
        };
        result.push(data);
      });
      setFlatPictures(result);
    }

    flatPicturesHandler();
  }, [pictures]);

  const renderPictures = () => {
    return (
      <ScrollView
        horizontal
        contentContainerStyle={{ flexGrow: appNumbers.number_1 }}
      >
        {pictures.map((image, i) => (
          <TouchableHighlight
            key={i}
            onPress={() => {
              setIndex(i);
              setModalVisible(true);
            }}
          >
            <Image
              source={{
                uri: image.attachment,
              }}
              style={{
                margin: appNumbers.number_10,
                borderWidth: appNumbers.number_1,
                height: appNumbers.number_100,
                width: appNumbers.number_100,
              }}
              key={image.attachment}
            />
          </TouchableHighlight>
        ))}
      </ScrollView>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={{ padding: appNumbers.number_10 }}>
        <Text>Ingen billeder fundet...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.itemContainer, { backgroundColor: appColors.solidGrey }]}
      >
        <Text style={[styles.itemHeaderText, { flex: 1 }]}>{title}</Text>
      </View>
      <View style={styles.content}>
        {pictures.length > 0 ? renderPictures(pictures) : renderEmpty()}
      </View>

      <Modal visible={modalVisible} transparent>
        <ImageViewer
          renderHeader={() => (
            <View
              style={{
                width: "100%",
                alignItems: "flex-end",
                position: "absolute",
                zIndex: 1,
                top: 10,
                right: 10,
              }}
            >
              <Ionicons
                size={30}
                name="close-circle"
                style={{ color: "#2E3D43" }}
                onPress={() => setModalVisible(false)}
              />
            </View>
          )}
          onSwipeDown={() => setModalVisible(false)}
          enableSwipeDown
          index={index}
          imageUrls={flatPictures}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
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
  content: {
    flex: appNumbers.number_1,
    justifyContent: appAlignment.center,
    alignItems: appAlignment.center,
  },
});

export default ProofPicturesSection;
