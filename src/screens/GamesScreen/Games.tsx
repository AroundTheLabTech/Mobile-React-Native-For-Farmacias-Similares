import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  PixelRatio,
  Text,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import GamesStyles from './style/GamesStyles';
import Game1 from '../../../img/games/portada/game-1.png';
import Game2 from '../../../img/games/portada/game-2.png';
import Game3 from '../../../img/games/portada/game-3.png';
import Game4 from '../../../img/games/portada/game-4.png';
import Game5 from '../../../img/games/portada/game-5.png';
import Game6 from '../../../img/games/portada/game-6.png';
import Game7 from '../../../img/games/portada/game-7.png';
import Game8 from '../../../img/games/portada/game-8.png';
import Game9 from '../../../img/games/portada/game-9.png';
import Game10 from '../../../img/games/portada/game-10.png';
import Game11 from '../../../img/games/portada/game-11.png';
import Game12 from '../../../img/games/portada/game-12.png';
import Game13 from '../../../img/games/portada/game-13.png';
import Game14 from '../../../img/games/portada/game-14.png';
import Game15 from '../../../img/games/portada/game-15.png';
import Game16 from '../../../img/games/portada/game-16.png';
import Game17 from '../../../img/games/portada/game-17.png';
import Game18 from '../../../img/games/portada/game-18.png';
import { useAuth } from '../../AuthContext';
import { useUser } from '@services/UserContext';
import { getGamesCatalog } from '@services/backend';
import { calculateScreenSizeInInches } from '../../utils/helpers';
import Loader from '@components/LoaderComponent/Loader';
import { TGameCatalogItem } from 'src/types/game';
import { darkTheme } from '../../theme/colors';

// Local image fallback mapping — used when backend imageUrl is empty
const LOCAL_IMAGE_MAP: Record<string, any> = {
  juego1: Game1, juego2: Game2, juego3: Game3, juego4: Game4,
  juego5: Game5, juego6: Game6, juego7: Game7, juego8: Game8,
  juego9: Game9, juego10: Game10, juego11: Game11, juego12: Game12,
  juego13: Game13, juego14: Game14, juego15: Game15, juego16: Game16,
  juego17: Game17, juego18: Game18,
};

type GameId =
  | 'juego1' | 'juego2' | 'juego3' | 'juego4' | 'juego5' | 'juego6'
  | 'juego7' | 'juego8' | 'juego9' | 'juego10' | 'juego11' | 'juego12'
  | 'juego13' | 'juego14' | 'juego15' | 'juego16' | 'juego17' | 'juego18';

type Game = {
  id: GameId;
  title: string;
  imageUrl: any;
  gameUrl: string;
  score_given_per_game: number;
  description: string;
  score?: number;
};

function catalogToGame(item: TGameCatalogItem): Game {
  return {
    id: item.id as GameId,
    title: item.title,
    imageUrl: LOCAL_IMAGE_MAP[item.id] || null,
    gameUrl: item.gameUrl,
    score_given_per_game: item.scorePerGame,
    description: item.description,
  };
}

const HORIZONTAL_PADDING = 20;
const CARD_GAP = 10;

const Games = ({ navigation }) => {
  const { uid } = useAuth();
  const { scorePerGame, setUpdateScorePerGame } = useUser();
  const { width: screenWidth } = useWindowDimensions();

  const [listGames, setListGames] = useState<Game[] | null>(null);
  const [loading, setLoading] = useState(true);

  const sizeInInches = calculateScreenSizeInInches(Dimensions, PixelRatio);
  const isTablet = sizeInInches && Number(sizeInInches) > 9;
  const numColumns = isTablet ? 4 : 3;

  // Dynamic card width: (screenWidth - padding on both sides - gaps between cards) / numColumns
  const totalHorizontalPadding = HORIZONTAL_PADDING * 2;
  const totalGaps = CARD_GAP * (numColumns - 1);
  const cardWidth = Math.floor((screenWidth - totalHorizontalPadding - totalGaps) / numColumns);

  function orderGames(allGames: Game[]): Game[] {
    const forcedGames: GameId[] = ['juego7', 'juego9'];

    const ordered = [...allGames].sort((a, b) =>
      b.id.localeCompare(a.id, undefined, { numeric: true })
    );

    forcedGames.forEach((gameKey, i) => {
      const idx = ordered.findIndex(g => g.id === gameKey);
      if (idx !== -1) {
        const [item] = ordered.splice(idx, 1);
        ordered.splice(4 + i, 0, item);
      }
    });

    return ordered;
  }

  useEffect(() => {
    let mounted = true;

    async function fetchGames() {
      setLoading(true);

      // Fetch catalog from backend
      const catalog = await getGamesCatalog();
      let games: Game[];

      if (catalog && catalog.games && catalog.games.length > 0) {
        if (__DEV__) console.log(`DEBUG catalogToGame --->`, catalog.games);
        games = catalog.games.map(catalogToGame);
      } else {
        // Fallback: use local image map keys to build a minimal list
        games = Object.keys(LOCAL_IMAGE_MAP).map(key => ({
          id: key as GameId,
          title: key,
          imageUrl: LOCAL_IMAGE_MAP[key],
          gameUrl: '',
          score_given_per_game: 10,
          description: '',
        }));
      }

      // Attach user scores
      if (scorePerGame?.score_per_game) {
        games = games.map(game => ({
          ...game,
          score: scorePerGame.score_per_game[game.id] || 0,
        }));
      }

      if (mounted) {
        setListGames(orderGames(games));
        setLoading(false);
      }
    }

    if (!scorePerGame) {
      setUpdateScorePerGame(true);
    } else {
      setUpdateScorePerGame(false);
    }

    fetchGames();

    return () => { mounted = false; };
  }, [scorePerGame, setUpdateScorePerGame, uid]);

  const renderGameCard = useCallback(({ item: game, index }: { item: Game; index: number }) => {
    // Determine left margin: first item in each row gets 0, others get CARD_GAP
    const isFirstInRow = index % numColumns === 0;

    return (
      <TouchableOpacity
        key={game.id}
        style={[
          GamesStyles.gameCard,
          {
            width: cardWidth,
            marginLeft: isFirstInRow ? 0 : CARD_GAP,
          },
        ]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('GameDetails', game)}
      >
        <Image
          style={[GamesStyles.coverImage, { width: cardWidth, height: cardWidth }]}
          source={game.imageUrl}
          resizeMode="cover"
        />
        {game.score != null && game.score > 0 && (
          <View style={GamesStyles.scoreBadge}>
            <Text style={GamesStyles.scoreBadgeText}>{Math.round(game.score)} pts</Text>
          </View>
        )}
        {game.score != null && game.score === 0 && (
          <View style={GamesStyles.scoreBadgeNew}>
            <Text style={GamesStyles.scoreBadgeNewText}>Nuevo</Text>
          </View>
        )}
        <View style={GamesStyles.cardInfo}>
          <Text style={GamesStyles.gameTitle} numberOfLines={1}>{game.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }, [cardWidth, numColumns, navigation]);

  const ListHeader = useCallback(() => (
    <View style={GamesStyles.header}>
      <TouchableOpacity style={GamesStyles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesomeIcon icon={faArrowLeft} color={darkTheme.textPrimary} size={18} />
      </TouchableOpacity>
      <Text style={GamesStyles.headerTitle}>Juegos</Text>
    </View>
  ), [navigation]);

  if (loading || !listGames) {
    return (
      <View style={[GamesStyles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="light-content" backgroundColor={darkTheme.bg} />
        <Loader visible={true} />
      </View>
    );
  }

  return (
    <View style={GamesStyles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.bg} />
      <View style={GamesStyles.glowPurple} />
      <View style={GamesStyles.glowCyan} />
      <FlatList
        data={listGames}
        renderItem={renderGameCard}
        keyExtractor={(game) => game.id}
        numColumns={numColumns}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={GamesStyles.scrollContent}
        columnWrapperStyle={GamesStyles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Games;
