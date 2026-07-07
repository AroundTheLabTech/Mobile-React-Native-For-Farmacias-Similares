import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_SERVICE = 'com.simijuegos.auth';
const REFRESH_TOKEN_SERVICE = 'com.simijuegos.auth.refresh';
const TOKEN_USERNAME = 'userAccessToken';
const REFRESH_TOKEN_USERNAME = 'userRefreshToken';

/**
 * Store the auth token securely using the device keychain.
 * Falls back to AsyncStorage if Keychain is unavailable.
 */
export async function setSecureToken(token: string): Promise<void> {
  try {
    await Keychain.setGenericPassword(TOKEN_USERNAME, token, { service: TOKEN_SERVICE });
  } catch {
    if (__DEV__) console.warn('[SecureStorage] Keychain unavailable, falling back to AsyncStorage');
    await AsyncStorage.setItem('userAccessToken', token);
  }
}

/**
 * Store the refresh token securely using the device keychain.
 * Falls back to AsyncStorage if Keychain is unavailable.
 */
export async function setSecureRefreshToken(token: string): Promise<void> {
  try {
    await Keychain.setGenericPassword(REFRESH_TOKEN_USERNAME, token, { service: REFRESH_TOKEN_SERVICE });
  } catch {
    if (__DEV__) console.warn('[SecureStorage] Keychain unavailable, falling back to AsyncStorage');
    await AsyncStorage.setItem(REFRESH_TOKEN_USERNAME, token);
  }
}

/**
 * Retrieve the refresh token from secure storage.
 */
export async function getSecureToken(): Promise<string | null> {
  try {
    const credentials = await Keychain.getGenericPassword({ service: TOKEN_SERVICE });
    if (credentials && credentials.password) {
      return credentials.password;
    }
    // Fallback: check AsyncStorage for tokens stored before migration
    const legacyToken = await AsyncStorage.getItem('userAccessToken');
    if (legacyToken) {
      // Migrate to secure storage
      await setSecureToken(legacyToken);
      await AsyncStorage.removeItem('userAccessToken');
      return legacyToken;
    }
    return null;
  } catch {
    // Fallback to AsyncStorage
    return AsyncStorage.getItem('userAccessToken');
  }
}

/**
 * Retrieve the refresh token from secure storage.
 */
export async function getSecureRefreshToken(): Promise<string | null> {
  try {
    const credentials = await Keychain.getGenericPassword({ service: REFRESH_TOKEN_SERVICE });
    if (credentials && credentials.password) {
      return credentials.password;
    }
    // Fallback: check AsyncStorage for tokens stored before migration
    const legacyToken = await AsyncStorage.getItem(REFRESH_TOKEN_USERNAME);
    if (legacyToken) {
      // Migrate to secure storage
      await setSecureRefreshToken(legacyToken);
      await AsyncStorage.removeItem(REFRESH_TOKEN_USERNAME);
      return legacyToken;
    }
    return null;
  } catch {
    // Fallback to AsyncStorage
    return AsyncStorage.getItem(REFRESH_TOKEN_USERNAME);
  }
}

/**
 * Remove the auth token from secure storage.
 */
export async function clearSecureToken(): Promise<void> {
  try {
    await Keychain.resetGenericPassword({ service: TOKEN_SERVICE });
  } catch {
    // ignore
  }
  try {
    await Keychain.resetGenericPassword({ service: REFRESH_TOKEN_SERVICE });
  } catch {
    // ignore
  }
  // Also clear legacy storage
  await AsyncStorage.removeItem('userAccessToken');
  await AsyncStorage.removeItem(REFRESH_TOKEN_USERNAME);
}