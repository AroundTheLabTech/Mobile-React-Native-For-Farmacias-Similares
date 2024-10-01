import React, {useEffect} from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Image, TouchableOpacity} from 'react-native';

// Styles
import HomeStyles from './style/HomeStyle';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faUser, faChartBar, faGamepad } from '@fortawesome/free-solid-svg-icons'; // Importar los íconos

import { useAuth } from '../../AuthContext'; // Importa el hook useAuth


const HomeScreen = () => {
  // Obtener la variable del usuario
  const { uid,displayName } = useAuth();


  useEffect(() => {
    if (uid) {
      console.log("El UID del usuario es:", uid);
      console.log("El nombre de usuario es:", displayName);
    }
  }, [uid]);

  return (

    <ScrollView style={HomeStyles.containerScroll}>
        <View style={HomeStyles.container}>
          {/* Header Profile */}
          <View style={HomeStyles.containerHeaderProfile}>
            <View>
                <Text style={HomeStyles.textSaludo}>¡Hola!</Text>
                <Text style={HomeStyles.textUsuario}>{displayName || 'Usuario'}</Text>
            </View>
            <View>
                <Image
                  source={require('../../../img/profile/victorGonzales.png')}
                />
            </View>
          </View>

          {/* Juego Reciente */}

          <View style={HomeStyles.recienteContainer}>
            {/* Left Column */}
            <View style={HomeStyles.columnLeft}>
              <Text style={HomeStyles.nuevoJuego}>Nuevo juego disponible</Text>
              <View style={HomeStyles.containerTitleGameNew}>
                <Image
                  style ={HomeStyles.imageTitleGameNew}
                  source={require('../../../img/personajes/virus-1.png')}
                />
                <Text style={HomeStyles.titleJuego}>
                  DR.SIMI DEFENSE
                </Text>
              </View>
            </View>

            <View style={HomeStyles.columnRight}>
                <Image
                source={require('../../../img/iconos/play.png')}
                />
            </View>
          </View>

          {/* Referidos */}

          <View style={HomeStyles.containerReferidos}>
            <View style={HomeStyles.containerTitleReferidos}>
              <Text style={HomeStyles.titleReferidos}>
                REFERIDOS
              </Text>
              <Text style={HomeStyles.subtitleReferidos}>
                ¡Compite con tus amigos para lograr mayor puntaje!
              </Text>

              <TouchableOpacity style={HomeStyles.botonInvitar}>
                <Image
                source={require('../../../img/personajes/doctor-simi-invade.png')}
                />
                <Text style={HomeStyles.textoBoton}>Invitar</Text>
              </TouchableOpacity>
            </View>
          </View>

     
        </View>

             {/* Games */}
        <View style={HomeStyles.containerGamesSection}>
          <View style={HomeStyles.containerTitleGames}>
              <Text style={HomeStyles.titleSectionGames}>
                ¡Nuevos Juegos Disponibles!
              </Text>

              <Text>Ver Todos</Text>
          </View>
          {/* Game-1 */}
          <View style={HomeStyles.containerGame}>
                <Image
                  source={require('../../../img/games/mini-games/game-1.png')}
                  style = {HomeStyles.imageGameImg}
                  resizeMode='contain'
                />

              <View style={HomeStyles.titleGame}>
                <Text style={HomeStyles.gameTitle}>SimiInvade</Text>
                <Text>¡Defiende el Centro a toda costa!</Text>
              </View>

              <Image
                source={require('../../../img/iconos/arrow-right.png')}              
              />
          </View>
          {/* Game-2 */}
          <View style={HomeStyles.containerGame}>
                <Image
                  source={require('../../../img/games/mini-games/game-2.png')}
                  style = {HomeStyles.imageGameImg}
                  resizeMode='contain'
                />

              <View style={HomeStyles.titleGame}>
                <Text style={HomeStyles.gameTitle}>SimiRun</Text>
                <Text>¡Ayuda a Simi a recolectar todas las monedas!</Text>
              </View>

              <Image
                source={require('../../../img/iconos/arrow-right.png')}              
              />
          </View>
          {/* Game-4 */}
          <View style={HomeStyles.containerGame}>
                <Image
                  source={require('../../../img/games/mini-games/game-3.png')}
                  style = {HomeStyles.imageGameImg}
                  resizeMode='contain'
                />

              <View style={HomeStyles.titleGame}>
                <Text style={HomeStyles.gameTitle}>SimiSlash</Text>
                <Text>¡No dejes caer ninguna Rosca de Reyes!</Text>
              </View>

              <Image
                source={require('../../../img/iconos/arrow-right.png')}              
              />
          </View>
          {/* Game-5 */}
          <View style={HomeStyles.containerGame}>
                <Image
                  source={require('../../../img/games/mini-games/game-4.png')}
                  style = {HomeStyles.imageGameImg}
                  resizeMode='contain'
                />

              <View style={HomeStyles.titleGame}>
                <Text style={HomeStyles.gameTitle}>SimiFest</Text>
                <Text>¡Se parte de simiFest! Proximamente</Text>
              </View>

              <Image
                source={require('../../../img/iconos/arrow-right.png')}              
              />
          </View>

          
        </View>

        
    </ScrollView>
   
  );
};

const styles = StyleSheet.create({


});

export default HomeScreen;
