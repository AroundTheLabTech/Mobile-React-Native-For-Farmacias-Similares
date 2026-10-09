import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import SettingsStyles from './style/SettingsStyles';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faPen,
  faCheck,
  faXmark,
  faChevronRight,
  faClipboardList,
} from '@fortawesome/free-solid-svg-icons';
import {TGameCard} from '../../types/user';
import {
  getGameCard,
  updateUserProfilePicture,
  putUserInformation,
} from '../../services/backend';
import {useAuth} from '../../AuthContext';
import {formarGameCardNumber, formatNumber} from '../../utils/helpers';
import {
  toEditForm,
  toUpdatePayload,
  payloadToUserPatch,
} from '../../utils/userInformationMappers';
import {useUser} from '@services/UserContext';
import {AVATARS, getAvatarSource} from '../../utils/avatars';
import Loader from '@components/LoaderComponent/Loader';
import GameCardChip from '@components/GameCardChip/GameCardChip';
import {darkTheme} from '../../theme/colors';
import {useFadeInUp, usePressScale} from '../../utils/animations';
import {getUserLevel} from '../../utils/levels';

const Settings = ({navigation}) => {
  const {uid, logout} = useAuth();
  const {
    profilePicture,
    setProfilePictureUrl,
    setUpdateProfilePicture,
    userPoints,
    setUpdateUserPoints,
    userInformation,
    setUpdateUserInformation,
    patchUserInformation,
    refreshUserInformation,
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
  const [savingInfo, setSavingInfo] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const infoToastOpacity = useRef(new Animated.Value(0)).current;
  const userPickedAvatarRef = useRef(false);

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
        if (__DEV__) {
          console.error('Error fetching game card:', error);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [uid]);

  // Sync selectedAvatar from profilePicture on initial load only (not while user is picking)
  useEffect(() => {
    if (profilePicture && !userPickedAvatarRef.current && !selectedAvatar) {
      setSelectedAvatar(profilePicture);
    }
  }, [profilePicture, selectedAvatar]);

  const applyEditFormFromUser = useCallback(() => {
    const form = toEditForm(userInformation);
    setEditName(form.name);
    setEditLocation(form.location);
    setEditAge(form.age);
  }, [userInformation]);

  const showInfoSavedToast = useCallback(() => {
    setInfoSaved(true);
    Animated.sequence([
      Animated.timing(infoToastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(infoToastOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setInfoSaved(false));
  }, [infoToastOpacity]);

  const startEdit = useCallback(() => {
    applyEditFormFromUser();
    setEditMode(true);
  }, [applyEditFormFromUser]);

  const cancelEdit = useCallback(() => {
    applyEditFormFromUser();
    setEditMode(false);
  }, [applyEditFormFromUser]);

  // Sync edit fields from userInformation when not editing
  useEffect(() => {
    if (userInformation && !editMode) {
      applyEditFormFromUser();
    }
  }, [userInformation, editMode, applyEditFormFromUser]);

  const handleSaveInfo = useCallback(async () => {
    if (!editName.trim() || !editLocation.trim() || !editAge.trim()) {
      Alert.alert('Campos incompletos', 'Completa nombre, ubicacion y edad.');
      return;
    }

    const age = Number(editAge);
    if (isNaN(age) || age <= 0 || age > 120) {
      Alert.alert('Edad invalida', 'Ingresa una edad valida entre 1 y 120.');
      return;
    }

    if (!uid) {
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      return;
    }

    const data = toUpdatePayload(editName, editLocation, editAge);

    setSavingInfo(true);
    try {
      await putUserInformation(uid, data);
      const patch = payloadToUserPatch(data);
      patchUserInformation(patch);
      const fresh = await refreshUserInformation();

      if (
        fresh?.name !== patch.name ||
        fresh?.state !== patch.state ||
        fresh?.age !== patch.age
      ) {
        patchUserInformation(patch);
      }

      setEditMode(false);
      showInfoSavedToast();
    } catch (error) {
      Alert.alert(
        'Error al guardar',
        error instanceof Error ? error.message : 'Intenta de nuevo.',
      );
    } finally {
      setSavingInfo(false);
    }
  }, [
    editName,
    editLocation,
    editAge,
    uid,
    patchUserInformation,
    refreshUserInformation,
    showInfoSavedToast,
  ]);

  async function handleSaveAvatar() {
    if (!selectedAvatar || savingAvatar) {
      return;
    }
    setSavingAvatar(true);
    try {
      const response = await updateUserProfilePicture(uid, selectedAvatar);
      if (!response) {
        Alert.alert('Error al guardar', 'No se pudo actualizar el avatar. Intenta de nuevo.');
        return;
      }
      setProfilePictureUrl(selectedAvatar);
      userPickedAvatarRef.current = false;
      setAvatarSaved(true);
      Animated.sequence([
        Animated.timing(toastOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setAvatarSaved(false));
    } catch (error) {
      Alert.alert(
        'Error al guardar',
        error instanceof Error ? error.message : 'Intenta de nuevo.',
      );
    } finally {
      setSavingAvatar(false);
    }
  }

  function handleLogout() {
    Alert.alert('Cerrar Sesion', '¿Estas seguro que quieres cerrar sesion?', [
      {text: 'Cancelar', style: 'cancel'},
      {
        text: 'Cerrar Sesion',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        },
      },
    ]);
  }

  if (loading) {
    return <Loader visible={true} />;
  }

  return (
    <View style={SettingsStyles.screen}>

      <ScrollView contentContainerStyle={SettingsStyles.scrollContent}>
        {/* ── Header ── */}
        <View style={SettingsStyles.header}>
          <TouchableOpacity
            style={SettingsStyles.headerBackButton}
            onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faArrowLeft} size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={SettingsStyles.headerTitle}>Configuracion</Text>
        </View>

        {/* ── Profile Hero ── */}
        <Animated.View
          style={[
            SettingsStyles.profileHero,
            {opacity: profileAnim.opacity, transform: profileAnim.transform},
          ]}>
          <View style={SettingsStyles.avatarContainer}>
            <Image
              source={getAvatarSource(selectedAvatar || profilePicture)}
              style={SettingsStyles.avatarImage}
            />
          </View>
          <Text style={SettingsStyles.userName}>
            {userInformation?.name || 'Jugador'}
          </Text>
          <Text style={SettingsStyles.userEmail}>
            {userInformation?.email || ''}
          </Text>
          <View style={SettingsStyles.levelBadge}>
            <Text style={{color: '#fff', fontSize: 12, fontWeight: '600'}}>
              Nivel {getUserLevel(userPoints?.score_total || 0).level}
            </Text>
          </View>
        </Animated.View>

        {/* ── Game Card ── */}
        <Animated.View
          style={[
            SettingsStyles.gameCardOuter,
            {opacity: cardAnim.opacity, transform: cardAnim.transform},
          ]}>
          <View style={SettingsStyles.gameCard}>
            <View>
              <Text style={SettingsStyles.gameCardLabel}>GAME CARD</Text>
              <View style={SettingsStyles.gameCardChipContainer}>
                <GameCardChip />
              </View>
            </View>
            <Text style={SettingsStyles.gameCardName}>
              {userInformation?.name || 'Jugador'}
            </Text>
            <View style={SettingsStyles.gameCardBottom}>
              <Text style={SettingsStyles.gameCardNumber}>
                {formarGameCardNumber(gameCard?.card_number) ||
                  '0000-0000-0000'}
              </Text>
              <View style={SettingsStyles.gameCardScoreContainer}>
                <Image
                  source={require('../../../img/iconos/moneda.png')}
                  style={SettingsStyles.coinIcon}
                />
                <Text style={SettingsStyles.gameCardScore}>
                  {userPoints?.score_total
                    ? formatNumber(userPoints.score_total)
                    : '0'}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ── Informacion Personal ── */}
        <Animated.View
          style={[
            SettingsStyles.sectionCard,
            {opacity: infoAnim.opacity, transform: infoAnim.transform},
          ]}>
          <View style={SettingsStyles.sectionHeader}>
            <Text style={SettingsStyles.sectionTitle}>
              Informacion Personal
            </Text>
            {!editMode ? (
              <TouchableOpacity
                style={SettingsStyles.iconButton}
                onPress={startEdit}>
                <FontAwesomeIcon
                  icon={faPen}
                  size={14}
                  color="rgba(255,255,255,0.7)"
                />
              </TouchableOpacity>
            ) : (
              <View style={SettingsStyles.editButtonsRow}>
                <TouchableOpacity
                  style={SettingsStyles.iconButton}
                  onPress={cancelEdit}
                  disabled={savingInfo}>
                  <FontAwesomeIcon icon={faXmark} size={16} color="#EF4444" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    SettingsStyles.iconButton,
                    savingInfo && {opacity: 0.5},
                  ]}
                  onPress={handleSaveInfo}
                  disabled={savingInfo}>
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
                  <Text style={SettingsStyles.infoValue}>
                    {userInformation?.name || '-'}
                  </Text>
                )}
              </View>
              <View style={SettingsStyles.infoItem}>
                <Text style={SettingsStyles.infoLabel}>Email</Text>
                <Text style={SettingsStyles.infoValue}>
                  {userInformation?.email || '-'}
                </Text>
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
                  <Text style={SettingsStyles.infoValue}>
                    {userInformation?.state || '-'}
                  </Text>
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
                  <Text style={SettingsStyles.infoValue}>
                    {userInformation?.age || '-'}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Info Save Toast */}
        {infoSaved && (
          <Animated.View
            style={{
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
            <Text style={{color: '#10B981', fontWeight: '600', fontSize: 14}}>
              Informacion actualizada
            </Text>
          </Animated.View>
        )}

        {/* ── Elige tu Avatar ── */}
        <Animated.View
          style={[
            SettingsStyles.sectionCard,
            {opacity: avatarAnim.opacity, transform: avatarAnim.transform},
          ]}>
          <View style={SettingsStyles.sectionHeader}>
            <Text style={SettingsStyles.sectionTitle}>Elige tu Avatar</Text>
          </View>

          <View style={SettingsStyles.avatarsGrid}>
            {AVATARS.map((avatar, _idx) => {
              const isSelected = avatar.backendPath === selectedAvatar;
              return (
                <TouchableWithoutFeedback
                  key={avatar.id}
                  onPress={() => {
                    userPickedAvatarRef.current = true;
                    setSelectedAvatar(avatar.backendPath);
                  }}>
                  <Animated.View
                    style={[
                      SettingsStyles.avatarOption,
                      isSelected && SettingsStyles.avatarOptionSelected,
                    ]}>
                    <Image
                      source={avatar.source}
                      style={SettingsStyles.avatarOptionImage}
                    />
                    {isSelected && (
                      <View style={SettingsStyles.selectedCheck}>
                        <FontAwesomeIcon
                          icon={faCheck}
                          size={10}
                          color="#fff"
                        />
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
            disabled={savingAvatar}>
            <Animated.View
              style={[
                SettingsStyles.saveAvatarButton,
                savingAvatar && {opacity: 0.6},
                {transform: [{scale: savePress.scale}]},
              ]}>
              <Text style={SettingsStyles.saveAvatarButtonText}>
                {savingAvatar ? 'Guardando...' : 'Guardar Avatar'}
              </Text>
            </Animated.View>
          </TouchableWithoutFeedback>

          {/* Success Toast */}
          {avatarSaved && (
            <Animated.View
              style={{
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
              <Text style={{color: '#10B981', fontWeight: '600', fontSize: 14}}>
                Avatar guardado exitosamente
              </Text>
            </Animated.View>
          )}
        </Animated.View>

        {/* ── Cuenta ── */}
        <Animated.View
          style={[
            SettingsStyles.sectionCard,
            {opacity: accountAnim.opacity, transform: accountAnim.transform},
          ]}>
          <View style={SettingsStyles.sectionHeader}>
            <Text style={SettingsStyles.sectionTitle}>Cuenta</Text>
          </View>

          <TouchableOpacity
            style={SettingsStyles.settingItem}
            onPress={() => navigation.navigate('ReportProblem')}>
            <View style={SettingsStyles.settingInfo}>
              <View style={SettingsStyles.settingIconBox}>
                <FontAwesomeIcon
                  icon={faClipboardList}
                  size={18}
                  color={darkTheme.purple}
                />
              </View>
              <View style={SettingsStyles.settingTextContainer}>
                <Text style={SettingsStyles.settingName}>
                  Reportar un problema
                </Text>
                <Text style={SettingsStyles.settingDesc}>
                  Ayudanos a mejorar
                </Text>
              </View>
            </View>
            <FontAwesomeIcon
              icon={faChevronRight}
              size={14}
              color="rgba(255,255,255,0.3)"
            />
          </TouchableOpacity>

          <TouchableWithoutFeedback
            onPress={handleLogout}
            onPressIn={logoutPress.onPressIn}
            onPressOut={logoutPress.onPressOut}>
            <Animated.View
              style={[
                SettingsStyles.logoutButton,
                {transform: [{scale: logoutPress.scale}]},
              ]}>
              <Text style={SettingsStyles.logoutButtonText}>Cerrar Sesion</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default Settings;
