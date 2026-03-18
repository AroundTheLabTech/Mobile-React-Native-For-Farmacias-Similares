import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Text, Animated } from 'react-native';
import { trophyImages } from '../HomeScreen/imageMapping';

// Styles
import BadgesStyle from './style/BadgesStyle';

import { useAuth } from '../../AuthContext';
import { getUserBadges } from '@services/backend';
import { useBounceIn } from '../../utils/animations';

/** Animated badge item with bounce-in */
const BadgeItem = ({ trophy, index }: { trophy: string; index: number }) => {
  const anim = useBounceIn(index * 100);
  return (
    <Animated.View style={[BadgesStyle.containerImage, { opacity: anim.opacity, transform: anim.transform }]}>
      {trophyImages[trophy] && (
        <Image
          source={trophyImages[trophy]}
          resizeMode="contain"
          style={BadgesStyle.medalStyle}
        />
      )}
      <Text style={BadgesStyle.badgeName}>
        {BADGE_NAMES[trophy] || trophy}
      </Text>
    </Animated.View>
  );
};

const BADGE_NAMES: Record<string, string> = {
  medal1: 'Primera Sesion',
  medal2: '3 Dias Seguidos',
  medal3: 'Competidor',
  medal4: '10 Partidas',
  medal5: 'Top 10',
  medal6: '100 Partidas',
  medal7: 'Maestro',
  medal8: 'Leyenda',
  medal9: 'Campeon',
};

const Badges = () => {
  const { uid } = useAuth();
  const [trophies, setTrophies] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (uid) {
        const userBadges = await getUserBadges(uid);
        if (userBadges && userBadges?.badges) {
          const rows = [];
          for (let i = 0; i < userBadges.badges.length; i += 3) {
            rows.push(userBadges.badges.slice(i, i + 3));
          }
          setTrophies(rows);
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
              <BadgeItem key={`${rowIndex}-${index}`} trophy={trophy} index={rowIndex * 3 + index} />
            ))}
          </View>
        )) :
        <View style={BadgesStyle.notFoundContainer}>
          <Text style={BadgesStyle.notFoundText}>¡Sigue jugando para ganar insignias!</Text>
        </View>
      }
    </View>
  );
};

export default Badges;
