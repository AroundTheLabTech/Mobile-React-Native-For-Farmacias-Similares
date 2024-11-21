/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, Image, Dimensions } from 'react-native';
import Svg, { Rect, Polygon, Text, Defs, LinearGradient, Stop } from 'react-native-svg';

import { fontSizes } from '../../../global-class';
import { formatNumber } from '../../utils/helpers';
import { recalculateDimension, TDimentions, TRectDimentions } from './calculateDimension';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window'); // Ancho de la pantalla

const CenteredTextWithBackground = ({ text, rectWidth, myScreenHeight, svgWidth = rectWidth, fillColor = 'white', positionX = 10, positionY = 10, textColor = 'black', fontWeight = '400', fontSize = fontSizes.xs }) => {

  if(!myScreenHeight || typeof myScreenHeight !== 'number') {
    return null;
  }

  return (
    <Svg height={myScreenHeight + 20} width={svgWidth}>
      <Rect
        x={positionX}
        y={positionY}
        width={rectWidth}
        height={myScreenHeight}
        rx="10"
        fill={fillColor}
      />
      <Text
        x={positionX + rectWidth / 2}
        y={positionY + myScreenHeight / 2 + 2}
        fontSize={fontSize}
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

  const [dimentions, setDimentions] = useState<TDimentions>(null);
  const [reacts, setReacts] = useState<TRectDimentions[]>(null);
  const [display, setDisplay] = useState<Boolean>(false);

  useEffect(() => {

    const { dimentions: fullDimentions, display: newDispay } = recalculateDimension({ screenWidth, screenHeight, svgWidth });
    const { dimentions: newDimentions, reacts: newReacts } = fullDimentions;

    if (newDispay) {
      setDimentions(newDimentions);
      setReacts(newReacts);
      setDisplay(newDispay);
    }

  }, [svgWidth, display]);

  const top3Data = [
    {
      name: 'vicglezh',
      profilePicture: 'https://via.placeholder.com/50',
      countriFlag: 'https://via.placeholder.com/20',
      points: 2569,
    },
    {
      name: 'Alena Donin',
      profilePicture: 'https://via.placeholder.com/50',
      countriFlag: 'https://via.placeholder.com/20',
      points: 1469,
    },
    {
      name: 'Craig Gouse',
      profilePicture: 'https://via.placeholder.com/50',
      countriFlag: 'https://via.placeholder.com/20',
      points: 591,
    },
  ];

  if (!display) {
    return (
      <Text>
        Tamaño de pantalla no soportado
      </Text>
    );
  }


  return (
    <View style={{ alignItems: 'center', marginTop: 50, borderWidth: 1, borderColor: 'transparent' }}>
      <Svg height={dimentions.newHeight} width={svgWidth}>
        {/* Segundo Lugar */}
        <Rect x={reacts[0].rectX} y={reacts[0].rectY} width={dimentions.rectWidth} height={dimentions.rectHeight} fill="#9087E5" />
        <Polygon
          points={`
            ${reacts[0].polygonX1},${reacts[0].polygonY1}
            ${reacts[0].polygonX2},${reacts[0].polygonY2}
            ${reacts[0].polygonX3},${reacts[0].polygonY3}
            ${reacts[0].polygonX4},${reacts[0].polygonY4}
          `}
          fill="#AEA7EC"
        />
        <Text
          x={reacts[0].positionTextX}
          y={reacts[0].positionTextY}
          fill="white"
          fontSize={reacts[0].positionFontSize}
          fontWeight="800"
          textAnchor="middle"
        >
          2
        </Text>

        {/* Segundo Lugar - Información */}
        < View style={{ position: 'absolute', top: reacts[0].informationContainerY, left: reacts[0].informationContainerX, alignItems: 'center', width: reacts[0].informationContainerWidth, borderWidth: 1, borderColor: 'transparent' }}>
          <Image
            source={{ uri: top3Data[1].profilePicture }}
            style={{ width: reacts[0].profilePictureWidth, height: reacts[0].profilePictureHeight, borderRadius: 25 }}
          />
          <Image
            source={{ uri: top3Data[1].countriFlag }}
            style={{
              width: reacts[0].profileFlagWidth,
              height: reacts[0].profileFlagHeight,
              borderRadius: 10,
              position: 'absolute',
              top: reacts[0].profileFlagY,
              right: reacts[0].profileFlagX,
            }}
          />
          <CenteredTextWithBackground text={top3Data[1].name} rectWidth={reacts[0].userNameWidth} svgWidth={reacts[0].userNameSvgWidth} positionY={reacts[0].userNameY} myScreenHeight={reacts[0].userNameHeight} fillColor="transparent" textColor="white" fontWeight="700" fontSize={reacts[0].userNameFontSize} />
          <CenteredTextWithBackground text={`${formatNumber(top3Data[1].points)} QP`} rectWidth={reacts[0].pointsTextWidth} svgWidth={reacts[0].poinstTextSvgWidth} positionX={reacts[0].pointsTextX} positionY={reacts[0].pointsTextY} myScreenHeight={reacts[0].pointsTextHeight} fillColor={'#9087E5'} textColor="white" fontWeight="700" fontSize={reacts[0].pointsTextFontSize} />
        </View>

        {/* Primer Lugar */}
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="10%" stopColor="#9087E5" stopOpacity="1" />
            <Stop offset="100%" stopColor="#CDC9F3" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        <Rect x={reacts[1].rectX} y={reacts[1].rectY} width={dimentions.rectWidth} height={dimentions.rectHeight} fill="url(#grad1)" />

        <Polygon
          points={`
            ${reacts[1].polygonX1},${reacts[1].polygonY1}
            ${reacts[1].polygonX2},${reacts[1].polygonY2}
            ${reacts[1].polygonX3},${reacts[1].polygonY3}
            ${reacts[1].polygonX4},${reacts[1].polygonY4}
          `}
          fill="#AEA7EC"
        />

        <Text
          x={reacts[1].positionTextX}
          y={reacts[1].positionTextY}
          fill="white"
          fontSize={reacts[1].positionFontSize}
          fontWeight="800"
          textAnchor="middle"
        >
          1
        </Text>
        {/* Primer Lugar - Información */}

        <View style={{ position: 'absolute', top: reacts[1].informationContainerY, left: reacts[1].informationContainerX, alignItems: 'center', width: reacts[1].informationContainerWidth, borderWidth: 1, borderColor: 'transparent' }}>
          <Image
            source={{ uri: top3Data[0].profilePicture }}
            style={{ width: reacts[1].profilePictureWidth, height: reacts[1].profilePictureHeight, borderRadius: 25 }}
          />
          <Image
            source={{ uri: top3Data[0].countriFlag }}
            style={{
              width: reacts[1].profileFlagWidth,
              height: reacts[1].profileFlagHeight,
              borderRadius: 10,
              position: 'absolute',
              top: reacts[1].profileFlagY,
              right: reacts[1].profileFlagX,
            }}
          />
          <CenteredTextWithBackground text={top3Data[0].name} rectWidth={reacts[1].userNameWidth} svgWidth={reacts[1].userNameSvgWidth} positionY={reacts[1].userNameY} myScreenHeight={reacts[1].userNameHeight} fillColor="transparent" textColor="white" fontWeight="700" fontSize={reacts[1].userNameFontSize} />
          <CenteredTextWithBackground text={`${formatNumber(top3Data[0].points)} QP`} rectWidth={reacts[1].pointsTextWidth} svgWidth={reacts[1].poinstTextSvgWidth} positionY={reacts[1].pointsTextY} myScreenHeight={reacts[1].pointsTextHeight} fillColor={'#9087E5'} textColor="white" fontWeight="700" fontSize={reacts[1].pointsTextFontSize} />
        </View>

        {/* Tercer Lugar */}

        <Rect x={reacts[2].rectX} y={reacts[2].rectY} width={dimentions.rectWidth} height={dimentions.rectHeight} fill="#9087E5" />

        <Polygon
          points={`
            ${reacts[2].polygonX1},${reacts[2].polygonY1}
            ${reacts[2].polygonX2},${reacts[2].polygonY2}
            ${reacts[2].polygonX3},${reacts[2].polygonY3}
            ${reacts[2].polygonX4},${reacts[2].polygonY4}
          `}
          fill="#AEA7EC"
        />

        <Text
          x={reacts[2].positionTextX}
          y={reacts[2].positionTextY}
          fill="white"
          fontSize={reacts[2].positionFontSize}
          fontWeight="800"
          textAnchor="middle"
        >
          3
        </Text>
        {/* Primer Lugar - Información */}

        <View style={{ position: 'absolute', top: reacts[2].informationContainerY, left: reacts[2].informationContainerX, alignItems: 'center', width: reacts[2].informationContainerWidth, borderWidth: 1, borderColor: 'transparent' }}>
          <Image
            source={{ uri: top3Data[2].profilePicture }}
            style={{ width: reacts[2].profilePictureWidth, height: reacts[2].profilePictureHeight, borderRadius: 25 }}
          />
          <Image
            source={{ uri: top3Data[2].countriFlag }}
            style={{
              width: reacts[2].profileFlagWidth,
              height: reacts[2].profileFlagHeight,
              borderRadius: 10,
              position: 'absolute',
              top: reacts[2].profileFlagY,
              right: reacts[2].profileFlagX,
            }}
          />
          <CenteredTextWithBackground text={top3Data[2].name} rectWidth={reacts[2].userNameWidth} svgWidth={reacts[2].userNameSvgWidth} positionY={reacts[2].userNameY} myScreenHeight={reacts[2].userNameHeight} fillColor="transparent" textColor="white" fontWeight="700" fontSize={reacts[2].userNameFontSize} />
          <CenteredTextWithBackground text={`${formatNumber(top3Data[2].points)} QP`} rectWidth={reacts[2].pointsTextWidth} svgWidth={reacts[2].poinstTextSvgWidth} positionY={reacts[2].pointsTextY} myScreenHeight={reacts[2].pointsTextHeight} fillColor={'#9087E5'} textColor="white" fontWeight="700" fontSize={reacts[2].pointsTextFontSize} />
        </View>
      </Svg >
    </View >
  );
};

export default PodiumChart;
