import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, Dimensions, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../NavigationTypes';
import loginStyles from './style/loginStyles';
import { getUserInformation, loginUserByEmailAndPassword, validateToken } from '../../services/backend';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../AuthContext';
import { TUserLogin } from 'src/types/user';
import Loader from '@components/LoaderComponent/Loader';
import AppMessage from '@components/AppMessage/AppMessage';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type LoginScreenProps = {
  navigation: LoginScreenNavigationProp;
};

type ToastState = { type: string; text: string } | null;

// ✅ Claves de almacenamiento centralizadas
const STORAGE_KEYS = {
  accessToken: 'userAccessToken',
  expiresAt: 'tokenExpiresAt', // timestamp en ms
  updateScore: 'updateScore',
  updateProfilePicture: 'updateProfilePicture',
  updateProfileInformation: 'updateProfileInformation',
};

// ✅ helpers de tiempo
const nowMs = () => Date.now();
const secondsToMs = (s: number) => s * 1000;

// ✅ comprobar expiración con pequeño “margen” (p.ej., 10s)
const isExpired = (expiresAtMs: number, leewayMs = 10_000) => nowMs() >= (expiresAtMs - leewayMs);

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // ✅
  const [loading, setLoading] = useState<boolean>(false);
  const { updateUserInformation } = useAuth();
  const [toast, setToast] = useState<ToastState>(null);
  const showMessage = (type: string, text: string) => setToast({ type, text });

  const hasRestoredRef = useRef(false);
  const isNavigatingRef = useRef(false);

  // ✅ LOGIN: guarda token y expiración real (timestamp)
  const handleLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      showMessage('error', 'Por favor, completa todos los campos.');
      setLoading(false);
      return;
    }

    try {
      const user = await loginUserByEmailAndPassword(email, password); // devuelve { id_token, expires_in, ... }

      // convierte expires_in (segundos) → fecha futura absoluta
      const expiresAtMs = nowMs() + secondsToMs(Number(user.expires_in || 0));

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.accessToken, user.id_token],
        [STORAGE_KEYS.expiresAt, String(expiresAtMs)],
        [STORAGE_KEYS.updateScore, 'false'],
        [STORAGE_KEYS.updateProfilePicture, 'false'],
        [STORAGE_KEYS.updateProfileInformation, 'false'],
      ]);

      // hidrata user en contexto
      const validateAccessToken = await validateToken(user.id_token);
      const response = await getUserInformation(validateAccessToken.uid);

      const hydratedUser: TUserLogin = {
        uid: validateAccessToken.uid,
        email: response.email,
        gender: response.gender,
        age: response.age,
        last_session: response.last_session,
        ubication: response.state,
        display_name: response.name,
        id_token: user.id_token,
        registered: 'true',
        refresh_token: null,
        expires_in: Number(user.expires_in),
      };

      updateUserInformation(hydratedUser);

      showMessage('success', 'Login exitoso. Redirigiendo...');
      setLoading(false);

      // opcional: pequeño delay para ver el toast
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTab', params: { screen: 'Home' } }],
        });
      }, 600);
    } catch (error) {
      setLoading(false);
      showMessage('error', 'Error de login. Verifica tus credenciales.');
      console.error('Error de login:', error);
    }
  };

  // ✅ Rehidratación de sesión al montar la pantalla
  useEffect(() => {
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;

    const restoreSession = async () => {
      try {
        setLoading(true);

        const [[, storedAccessToken], [, storedExpiresAt]] = await AsyncStorage.multiGet([
          STORAGE_KEYS.accessToken,
          STORAGE_KEYS.expiresAt,
        ]);

        if (!storedAccessToken || !storedExpiresAt) {
          setLoading(false);
          return;
        }

        const expiresAtMs = Number(storedExpiresAt);
        if (!expiresAtMs || isNaN(expiresAtMs) || isExpired(expiresAtMs)) {
          await AsyncStorage.multiRemove([STORAGE_KEYS.accessToken, STORAGE_KEYS.expiresAt]);
          setLoading(false);
          return;
        }

        const validateAccessToken = await validateToken(storedAccessToken);
        if (!validateAccessToken?.uid) {
          await AsyncStorage.multiRemove([STORAGE_KEYS.accessToken, STORAGE_KEYS.expiresAt]);
          setLoading(false);
          return;
        }

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
          expires_in: Math.max(0, Math.floor((expiresAtMs - Date.now()) / 1000)),
        };

        updateUserInformation(user);
        setLoading(false);

        if (!isNavigatingRef.current) {
          isNavigatingRef.current = true;
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTab', params: { screen: 'Home' } }],
          });
        }
      } catch (error) {
        await AsyncStorage.multiRemove([STORAGE_KEYS.accessToken, STORAGE_KEYS.expiresAt]);
        setLoading(false);
      }
    };

    restoreSession();
    // 👇 intencionalmente SIN deps para que NO se repita por cambios de contexto/navigation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // orientación (tu código)
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

          <ScrollView
            key={orientation}
            style={loginStyles.container}
            contentContainerStyle={orientation === 'portrait' ? loginStyles.container : loginStyles.containerMax}
          >
            <View style={loginStyles.containerLogin}>
              <View style={loginStyles.headerContainer}>
                <Image source={require('../../../img/medallas/medal1.png')} style={loginStyles.headerMedal} />
                <Image source={require('../../../img/medallas/medal1.png')} style={loginStyles.headerMedal} />
              </View>

              <View style={loginStyles.containerTitle}>
                <Text style={loginStyles.titleLogin}>¡GANAR NUNCA FUE MÁS DIVERTIDO!</Text>

                <View style={loginStyles.containerForms}>
                  {/* Correo */}
                  <View style={loginStyles.containerPlaceHolder}>
                    <Text style={loginStyles.placeHolder}>Correo Electrónico</Text>
                  </View>
                  <TextInput
                    style={loginStyles.input}
                    placeholder="Correo electrónico"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    returnKeyType="next"
                    autoCorrect={false}
                    textContentType="emailAddress"
                  />

                  {/* Contraseña */}
                  <View style={loginStyles.containerPlaceHolder}>
                    <Text style={loginStyles.placeHolder}>Contraseña</Text>
                  </View>
                  <TextInput
                    style={loginStyles.input}
                    placeholder="Contraseña"
                    // ❌ estaba en email-address
                    keyboardType="default" // ✅
                    autoCapitalize="none"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry // ✅ oculta caracteres
                    returnKeyType="done"
                    textContentType="password"
                  />
                </View>

                {/* Botones */}
                <View style={loginStyles.containerLoginButtons}>
                  <TouchableOpacity style={loginStyles.botonLogin} onPress={handleLogin} disabled={loading}>
                    {loading ? <Loader visible={loading} message="" /> : <Text style={loginStyles.textoButtons}>Login</Text>}
                  </TouchableOpacity>

                  <TouchableOpacity style={loginStyles.botonLogin} onPress={() => navigation.navigate('Register')} disabled={loading}>
                    <Text style={loginStyles.textoButtons}>Register</Text>
                  </TouchableOpacity>
                </View>

                <View style={loginStyles.containerButtons}>
                  <TouchableOpacity style={loginStyles.botonForgot} onPress={() => navigation.navigate('ForgotPassword')} disabled={loading}>
                    <Text style={loginStyles.textoButtons}>Forgot Password</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={loginStyles.headerContainer}>
                <Image source={require('../../../img/medallas/medal1.png')} style={loginStyles.headerMedal} />
                <Image source={require('../../../img/medallas/medal1.png')} style={loginStyles.headerMedal} />
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
