import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import SettingsStyles from './style/SettingsStyles';
import { faArrowLeft, faArrowRight, faCameraRetro, faCircleXmark, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { TGameCard } from '../../types/user';
import { getGameCard } from '../../services/backend';
import { useAuth } from '../../AuthContext';
import { formarGameCardNumber, formatNumber } from '../../utils/helpers';
import { useUser } from '@services/UserContext';

const SettingOpctionCard = ({ option, navigation }) => {
  return (
    <View style={SettingsStyles.containerSettingsOption}  >
      <TouchableOpacity
        onPress={() => {
          if (option.fn) {
            option.fn();
          }
          navigation.navigate(option.path);
        }}
      >
        <View style={SettingsStyles.containerSettingsOptionTexts} >
          <FontAwesomeIcon style={SettingsStyles.settingOptionsIcon} icon={option.icon} />
          <Text style={SettingsStyles.settingOptionsText} >{option.label}</Text>
          <FontAwesomeIcon style={SettingsStyles.settingOptionsBackIcon} icon={option.backIcon} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const Settings = ({ navigation }) => {
  const { uid, logout } = useAuth();
  const [orientation, setOrientation] = useState('portrait');
  const [gameCard, setGameCard] = useState<TGameCard>();

  const { profilePicture, setUpdateProfilePicture, userPoints, setUpdateUserPoints } = useUser();

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

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getGameCard(uid);
        setGameCard(response);
      } catch (error) {
        console.error('Error fetching game card:', error);
      }
    }

    fetchData();
  }, [uid]);

  useEffect(() => {
    function fetchData() {
      if (!profilePicture) {
        setUpdateProfilePicture(true);
      } else {
        setUpdateProfilePicture(false);
      }
    }

    fetchData();
  }, [profilePicture, setUpdateProfilePicture, uid]);

  useEffect(() => {
    if (!userPoints) {
      setUpdateUserPoints(true);
    } else {
      setUpdateUserPoints(false);
    }
  }, [setUpdateUserPoints, userPoints]);

  const settingOptionData = [
    {
      icon: faCameraRetro,
      label: 'Foto de perfil',
      backIcon: faArrowRight,
      path: 'ProfilePicture',
      fn: null,
    },
    {
      icon: faCircleXmark,
      label: 'Reportar un problema',
      backIcon: faArrowRight,
      path: 'ReportProblem',
      fn: null,
    },
    {
      icon: faXmark,
      label: 'Cerrar session',
      backIcon: faArrowRight,
      path: 'Login',
      fn: async () => {
        await logout();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      },
    },
  ];

  return (
    <ScrollView
      style={SettingsStyles.container}
      contentContainerStyle={orientation === 'portrait' ? SettingsStyles.container : SettingsStyles.containerMax}
    >
      <View style={SettingsStyles.containerSettings} >
        <TouchableOpacity style={SettingsStyles.containerGoBack} onPress={() => navigation.goBack()} >
          <FontAwesomeIcon icon={faArrowLeft} />
        </TouchableOpacity>
        <View style={SettingsStyles.containerProfileInformation} >
          <View style={SettingsStyles.containerProfilePicture} >
            <Image
              style={SettingsStyles.profilePicture}
              source={{ uri: profilePicture }}
              width={100}
              height={100}
            />
          </View>
          <View style={SettingsStyles.containerAccountInformation} >
            <View style={SettingsStyles.accountInformationLeft} >
              <Text style={SettingsStyles.accountCardText} >GAME-CARD</Text>
              <Text style={SettingsStyles.accountUsername} >{gameCard?.name}</Text>
              <Text style={SettingsStyles.accountUserNumber} >{formarGameCardNumber(gameCard?.card_number)}</Text>
            </View>
            <View style={SettingsStyles.accountInformationRigth} >
              <Image
                style={SettingsStyles.simiAccountImage}
                source={{ uri: profilePicture }}
              />
              <Text style={SettingsStyles.userPoints} >
                <Image source={require('../../../img/iconos/moneda.png')} /> {userPoints?.score_total ? formatNumber(userPoints.score_total) : 0}
              </Text>
            </View>
          </View>
          <View style={SettingsStyles.containerSettingsOption} >
            <TouchableOpacity style={SettingsStyles.containerAccountCenterButton} onPress={() => navigation.navigate('AccountCenter')} >
              <FontAwesomeIcon style={SettingsStyles.accountCenterButtonIcon} icon={faUser} />
              <View style={SettingsStyles.containerAccountCenterButtonText} >
                <Text style={SettingsStyles.accountCenterButtonTitle} >Centro de cuentas</Text>
                <Text style={SettingsStyles.accountCenterButtonSubtite} >Contraseña , datos personales, correo electrónico</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={SettingsStyles.line} />
        <View style={SettingsStyles.otherOptionsContainer} >
          {settingOptionData.map((option, index) => {
            return <SettingOpctionCard option={option} key={index} navigation={navigation} />;
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default Settings;
