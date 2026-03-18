import { ImageSourcePropType } from 'react-native';

export interface AvatarOption {
  id: string;
  title: string;
  source: ImageSourcePropType;
  /** Backend-compatible path for saving selection */
  backendPath: string;
}

/**
 * Local avatar mapping. Images bundled in img/avatars/.
 * backendPath matches the relative URL the backend stores in Firestore.
 */
export const AVATARS: AvatarOption[] = [
  { id: 'img1', title: 'Avatar 1', source: require('../../img/avatars/img1.png'), backendPath: '/img/perfil/img1.png' },
  { id: 'img2', title: 'Avatar 2', source: require('../../img/avatars/img2.png'), backendPath: '/img/perfil/img2.png' },
  { id: 'img3', title: 'Avatar 3', source: require('../../img/avatars/img3.png'), backendPath: '/img/perfil/img3.png' },
  { id: 'img4', title: 'Avatar 4', source: require('../../img/avatars/img4.png'), backendPath: '/img/perfil/img4.png' },
  { id: 'img5', title: 'Avatar 5', source: require('../../img/avatars/img5.png'), backendPath: '/img/perfil/img5.png' },
  { id: 'img6', title: 'Avatar 6', source: require('../../img/avatars/img6.png'), backendPath: '/img/perfil/img6.png' },
  { id: 'img7', title: 'Avatar 7', source: require('../../img/avatars/img7.png'), backendPath: '/img/perfil/img7.png' },
  { id: 'img8', title: 'Avatar 8', source: require('../../img/avatars/img8.png'), backendPath: '/img/perfil/img8.png' },
  { id: 'img9', title: 'Avatar 9', source: require('../../img/avatars/img9.png'), backendPath: '/img/perfil/img9.png' },
];

export const DEFAULT_AVATAR = require('../../img/avatars/default.png');

/**
 * Find the local avatar source for a backend path.
 * Falls back to DEFAULT_AVATAR if no match.
 */
export function getAvatarSource(backendPath: string | null | undefined): ImageSourcePropType {
  if (!backendPath || backendPath === 'null' || backendPath === 'undefined') return DEFAULT_AVATAR;
  const match = AVATARS.find(a => a.backendPath === backendPath);
  return match?.source ?? DEFAULT_AVATAR;
}
