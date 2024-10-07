import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ProfileStyles from './style/ProfileStyle';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faStar, faGlobe, faCube } from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '../../AuthContext'; // Importa el hook useAuth

const ProfileScreen = () => {

  // Usar Las Variables de Contexto
  const { uid,displayName } = useAuth();

  // Añadir estado para controlar la vista seleccionada
  const [selectedView, setSelectedView] = useState('insignias'); // 'insignias' o 'estadisticas'


  return (

      <ScrollView style={ProfileStyles.containerMax} contentContainerStyle={ProfileStyles.container}>
  
      {/* Header Profile */}
      <View style={ProfileStyles.headerProfile}>
        <Image
          source={require('../../../img/iconos/config.png')}
        />
      </View>
      
      {/* Foto de Perfil  */}
      <View style={ProfileStyles.profileImageContainer}>
        <Image
          resizeMode='contain'
          style ={ProfileStyles.imageProfile}
          source={require('../../../img/profile/victorGonzales.png')}
        />
      </View>

      {/* View Dashboard */}
      <View style={ProfileStyles.containerDashboard}>
        <Text style={ProfileStyles.TextProfile}>{displayName || 'Usuario'}</Text>

        {/* Puntuacion Global */}
        <View style={ProfileStyles.ContainerPuntaje}>
          {/* Puntos */}
          <View style={ProfileStyles.puntajeBox}>
            {/* Icono */}
            <View style={ProfileStyles.containerIcono}>
            <FontAwesomeIcon icon={faStar} size={20} color="#fff" />
            </View>
            {/* Title */}
            <Text style={ProfileStyles.titlePuntaje}>
              Puntos
            </Text>
            {/* Puntos */}
            <Text style={ProfileStyles.puntajeNumber}>
              590
            </Text>
          </View>    
          
          {/* Top Mundial */}
          <View style={ProfileStyles.puntajeBox}>
            {/* Icono */}
            <View style={ProfileStyles.containerIcono}>
            <FontAwesomeIcon icon={faGlobe} size={20} color="#fff" />
            </View>
            {/* Title */}
            <Text style={ProfileStyles.titlePuntaje}>
              Top Mundial
            </Text>
            {/* Puntos */}
            <Text style={ProfileStyles.puntajeNumber}>
              #1,438
            </Text>
          </View>  

          {/* Top Local */}
          <View style={ProfileStyles.puntajeBox2}>
            {/* Icono */}
            <View style={ProfileStyles.containerIcono}>
            <FontAwesomeIcon icon={faCube} size={20} color="#fff" />
            </View>
            {/* Title */}
            <Text style={ProfileStyles.titlePuntaje}>
              Top Local
            </Text>
            {/* Puntos */}
            <Text style={ProfileStyles.puntajeNumber}>
              #56
            </Text>
          </View>  
        </View>
        
        {/* Insignias  */}

        <View style={ProfileStyles.containerPuntaje}>
          {/* NavBar */}
          <View style={ProfileStyles.containerNavBar}>
            {/* Botones para cambiar la vista */}
            <TouchableOpacity onPress={() => setSelectedView('insignias')}>
              <Text>Insignias</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedView('estadisticas')}>
              <Text>Estadísticas</Text>
            </TouchableOpacity>
            <Text>Detalles</Text>
          </View>

          {/* Insignias */}

          {/* Mostrar contenedores basados en la vista seleccionada */}
          {selectedView === 'insignias' ? (
            <View style={ProfileStyles.containerInsignias}>

              {/* Row Insignias */}
              <View style={ProfileStyles.rowInsignias}>
                <View style={ProfileStyles.containerImage}>
                  <Image source={require('../../../img/medallas/medal1.png')} resizeMode="contain" style={ProfileStyles.medalStyle} />
                </View>
                <View style={ProfileStyles.containerImage}>
                  <Image source={require('../../../img/medallas/medal2.png')} resizeMode="contain" style={ProfileStyles.medalStyle} />
                </View>
                <View style={ProfileStyles.containerImage}>
                  <Image source={require('../../../img/medallas/medal3.png')} resizeMode="contain" style={ProfileStyles.medalStyle} />
                </View>
              </View>

              {/* Row Insignias */}
              <View style={ProfileStyles.rowInsignias}>
                <View style={ProfileStyles.containerImage}>
                  <Image source={require('../../../img/medallas/medal4.png')} resizeMode="contain" style={ProfileStyles.medalStyle} />
                </View>
                <View style={ProfileStyles.containerImage}>
                  <Image source={require('../../../img/medallas/medal5.png')} resizeMode="contain" style={ProfileStyles.medalStyle} />
                </View>
                <View style={ProfileStyles.containerImage}>
                  <Image source={require('../../../img/medallas/medal6.png')} resizeMode="contain" style={ProfileStyles.medalStyle} />
                </View>
              </View>

              {/* Row Insignias */}
              <View style={ProfileStyles.rowInsignias}>
                <View style={ProfileStyles.containerImage}>
                  <Image source={require('../../../img/medallas/medal7.png')} resizeMode="contain" style={ProfileStyles.medalStyle} />
                </View>
                <View style={ProfileStyles.containerImage}>
                  <Image source={require('../../../img/medallas/medal8.png')} resizeMode="contain" style={ProfileStyles.medalStyle} />
                </View>
                <View style={ProfileStyles.containerImage}>
                  <Image source={require('../../../img/medallas/medal9.png')} resizeMode="contain" style={ProfileStyles.medalStyle} />
                </View>
              </View>


            </View>
          ) : (
            <View style={ProfileStyles.containerEstadistics}>
              <Text style={ProfileStyles.titleTotalGames}>
                HAZ JUGADO UN TOTAL DE 6 JUEGOS EN EL MES
              </Text>

              <View style={ProfileStyles.rowStadistics}> 
                {/* Box */}
                <View style={ProfileStyles.containerBoxStadistics}>
                    <View style={ProfileStyles.containerUpNumber}>
                        <Text style={ProfileStyles.titleNumber}>
                          5
                        </Text>
                        <Image 
                          source={require('../../../img/iconos/pastilla.png')} resizeMode="contain"
                        />
                    </View>

                    <View>
                      <Text style={ProfileStyles.textBox}>Mejor Juego</Text>
                    </View>
                </View>

                {/* Box                 */}
                <View style={ProfileStyles.containerBoxStadistics}>
                    <View style={ProfileStyles.containerUpNumber}>
                        <Text style={ProfileStyles.titleNumber}>
                          21
                        </Text>
                     
                    </View>

                    <View>
                      <Text style={ProfileStyles.textBox}>Mejor Partida</Text>
                    </View>
                </View>  
              
              </View>

            </View>
          )}
        </View>

        
        
      </View>

      {/* Stadistics */}


    </ScrollView>
  );
};

const styles = StyleSheet.create({


});

export default ProfileScreen;
