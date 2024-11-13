import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import AccountCenterStyles from './style/AccountCenterStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { TUserInformation } from '../../types/user';
import { getUserInformation } from '../../services/backend';
import { useAuth } from '../../AuthContext';

const AccountCenter = ({ navigation }) => {

  const [orientation, setOrientation] = useState('portrait');
  const [userInformation, setUserInformation] = useState<TUserInformation>();

  const { uid } = useAuth();

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
      const response = await getUserInformation(uid);
      setUserInformation(response);
    }

    fetchData();
  }, [uid]);

  return (
    <ScrollView
      style={AccountCenterStyles.container}
      contentContainerStyle={orientation === 'portrait' ? AccountCenterStyles.container : AccountCenterStyles.containerMax}
    >
      <View style={AccountCenterStyles.containerSettings} >
        <TouchableOpacity style={AccountCenterStyles.containerGoBack} onPress={() => navigation.goBack()} >
          <FontAwesomeIcon icon={faArrowLeft} />
        </TouchableOpacity>
        <Text style={AccountCenterStyles.accountCenterTitle} >Centro de cuentas</Text>
        <View style={AccountCenterStyles.containerTableInformation} >
          <View style={AccountCenterStyles.containerRowTable} >
            <Text style={AccountCenterStyles.tableLabel} >Nombre:</Text>
            <Text style={AccountCenterStyles.tableValue} >{userInformation?.name}</Text>
          </View>
          <View style={AccountCenterStyles.line} />
          <View style={AccountCenterStyles.containerRowTable} >
            <Text style={AccountCenterStyles.tableLabel} >Correo Electrónico:</Text>
            <Text style={AccountCenterStyles.tableValue} >{userInformation?.email}</Text>
          </View>
          <View style={AccountCenterStyles.line} />
          <View style={AccountCenterStyles.containerRowTable} >
            <Text style={AccountCenterStyles.tableLabel} >Estado:</Text>
            <Text style={AccountCenterStyles.tableValue} >{userInformation?.state}</Text>
          </View>
          <View style={AccountCenterStyles.line} />
          <View style={AccountCenterStyles.containerRowTable} >
            <Text style={AccountCenterStyles.tableLabel} >Edad:</Text>
            <Text style={AccountCenterStyles.tableValue} >{userInformation?.age} {userInformation?.age > 1 ? 'Años' : 'Año'}</Text>
          </View>
        </View>
        <View style={AccountCenterStyles.containerSave} >
          <TouchableOpacity style={AccountCenterStyles.containerButtonSave} onPress={() => navigation.goBack()} >
            <Text style={AccountCenterStyles.buttonSaveText} >Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
};

export default AccountCenter;
