import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import SettingsStyles from './style/SettingsStyles';
import { faArrowLeft, faArrowRight, faCameraRetro, faCircleXmark, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';


const SettingOpctionCard = ({ option, navigation }) => {
  return (
    <View style={SettingsStyles.containerSettingsOption}  >
      <TouchableOpacity onPress={() => navigation.navigate(option.path)}>
        <View style={SettingsStyles.containerSettingsOptionTexts} >
          <FontAwesomeIcon style={SettingsStyles.settingOptionsIcon} icon={option.icon} />
          <Text style={SettingsStyles.settingOptionsText} >{option.label}</Text>
          <FontAwesomeIcon style={SettingsStyles.settingOptionsBackIcon} icon={option.backIcon} />
        </View>
      </TouchableOpacity>
    </View>
  )
};

const settingOptionData = [
  {
    icon: faCameraRetro,
    label: 'Foto de perfil',
    backIcon: faArrowRight,
    path: 'ProfilePicture',
  },
  {
    icon: faCircleXmark,
    label: 'Reportar un problema',
    backIcon: faArrowRight,
    path: 'ReportProblem',
  },
  {
    icon: faXmark,
    label: 'Cerrar session',
    backIcon: faArrowRight,
    path: 'Login',
  },
];

const Settings = ({ navigation }) => {


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
              source={require('../../../img/profile/victorGonzales.png')}
            />
          </View>
          <View style={SettingsStyles.containerAccountInformation} >
            <View style={SettingsStyles.accountInformationLeft} >
              <Text style={SettingsStyles.accountCardText} >GAME-CARD</Text>
              <Text style={SettingsStyles.accountUsername} >Iván Martínez</Text>
              <Text style={SettingsStyles.accountUserNumber} >1020-2012-2333-2211</Text>
            </View>
            <View style={SettingsStyles.accountInformationRigth} >
              <Image
                style={SettingsStyles.simiAccountImage}
                source={require('../../../img/profile/victorGonzales.png')}
              />
              <Text style={SettingsStyles.userPoints} >
                <Image source={require('../../../img/iconos/moneda.png')} /> 1,000
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
