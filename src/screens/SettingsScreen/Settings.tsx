import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Image, TextInput, Alert, StatusBar, Animated } from 'react-native';
import SettingsStyles from './style/SettingsStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faPen, faCheck, faXmark, faChevronRight, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { TGameCard, TUpdateUserInformation } from '../../types/user';
import { getGameCard, updateUserProfilePicture, putUserInformation } from '../../services/backend';
import { useAuth } from '../../AuthContext';
import { formarGameCardNumber, formatNumber } from '../../utils/helpers';
import { useUser } from '@services/UserContext';
import { AVATARS, getAvatarSource } from '../../utils/avatars';
import Loader from '@components/LoaderComponent/Loader';
import { darkTheme } from '../../theme/colors';
import { useFadeInUp, usePressScale } from '../../utils/animations';

const Settings = ({ navigation }) => {
  const { uid, logout } = useAuth();
  const {
    profilePicture,
    setUpdateProfilePicture,
    userPoints,
    setUpdateUserPoints,
    userInformation,
    setUpdateUserInformation,
  } = useUser();

  const [loading, setLoading] = useState(true);
  const [gameCard, setGameCard] = useState<TGameCard | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editAge, setEditAge] = useState('');
  const [avatarSaved, setAvatarSaved] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [infoSaved, setInfoSaved] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const infoToastOpacity = useRef(new Animated.Value(0)).current;

  // Section animations
  const profileAnim = useFadeInUp(0);
  const cardAnim = useFadeInUp(150);
  const infoAnim = useFadeInUp(300);
  const avatarAnim = useFadeInUp(450);
  const accountAnim = useFadeInUp(600);
  const savePress = usePressScale();
  const logoutPress = usePressScale();

  // Trigger context updates for missing data
  useEffect(() => {
    if (!profilePicture) {
      setUpdateProfilePicture(true);
    }
  }, [profilePicture, setUpdateProfilePicture]);

  useEffect(() => {
    if (!userPoints) {
      setUpdateUserPoints(true);
    }
  }, [userPoints, setUpdateUserPoints]);

  useEffect(() => {
    if (!userInformation) {
      setUpdateUserInformation(true);
    }
  }, [userInformation, setUpdateUserInformation]);

  // Fetch game card on mount (avatars are local now)
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const cardRes = await getGameCard(uid);
        setGameCard(cardRes);
      } catch (error) {
        if (__DEV__) console.error('Error fetching game card:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [uid]);

  // Sync selectedAvatar from profilePicture
  useEffect(() => {
    if (profilePicture) {
      setSelectedAvatar(profilePicture);
    }
  }, [profilePicture]);

  // Sync edit fields from userInformation
  useEffect(() => {
    if (userInformation) {
      setEditName(userInformation.name || '');
      setEditLocation(userInformation.state || '');
      setEditAge(userInformation.age?.toString() || '');
    }
  }, [userInformation]);

  const handleSaveInfo = useCallback(async () => {
    if (!editName.trim() || !editLocation.trim() || !editAge.trim() || Number(editAge) <= 0) {
      return;
    }
    const data: TUpdateUserInformation = {
      name: editName,
      ubication: editLocation,
      age: Number(editAge),
    };
    try {
      const response = await putUserInformation(uid, data);
      if (response?.message) {
        setUpdateUserInformation(true);
        setInfoSaved(true);
        Animated.sequence([
          Animated.timing(infoToastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.delay(2000),
          Animated.timing(infoToastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => setInfoSaved(false));
      }
    } catch (error) {
      if (__DEV__) console.error('Error saving user info:', error);
    }
    setEditMode(false);
  }, [editName, editLocation, editAge, uid, setUpdateUserInformation]);

  async function handleSaveAvatar() {
    if (!selectedAvatar || savingAvatar) return;
    setSavingAvatar(true);
    try {
      const response = await updateUserProfilePicture(uid, selectedAvatar);
      if (response?.message) {
        setUpdateProfilePicture(true);
        // Show success toast with animation
        setAvatarSaved(true);
        Animated.sequence([
          Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.delay(2000),
          Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => setAvatarSaved(false));
      }
    } catch (error) {
      if (__DEV__) console.error('Error updating avatar:', error);
    } finally {
      setSavingAvatar(false);
    }
  }

  function handleLogout() {
    Alert.alert(
      'Cerrar Sesion',
      '¿Estas seguro que quieres cerrar sesion?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesion',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ],
    );
  }

  if (loading) {
    return <Loader visible={true} />;
  }

  return (
    <View style={SettingsStyles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.bg} />

      <ScrollView contentContainerStyle={SettingsStyles.scrollContent}>
        {/* ── Header ── */}
        <View style={SettingsStyles.header}>
          <TouchableOpacity style={SettingsStyles.headerBackButton} onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faArrowLeft} size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={SettingsStyles.headerTitle}>Configuracion</Text>
        </View>

        {/* ── Profile Hero ── */}
        <Animated.View style={[SettingsStyles.profileHero, { opacity: profileAnim.opacity, transform: profileAnim.transform }]}>
          <View style={SettingsStyles.avatarContainer}>
            <Image source={getAvatarSource(profilePicture)} style={SettingsStyles.avatarImage} />
          </View>
          <Text style={SettingsStyles.userName}>{userInformation?.name || 'Jugador'}</Text>
          <Text style={SettingsStyles.userEmail}>{userInformation?.email || ''}</Text>
          <View style={SettingsStyles.levelBadge}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Nivel 1</Text>
          </View>
        </Animated.View>

        {/* ── Game Card ── */}
        <Animated.View style={[SettingsStyles.gameCardOuter, { opacity: cardAnim.opacity, transform: cardAnim.transform }]}>
          <View style={SettingsStyles.gameCard}>
            <View>
              <Text style={SettingsStyles.gameCardLabel}>GAME CARD</Text>
              <View style={SettingsStyles.gameCardChip} />
            </View>
            <Text style={SettingsStyles.gameCardName}>{gameCard?.name || userInformation?.name || 'Jugador'}</Text>
            <View style={SettingsStyles.gameCardBottom}>
              <Text style={SettingsStyles.gameCardNumber}>
                {formarGameCardNumber(gameCard?.card_number) || '0000-0000-0000'}
              </Text>
              <View style={SettingsStyles.gameCardScoreContainer}>
                <Image source={require('../../../img/iconos/moneda.png')} style={SettingsStyles.coinIcon} />
                <Text style={SettingsStyles.gameCardScore}>
                  {userPoints?.score_total ? formatNumber(userPoints.score_total) : '0'}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ── Informacion Personal ── */}
        <Animated.View style={[SettingsStyles.sectionCard, { opacity: infoAnim.opacity, transform: infoAnim.transform }]}>
          <View style={SettingsStyles.sectionHeader}>
            <Text style={SettingsStyles.sectionTitle}>Informacion Personal</Text>
            {!editMode ? (
              <TouchableOpacity style={SettingsStyles.iconButton} onPress={() => setEditMode(true)}>
                <FontAwesomeIcon icon={faPen} size={14} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            ) : (
              <View style={SettingsStyles.editButtonsRow}>
                <TouchableOpacity style={SettingsStyles.iconButton} onPress={() => setEditMode(false)}>
                  <FontAwesomeIcon icon={faXmark} size={16} color="#EF4444" />
                </TouchableOpacity>
                <TouchableOpacity style={SettingsStyles.iconButton} onPress={handleSaveInfo}>
                  <FontAwesomeIcon icon={faCheck} size={16} color="#10B981" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={SettingsStyles.infoGrid}>
            {/* Row 1: Nombre | Email */}
            <View style={SettingsStyles.infoRow}>
              <View style={SettingsStyles.infoItem}>
                <Text style={SettingsStyles.infoLabel}>Nombre</Text>
                {editMode ? (
                  <TextInput
                    style={SettingsStyles.infoInput}
                    value={editName}
                    onChangeText={setEditName}
                    autoFocus
                    placeholderTextColor="rgba(255,255,255,0.3)"
                  />
                ) : (
                  <Text style={SettingsStyles.infoValue}>{userInformation?.name || '-'}</Text>
                )}
              </View>
              <View style={SettingsStyles.infoItem}>
                <Text style={SettingsStyles.infoLabel}>Email</Text>
                <Text style={SettingsStyles.infoValue}>{userInformation?.email || '-'}</Text>
              </View>
            </View>

            {/* Row 2: Ubicacion | Edad */}
            <View style={SettingsStyles.infoRow}>
              <View style={SettingsStyles.infoItem}>
                <Text style={SettingsStyles.infoLabel}>Ubicacion</Text>
                {editMode ? (
                  <TextInput
                    style={SettingsStyles.infoInput}
                    value={editLocation}
                    onChangeText={setEditLocation}
                    placeholderTextColor="rgba(255,255,255,0.3)"
                  />
                ) : (
                  <Text style={SettingsStyles.infoValue}>{userInformation?.state || '-'}</Text>
                )}
              </View>
              <View style={SettingsStyles.infoItem}>
                <Text style={SettingsStyles.infoLabel}>Edad</Text>
                {editMode ? (
                  <TextInput
                    style={SettingsStyles.infoInput}
                    value={editAge}
                    onChangeText={setEditAge}
                    keyboardType="numeric"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                  />
                ) : (
                  <Text style={SettingsStyles.infoValue}>{userInformation?.age || '-'}</Text>
                )}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Info Save Toast */}
        {infoSaved && (
          <Animated.View style={{
            opacity: infoToastOpacity,
            backgroundColor: 'rgba(16,185,129,0.15)',
            borderWidth: 1,
            borderColor: 'rgba(16,185,129,0.30)',
            borderRadius: 12,
            paddingVertical: 10,
            paddingHorizontal: 16,
            marginTop: 8,
            marginHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            <FontAwesomeIcon icon={faCheck} size={14} color="#10B981" />
            <Text style={{ color: '#10B981', fontWeight: '600', fontSize: 14 }}>
              Informacion actualizada
            </Text>
          </Animated.View>
        )}

        {/* ── Elige tu Avatar ── */}
        <Animated.View style={[SettingsStyles.sectionCard, { opacity: avatarAnim.opacity, transform: avatarAnim.transform }]}>
          <View style={SettingsStyles.sectionHeader}>
            <Text style={SettingsStyles.sectionTitle}>Elige tu Avatar</Text>
          </View>

          <View style={SettingsStyles.avatarsGrid}>
            {AVATARS.map((avatar, idx) => {
              const isSelected = avatar.backendPath === selectedAvatar;
              return (
                <TouchableWithoutFeedback
                  key={avatar.id}
                  onPress={() => setSelectedAvatar(avatar.backendPath)}
                >
                  <Animated.View
                    style={[
                      SettingsStyles.avatarOption,
                      isSelected && SettingsStyles.avatarOptionSelected,
                    ]}
                  >
                    <Image source={avatar.source} style={SettingsStyles.avatarOptionImage} />
                    {isSelected && (
                      <View style={SettingsStyles.selectedCheck}>
                        <FontAwesomeIcon icon={faCheck} size={10} color="#fff" />
                      </View>
                    )}
                  </Animated.View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>

          <TouchableWithoutFeedback
            onPress={handleSaveAvatar}
            onPressIn={savePress.onPressIn}
            onPressOut={savePress.onPressOut}
            disabled={savingAvatar}
          >
            <Animated.View style={[SettingsStyles.saveAvatarButton, savingAvatar && { opacity: 0.6 }, { transform: [{ scale: savePress.scale }] }]}>
              <Text style={SettingsStyles.saveAvatarButtonText}>
                {savingAvatar ? 'Guardando...' : 'Guardar Avatar'}
              </Text>
            </Animated.View>
          </TouchableWithoutFeedback>

          {/* Success Toast */}
          {avatarSaved && (
            <Animated.View style={{
              opacity: toastOpacity,
              backgroundColor: 'rgba(16,185,129,0.15)',
              borderWidth: 1,
              borderColor: 'rgba(16,185,129,0.30)',
              borderRadius: 12,
              paddingVertical: 10,
              paddingHorizontal: 16,
              marginTop: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}>
              <FontAwesomeIcon icon={faCheck} size={14} color="#10B981" />
              <Text style={{ color: '#10B981', fontWeight: '600', fontSize: 14 }}>
                Avatar guardado exitosamente
              </Text>
            </Animated.View>
          )}
        </Animated.View>

        {/* ── Cuenta ── */}
        <Animated.View style={[SettingsStyles.sectionCard, { opacity: accountAnim.opacity, transform: accountAnim.transform }]}>
          <View style={SettingsStyles.sectionHeader}>
            <Text style={SettingsStyles.sectionTitle}>Cuenta</Text>
          </View>

          <TouchableOpacity style={SettingsStyles.settingItem} onPress={() => navigation.navigate('ReportProblem')}>
            <View style={SettingsStyles.settingInfo}>
              <View style={SettingsStyles.settingIconBox}>
                <FontAwesomeIcon icon={faClipboardList} size={18} color={darkTheme.purple} />
              </View>
              <View style={SettingsStyles.settingTextContainer}>
                <Text style={SettingsStyles.settingName}>Reportar un problema</Text>
                <Text style={SettingsStyles.settingDesc}>Ayudanos a mejorar</Text>
              </View>
            </View>
            <FontAwesomeIcon icon={faChevronRight} size={14} color="rgba(255,255,255,0.3)" />
          </TouchableOpacity>

          <TouchableWithoutFeedback
            onPress={handleLogout}
            onPressIn={logoutPress.onPressIn}
            onPressOut={logoutPress.onPressOut}
          >
            <Animated.View style={[SettingsStyles.logoutButton, { transform: [{ scale: logoutPress.scale }] }]}>
              <Text style={SettingsStyles.logoutButtonText}>Cerrar Sesion</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default Settings;
