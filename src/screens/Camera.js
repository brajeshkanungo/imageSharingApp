import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { Button, Icon } from 'native-base';
import { RNCamera } from 'react-native-camera';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useNavigation } from 'react-navigation-hooks';
import * as Actions from '../actions';
import Analytics from '../services/analytics';

const CameraScreen = ({ addImage }) => {

  const { navigate } = useNavigation();

  const takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync({metadata: options});
      console.log(data.uri);
      await addImage(data);

      Analytics.logEvent("add_image", {
        "take_picture": true,
        "camera_roll": false
      });

      navigate('ImagesList');
    }
  }

  return (
    <View style={styles.container}>
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onGoogleVisionBarcodesDetected={({ barcodes }) => {
          console.log(barcodes);
        }}
      />
      <View style={{ flex: 0, flexDirection: 'column', justifyContent: 'center' }}>
        <Button onPress={takePicture} style={{flex: 0, alignSelf: 'center'}} transparent>
          <Icon name='camera' style={{fontSize: 70, color: 'black'}}/>
        </Button>
      </View>
      <Button onPress={() => navigate('ImagesList')} style={{position: 'absolute', top:20}} transparent>
        <Icon ios='ios-arrow-dropleft' android='md-arrow-dropleft' style={{fontSize: 30, color: 'white'}}/>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});

function mapStateToProps(state) { return {} }
function mapStateActionsToProps(dispatch) { return bindActionCreators(Actions, dispatch) }

export default connect(mapStateToProps, mapStateActionsToProps)(CameraScreen);

