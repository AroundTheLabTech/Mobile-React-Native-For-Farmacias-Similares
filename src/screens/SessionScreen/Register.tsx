import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { RootStackParamList } from '../../NavigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';
import { TUserRegister } from 'src/types/user';
import { postUserRegister } from '@services/backend';
import Loader from '@components/LoaderComponent/Loader';
import AppMessage from '@components/AppMessage/AppMessage';
import { ToastState, ToastType } from 'src/types/toast';
import authStyles from '../../theme/authStyles';
import { darkTheme } from '../../theme/colors';

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

type RegisterScreenProps = {
  navigation: RegisterScreenNavigationProp;
};

const getPasswordStrength = (password: string): { level: number; label: string; color: string } => {
  if (!password || password.length === 0) return { level: 0, label: '', color: '' };
  if (password.length < 6) return { level: 1, label: 'Débil', color: darkTheme.error };
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const score = [password.length >= 8, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  if (score >= 3) return { level: 3, label: 'Fuerte', color: darkTheme.success };
  if (score >= 2) return { level: 2, label: 'Media', color: '#F59E0B' };
  return { level: 1, label: 'Débil', color: darkTheme.error };
};

function validateField(field: string, value: string): string {
  switch (field) {
    case 'email':
      if (!value.trim()) return 'El correo es requerido';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ingresa un correo válido';
      return '';
    case 'name':
      if (!value.trim()) return 'El nombre es requerido';
      if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
      return '';
    case 'password':
      if (!value) return 'La contraseña es requerida';
      if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
      return '';
    case 'location':
      if (!value.trim()) return 'La ubicación es requerida';
      return '';
    case 'age':
      if (!value.trim()) return 'La edad es requerida';
      const num = Number(value);
      if (isNaN(num) || num < 1 || num > 120) return 'Ingresa una edad válida (1-120)';
      return '';
    default:
      return '';
  }
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [age, setAge] = useState<string>('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [toast, setToast] = useState<ToastState>(null);
  const showMessage = (type: ToastType, text: string) => setToast({ type, text });

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  async function handleRegister() {
    setLoading(true);
    if (!email || email.trim() === '') {
      showMessage('info', 'Por favor, completa el email.');
      setLoading(false);
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
      showMessage('info', 'Por favor, completa la edad.');
      setLoading(false);
      return;
    }

    const newUser: TUserRegister = {
      email,
      display_name: name,
      password,
      ubication: location,
      age: Number(age),
    };

    try {
      const response = await postUserRegister(newUser);

      if (response && response.message) {
        showMessage('success', 'Registro exitoso. Redirigiendo...');
        setTimeout(() => navigation.navigate('Login'), 1500);
      } else {
        showMessage('error', 'Error al registrar. Intenta de nuevo.');
      }
    } catch {
      showMessage('error', 'Error al registrar. Intenta de nuevo.');
    }
    setLoading(false);
  }

  const renderStrengthBar = () => {
    if (passwordStrength.level === 0) return null;
    return (
      <>
        <View style={authStyles.strengthContainer}>
          {[1, 2, 3].map((seg) => (
            <View
              key={seg}
              style={[
                authStyles.strengthSegment,
                seg <= passwordStrength.level && {
                  backgroundColor: passwordStrength.color,
                },
              ]}
            />
          ))}
        </View>
        <Text style={[authStyles.strengthLabel, { color: passwordStrength.color }]}>
          {passwordStrength.label}
        </Text>
      </>
    );
  };

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
              {/* Header */}
              <Text style={authStyles.brandText}>SimiJuegos</Text>
              <Text style={authStyles.title}>Crear cuenta</Text>
              <Text style={authStyles.subtitle}>Regístrate para empezar a jugar</Text>

              {/* Email */}
              <View style={authStyles.inputGroup}>
                <Text style={authStyles.label}>Correo Electrónico</Text>
                <View style={authStyles.inputWrapper}>
                  <TextInput
                    style={[
                      authStyles.input,
                      focusedField === 'email' && authStyles.inputFocused,
                      !!fieldErrors.email && authStyles.inputError,
                    ]}
                    placeholder="tu@correo.com"
                    placeholderTextColor="rgba(255,255,255,0.30)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                    }}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => {
                      setFocusedField(null);
                      const error = validateField('email', email);
                      setFieldErrors(prev => ({ ...prev, email: error }));
                    }}
                    returnKeyType="next"
                  />
                </View>
                {fieldErrors.email ? <Text style={authStyles.errorText}>{fieldErrors.email}</Text> : null}
              </View>

              {/* Name */}
              <View style={authStyles.inputGroup}>
                <Text style={authStyles.label}>Nombre</Text>
                <View style={authStyles.inputWrapper}>
                  <TextInput
                    style={[
                      authStyles.input,
                      focusedField === 'name' && authStyles.inputFocused,
                      !!fieldErrors.name && authStyles.inputError,
                    ]}
                    placeholder="Tu nombre"
                    placeholderTextColor="rgba(255,255,255,0.30)"
                    autoCapitalize="words"
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: '' }));
                    }}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => {
                      setFocusedField(null);
                      const error = validateField('name', name);
                      setFieldErrors(prev => ({ ...prev, name: error }));
                    }}
                    returnKeyType="next"
                  />
                </View>
                {fieldErrors.name ? <Text style={authStyles.errorText}>{fieldErrors.name}</Text> : null}
              </View>

              {/* Password */}
              <View style={authStyles.inputGroup}>
                <Text style={authStyles.label}>Contraseña</Text>
                <View style={authStyles.inputWrapper}>
                  <TextInput
                    style={[
                      authStyles.input,
                      focusedField === 'password' && authStyles.inputFocused,
                      !!fieldErrors.password && authStyles.inputError,
                    ]}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255,255,255,0.30)"
                    autoCapitalize="none"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                    }}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => {
                      setFocusedField(null);
                      const error = validateField('password', password);
                      setFieldErrors(prev => ({ ...prev, password: error }));
                    }}
                    returnKeyType="next"
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
                {fieldErrors.password ? <Text style={authStyles.errorText}>{fieldErrors.password}</Text> : null}
                {renderStrengthBar()}
              </View>

              {/* Section separator */}
              <Text style={{ color: 'rgba(255,255,255,0.50)', fontSize: 13, marginTop: 8, marginBottom: 4 }}>
                Información Personal
              </Text>

              {/* Location */}
              <View style={authStyles.inputGroup}>
                <Text style={authStyles.label}>Ubicación</Text>
                <View style={authStyles.inputWrapper}>
                  <TextInput
                    style={[
                      authStyles.input,
                      focusedField === 'location' && authStyles.inputFocused,
                      !!fieldErrors.location && authStyles.inputError,
                    ]}
                    placeholder="Ciudad o estado"
                    placeholderTextColor="rgba(255,255,255,0.30)"
                    autoCapitalize="words"
                    value={location}
                    onChangeText={(text) => {
                      setLocation(text);
                      if (fieldErrors.location) setFieldErrors(prev => ({ ...prev, location: '' }));
                    }}
                    onFocus={() => setFocusedField('location')}
                    onBlur={() => {
                      setFocusedField(null);
                      const error = validateField('location', location);
                      setFieldErrors(prev => ({ ...prev, location: error }));
                    }}
                    returnKeyType="next"
                  />
                </View>
                {fieldErrors.location ? <Text style={authStyles.errorText}>{fieldErrors.location}</Text> : null}
              </View>

              {/* Age */}
              <View style={authStyles.inputGroup}>
                <Text style={authStyles.label}>Edad</Text>
                <View style={authStyles.inputWrapper}>
                  <TextInput
                    style={[
                      authStyles.input,
                      focusedField === 'age' && authStyles.inputFocused,
                      !!fieldErrors.age && authStyles.inputError,
                    ]}
                    placeholder="25"
                    placeholderTextColor="rgba(255,255,255,0.30)"
                    keyboardType="numeric"
                    value={age}
                    onChangeText={(text) => {
                      setAge(text);
                      if (fieldErrors.age) setFieldErrors(prev => ({ ...prev, age: '' }));
                    }}
                    onFocus={() => setFocusedField('age')}
                    onBlur={() => {
                      setFocusedField(null);
                      const error = validateField('age', age);
                      setFieldErrors(prev => ({ ...prev, age: error }));
                    }}
                    returnKeyType="done"
                    onSubmitEditing={handleRegister}
                  />
                </View>
                {fieldErrors.age ? <Text style={authStyles.errorText}>{fieldErrors.age}</Text> : null}
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={[authStyles.buttonPrimary, loading && authStyles.buttonPrimaryDisabled]}
                onPress={handleRegister}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <Loader visible={loading} message="" size="small" />
                ) : (
                  <Text style={authStyles.buttonPrimaryText}>Registrarse</Text>
                )}
              </TouchableOpacity>

              {/* Link to Login */}
              <TouchableOpacity
                style={authStyles.buttonLink}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={authStyles.buttonLinkText}>Ya tengo una cuenta</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
