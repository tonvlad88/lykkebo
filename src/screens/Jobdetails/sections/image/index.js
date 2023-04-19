// Main Components
import React, { Component } from "react";
import { Content, Button, Icon, ListItem, Thumbnail } from "native-base";
import {
  View,
  ScrollView,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Packages
import * as Localization from "expo-localization";
import ImageViewer from "react-native-image-zoom-viewer";

// Actions

// Localization
import i18n from "i18n-js";
import { da, en } from "../../../../services/translations";
i18n.fallbacks = true;
i18n.translations = { da, en };
i18n.locale = Localization.locale;

// Global imports

// Local imports
import styles from "../../styles";
import { appColors, appNumbers, appStrings } from "../../../../utils/constants";
import { Image } from "react-native";

// Local constants

class ImageSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      modalVisible: false,
    };
  }

  renderAllImagesHandler = () => {
    const { info, isAttachment } = this.props;

    if (!Array.isArray(info) || !info.length) {
      return (
        <View style={[styles.noMarginLeft, { padding: appNumbers.number_10 }]}>
          <Text style={{ paddingLeft: 18 }} note>
            Ingen billeder fundet
          </Text>
        </View>
      );
    } else {
      return (
        <ScrollView horizontal>
          <View style={{ flex: 1, flexDirection: "row" }}>
            {info.map((image, i) => (
              <TouchableHighlight
                key={i}
                onPress={() => {
                  this.setState({
                    index: i,
                    modalVisible: true,
                  });
                }}
              >
                <Image
                  source={{
                    uri: isAttachment ? image.attachment : image.image,
                  }}
                  style={{
                    margin: appNumbers.number_10,
                    borderWidth: appNumbers.number_1,
                    height: appNumbers.number_100,
                    width: appNumbers.number_100,
                  }}
                  key={isAttachment ? image.attachment : image.image}
                />
              </TouchableHighlight>
            ))}
          </View>
        </ScrollView>
      );
    }
  };

  render() {
    const { navigation, info, title, isAttachment, showCameraIcon } =
      this.props;
    const { modalVisible, index } = this.state;

    const images = [];

    if (isAttachment) {
      info.forEach((image) => {
        const data = {
          url: image.attachment,
        };
        images.push(data);
      });
    } else {
      info.forEach((image) => {
        const data = {
          url: image.image,
        };
        images.push(data);
      });
    }

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.itemContainer,
            { backgroundColor: appColors.solidGrey },
          ]}
        >
          <Text style={[styles.itemHeaderText, { flex: 1 }]}>{title}</Text>
          {showCameraIcon ? (
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={() => {
                navigation.navigate(appStrings.mainStack.uploadImageScreen);
              }}
            >
              <Ionicons
                name="camera"
                size={appNumbers.number_24}
                style={{ color: "#2E3D43" }}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {this.renderAllImagesHandler()}

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
                  onPress={() => this.setState({ modalVisible: false })}
                />
              </View>
            )}
            onSwipeDown={() => {
              this.setState({ modalVisible: false });
            }}
            enableSwipeDown
            index={index}
            imageUrls={images}
          />
        </Modal>
      </View>
    );
  }
}

export default ImageSection;
