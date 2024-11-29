import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, Text, Image, Dimensions, Alert } from 'react-native';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import GameDetailsStyles from './style/GameDetailsStyles';


const GameDetails = ({ navigation, route }) => {

  const { title, description, imageUrl } = route.params;

  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    // Escucha los cambios en el tamaño de la pantalla
    const subscription = Dimensions.addEventListener('change', updateOrientation);

    // Llama a la función de actualización al inicio
    updateOrientation();

    // Limpia el evento cuando el componente se desmonte
    return () => {
      subscription?.remove();
    };
  }, []);

  const handleGoToGame = () => {

    if (orientation === 'portrait') {
      Alert.alert('Por favor gira la pantalla');
    } else {
      navigation.navigate('GameIframe', route.params );
    }
  };

  return (
    <ScrollView
      style={GameDetailsStyles.container}
      contentContainerStyle={GameDetailsStyles.containerMax}
    >
      <View style={GameDetailsStyles.containerGameDetails} >
        <TouchableOpacity style={GameDetailsStyles.containerGoBack} onPress={() => navigation.goBack()} >
          <FontAwesomeIcon icon={faArrowLeft} color="white" />
        </TouchableOpacity>
        <View style={GameDetailsStyles.containerCoverImage} >
          <Image style={GameDetailsStyles.coverImage} source={imageUrl} />
        </View>
        <View style={GameDetailsStyles.containerGameInformation} >
          <Text style={GameDetailsStyles.gameTile} >{title}</Text>
          <View style={GameDetailsStyles.containerCurrentGameDetails} >
            <View style={GameDetailsStyles.currentGameDetails} >
              <Text style={GameDetailsStyles.currentGameText} >.</Text>
              <View style={GameDetailsStyles.line} />
              <Text style={GameDetailsStyles.currentGameText} >+100 puntos</Text>
            </View>
          </View>
          <Text style={GameDetailsStyles.gameDescription} >{description}</Text>
          <TouchableOpacity style={GameDetailsStyles.playGameButton} onPress={() => handleGoToGame()} >
            <Text style={GameDetailsStyles.playGameButtonText} >Jugar solo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default GameDetails;
