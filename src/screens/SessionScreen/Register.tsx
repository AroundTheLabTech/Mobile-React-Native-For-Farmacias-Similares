import React from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import loginStyles from './style/registerStyle'; // Importamos los estilos de login
import { ScrollView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../../NavigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';



// Definir el tipo de navegación para la pantalla Register
type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

type RegisterScreenProps = {
  navigation: RegisterScreenNavigationProp;
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
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
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
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
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
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
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Edad */}
            <View style={loginStyles.containerPlaceHolder}
            >
              <Text
                style={loginStyles.placeHolder}
              >
                Eda                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             d</Text>
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
            <TouchableOpacity
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
