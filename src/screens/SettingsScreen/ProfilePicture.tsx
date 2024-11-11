import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ProfilePictureStyles from './style/ProfilePictureStyles';
import ImagePicker from '../../components/ImagePickerComponent/ImagePicker';

const ProfilePicture = ({ navigation }) => {

  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    const subscription = Dimensions.addEventListener('change', updateOrientation);

    updateOrientation();

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <ScrollView
      style={ProfilePictureStyles.container}
      contentContainerStyle={orientation === 'portrait' ? ProfilePictureStyles.container : ProfilePictureStyles.containerMax}
    >
      <View style={ProfilePictureStyles.containerSettings} >
        <TouchableOpacity style={ProfilePictureStyles.containerGoBack} onPress={() => navigation.goBack()} >
          <FontAwesomeIcon icon={faArrowLeft} />
        </TouchableOpacity>
        <Text style={ProfilePictureStyles.profilePictureTite} >Foto de perfil</Text>
        <View style={ProfilePictureStyles.containerPictures}>
          <View style={ProfilePictureStyles.containerMainPicture} >
            <ImagePicker customStyles={ProfilePictureStyles.mainPicture} imagePickerStyle={ProfilePictureStyles.mainPicture} />
          </View>
          <View style={ProfilePictureStyles.line} />
          <View style={ProfilePictureStyles.containerLastPictures} >
            <Image
              style={ProfilePictureStyles.profilePicture}
              source={require('../../../img/profile/victorGonzales.png')}
            />
            <Image
              style={ProfilePictureStyles.profilePicture}
              source={require('../../../img/profile/victorGonzales.png')}
            />
            <Image
              style={ProfilePictureStyles.profilePicture}
              source={require('../../../img/profile/victorGonzales.png')}
            />
            <Image
              style={ProfilePictureStyles.profilePicture}
              source={require('../../../img/profile/victorGonzales.png')}
            />
            <Image
              style={ProfilePictureStyles.profilePicture}
              source={require('../../../img/profile/victorGonzales.png')}
            />
            <Image
              style={ProfilePictureStyles.profilePicture}
              source={require('../../../img/profile/victorGonzales.png')}
            />
          </View>
        </View>
        <View style={ProfilePictureStyles.containerSave} >
          <TouchableOpacity style={ProfilePictureStyles.containerButtonSave} onPress={() => navigation.goBack()} >
            <Text style={ProfilePictureStyles.buttonSaveText} >Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
};

export default ProfilePicture;
