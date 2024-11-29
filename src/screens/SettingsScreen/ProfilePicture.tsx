import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ProfilePictureStyles from './style/ProfilePictureStyles';
import { getUserPicture, getUserProfilePictures, updateUserProfilePicture } from '../../services/backend';
import { useAuth } from '../../AuthContext';
import { SvgUri } from 'react-native-svg';
import { TUserProfilePictures } from 'src/types/user';
import Loader from '@components/LoaderComponent/Loader';
import { useUser } from '@services/UserContext';

const ProfilePicture = ({ navigation }) => {

  const { uid } = useAuth();
  const [profileUrl, setProfileUrl] = useState('');
  const [profilePicturesUrls, setProfilePicturesUrls] = useState<TUserProfilePictures>();

  const { setUpdateProfilePicture } = useUser();

  async function handleUpdatePictureProfile() {
    try {
      const response = await updateUserProfilePicture(uid, profileUrl);

      setUpdateProfilePicture(true);

      if (response && response.message) {
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      const response = await getUserProfilePictures(uid);
      if (response && response.current_profile_picture_url && response.list_profile_pictures_avalible) {

        if (!response.current_profile_picture_url) {
          const responsePicture = await getUserPicture(uid);
          if (responsePicture && responsePicture.url) {
            setProfileUrl(profileUrl);
          }
        } else {
          setProfileUrl(response.current_profile_picture_url);
        }
        setProfilePicturesUrls(response);
      }
    }

    if (!profileUrl || !profilePicturesUrls) {
      fetchData();
    }
  }, [profilePicturesUrls, profileUrl, uid]);

  return (
    <View style={ProfilePictureStyles.profileMainContainer} >
      <ScrollView
        style={ProfilePictureStyles.container}
        contentContainerStyle={ProfilePictureStyles.containerMax}
        showsVerticalScrollIndicator={false}
      >
        <View style={ProfilePictureStyles.containerSettings} >
          <TouchableOpacity style={ProfilePictureStyles.containerGoBack} onPress={() => navigation.goBack()} >
            <FontAwesomeIcon icon={faArrowLeft} />
          </TouchableOpacity>
          <Text style={ProfilePictureStyles.profilePictureTite} >Foto de perfil</Text>
          <View style={ProfilePictureStyles.containerPictures}>
            <View style={ProfilePictureStyles.containerMainPicture} >
              <View style={ProfilePictureStyles.subContainerMainPicture} >
                {
                  profileUrl &&
                  (
                    profileUrl.includes('png') ?
                      <Image source={{ uri: profileUrl }} width={150} height={150} />
                      :
                      <SvgUri uri={profileUrl} width={150} height={150} />
                  )
                }
              </View>
            </View>
            <View style={ProfilePictureStyles.line} />
            <View style={ProfilePictureStyles.containerLastPictures} >
              {
                profilePicturesUrls ?
                  profilePicturesUrls.list_profile_pictures_avalible.map(
                    (profilePicture, index) => {
                      return (
                        <View key={index} style={ProfilePictureStyles.profilePicturesAvalibleContainer} >
                          <TouchableOpacity onPress={() => setProfileUrl(profilePicture.image_url)} >
                            <Image source={{ uri: profilePicture.image_url }} width={150} height={150} />
                          </TouchableOpacity>
                        </View>
                      );
                    }) :
                  <Loader visible={profilePicturesUrls ? false : true} />
              }
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={ProfilePictureStyles.containerSave} >
        <TouchableOpacity style={ProfilePictureStyles.containerButtonSave} onPress={handleUpdatePictureProfile} >
          <Text style={ProfilePictureStyles.buttonSaveText} >Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
};

export default ProfilePicture;
