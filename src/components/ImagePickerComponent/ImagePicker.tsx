import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const ImagePicker = ({ customStyles, imagePickerStyle }) => {
  console.log(customStyles)
  const [imageUri, setImageUri] = useState(null);

  const openImagePicker = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error:', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const { uri } = response.assets[0];
          setImageUri(uri);
        }
      }
    );
  };

  return (
    <View style={customStyles ? customStyles : styles.container}>
      <TouchableOpacity style={styles.button} onPress={openImagePicker} >
        {imageUri && <Image source={{ uri: imageUri }} style={imagePickerStyle ? imagePickerStyle : styles.image} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

export default ImagePicker;
