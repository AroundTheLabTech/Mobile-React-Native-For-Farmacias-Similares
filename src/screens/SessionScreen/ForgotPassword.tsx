import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native';
import forgotPasswordStyle from './style/forgotPasswordStyle'; // Importamos los estilos de login
import { ScrollView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../../NavigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';
import { putResetPassword } from '@services/backend';
import Loader from '@components/LoaderComponent/Loader';
import AppMessage from '@components/AppMessage/AppMessage';

// Definir el tipo de navegación para la pantalla ForgotPassword
type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ForgotPassword'
>;

type ForgotPasswordScreenProps = {
  navigation: ForgotPasswordScreenNavigationProp;
};

type ToastState = { type: string; text: string } | null;

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {

  const [email, setEmail] = useState<string>();

  const [loading, setLoading] = useState<boolean>(false);

  const [toast, setToast] = useState<ToastState>(null);

  const showMessage = (type: string, text: string) => {
    setToast({ type, text });
  };

  async function handleForgotPassword() {
    setLoading(true);
    if (!email || email.trim() === '') {
      setLoading(false);
      showMessage('error', 'Por favor, ingresa un correo electrónico válido.');
      return;
    }

    const response = await putResetPassword(email);

    if (response.message) {
      showMessage('success', 'Se ha enviado un correo para restablecer tu contraseña.');
      await new Promise(resolve => setTimeout(resolve, 5000));
      navigation.navigate('Login');
    } else {
      showMessage('error', 'No se pudo enviar el correo. Inténtalo de nuevo más tarde.');
      await new Promise(resolve => setTimeout(resolve, 5000));
      navigation.navigate('Login');
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={forgotPasswordStyle.keyboardAvoid}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            {/* AppMessage siempre flotando arriba */}
            {toast && (
              <AppMessage
                type={toast.type}
                message={toast.text}
                onHide={() => setToast(null)}
                duration={2500}
              />
            )}

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={forgotPasswordStyle.headerContainer}>
                <Image
                  source={require('../../../img/medallas/medal1.png')}
                  style={forgotPasswordStyle.headerMedal}
                />
                <Image
                  source={require('../../../img/medallas/medal1.png')}
                  style={forgotPasswordStyle.headerMedal}
                />
              </View>
              <View style={forgotPasswordStyle.containerLogin}>
                <View style={forgotPasswordStyle.containerTitle}>
                  {/* Title */}
                  <Text style={forgotPasswordStyle.titleLogin}>
                    ¡Olvidaste tu Contraseña?!
                  </Text>
                  {/* Container Forms */}
                  <View
                    style={forgotPasswordStyle.containerForms}>
                    {/* Correo Electronico */}
                    <View style={forgotPasswordStyle.containerPlaceHolder}
                    >
                      <Text
                        style={forgotPasswordStyle.placeHolder}
                      >
                        Correo Electrónico</Text>
                    </View>
                    <TextInput
                      style={forgotPasswordStyle.input}
                      placeholder="Correo electrónico"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onChangeText={setEmail}
                    />
                  </View>
                  {/* Container Button */}
                  <View style={forgotPasswordStyle.containerButtons}>
                    {/* Boton Login */}
                    <TouchableOpacity
                      style={forgotPasswordStyle.botonLogin}
                      onPress={() => navigation.navigate('Login')} // Asegúrate de que onPress esté dentro de TouchableOpacity
                    >
                      <Text style={forgotPasswordStyle.textoButtons}>
                        Login
                      </Text>
                    </TouchableOpacity>
                    {/* Boton ForgotPassword */}
                    <TouchableOpacity onPress={handleForgotPassword}
                      style={forgotPasswordStyle.botonLogin}
                    >
                      {
                        loading ?
                          <Loader visible={loading} message="" /> :
                          <Text style={forgotPasswordStyle.textoButtons}>
                            ForgotPassword
                          </Text>
                      }
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={forgotPasswordStyle.headerContainer}>
                  <Image
                    source={require('../../../img/medallas/medal1.png')}
                    style={forgotPasswordStyle.headerMedal}
                  />
                  <Image
                    source={require('../../../img/medallas/medal1.png')}
                    style={forgotPasswordStyle.headerMedal}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
