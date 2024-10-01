import React, {useState} from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../../NavigationTypes'; 


//Styles

import loginStyles from './style/loginStyles'; 

//Services

import { loginWithEmailAndPassword } from '../../services/authService';  


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



    const handleLogin = async () => {
      try {
        const user = await loginWithEmailAndPassword(email, password);
        console.log("Usuario autenticado", user);
        // Aquí puedes redirigir a la pantalla principal o manejar el usuario logueado
        navigation.navigate('Home');
      } catch (error) {
        console.error("Error de login:", error);
        // Manejar el error, por ejemplo, mostrando un mensaje de error en la UI
      }
    };


  
  return (
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
            value = {email}
            onChangeText = {setEmail}
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

            onChangeText={setPassword}
          />
        </View>
        {/* Container Button */}
        <View style={loginStyles.containerButtons}>

             {/* Boton Login */}
          <TouchableOpacity
            style= {loginStyles.botonLogin}
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
    
  );
};


export default LoginScreen;
