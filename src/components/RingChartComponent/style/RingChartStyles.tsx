import { StyleSheet } from 'react-native';

const RingChartStyle = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
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
