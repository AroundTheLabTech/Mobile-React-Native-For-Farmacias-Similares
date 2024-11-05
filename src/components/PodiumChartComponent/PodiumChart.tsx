import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Svg, { Rect, Polygon, Text, Defs, LinearGradient, Stop } from 'react-native-svg';

import { fontSizes } from '../../../global-class';
import { formatNumber } from '../../utils/helpers';

const CenteredTextWithBackground = ({ text, rectWidth, rectHeight, fillColor = 'white', positionX = 10, positionY = 10, textColor = 'black', fontWeight = '400' }) => {
  return (
    <Svg height={rectHeight + 20} width={rectWidth + 20}>
      {/* Rectángulo con bordes redondeados */}
      <Rect
        x={positionX} // Ajustar para que el rectángulo esté centrado
        y={positionY} // Ajustar para que el rectángulo esté centrado
        width={rectWidth}
        height={rectHeight}
        rx="10" // Radio de los bordes redondeados
        fill={fillColor} // Color de fondo
      />
      {/* Texto centrado */}
      <Text
        x={positionX + rectWidth / 2} // Centro horizontalmente
        y={positionY + rectHeight / 2 + 2} // Centro verticalmente y ajustar un poco hacia abajo
        fontSize={fontSizes.xs}
        fill={textColor}
        textAnchor="middle" // Centrar horizontalmente
        alignmentBaseline="middle" // Centrar verticalmente
        fontWeight={fontWeight}
      >
        {text}
      </Text>
    </Svg>
  );
};

const PodiumChart = () => {

  const top3Data = [
    {
      "name": "Alena Donin",
      "profilePicture": "https://via.placeholder.com/50",
      "countriFlag": "https://via.placeholder.com/20",
      "points": 1469,
    },
    {
      "name": "vicglezh",
      "profilePicture": "https://via.placeholder.com/50",
      "countriFlag": "https://via.placeholder.com/20",
      "points": 2569,
    },
    {
      "name": "Craig Gouse",
      "profilePicture": "https://via.placeholder.com/50",
      "countriFlag": "https://via.placeholder.com/20",
      "points": 569,
    }
  ]

  return (
    <View style={{ alignItems: 'center', marginTop: 50 }}>
      <Svg height="350" width="80%">
        {/* Segundo Lugar */}
        {/* Cara principal */}
        <Rect x="0" y="180" width="110" height="170" fill="#9087E5" />
        {/* Cara superior para efecto 3D */}
        <Polygon points="0,180 110,180 110,165 20,165" fill="#AEA7EC" />
        {/* Texto para Segundo Lugar */}
        <Text
          x="60"
          y="265"
          fill="white"
          fontSize={fontSizes.span}
          fontWeight="800"
          textAnchor="middle"
        >
          2
        </Text>

        {/* Primer Lugar */}
        {/* Degradado */}
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="10%" stopColor="#9087E5" stopOpacity="1" />
            <Stop offset="100%" stopColor="#CDC9F3" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        {/* Cara principal */}
        <Rect x="110" y="150" width="110" height="200" fill="url(#grad1)" />
        {/* Cara superior para efecto 3D */}
        <Polygon points="110,150 220,150 205,130 125,130" fill="#CDC9F3" />
        {/* Texto para Primer Lugar */}
        <Text
          x="160"
          y="235"
          fill="white"
          fontSize={fontSizes.span}
          fontWeight="1000"
          textAnchor="middle"
        >
          1
        </Text>

        {/* Tercer Lugar */}
        {/* Cara principal */}
        <Rect x="220" y="200" width="110" height="160" fill="#9087E5" />
        {/* Cara superior para efecto 3D */}
        <Polygon points="220,200 330,200 310,180 220,180" fill="#AEA7EC" />
        {/* Texto para Tercer Lugar */}
        <Text
          x="270"
          y="285"
          fill="white"
          fontSize={fontSizes.span}
          fontWeight="700"
          textAnchor="middle"
        >
          3
        </Text>


        {/* Segundo Lugar */}
        <View style={{ position: 'absolute', top: 30, left: -15, alignItems: 'center' }}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
          <Image
            source={{ uri: 'https://via.placeholder.com/20' }}
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              position: 'absolute',
              top: 35,
              right: 35,
            }}
          />
          <CenteredTextWithBackground
            text={top3Data[1].name}
            rectWidth={110}
            rectHeight={25}
            fillColor={"none"}
            textColor='white'
            positionY={90} // posición Y del rectángulo
            positionX={0} // posición X (centro del componente)
            fontWeight='700'
          />
          {/* Rectángulo con bordes redondeados */}
          <CenteredTextWithBackground text={`${top3Data[1].points} QP`} rectWidth={75} rectHeight={25} fillColor={"#9087E5"} textColor='white' positionY={125} positionX={15} fontWeight='700' />
        </View>

        {/* Primer Lugar */}
        <View style={{ position: 'absolute', top: 0, left: 110, alignItems: 'center' }}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }}
            style={{ width: 50, height: 50, borderRadius: 25, left: -20 }}
          />
          <Image
            source={{ uri: 'https://via.placeholder.com/20' }}
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              position: 'absolute',
              top: 35,
              left: 55,
            }}
          />
          <CenteredTextWithBackground
            text={top3Data[0].name}
            rectWidth={110}
            rectHeight={25}
            fillColor={"none"}
            textColor='white'
            positionY={60} // posición Y del rectángulo
            positionX={110} // posición X (centro del componente)
            fontWeight='700'
          />
          {/* Rectángulo con bordes redondeados */}
          <CenteredTextWithBackground text={`${top3Data[0].points} QP`} rectWidth={75} rectHeight={25} fillColor={"#9087E5"} textColor='white' positionY={90} positionX={125} fontWeight='700' />
        </View>

        {/* Tercer Lugar */}
        <View style={{ position: 'absolute', top: 45, left: 215, alignItems: 'center'}}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
          <Image
            source={{ uri: 'https://via.placeholder.com/20' }}
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              position: 'absolute',
              top: 35,
              right: 35,
            }}
          />
          <CenteredTextWithBackground
            text={top3Data[2].name}
            rectWidth={110}
            rectHeight={25}
            fillColor={"none"}
            textColor='white'
            positionY={105} // posición Y del rectángulo
            positionX={220} // posición X (centro del componente)
            fontWeight='700'
          />
          {/* Rectángulo con bordes redondeados */}
          <CenteredTextWithBackground text={`${top3Data[2].points} QP`} rectWidth={75} rectHeight={25} fillColor={"#9087E5"} textColor='white' positionY={140} positionX={235} />
        </View>


      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  qpContainer: {
    backgroundColor: '#9087E5', // Fondo del contenedor
    borderRadius: 10, // Borde redondeado
    paddingVertical: 5, // Espaciado vertical
    paddingHorizontal: 10, // Espaciado horizontal
    marginTop: 5, // Margen superior
  },
  qpText: {
    color: 'white', // Color del texto
    fontSize: fontSizes.xs,
    fontWeight: '700',
    textAlign: 'center', // Centrar el texto
  },
});

export default PodiumChart;
