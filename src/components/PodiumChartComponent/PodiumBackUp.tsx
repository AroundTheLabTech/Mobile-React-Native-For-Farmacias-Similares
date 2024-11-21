import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Polygon, Text, Defs, LinearGradient, Stop } from 'react-native-svg';

import { fontSizes } from '../../../global-class';
import { formatNumber } from '../../utils/helpers';

const { width: screenWidth , height: screenHeight} = Dimensions.get('window'); // Ancho de la pantalla

const CenteredTextWithBackground = ({ text, rectWidth, screenHeight, fillColor = 'white', positionX = 10, positionY = 10, textColor = 'black', fontWeight = '400' }) => {
  return (
    <Svg height={screenHeight + 20} width={rectWidth + 20}>
      <Rect
        x={positionX}
        y={positionY}
        width={rectWidth}
        height={screenHeight}
        rx="10"
        fill={fillColor}
      />
      <Text
        x={positionX + rectWidth / 2}
        y={positionY + screenHeight / 2 + 2}
        fontSize={fontSizes.xs}
        fill={textColor}
        textAnchor="middle"
        alignmentBaseline="middle"
        fontWeight={fontWeight}
      >
        {text}
      </Text>
    </Svg>
  );
};

const PodiumChart = () => {
  const svgWidth = screenWidth * 0.8; // SVG ajusta al 80% del ancho de la pantalla
  console.log(screenWidth);
  const top3Data = [
    {
      name: "Alena Donin",
      profilePicture: "https://via.placeholder.com/50",
      countriFlag: "https://via.placeholder.com/20",
      points: 1469,
    },
    {
      name: "vicglezh",
      profilePicture: "https://via.placeholder.com/50",
      countriFlag: "https://via.placeholder.com/20",
      points: 2569,
    },
    {
      name: "Craig Gouse",
      profilePicture: "https://via.placeholder.com/50",
      countriFlag: "https://via.placeholder.com/20",
      points: 569,
    }
  ];

  // Calcular dimensiones en base al ancho del SVG
  const rectWidth = svgWidth / 3;

  return (
    <View style={{ alignItems: 'center', marginTop: 50 }}>
      <Svg height={screenHeight * 0.6} width={svgWidth}>
        {/* Segundo Lugar */}
        <Rect x="0" y="50%" width={`${rectWidth}`} height={`${screenHeight * 0.5}`} fill="#9087E5" />
        <Polygon points={`0,${screenHeight + 11} ${rectWidth},${screenHeight + 11} ${rectWidth},${screenHeight - 5} 20,${screenHeight - 5}`} fill="#AEA7EC" />
        <Text
          x="18%"
          y={screenHeight + 50}
          fill="white"
          fontSize={fontSizes.span}
          fontWeight="800"
          textAnchor="middle"
        >
          2
        </Text>

        {/* Primer Lugar */}
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="10%" stopColor="#9087E5" stopOpacity="1" />
            <Stop offset="100%" stopColor="#CDC9F3" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x={rectWidth} y="40%" width={`${rectWidth}`} height={`${screenHeight * 1.2}`} fill="url(#grad1)" />
        <Polygon points={`${rectWidth},${screenHeight} ${rectWidth * 2},${screenHeight} ${rectWidth * 2 - 15},${screenHeight - 20} ${rectWidth + 10},${screenHeight - 20}`} fill="#CDC9F3" />
        <Text
          x="50%"
          y={screenHeight + 20}
          fill="white"
          fontSize={fontSizes.span}
          fontWeight="1000"
          textAnchor="middle"
        >
          1
        </Text>

        {/* Tercer Lugar */}
        <Rect x={rectWidth * 2} y="60%" width={`${rectWidth}`} height={`${screenHeight * 0.7}`} fill="#9087E5" />
        <Polygon points={`${rectWidth * 2},${screenHeight + 30} ${rectWidth * 3},${screenHeight + 30} ${rectWidth * 3 - 20},${screenHeight + 10} ${rectWidth * 2 + 20},${screenHeight + 10}`} fill="#AEA7EC" />
        <Text
          x="82%"
          y={screenHeight + 60}
          fill="white"
          fontSize={fontSizes.span}
          fontWeight="700"
          textAnchor="middle"
        >
          3
        </Text>

        {/* Segundo Lugar - Información */}
        <View style={{ position: 'absolute', top: 30, left: -15, alignItems: 'center' }}>
          <Image
            source={{ uri: top3Data[1].profilePicture }}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
          <Image
            source={{ uri: top3Data[1].countriFlag }}
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
            rectWidth={rectWidth * 0.7}
            screenHeight={25}
            fillColor={"none"}
            textColor='white'
            positionY={90}
            positionX={0}
            fontWeight='700'
          />
          <CenteredTextWithBackground text={`${top3Data[1].points} QP`} rectWidth={rectWidth * 0.5} screenHeight={25} fillColor={"#9087E5"} textColor='white' positionY={125} positionX={15} fontWeight='700' />
        </View>

        {/* Otros elementos aquí... */}

      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  qpContainer: {
    backgroundColor: '#9087E5',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  qpText: {
    color: 'white',
    fontSize: fontSizes.xs,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default PodiumChart;
