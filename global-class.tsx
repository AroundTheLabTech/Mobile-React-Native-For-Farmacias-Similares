import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

// Function to calculate responsive numbers based on width and height
const responsiveWidth = (value: number) => {
  const baseWidth = 375; // Ancho base
  return (value / baseWidth) * width;
};

const responsiveHeight = (value: number) => {
  const baseHeight = 812; // Altura base (puedes ajustar esto según tus necesidades)
  return (value / baseHeight) * height;
};

export const colors = {
  primary: '#fff', //Blanco
  secondary: '#000', // Negro
  third: '#6A5AE0',  //Azul
  fourd: '#f8FBE9',
  success400: '#59AC6B',
  bad: '#FF5959',
  button1: '#76777E',
  button2: '#601B4D',
  background1: '#000',
  background2: '#6A5AE0',
  background3: '#fff',
};

// Tamaños de fuente basados en la altura de la pantalla
export const fontSizes = {
  xs: responsiveHeight(12), // 1.5% de la altura de la pantalla
  sm: responsiveHeight(14), // 1.75% de la altura
  md: responsiveHeight(16), // 2% de la altura
  lg: responsiveHeight(18), // 2.25% de la altura
  xl: responsiveHeight(20), // 2.5% de la altura
  xxl: responsiveHeight(24), // 3% de la altura
  mxxl: responsiveHeight(32), // 4% de la altura
  sxxl: responsiveHeight(40), // 5% de la altura
  xxxl: responsiveHeight(48), // 6% de la altura
  xxxxl: responsiveHeight(64), // 8% de la altura
  span: responsiveHeight(80), // 10% de la altura
};

// Espaciados basados en el ancho de la pantalla
export const spacing = {
  xs: responsiveWidth(5), // 1% del ancho
  sm: responsiveWidth(10), // 2% del ancho
  md: responsiveWidth(20), // 4% del ancho
  lg: responsiveWidth(30), // 6% del ancho
  xl: responsiveWidth(40), // 8% del ancho
  xxl: responsiveWidth(50), // 10% del ancho
  sxxl: responsiveWidth(60), // 12% del ancho
  xxxl: responsiveWidth(75), // 15% del ancho
  xxxxl: responsiveWidth(100), // 20% del ancho
};

// Font Families, incluyendo la fuente PressStart2P-Regular
export const fonts = {
  press: 'PressStart2P-Regular', // Fuente personalizada PressStart2P
  bold: 'Inter-Bold', 
  rubik: 'Rubik-VariableFont_wght', 

};
