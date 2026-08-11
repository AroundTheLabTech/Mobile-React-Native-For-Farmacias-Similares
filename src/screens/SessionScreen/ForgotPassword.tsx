import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import {RootStackParamList} from '../../NavigationTypes';
import {StackNavigationProp} from '@react-navigation/stack';
import {putResetPassword} from '@services/backend';
import Loader from '@components/LoaderComponent/Loader';
import AppMessage from '@components/AppMessage/AppMessage';
import authStyles from '../../theme/authStyles';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ForgotPassword'
>;

type ForgotPasswordScreenProps = {
  navigation: ForgotPasswordScreenNavigationProp;
};

type ToastState = {type: string; text: string} | null;

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [isActive, setIsActive] = useState(false);

  const [toast, setToast] = useState<ToastState>(null);
  const showMessage = (type: string, text: string) => setToast({type, text});

  useEffect(() => {
    if (!isActive) {
      return;
    }

    if (countdown <= 0) {
      setIsActive(false);
      return;
    }

    const timeout = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    // Cleanup when time changes or when leaving the screen
    return () => clearTimeout(timeout);
  }, [countdown, isActive]);

  async function handleForgotPassword() {
    if (!email || email.trim() === '') {
      showMessage('error', 'Por favor, ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);
    try {
      const response = await putResetPassword(email);

      if (response && response.message) {
        setEmailSent(true);
        showMessage('success', 'Correo enviado correctamente.');
        setIsActive(true);
      } else {
        showMessage(
          'error',
          'Correo no encontrado. Verifica que sea el correo correcto.',
        );
      }
    } catch {
      showMessage('error', 'Error al enviar. Inténtalo más tarde.');
    }
    setLoading(false);
  }

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
            keyboardShouldPersistTaps="handled">
            <View style={authStyles.glassCard}>
              {/* Header */}
              <Text style={authStyles.brandText}>SimiJuegos</Text>
              <Text style={authStyles.title}>Recuperar contraseña</Text>
              <Text style={authStyles.subtitle}>
                Ingresa tu correo y te enviaremos un enlace para restablecer tu
                contraseña
              </Text>

              {!emailSent ? (
                <>
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
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        returnKeyType="done"
                        onSubmitEditing={handleForgotPassword}
                      />
                    </View>
                  </View>

                  {/* Send Button */}
                  <TouchableOpacity
                    style={[
                      authStyles.buttonPrimary,
                      loading && authStyles.buttonPrimaryDisabled,
                    ]}
                    onPress={handleForgotPassword}
                    disabled={loading}
                    activeOpacity={0.8}>
                    {loading ? (
                      <Loader visible={loading} message="" size="small" />
                    ) : (
                      <Text style={authStyles.buttonPrimaryText}>
                        Enviar enlace
                      </Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {/* Confirmation message */}
                  <View style={authStyles.confirmationContainer}>
                    <Text style={authStyles.confirmationText}>
                      Hemos enviado un enlace de recuperación a {email}. Revisa
                      tu bandeja de entrada.
                    </Text>
                  </View>

                  {/* Resend button */}
                  <TouchableOpacity
                    style={[
                      authStyles.buttonOutline,
                      countdown > 0 && {opacity: 0.4},
                    ]}
                    onPress={handleForgotPassword}
                    disabled={countdown > 0 || loading}
                    activeOpacity={0.8}>
                    {loading ? (
                      <Loader visible={loading} message="" size="small" />
                    ) : (
                      <Text style={authStyles.buttonOutlineText}>
                        {countdown > 0
                          ? `Reenviar en ${countdown}s`
                          : 'Reenviar correo'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </>
              )}

              {/* Back to Login */}
              <TouchableOpacity
                style={authStyles.buttonLink}
                onPress={() => navigation.navigate('Login')}>
                <Text style={authStyles.buttonLinkText}>
                  Volver al inicio de sesión
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
