import { StyleSheet } from 'react-native';
import { colors, fontSizes, spacing, fonts } from '../../../../global-class'; // Importa las variables globales

const RingChartStyle = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ring: {
    borderRadius: 75, // Cambia esto según tu tamaño
    position: 'absolute',
    top: 0,
    left: 0,
    // Puedes agregar más estilos para el efecto de anillo
  },
  center: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

export default RingChartStyle;
