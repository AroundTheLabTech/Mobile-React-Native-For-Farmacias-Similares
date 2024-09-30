import React from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';
import loginStyles from './style/loginStyles'; // Importamos los estilos de login


type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type LoginScreenProps = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  return (
      <View style={loginStyles.containerLogin}>

      
      <View style={loginStyles.headerContainer}>
          <Image
          source={require('../../../public/medallas/medal1.png')}
          style={loginStyles.headerMedal}
          />
           <Image
          source={require('../../../public/medallas/medal2.png')}
          style={loginStyles.headerMedal}
          />
      </View>     

      <View style={loginStyles.containerTitle}>
        {/* Title */}
        <Text style={loginStyles.titleLogin}>
          ¡GANAR NUNCA FUE MÁS DIVERTIDO! 
        </Text>  
        <View 
        style={loginStyles.containerForms}>
          {/* PlaceHolder */}
          <View
          style ={loginStyles.containerPlaceHolder}
          >
            <Text
            style ={loginStyles.placeHolder}
            >
              Correo Electrónico</Text>
          </View>
     
           <TextInput
            style={loginStyles.input}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          {/* Contraseña */}
          <View
          style ={loginStyles.containerPlaceHolder}
          >
            <Text
            style ={loginStyles.placeHolder}
            >
              Contraseña</Text>
          </View>

          <TextInput
            style={loginStyles.input}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {/* Container Button */}
        <View style={loginStyles.containerButtons}>

          {/* Boton Register */}
          <TouchableOpacity 
          style={loginStyles.botonLogin}>
            <Text
              style={loginStyles.textoButtons}
            >Login
            </Text>
          </TouchableOpacity>
          {/* Boton Login */}
          <TouchableOpacity
            style= {loginStyles.botonLogin}
          >
            <Text style={loginStyles.textoButtons}>
              Register
            </Text>
          </TouchableOpacity>

        </View>

      </View> 

      <View style={loginStyles.headerContainer}>
          <Image
          source={require('../../../public/medallas/medal1.png')}
          style={loginStyles.headerMedal}
          />
           <Image
          source={require('../../../public/medallas/medal2.png')}
          style={loginStyles.headerMedal}
          />
      </View>

      </View>
    
  );
};


export default LoginScreen;
