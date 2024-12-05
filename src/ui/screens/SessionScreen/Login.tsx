import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@shared/types/NavigationTypes';

//Styles

import loginStyles from './style/loginStyles';

//Services
import { useAuth } from '@domain/context/AuthContext';
import { useUser } from '@domain/context/UserContext';


import { PostAuthUseCase } from '@application/useCases/PostAuthUseCase';
import { AuthApi } from '@infrastructure/api/AuthApi';
import { ApiResponse } from '@domain/models/ApiResponse';
import { UserAuth } from '@domain/models/User';
import Loader from '@ui/components/LoaderComponent/Loader';
import { reforrmatEmail } from '@shared/utils/helpers';


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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { isAuthenticated, updateUser } = useUser();
  const { login } = useAuth();

  const authApi = new AuthApi();
  const postAuthUseCase = new PostAuthUseCase(authApi);

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    if (!email || !password) {
      console.error('Por favor, completa todos los campos.');
      return;
    }

    const newEmail = reforrmatEmail(email);

    try {
      const response: ApiResponse<UserAuth> = await postAuthUseCase.execute(newEmail, password);
      const { data } = response;
      const { user } = data;

      if (response.success) {
        login();
        updateUser(user);
        navigation.navigate('MainTab', { screen: 'Home' });
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error('Error de login:', err);
      setError(err.message);
    }
  };

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
            source={require('@img/medallas/medal1.png')}
            style={loginStyles.headerMedal}
          />

          <Image
            source={require('@img/medallas/medal1.png')}
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
            source={require('@img/medallas/medal1.png')}
            style={loginStyles.headerMedal}
          />

          <Image
            source={require('@img/medallas/medal1.png')}
            style={loginStyles.headerMedal}
          />
        </View>

      </View>
    </ScrollView>
  );
};


export default LoginScreen;
