import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Dimensions, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../NavigationTypes';
import authStyles from '../../theme/authStyles';
import { getUserInformation, loginUserByEmailAndPassword, validateToken } from '../../services/backend';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../AuthContext';
import { useUser } from '../../services/UserContext';
import { setSecureToken, getSecureToken, clearSecureToken, setSecureRefreshToken, getSecureRefreshToken } from '../../utils/secureStorage';
import { TUserLogin } from 'src/types/user';
import AppMessage from '@components/AppMessage/AppMessage';
import { ToastState, ToastType } from 'src/types/toast';
import { DEV_SKIP_LOGIN, MOCK_USER } from '../../config/dev';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type LoginScreenProps = {
  navigation: LoginScreenNavigationProp;
};

const STORAGE_KEYS = {
  accessToken: 'userAccessToken',
  expiresAt: 'tokenExpiresAt',
  updateScore: 'updateScore',
  updateProfilePicture: 'updateProfilePicture',
  updateProfileInformation: 'updateProfileInformation',
};

const nowMs = () => Date.now();
const secondsToMs = (s: number) => s * 1000;

const isExpired = (expiresAtMs: number, leewayMs = 10_000) => nowMs() >= (expiresAtMs - leewayMs);

async function clearExpiredSession() {
  await clearSecureToken();
  await AsyncStorage.multiRemove(['tokenExpiresAt', 'updateScore', 'updateProfilePicture', 'updateProfileInformation']);
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { updateUserInformation, isLogout, setIsLogout } = useAuth();
  const { hydrateUserInformation } = useUser();
  const [toast, setToast] = useState<ToastState>(null);
  const showMessage = (type: ToastType, text: string) => setToast({ type, text });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const hasRestoredRef = useRef(false);
  const isNavigatingRef = useRef(false);

  const handleLogin = async () => {
    setLoading(true);
    if (!email || !password || isLogout) {
      showMessage('error', 'Por favor, completa todos los campos.');
      setLoading(false);
      return;
    }

    try {
      const user = await loginUserByEmailAndPassword(email, password);
      const expiresAtMs = nowMs() + secondsToMs(Number(user.expires_in || 0));

      // Store token securely in device keychain
      await setSecureToken(user.id_token);
      if (user.refresh_token) {
        await setSecureRefreshToken(user.refresh_token);
      }
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.expiresAt, String(expiresAtMs)],
        [STORAGE_KEYS.updateScore, 'false'],
        [STORAGE_KEYS.updateProfilePicture, 'false'],
        [STORAGE_KEYS.updateProfileInformation, 'false'],
      ]);

      if (__DEV__) console.log('[LOGIN] Validating token...');
      const validateAccessToken = await validateToken(user.id_token);
      if (__DEV__) console.log('[LOGIN] validateToken result:', JSON.stringify(validateAccessToken));

      if (!validateAccessToken?.uid) {
        showMessage('error', 'Error validando el token. Intenta de nuevo.');
        setLoading(false);
        return;
      }

      if (__DEV__) console.log('[LOGIN] Getting user info for uid:', validateAccessToken.uid);
      const response = await getUserInformation(validateAccessToken.uid);
      if (__DEV__) console.log('[LOGIN] getUserInformation result:', JSON.stringify(response));

      if (!response) {
        showMessage('error', 'Error obteniendo información del usuario.');
        setLoading(false);
        return;
      }

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
      hydrateUserInformation(response);

      showMessage('success', 'Login exitoso. Redirigiendo...');
      setLoading(false);
      setIsLogout(false);

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTab', params: { screen: 'Home' } }],
        });
      }, 600);
    } catch (error) {
      setLoading(false);
      const errorMsg = error instanceof Error ? error.message : 'Error inesperado. Intentalo de nuevo.';
      showMessage('error', errorMsg);
    }
  };

  useEffect(() => {
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;

    const restoreSession = async () => {
      if (DEV_SKIP_LOGIN) {
        updateUserInformation(MOCK_USER);
        navigation.reset({ index: 0, routes: [{ name: 'MainTab', params: { screen: 'Home' } }] });
        return;
      }

      try {
        setLoading(true);

        const storedAccessToken = await getSecureToken();
        const storedExpiresAt = await AsyncStorage.getItem(STORAGE_KEYS.expiresAt);
        const storedRefreshToken = await getSecureRefreshToken();

        if (!storedAccessToken || !storedExpiresAt || !storedRefreshToken) {
          if (storedAccessToken || storedExpiresAt || storedRefreshToken) {
            await clearExpiredSession();
          }
          setLoading(false);
          return;
        }

        const expiresAtMs = Number(storedExpiresAt);
        if (!expiresAtMs || isNaN(expiresAtMs) || isExpired(expiresAtMs)) {
          await clearExpiredSession();
          setLoading(false);
          return;
        }

        const validateAccessToken = await validateToken(storedAccessToken);
        if (!validateAccessToken?.uid) {
          await clearExpiredSession();
          setLoading(false);
          return;
        }

        const response = await getUserInformation(validateAccessToken.uid);

        if (!response) {
          await clearExpiredSession();
          setLoading(false);
          return;
        }

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
        hydrateUserInformation(response);
        setLoading(false);

        if (!isNavigatingRef.current) {
          isNavigatingRef.current = true;
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTab', params: { screen: 'Home' } }],
          });
        }
      } catch (error) {
        await clearExpiredSession();
        setLoading(false);
      }
    };

    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={authStyles.keyboardAvoid}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={authStyles.screenContainer}>
          {/* Gradient overlays */}
          <View style={authStyles.gradientPurple} />
          <View style={authStyles.gradientCyan} />

          {/* Toast */}
          {toast && (
            <AppMessage
              type={toast.type}
              message={toast.text}
              onHide={() => setToast(null)}
              duration={2500}
            />
          )}

          <ScrollView
            contentContainerStyle={authStyles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={authStyles.glassCard}>
              {/* Brand */}
              <Text style={authStyles.brandText}>SimiJuegos</Text>
              <Text style={authStyles.title}>¡Ganar nunca fue{'\n'}más divertido!</Text>
              <Text style={authStyles.subtitle}>Inicia sesión para continuar</Text>

              {/* Email */}
              <View style={authStyles.inputGroup}>
                <Text style={authStyles.label}>Correo Electrónico</Text>
                <View style={authStyles.inputWrapper}>
                  <TextInput
                    style={[
                      authStyles.input,
                      focusedField === 'email' && authStyles.inputFocused,
                    ]}
                    placeholder="tu@correo.com"
                    placeholderTextColor="rgba(255,255,255,0.30)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    returnKeyType="next"
                  />
                </View>
              </View>

              {/* Password */}
              <View style={authStyles.inputGroup}>
                <Text style={authStyles.label}>Contraseña</Text>
                <View style={authStyles.inputWrapper}>
                  <TextInput
                    style={[
                      authStyles.input,
                      focusedField === 'password' && authStyles.inputFocused,
                    ]}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255,255,255,0.30)"
                    autoCapitalize="none"
                    secureTextEntry={!showPassword}
                    textContentType="password"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    style={authStyles.passwordToggle}
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={authStyles.passwordToggleText}>
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[authStyles.buttonPrimary, loading && authStyles.buttonPrimaryDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={[authStyles.buttonPrimaryText, { marginLeft: 8 }]}>Ingresando...</Text>
                  </View>
                ) : (
                  <Text style={authStyles.buttonPrimaryText}>Iniciar Sesión</Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={authStyles.dividerContainer}>
                <View style={authStyles.dividerLine} />
                <Text style={authStyles.dividerText}>o</Text>
                <View style={authStyles.dividerLine} />
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={authStyles.buttonOutline}
                onPress={() => navigation.navigate('Register')}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={authStyles.buttonOutlineText}>Registrarse</Text>
              </TouchableOpacity>

              {/* Forgot Password Link */}
              <TouchableOpacity
                style={authStyles.buttonLink}
                onPress={() => navigation.navigate('ForgotPassword')}
                disabled={loading}
              >
                <Text style={authStyles.buttonLinkText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
