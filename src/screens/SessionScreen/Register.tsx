import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import loginStyles from './style/registerStyle'; // Importamos los estilos de login
import { ScrollView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../../NavigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';
import { TUserRegister } from 'src/types/user';
import { postUserRegister } from '@services/backend';
import Loader from '@components/LoaderComponent/Loader';
import AppMessage from '@components/AppMessage/AppMessage';
import { ToastState, ToastType } from 'src/types/toast';

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

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [toast, setToast] = useState<ToastState>(null);
  const showMessage = (type: ToastType, text: string) => setToast({ type, text });

  async function handleRegister() {
    setLoading(true);
    if (!email || email.trim() === '') {
      showMessage('info', 'Por favor, completa el email.');
      return;
    }
    if (!name || name.trim() === '') {
      showMessage('info', 'Por favor, completa el nombre.');
      setLoading(false);
      return;
    }
    if (!password || password.trim() === '') {
      showMessage('info', 'Por favor, completa la contraseña.');
      setLoading(false);
      return;
    }
    if (!location || location.trim() === '') {
      showMessage('info', 'Por favor, completa la ubicación.');
      setLoading(false);
      return;
    }
    if (!age || Number(age) <= 0) {
      showMessage('info', 'Por favor, completa todos la edad.');
      return;
    }

    const newUser: TUserRegister = {
      email,
      display_name: name,
      password,
      ubication: location,
      age: Number(age),
    };

    const response = await postUserRegister(newUser);

    if (response && response.message) {
      showMessage('success', 'Registro exitoso. Redirigiendo...');
      setTimeout(() => navigation.navigate('Login'), 1500);
    } else {
      showMessage('error', 'Error al registrar. Intenta de nuevo.');
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={loginStyles.keyboardAvoid}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          {/* AppMessage flotante */}
          {toast && (
            <AppMessage
              type={toast.type}
              message={toast.text}
              onHide={() => setToast(null)}
              duration={2500}
            />
          )}

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
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      style={[loginStyles.input, { flex: 1 }]}
                      placeholder="Contraseña"
                      keyboardType="default"
                      autoCapitalize="none"
                      secureTextEntry={!showPassword}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 10 }}>
                      <Text style={{ color: '#6A5AE0', fontSize: 12 }}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
                    </TouchableOpacity>
                  </View>
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
                    keyboardType="numeric"
                    autoCapitalize="none"
                    onChangeText={setAge}
                  />
                </View>
                {/* Container Button */}
                <View style={loginStyles.containerLoginButtons}>
                  {/* Boton Register */}
                  <TouchableOpacity onPress={handleRegister}
                    style={loginStyles.botonLogin}
                  >
                    {
                      loading ?
                        <Loader visible={loading} message="" /> :
                        <Text style={loginStyles.textoButtons}>
                          Registrar
                        </Text>
                    }
                  </TouchableOpacity>
                  {/* Boton Login */}
                  <TouchableOpacity
                    style={loginStyles.botonLogin}
                    onPress={() => navigation.navigate('Login')} // Asegúrate de que onPress esté dentro de TouchableOpacity
                  >
                    <Text style={loginStyles.textoButtons}>
                      Ir a Login
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
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
