import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import { trophyImages } from '../HomeScreen/imageMapping';

// Styles
import BadgesStyle from './style/BadgesStyle';

import { useAuth } from '../../AuthContext'; // Importa el hook useAuth
import { getUserBadges } from '@services/backend';


const Badges = () => {

  const { uid } = useAuth();

  // Añadir estado para controlar la vista seleccionada
  const [trophies, setTrophies] = useState<any[]>([]);

  // Efecto para cargar los trofeos del usuario al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      if (uid) {
        const userBadges = await getUserBadges(uid);
        if (userBadges && userBadges?.badges) {

          const rows = [];
          if (userBadges?.badges) {
            for (let i = 0; i < userBadges.badges.length; i += 3) {
              rows.push(userBadges.badges.slice(i, i + 3));
            }

            setTrophies(rows);
          }
        }
      }
    };

    fetchData();
  }, [uid]);

  return (
    <View style={BadgesStyle.containerInsignias}>
      {trophies && trophies.length > 0 ?
        trophies.map((row, rowIndex) => (
          <View key={rowIndex} style={BadgesStyle.rowInsignias}>
            {row.map((trophy, index) => (
              <View key={index} style={BadgesStyle.containerImage}>
                {trophyImages[trophy] && (
                  <Image
                    source={trophyImages[trophy]} // Usar el mapa de imágenes
                    resizeMode="contain"
                    style={BadgesStyle.medalStyle}
                  />
                )}
              </View>
            ))}
          </View>
        )) :
        <View style={BadgesStyle.notFoundContainer} >
          <Text style={BadgesStyle.notFoundText} >No hay insignias aun</Text>
        </View>
      }
    </View>
  );
};

export default Badges;
