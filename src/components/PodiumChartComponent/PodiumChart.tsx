import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Polygon, Text, Defs, LinearGradient, Stop } from 'react-native-svg';

import { fontSizes } from '../../../global-class';
import { formatNumber } from '../../utils/helpers';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window'); // Ancho de la pantalla

const CenteredTextWithBackground = ({ text, rectWidth, screenHeight, fillColor = 'white', positionX = 10, positionY = 10, textColor = 'black', fontWeight = '400', fontSize = fontSizes.xs }) => {
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

  let newWidth = screenWidth;
  let newHeight = screenHeight;

  let rectWidth = svgWidth / 3;
  let rectHeight = screenHeight * 0.15;

  let rect1Y = screenHeight * 0.2;
  let polygon1X1 = rectWidth * 0.1;
  let polygon1Y1 = rectHeight * 0.2;
  let polygon1Y2 = rectHeight * 0.185;
  let text1Size = rectWidth;
  let text1X = rectWidth;
  let text1Y = rectHeight;
  let info1ContainerWidth = rectWidth;
  let info1ContainerY = rectWidth;
  let image1_20X = rectWidth;
  let image1_20Y = rectWidth;
  let textNameSize = 0;
  let textNameY = 0;
  let textNameX = 0;
  let text1NameFontSize = 0;
  let textPointSize = rectHeight;
  let textPointY = rectHeight * 10;
  let textPointX = rectHeight * 10;
  let text1PointsFontSize = 10;

  let rect2Y = screenHeight * 0.2;
  let rect2X = screenHeight * 0.2;
  let polygon2X1 = rectWidth * 0.1;
  let polygon2X2 = rectWidth * 0.1;
  let polygon2X3 = rectWidth * 0.1;
  let polygon2Y1 = rectHeight * 0.2;
  let polygon2Y2 = rectHeight * 0.185;
  let text2Size = rectWidth;
  let text2X = rectWidth;
  let text2Y = rectHeight;
  let info2ContainerY = rectWidth;
  let info2ContainerX = rectWidth;
  let image2_20X = rectWidth;
  let image2_20Y = rectWidth;
  let text2NameSize = rectWidth;
  let text2NameY = rectHeight;
  let text2PointSize = rectHeight * 0.8;
  let text2PointY = rectHeight * 0.1;

  let rect3Y = screenHeight * 0.4;
  let rect3X = screenHeight * 0.4;
  let polygon3X1 = rectWidth * 0.2;
  let polygon3X2 = rectWidth * 0.2;
  let polygon3X3 = rectWidth * 0.2;
  let polygon3Y1 = rectHeight * 0.2;
  let polygon3Y2 = rectHeight * 0.2;
  let text3Size = rectWidth;
  let text3X = rectWidth;
  let text3Y = rectHeight;
  let info3ContainerY = rectWidth;
  let info3ContainerX = rectWidth;
  let image3_20X = rectWidth;
  let image3_20Y = rectWidth;
  let text3NameSize = rectWidth;
  let text3NameY = rectHeight;
  let text3PointSize = rectHeight * 0.8;
  let text3PointY = rectHeight * 0.1;

  if (newWidth < 412 && newHeight < 915 && newWidth > 410 && newHeight > 913) {
    newHeight = screenHeight * 0.6;

    rectWidth = svgWidth / 3;
    rectHeight = screenHeight * 0.25;

    rect1Y = screenHeight * 0.15;
    polygon1X1 = rectWidth * 0.1;
    polygon1Y1 = rectHeight * 0.6;
    polygon1Y2 = rectHeight * 0.53;
    text1Size = rectWidth;
    text1X = rectWidth * 0.5;
    text1Y = rectHeight * 1.05;
    info1ContainerWidth = rectWidth;
    info1ContainerY = -30;
    image1_20X = 30;
    image1_20Y = 35;
    textNameSize = rectWidth * 0.3;
    text1NameFontSize = fontSizes.xs;
    textNameY = rectHeight * 0.1;
    textNameX = 10;
    textPointSize = rectWidth * 0.8;
    textPointY = 4;
    textPointX = 10;
    text1PointsFontSize = fontSizes.xs;

    rect2Y = screenHeight * 0.11;
    rect2X = rectWidth;
    polygon2X1 = rectWidth * 1.08;
    polygon2X2 = rectWidth * 1.88;
    polygon2X3 = rectWidth * 2;
    polygon2Y1 = rectHeight * 0.44;
    polygon2Y2 = rectHeight * 0.38;
    text2X = rectWidth * 1.5;
    text2Y = rect2Y * 2.05;
    info2ContainerY = -60;
    info2ContainerX = rectWidth;
    image2_20X = 30;
    image2_20Y = 35;
    text2NameSize = rectWidth * 0.3;
    text2NameY = rectHeight * 0.1;
    text2PointSize = rectWidth * 0.8;
    text2PointY = 4;

    rect3Y = screenHeight * 0.19;
    rect3X = rectWidth * 2;
    polygon3X1 = rectWidth * 2;
    polygon3X2 = rectWidth * 2.88;
    polygon3X3 = rectWidth * 3;
    polygon3Y1 = rectHeight * 0.76;
    polygon3Y2 = rectHeight * 0.69;
    text3X = rect3X * 1.25;
    text3Y = rect3Y * 1.6;
    info3ContainerY = 8;
    info3ContainerX = rectWidth * 2;
    image3_20X = 30;
    image3_20Y = 35;
    text3NameSize = rectWidth * 0.3;
    text3NameY = rectHeight * 0.1;
    text3PointSize = rectWidth * 0.8;
    text3PointY = 4;
  } else if (newWidth < 541 && newHeight < 945 && newWidth > 539 && newHeight > 943) {
    newHeight = screenHeight * 0.4;

    rectWidth = svgWidth / 4;
    rectHeight = newHeight;

    rect1Y = screenHeight * 0.15;
    polygon1X1 = rectWidth * 0.1;
    polygon1Y1 = rectHeight * 0.374;
    polygon1Y2 = rectHeight * 0.34;
    text1Size = rectWidth * 0.5;
    text1X = rectWidth * 0.5;
    text1Y = rectHeight * 0.51;
    info1ContainerWidth = svgWidth / 3;
    info1ContainerY = 40;
    image1_20X = 45;
    image1_20Y = 35;
    textNameSize = rectWidth * 0.2;
    textNameY = 10;
    textNameX = -5;
    text1NameFontSize = rectWidth * 0.1;
    textPointSize = rectWidth * 0.6;
    textPointY = -1;
    textPointX = 0;
    text1PointsFontSize = rectWidth * 0.09;

    rect2Y = screenHeight * 0.11;
    rect2X = rectWidth;
    polygon2X1 = rectWidth * 1.08;
    polygon2X2 = rectWidth * 1.88;
    polygon2X3 = rectWidth * 2;
    polygon2Y1 = rectHeight * 0.44;
    polygon2Y2 = rectHeight * 0.38;
    text2X = rectWidth * 1.5;
    text2Y = rect2Y * 2.05;
    info2ContainerY = -60;
    info2ContainerX = rectWidth;
    image2_20X = 30;
    image2_20Y = 35;
    text2NameSize = rectWidth * 0.3;
    text2NameY = rectHeight * 0.1;
    text2PointSize = rectWidth * 0.8;
    text2PointY = 4;

    rect3Y = screenHeight * 0.19;
    rect3X = rectWidth * 2;
    polygon3X1 = rectWidth * 2;
    polygon3X2 = rectWidth * 2.88;
    polygon3X3 = rectWidth * 3;
    polygon3Y1 = rectHeight * 0.76;
    polygon3Y2 = rectHeight * 0.69;
    text3X = rect3X * 1.25;
    text3Y = rect3Y * 1.6;
    info3ContainerY = 8;
    info3ContainerX = rectWidth * 2;
    image3_20X = 30;
    image3_20Y = 35;
    text3NameSize = rectWidth * 0.1;
    text3NameY = rectHeight * 0.1;
    text3PointSize = rectWidth * 0.1;
    text3PointY = 4;
  } else if (newWidth < 541 && newHeight < 937 && newWidth > 539 && newHeight > 935) {
    console.log("Si?s")
    newHeight = 0;

    rectWidth = svgWidth / 4;
    rectHeight = newHeight;

    rect1Y = newHeight * 0.15;
    polygon1X1 = rectWidth * 0.1;
    polygon1Y1 = rectHeight * 0.6;
    polygon1Y2 = rectHeight * 0.53;
    text1Size = 1;
    text1X = rectWidth * 0.5;
    text1Y = rectHeight * 1.05;
    info1ContainerY = -30;
    image1_20X = 30;
    image1_20Y = 35;
    textNameSize = rectWidth * 0.3;
    textNameY = rectHeight * 0.1;
    textPointSize = rectWidth * 0.8;
    textPointY = 4;

    rect2Y = newHeight * 0.11;
    rect2X = rectWidth;
    polygon2X1 = rectWidth * 1.08;
    polygon2X2 = rectWidth * 1.88;
    polygon2X3 = rectWidth * 2;
    polygon2Y1 = rectHeight * 0.44;
    polygon2Y2 = rectHeight * 0.38;
    text2X = rectWidth * 1.5;
    text2Y = rect2Y * 2.05;
    info2ContainerY = -60;
    info2ContainerX = rectWidth;
    image2_20X = 30;
    image2_20Y = 35;
    text2NameSize = rectWidth * 0.3;
    text2NameY = rectHeight * 0.1;
    text2PointSize = rectWidth * 0.8;
    text2PointY = 4;

    rect3Y = newHeight * 0.19;
    rect3X = rectWidth * 2;
    polygon3X1 = rectWidth * 2;
    polygon3X2 = rectWidth * 2.88;
    polygon3X3 = rectWidth * 3;
    polygon3Y1 = rectHeight * 0.76;
    polygon3Y2 = rectHeight * 0.69;
    text3X = rect3X * 1.25;
    text3Y = rect3Y * 1.6;
    info3ContainerY = 8;
    info3ContainerX = rectWidth * 2;
    image3_20X = 30;
    image3_20Y = 35;
    text3NameSize = rectWidth * 0.3;
    text3NameY = rectHeight * 0.1;
    text3PointSize = rectWidth * 0.8;
    text3PointY = 4;
  }

  console.log(screenWidth);
  console.log(screenHeight);
  const top3Data = [
    {
      name: "vicglezh",
      profilePicture: "https://via.placeholder.com/50",
      countriFlag: "https://via.placeholder.com/20",
      points: 2569,
    },
    {
      name: "Alena Donin",
      profilePicture: "https://via.placeholder.com/50",
      countriFlag: "https://via.placeholder.com/20",
      points: 1469,
    },
    {
      name: "Craig Gouse",
      profilePicture: "https://via.placeholder.com/50",
      countriFlag: "https://via.placeholder.com/20",
      points: 569,
    },
  ];


  return (
    <View style={{ alignItems: 'center', marginTop: 50, borderWidth: 1}}>
      <Svg height={newHeight} width={svgWidth}>
        {/* Segundo Lugar */}
        <Rect x="0" y={rect1Y} width={rectWidth} height={rectHeight} fill="#9087E5" />
        <Polygon
          points={`
            0,${polygon1Y1}
            ${rectWidth},${polygon1Y1}
            ${rectWidth},${polygon1Y2}
            ${polygon1X1},${polygon1Y2}
          `}
          fill="#AEA7EC"
        />
        <Text
          x={text1X}
          y={text1Y}
          fill="white"
          fontSize={text1Size}
          fontWeight="800"
          textAnchor="middle"
        >
          2
        </Text>

          {/* Segundo Lugar - Información */ }
          < View style={{ position: 'absolute', top: info1ContainerY, left: 0, alignItems: 'center', width: info1ContainerWidth, borderWidth: 1, borderColor: 'transparent' }}>
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
                top: image1_20Y,
                right: image1_20X,
              }}
            />
            <CenteredTextWithBackground text={top3Data[1].name} rectWidth={rectWidth} positionX={textNameX} positionY={textNameY} screenHeight={textNameSize} fillColor='transparent' textColor='white' fontWeight='700' fontSize={text1NameFontSize} />
            <CenteredTextWithBackground text={`${formatNumber(top3Data[1].points)} QP`} rectWidth={textPointSize} positionX={textPointX} positionY={textPointY} screenHeight={textNameSize} fillColor={"#9087E5"} textColor='white' fontWeight='700' fontSize={text1PointsFontSize}  />
          </View>

         {/* Primer Lugar */ }
          <Defs>
            <LinearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="10%" stopColor="#9087E5" stopOpacity="1" />
              <Stop offset="100%" stopColor="#CDC9F3" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          <Rect x={rectWidth} y={rect2Y} width={rectWidth} height={rectHeight} fill="url(#grad1)" />

          <Polygon
            points={`
            ${rect2X},${polygon2Y1}
            ${polygon2X3},${polygon2Y1}
            ${polygon2X2},${polygon2Y2}
            ${polygon2X1},${polygon2Y2}
          `}
            fill="#AEA7EC"
          />

          <Text
            x={text2X}
            y={text2Y}
            fill="white"
            fontSize={text2Size}
            fontWeight="800"
            textAnchor="middle"
          >
            1
          </Text>
          // {/* Primer Lugar - Información */ }
 
          <View style={{ position: 'absolute', top: info2ContainerY, left: info2ContainerX, alignItems: 'center', width: rectWidth, borderWidth: 1, borderColor: 'transparent' }}>
            <Image
              source={{ uri: top3Data[0].profilePicture }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <Image
              source={{ uri: top3Data[1].countriFlag }}
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                position: 'absolute',
                top: image2_20Y,
                right: image2_20X,
              }}
            />
            <CenteredTextWithBackground text={top3Data[0].name} rectWidth={rectWidth} positionY={text2NameY} screenHeight={text2NameSize} fillColor='transparent' textColor='white' fontWeight='700' />
            <CenteredTextWithBackground text={`${formatNumber(top3Data[0].points)} QP`} rectWidth={text2PointSize} positionY={text2PointY} screenHeight={text2NameSize} fillColor={"#9087E5"} textColor='white' fontWeight='700' />
          </View>

          {/* Tercer Lugar */ }

          <Rect x={rectWidth * 2} y={rect3Y} width={rectWidth} height={rectHeight} fill="#9087E5" />

          <Polygon
            points={`
            ${rect3X},${polygon3Y1}
            ${polygon3X3},${polygon3Y1}
            ${polygon3X2},${polygon3Y2}
            ${polygon3X1},${polygon3Y2}
          `}
            fill="#AEA7EC"
          />

          <Text
            x={text3X}
            y={text3Y}
            fill="white"
            fontSize={text3Size}
            fontWeight="800"
            textAnchor="middle"
          >
            3
          </Text>
          {/* Primer Lugar - Información */}

          <View style={{ position: 'absolute', top: info3ContainerY, left: info3ContainerX, alignItems: 'center', width: rectWidth, borderWidth: 1, borderColor: 'transparent' }}>
            <Image
              source={{ uri: top3Data[0].profilePicture }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <Image
              source={{ uri: top3Data[1].countriFlag }}
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                position: 'absolute',
                top: image3_20Y,
                right: image3_20X,
              }}
            />
            <CenteredTextWithBackground text={top3Data[0].name} rectWidth={rectWidth} positionY={text3NameY} screenHeight={text3NameSize} fillColor='transparent' textColor='white' fontWeight='700' />
            <CenteredTextWithBackground text={`${formatNumber(top3Data[0].points)} QP`} rectWidth={text3PointSize} positionY={text3PointY} screenHeight={text3NameSize} fillColor={"#9087E5"} textColor='white' fontWeight='700' />
          </View>
      </Svg >
    </View >
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
