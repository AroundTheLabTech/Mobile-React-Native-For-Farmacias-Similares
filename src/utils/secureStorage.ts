import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_SERVICE = 'com.simijuegos.auth';
const TOKEN_USERNAME = 'userAccessToken';

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
 * Retrieve the auth token from secure storage.
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
 * Remove the auth token from secure storage.
 */
export async function clearSecureToken(): Promise<void> {
  try {
    await Keychain.resetGenericPassword({ service: TOKEN_SERVICE });
  } catch {
    // ignore
  }
  // Also clear legacy storage
  await AsyncStorage.removeItem('userAccessToken');
}
