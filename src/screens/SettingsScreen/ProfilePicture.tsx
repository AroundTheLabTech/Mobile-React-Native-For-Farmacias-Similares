import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ProfilePictureStyles from './style/ProfilePictureStyles';
import ImagePicker from '../../components/ImagePickerComponent/ImagePicker';
import { getUserPicture } from '../../services/backend';
import { useAuth } from '../../AuthContext';
import RNFS from 'react-native-fs';
import { saveProfileImage } from '../../services/funtions';

const ProfilePicture = ({ navigation }) => {

  const { uid } = useAuth();

  const [orientation, setOrientation] = useState('portrait');
  const [profileUrl, setProfileUrl] = useState('');

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

  async function handleUpdatePictureProfile() {
    try {
      const response = await getUserPicture(uid);
      if (response && response.url) {

        const path = saveProfileImage(response.url);

        setProfileUrl(profileUrl);

        if (path) {
          Alert.alert('Descarga completa', 'Imagen actualizada');
        } else {
          Alert.alert('Error', 'No se pudo aplicar la imagen');
        }
      } else {
        Alert.alert('Error', 'Ocurrió un error al enviar el reporte.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo enviar el reporte. Inténtalo más tarde.');
    }
  }

  useEffect(() => {
    async function fetchData() {
      setProfileUrl("tets")
    }

    fetchData();
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
            <Text>{profileUrl}</Text>

          </View>
        </View>
        <View style={ProfilePictureStyles.containerSave} >
          <TouchableOpacity style={ProfilePictureStyles.containerButtonSave} onPress={handleUpdatePictureProfile} >
            <Text style={ProfilePictureStyles.buttonSaveText} >Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
};

export default ProfilePicture;
