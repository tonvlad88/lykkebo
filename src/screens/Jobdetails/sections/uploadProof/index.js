// Main Components
import React, { Component } from 'react';
import {
  AsyncStorage,
  ActivityIndicator,
  Text,
  Image,
} from 'react-native';
import {
  Container,
  Content,
  Body,
  Card,
  CardItem,
  Button,
} from 'native-base';

// Packages
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as Localization from 'expo-localization';

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
const notAvailable = require('../../../../../assets/images/na.gif');


class UploadProofScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasAccessGalery: false,
      hasAccessCamera: false,
      image: null,
      uploading: false,
      isFromTimeRec: 0,
      images: [],
      theJobId: '',
      theCustomerName: '',
      uploadMessage: '',
      hasHerror: false,
    };
  }

  // async componentDidMount() {
  //   const { statusGallery } = await Permissions.askAsync(Permissions.CAMERA);
  //   const { statusCamera} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  //   AsyncStorage.getItem('isFromTimeRec').then((isFromTimeRec) => {
  //     this.setState({
  //       hasAccessGalery: statusGallery === 'granted',
  //       hasAccessCamera: statusCamera === 'granted',
  //       isFromTimeRec,
  //     });
  //   });
  // }

  // pickImage = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     allowsEditing: false,
  //     // aspect: [4, 3],
  //   });

  //   if (!result.cancelled) {
  //     this.setState({ image: result.uri });
  //   }
  // };

  pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
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


  takePhoto = async () => {
  
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return
    }

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
    const { imageType } = this.props;

    if (image === null) {
      return;
    }

    this.setState({uploading: true});

    AsyncStorage.getItem('user_id').then((userId) => {
      AsyncStorage.getItem('token').then((token) => {
        AsyncStorage.getItem('baseUrl').then((baseUrl) => {
          AsyncStorage.getItem('selectedJobId').then((jobId) => {
            const formData = new FormData();
            // Add your input data
            formData.append('user_id', userId);
            formData.append('job_id', jobId);
            formData.append('image_type', imageType);

            // Add your photo
            // this, retrive the file extension of your photo
            const uriPart = image.split('.');
            const fileExtension = uriPart[uriPart.length - 1];

            formData.append('photo', {
              uri: image,
              name: `photo.${fileExtension}`,
              type: `image/${fileExtension}`,
              user_id: `${userId}`,
              job_id: jobId,
            });

            // axios.post('http://lykkeboadm.typo3cms.dk/wp-json/lykkebo/v1/jobdetails/uploadImage', postData, axiosConfig)
            // fetch('http://192.168.254.111/lykkebo/upload.php', {
            fetch(`${baseUrl}/lykkebo/v1/jobdetails/uploadImage`, {
              method: 'POST',
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              body: formData,
            })
              .then((res) => {
                console.log('res', res.data)
                fetch(`${baseUrl}/lykkebo/v1/jobdetails/overview?user_id=${userId}&job_id=${jobId}`, {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  params: {
                    user_id: `${userId}`,
                    job_id: `${jobId}`,
                  },
                })
                  .then(response => response.json())
                  .then((responseJson) => {
                    const temp = [];
                    responseJson.booking.booking_info.images.forEach((item) => {
                      temp.push(item.image);
                    });
                    this.setState({
                      images: temp,
                      uploading: false,
                      uploadMessage: i18n.t('uploadedSuccessfully'),
                      hasHerror: false,
                    });
                    this.props.getJobDetails();
                    this.props.goToPage(1);
                  })
                  .catch((error) => {
                    this.setState({
                      uploading: false,
                      hasHerror: true,
                      uploadMessage: error.message,
                    });
                  });
              })
              .catch((error) => {
                this.setState({
                  uploading: false,
                  hasHerror: true,
                  uploadMessage: error.message,
                });
              });

            // // API that use fetch to input data to database via backend php script
            // // fetch('http://192.168.254.101/lykkebo/upload.php', {
            // fetch('lykkeboadm.typo3cms.dk/wp-json/lykkebo/v1/jobdetails/uploadImage', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'multipart/form-data',
            //   },
            //   body: formData,
            // })
            //   .then(response => response)
            //   .then(() => {
            //     this.setState({uploading: false});
            //     Toast.show({
            //       text: 'Uploadet succesfuldt',
            //       position: 'bottom',
            //       duration: 3000,
            //       buttonText: 'Okay',
            //       type: 'success',
            //     });
            //   })
            //   .catch((error) => {
            //     console.error(error);
            //   });
          });
        });
      });
    });
  };

  openBooking = () => {
    const { theJobId } = this.state;
    const { navigation } = this.props;
    AsyncStorage.setItem('selectedJobId', theJobId).then(() => {
      navigation.navigate('Jobdetails');
    });
  }

  render() {
    const { navigation } = this.props;
    const {
      image, uploading, isFromTimeRec, images, theJobId, theCustomerName, uploadMessage, hasHerror,
    } = this.state;

    return (
      <Container style={styles.container}>
        <Content padder>
          <Card style={styles.mb}>
            <CardItem>
              <Body style={{flex: 1, flexDirection: 'column'}}>
                <Image
                  source={image !== null ? {uri: image} : notAvailable}
                  style={{
                    marginBottom: 15, width: 200, height: 200, resizeMode: 'cover', alignSelf: 'center',
                  }} />
                <Button full info style={{marginBottom: 15}} onPress={this.pickImage}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>Vælg fra Galleri</Text>
                </Button>

                <Button full info style={{marginBottom: 15}} onPress={this.takePhoto}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>Tag et Billed</Text>
                </Button>

                {!uploading
                  ? (
                    <Button full info style={{marginBottom: 15}} onPress={this.uploadPhoto}>
                      <Text style={{color: 'white', fontWeight: 'bold'}}>Upload Billed</Text>
                    </Button>
                  ) : (
                    <Button full info style={{marginBottom: 15}} onPress={this.uploadPhoto}>
                      <ActivityIndicator
                        size="small"
                        color="#FFF"
                        style={{
                          flex: 1, flexDirection: 'column', justifyContent: 'center', alignSelf: 'center',
                        }} />
                    </Button>
                  )
                }

                {uploadMessage !== '' ? (
                  <Text style={hasHerror ? {width: '100%', color: 'red', textAlign: 'center'} : {width: '100%', color: 'green', textAlign: 'center'}}>{uploadMessage}</Text>
                ) : null}
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
    // }
  }
}

export default UploadProofScreen;
