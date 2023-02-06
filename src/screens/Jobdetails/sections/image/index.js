// Main Components
import React, { Component } from 'react';
import {
  Content, Button, Icon, ListItem, Text, Thumbnail,
} from 'native-base';
import {
  View, ScrollView, Modal, TouchableHighlight, TouchableOpacity,
} from 'react-native';

// Packages
import * as Localization from 'expo-localization';
import ImageViewer from 'react-native-image-zoom-viewer';

// Actions

// Localization
import i18n from 'i18n-js';
import { da, en } from '../../../../services/translations';
i18n.fallbacks = true;
i18n.translations = { da, en };
i18n.locale = Localization.locale;

// Global imports

// Local imports
import styles from '../../styles';

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
        <ListItem style={styles.noMarginLeft}>
          <Text style={{paddingLeft: 18}} note>Ingen billeder fundet</Text>
        </ListItem>
      );
    } else {
      return (
        <ScrollView horizontal>
          <View style={{flex: 1, flexDirection: 'row'}}>
            {info.map((image, i) => (
              <TouchableHighlight
                key={i}
                onPress={() => {
                  this.setState({
                    index: i,
                    modalVisible: true,
                  });
                }}>
                <Thumbnail
                  square
                  large
                  source={{ uri: isAttachment ? image.attachment : image.image }}
                  style={{margin: 10}}
                  key={isAttachment ? image.attachment : image.image} />
              </TouchableHighlight>

            ))}
          </View>
        </ScrollView>
      );
    }
  }

  render() {
    const {
      navigation, info, title, isAttachment, showCameraIcon,
    } = this.props;
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
      <Content>
        <ListItem itemDivider style={{paddingTop: 0, paddingBottom: 0}}>
          <Text style={{flex: 1, color: '#787878', fontWeight: 'bold'}}>{title}</Text>
          {showCameraIcon ? (
            <Button style={{alignSelf: 'flex-end'}} transparent>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('UploadImage');
                }}>
                <Icon name="camera" style={{color: '#2E3D43'}} />
              </TouchableOpacity>
            </Button>
          ) : null}
        </ListItem>

        <ListItem
          style={{
            height: 0, marginLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0,
          }} />

        <Modal
          visible={modalVisible}
          transparent>
          <ImageViewer
            renderHeader={() => (
              <View style={{
                width: '100%', alignItems: 'flex-end', position: 'absolute', zIndex: 1, top: 10, right: 10,
              }}>
                <Icon size={30} name="close-circle" style={{color: '#2E3D43'}} onPress={() => this.setState({modalVisible: false})} />
              </View>
            )}
            onSwipeDown={() => {
              this.setState({modalVisible: false});
            }}
            enableSwipeDown
            index={index}
            imageUrls={images} />
        </Modal>
        {this.renderAllImagesHandler()}
      </Content>
    );
  }
}

export default ImageSection;
