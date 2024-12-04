import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../NavigationTypes';


//Styles

import loginStyles from './style/loginStyles';

//Services

// import { checkLoginStatus, getCurrentUser, getUserInformation, refreshAccessToken } from '../../services/authService';
import { getUserInformation, loginUserByEmailAndPassword, validateToken } from '../../services/backend';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../AuthContext';
import { TUserLogin } from 'src/types/user';
// import { checkLoginStatus, getUserInformation } from '@services/authService';


type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type LoginScreenProps = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { updateUserInformation } = useAuth();


  const handleLogin = async () => {
    if (!email || !password) {
      console.error('Por favor, completa todos los campos.');
      return;
    }

    try {
      const user = await loginUserByEmailAndPassword(email, password); // TUserLogin
      await AsyncStorage.setItem('userAccessToken', user.id_token);
      await AsyncStorage.setItem('tokenExpirationTime', user.expires_in.toString());

      await AsyncStorage.setItem('updateScore', 'false');
      await AsyncStorage.setItem('updateProfilePicture', 'false');
      await AsyncStorage.setItem('updateProfileInformation', 'false');

      updateUserInformation(user);

      if (user.id_token) {
        navigation.navigate('MainTab', { screen: 'Home' });
      }
    } catch (error) {
      console.error('Error de login:', error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedAccessToken = await AsyncStorage.getItem('userAccessToken');
        const storedExpirationTime = await AsyncStorage.getItem('tokenExpirationTime');

        if (!storedAccessToken || !storedExpirationTime) {
          navigation.navigate('Login');
          return;
        }

        const validateAccessToken = await validateToken(storedAccessToken);
        const response = await getUserInformation(validateAccessToken.uid);

        const user: TUserLogin = {
          uid: validateAccessToken.uid,
          email: response.email,
          gender: response.gender,
          age: response.age,
          last_session: response.last_session,
          ubication: response.state,
          display_name: response.name,
          id_token: storedAccessToken,
          registered: 'true',
          refresh_token: null,
          expires_in: Number(storedExpirationTime),
        };

        updateUserInformation(user);
        navigation.navigate('MainTab', { screen: 'Home' });
      } catch (error) {
        console.error('Error al validar la sesión:', error);
        navigation.navigate('Login');
      }
    };

    fetchData();
  }, [navigation, updateUserInformation]);


  /*
  useEffect(() => {
    async function sessionStatus() {
      const storedAccessToken = await AsyncStorage.getItem('userAccessToken');
      const storedExpirationTime = await AsyncStorage.getItem('tokenExpirationTime');

      const isValid = await checkLoginStatus(storedAccessToken, storedExpirationTime);
      if (!isValid) {
        const user = getCurrentUser(); // Obtén el usuario actual
        const tokens = await refreshAccessToken(user);
        if (tokens) {
          await AsyncStorage.setItem('userAccessToken', tokens.userAccessToken);
          await AsyncStorage.setItem('tokenExpirationTime', tokens.tokenExpirationTime);
        } else {
          navigation.navigate('Login');
        }
      } else {
        const response = await getUserInformation();
        if (response) {
          navigation.navigate('MainTab', { screen: 'Home' });
        } else {
          navigation.navigate('Login');
        }
      }
    }

    sessionStatus();
  }, [navigation]);
  */

  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setOrientation(width > height ? 'c' : 'portrait');
    };

    const subscription = Dimensions.addEventListener('change', updateOrientation);

    updateOrientation();

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <ScrollView
      key={orientation}
      style={loginStyles.container}
      contentContainerStyle={orientation === 'portrait' ? loginStyles.container : loginStyles.containerMax}
    >
      <View style={loginStyles.containerLogin}>


        <View style={loginStyles.headerContainer}>
          <Image
            source={require('../../../img/medallas/medal1.png')}
            style={loginStyles.headerMedal}
          />

          <Image
            source={require('../../../img/medallas/medal1.png')}
            style={loginStyles.headerMedal}
          />


        </View>

        <View style={loginStyles.containerTitle}>
          {/* Title */}
          <Text style={loginStyles.titleLogin}>
            ¡GANAR NUNCA FUE MÁS DIVERTIDO!
          </Text>
          {/* Container Forms */}
          <View
            style={loginStyles.containerForms}>
            {/* Correo Electrónico */}
            <View
              style={loginStyles.containerPlaceHolder}
            >
              <Text
                style={loginStyles.placeHolder}
              >
                Correo Electrónico</Text>
            </View>

            <TextInput
              style={loginStyles.input}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            {/* Contraseña */}
            <View
              style={loginStyles.containerPlaceHolder}
            >
              <Text
                style={loginStyles.placeHolder}
              >
                Contraseña</Text>
            </View>

            <TextInput
              style={loginStyles.input}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"

              onChangeText={setPassword}
            />
          </View>
          {/* Container Button */}
          <View style={loginStyles.containerButtons}>

            {/* Boton Login */}
            <TouchableOpacity
              style={loginStyles.botonLogin}
              onPress={handleLogin}
            >
              <Text style={loginStyles.textoButtons}>

                Login
              </Text>
            </TouchableOpacity>

            {/* Boton Register */}
            <TouchableOpacity
              style={loginStyles.botonLogin}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={loginStyles.textoButtons}>
                Register
              </Text>
            </TouchableOpacity>



          </View>

        </View>

        <View style={loginStyles.headerContainer}>
          <Image
            source={require('../../../img/medallas/medal1.png')}
            style={loginStyles.headerMedal}
          />

          <Image
            source={require('../../../img/medallas/medal1.png')}
            style={loginStyles.headerMedal}
          />
        </View>

      </View>
    </ScrollView>
  );
};


export default LoginScreen;
