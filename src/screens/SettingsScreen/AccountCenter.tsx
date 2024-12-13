import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, TextInput } from 'react-native';
import AccountCenterStyles from './style/AccountCenterStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { TUpdateUserInformation } from '../../types/user';
import { useAuth } from '../../AuthContext';
import { useUser } from '@services/UserContext';
import { putUserInformation } from '@services/backend';

type TUpdateInput = {
  key: string
  value: string
  visible: boolean
}

const AccountCenter = ({ navigation }) => {

  const { userInformation, setUpdateUserInformation } = useUser();
  const [orientation, setOrientation] = useState('portrait');

  const [name, setName] = useState<TUpdateInput>({
    key: 'name',
    value: userInformation?.name,
    visible: false,
  });
  const [location, setLocation] = useState<TUpdateInput>({
    key: 'location',
    value: userInformation?.state,
    visible: false,
  });
  const [age, setAge] = useState<TUpdateInput>({
    key: 'age',
    value: userInformation?.age.toString(),
    visible: false,
  });

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
    if (!userInformation) {
      setUpdateUserInformation(true);
    } else {
      setUpdateUserInformation(false);
    }
  }, [setUpdateUserInformation, uid, userInformation]);

  async function handleUpdate() {

    let avalibleToUpdate = true;

    if (!name.value || name.value.trim() === '') {
      avalibleToUpdate = false;
    }

    if (!location.value || location.value.trim() === '') {
      avalibleToUpdate = false;
    }

    if (!age.value || age.value.trim() === '') {
      avalibleToUpdate = false;
    }

    if (Number(age.value) <= 0) {
      avalibleToUpdate = false;
    }

    if (avalibleToUpdate) {
      let newInformation: TUpdateUserInformation = {
        name: name.value,
        ubication: location.value,
        age: Number(age.value),
      };

      const response = await putUserInformation(uid, newInformation);

      if (response?.message) {
        setUpdateUserInformation(true);
        navigation.goBack();
      } else {
        navigation.goBack();
      }
    }
  }

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
            {
              name?.visible ?
                <TextInput
                  placeholder={name?.value}
                  style={AccountCenterStyles.tableValue}
                  value={name?.value}
                  onChangeText={(value) => setName({ ...name, value: value })}
                /> :
                <Text onPress={() => setName({ ...name, key: 'name', value: userInformation?.name, visible: true })} style={AccountCenterStyles.tableValue} >{userInformation?.name}</Text>
            }
          </View>
          <View style={AccountCenterStyles.line} />
          <View style={AccountCenterStyles.containerRowTable} >
            <Text style={AccountCenterStyles.tableLabel} >Correo Electrónico:</Text>
            <Text style={AccountCenterStyles.tableValue} >{userInformation?.email}</Text>
          </View>
          <View style={AccountCenterStyles.line} />
          <View style={AccountCenterStyles.containerRowTable} >
            <Text style={AccountCenterStyles.tableLabel} >Estado:</Text>
            {
              location?.visible ?
                <TextInput
                  placeholder={location?.value}
                  style={AccountCenterStyles.tableValue}
                  value={location?.value}
                  onChangeText={(value) => setLocation({ ...location, value: value })}
                /> :
                <Text onPress={() => setLocation({ ...location, key: 'location', value: userInformation?.state, visible: true })} style={AccountCenterStyles.tableValue} >{userInformation?.state}</Text>
            }
          </View>
          <View style={AccountCenterStyles.line} />
          <View style={AccountCenterStyles.containerRowTable} >
            <Text style={AccountCenterStyles.tableLabel} >Edad:</Text>
            {
              age?.visible ?
                <TextInput
                  placeholder={age?.value}
                  style={AccountCenterStyles.tableValue}
                  value={age?.value}
                  onChangeText={(value) => setAge({ ...age, value: value })}
                /> :
                <Text onPress={() => setAge({ ...age, key: 'age', value: userInformation?.age.toString(), visible: true })} style={AccountCenterStyles.tableValue} >{userInformation?.age} {userInformation?.age > 1 ? 'Años' : 'Año'}</Text>
            }
          </View>
        </View>
        <View style={AccountCenterStyles.containerSave} >
          <TouchableOpacity style={AccountCenterStyles.containerButtonSave} onPress={() => handleUpdate()} >
            <Text style={AccountCenterStyles.buttonSaveText} >Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AccountCenter;
