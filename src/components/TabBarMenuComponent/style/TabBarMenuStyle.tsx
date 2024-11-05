import { StyleSheet } from 'react-native';
import { colors } from '../../../../global-class'; // Importa las variables globales

const TabBarMenuStyle = StyleSheet.create({
  //Profile Image 
  containerMax: {
    flex: 1,
    backgroundColor: colors.background2,
  },
  container: {
    backgroundColor: colors.background2,
    alignItems: 'center',
  },
  containerNavBar: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});

export default TabBarMenuStyle;
