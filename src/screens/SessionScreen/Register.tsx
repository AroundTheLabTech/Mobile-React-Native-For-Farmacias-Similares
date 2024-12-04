import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import loginStyles from './style/registerStyle'; // Importamos los estilos de login
import { ScrollView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../../NavigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';
import { TUserRegister } from 'src/types/user';



// Definir el tipo de navegación para la pantalla Register
type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

type RegisterScreenProps = {
  navigation: RegisterScreenNavigationProp;
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {

  const [email, setEmail] = useState<string>();
  const [name, setName] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [age, setAge] = useState<string>();

  async function handleRegister() {
    if (!email) {
      console.log('completar el email');
      return;
    }
    if (!name) {
      console.log('completar el name');
      return;
    }
    if (!password) {
      console.log('completar el password');
      return;
    }
    if (!location) {
      console.log('completar el location');
      return;
    }
    if (!age) {
      console.log('completar el age');
      return;
    }

    const newUser: TUserRegister = {
      email,
      name,
      password,
      location,
      age,
    };

    console.log(newUser);
  }

  return (
    <ScrollView>
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
      <View style={loginStyles.containerLogin}>

        <View style={loginStyles.containerTitle}>
          {/* Title */}
          <Text style={loginStyles.titleLogin}>
            ¡Registro!
          </Text>
          {/* Container Forms */}
          <View
            style={loginStyles.containerForms}>

            {/* Correo Electronico */}
            <View style={loginStyles.containerPlaceHolder}
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
              onChangeText={setEmail}
            />


            {/* Nombre */}
            <View style={loginStyles.containerPlaceHolder}
            >
              <Text
                style={loginStyles.placeHolder}
              >
                Nombre</Text>
            </View>


            <TextInput
              style={loginStyles.input}
              placeholder="Nombre"
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={setName}
            />


            {/* Contraseña */}
            <View style={loginStyles.containerPlaceHolder}
            >
              <Text
                style={loginStyles.placeHolder}
              >
                Contraseña</Text>
            </View>

            <TextInput
              style={loginStyles.input}
              placeholder="Contraseña"
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={setPassword}
            />

            {/* Ubicación */}
            <View style={loginStyles.containerPlaceHolder}
            >
              <Text
                style={loginStyles.placeHolder}
              >
                Ubicación</Text>
            </View>

            <TextInput
              style={loginStyles.input}
              placeholder="Ubicacion"
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={setLocation}
            />

            {/* Edad */}
            <View style={loginStyles.containerPlaceHolder}
            >
              <Text
                style={loginStyles.placeHolder}
              >
                Edad</Text>
            </View>

            <TextInput
              style={loginStyles.input}
              placeholder="Edad"
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={setAge}
            />


          </View>


          {/* Container Button */}
          <View style={loginStyles.containerButtons}>

            {/* Boton Login */}
            <TouchableOpacity
              style={loginStyles.botonLogin}
              onPress={() => navigation.navigate('Login')} // Asegúrate de que onPress esté dentro de TouchableOpacity

            >
              <Text style={loginStyles.textoButtons}>
                Login
              </Text>
            </TouchableOpacity>

            {/* Boton Register */}
            <TouchableOpacity onPress={handleRegister}
              style={loginStyles.botonLogin}
            >
              <Text style={loginStyles.textoButtons}>
                Register
              </Text>
            </TouchableOpacity>



          </View>

        </View>

        <View style={loginStyles.headerContainer} />

      </View>

    </ScrollView>
  );
};

export default RegisterScreen;
