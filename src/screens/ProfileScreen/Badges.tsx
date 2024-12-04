import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { trophyImages } from '../HomeScreen/imageMapping';

// Styles
import BadgesStyle from './style/BadgesStyle';

import { useAuth } from '../../AuthContext'; // Importa el hook useAuth
import { getUserBadges } from '@services/backend';


const Badges = () => {

  const { uid } = useAuth();

  // Añadir estado para controlar la vista seleccionada
  const [trophies, setTrophies] = useState<string[]>([]);


  // Efecto para cargar los trofeos del usuario al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      if (uid) {
        const userBadges = await getUserBadges(uid);
        setTrophies(userBadges.badges); // Guardar los trofeos en el estado
      }
    };

    fetchData();
  }, [uid]);

  const getRowsOfTrophies = () => {
    const rows = [];
    for (let i = 0; i < trophies.length; i += 3) {
      rows.push(trophies.slice(i, i + 3));
    }
    return rows;
  };

  return (
    <View style={BadgesStyle.containerInsignias}>
      {getRowsOfTrophies().map((row, rowIndex) => (
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
      ))}
    </View>
  );
};

export default Badges;
