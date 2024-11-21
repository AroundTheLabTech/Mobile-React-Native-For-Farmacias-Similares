import RNFS from 'react-native-fs';

const fileName = 'profilePicture.jpg';
const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

export async function saveProfileImage(imageUrl) {
  try {
    await RNFS.downloadFile({
      fromUrl: imageUrl,
      toFile: filePath,
    }).promise;

    return filePath;
  } catch (error) {
    console.error('Error al guardar la imagen:', error);
    throw error;
  }
}

export async function getProfileImage() {
  try {
    return filePath;
  } catch (error) {
    console.error('Error al obtener la imagen:', error);
  }
}
