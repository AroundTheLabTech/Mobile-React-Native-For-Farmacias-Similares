/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View } from 'react-native';
import Svg, { Rect, Polygon, Text, Image as SvgImage } from 'react-native-svg';
import { TLeaderBoard } from '../../types/user';

interface PodiumSvgProps {
  top3Data: TLeaderBoard[]
}

const PodiumSvg: React.FC<PodiumSvgProps> = ({ top3Data }) => {
  // Definir las dimensiones fijas del SVG
  const svgHeight = 400; // Alto fijo en píxeles

  // Calcular un factor de escala en función del tamaño de la pantalla

  // Elegir el factor de escala más pequeño para mantener la proporción

  const [podiumDimensions, setPodiumDimensions] = useState({ width: 0, height: 0 });

  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout; // Obtener el ancho
    setPodiumDimensions({ width, height });
  };

  const [podium2DimensionsInformation, setPodium2DimensionsInformation] = useState({ width: 0, height: 0 });

  const handleLayoutInformation2 = (event) => {
    const { width, height } = event.nativeEvent.layout; // Obtener el ancho
    setPodium2DimensionsInformation({ width, height });
  };

  const [podium1DimensionsInformation, setPodium1DimensionsInformation] = useState({ width: 0, height: 0 });

  const handleLayoutInformation1 = (event) => {
    const { width, height } = event.nativeEvent.layout; // Obtener el ancho
    setPodium1DimensionsInformation({ width, height });
  };

  const [podium3DimensionsInformation, setPodium3DimensionsInformation] = useState({ width: 0, height: 0 });

  const handleLayoutInformation3 = (event) => {
    const { width, height } = event.nativeEvent.layout; // Obtener el ancho
    setPodium3DimensionsInformation({ width, height });
  };

  const [podium2DimensionsReact, setPodium2DimensionsReact] = useState({ width: 0, height: 0 });

  const handleLayoutRect2 = (event) => {
    const { width, height } = event.nativeEvent.layout; // Obtener el ancho
    setPodium2DimensionsReact({ width, height });
  };

  const [podium1DimensionsReact, setPodium1DimensionsReact] = useState({ width: 0, height: 0 });

  const handleLayoutRect1 = (event) => {
    const { width, height } = event.nativeEvent.layout; // Obtener el ancho
    setPodium1DimensionsReact({ width, height });
  };

  const [podium3DimensionsReact, setPodium3DimensionsReact] = useState({ width: 0, height: 0 });

  const handleLayoutRect3 = (event) => {
    const { width, height } = event.nativeEvent.layout; // Obtener el ancho
    setPodium3DimensionsReact({ width, height });
  };

  return (
    <View style={{ alignItems: 'center', marginTop: 50, borderWidth: 0, borderColor: '#000', flexDirection: 'row', paddingHorizontal: 10 }}>
      <View
        style={{ alignItems: 'center', borderWidth: 0, borderColor: '#000', flex: 1, height: svgHeight }}
        onLayout={handleLayout}
      >
        <View style={{ borderWidth: 0, borderColor: '#000', width: podiumDimensions.width, flex: 1.2 }} onLayout={handleLayoutInformation2} >
          <Svg width={podium2DimensionsInformation.width} height={podium2DimensionsInformation.height * 0.5} >
            <SvgImage
              href={{ uri: top3Data[1].profile_mini_pictures_url }}
              x={'32%'}
              y={'48%'}
              width={40}
              height={40}
            />
            <SvgImage
              href={{ uri: top3Data[1].flag_url }}
              x={'52%'}
              y={'80%'}
              width={20}
              height={20}
            />
          </Svg>
          <Svg width={podium2DimensionsInformation.width} height={podium2DimensionsInformation.height * 0.25} >
            <Text
              x="50%"
              y="75%"
              fill="white"
              fontSize={podium2DimensionsInformation.height * 0.08}
              fontWeight="800"
              textAnchor="middle"
              alignmentBaseline="middle">
              {top3Data[1].username}
            </Text>
          </Svg>

          <Svg width={podium2DimensionsInformation.width} height={podium2DimensionsInformation.height * 0.25} >
            <Rect
              x="23.5%"
              y="20%"
              width={podium1DimensionsInformation.width * 0.5}
              height={(podium1DimensionsInformation.height * 0.25) * 0.6}
              rx={podium1DimensionsInformation.height * 0.05}
              fill={'#9087E5'}
            />
            <Text
              x="40%"
              y="50%"
              fill="white"
              fontSize={podium1DimensionsInformation.width * 0.09}
              fontWeight="800"
              textAnchor="middle"
              alignmentBaseline="middle">
              {top3Data[1].total_score} QP
            </Text>
          </Svg>
        </View>
        <View style={{ borderWidth: 0, borderColor: '#000', width: podiumDimensions.width, height: '100%', flex: 1.8 }} onLayout={handleLayoutRect2} >
          <Svg width={podium2DimensionsInformation.width} height={podium2DimensionsReact.height} >
            {/* Segundo Lugar */}
            <Rect x={0} y={podium2DimensionsReact.height * 0.05} width={podium2DimensionsInformation.width} height={podium2DimensionsReact.height} fill="#9087E5" />
            <Polygon
              points={`
                ${0},${podium2DimensionsReact.height * 0.05}
                ${podium2DimensionsInformation.width},${podium2DimensionsReact.height * 0.05}
                ${podium2DimensionsInformation.width},${0}
                ${podium2DimensionsInformation.width * 0.05},${0}
              `}
              fill="#AEA7EC"
            />

            <Text
              x="50%"
              y={podium2DimensionsReact.height * 0.25}
              fill="white"
              fontSize={podium2DimensionsInformation.width * 0.5}
              fontWeight="800"
              textAnchor="middle"
              alignmentBaseline="middle">
              2
            </Text>
          </Svg>
        </View>
      </View>
      <View
        style={{ alignItems: 'center', borderWidth: 0, borderColor: '#000', flex: 1, height: svgHeight }}
        onLayout={handleLayout}
      >
        <View style={{ borderWidth: 0, borderColor: '#000', width: podiumDimensions.width, flex: 1 }} onLayout={handleLayoutInformation1} >
          <Svg width={podium2DimensionsInformation.width} height={podium2DimensionsInformation.height * 0.3} >
            <View style={{ borderRadius: 40, width: 40, height: 40, top: '12%', left: '32%', overflow: 'hidden' }} >
              <Svg>
                <SvgImage
                  href={{ uri: top3Data[0].profile_mini_pictures_url }}
                  x={'0%'}
                  y={'0%'}
                  width={40}
                  height={40}
                  preserveAspectRatio="xMidYMid slice"
                />
              </Svg>
            </View>
            <View style={{ width: 20, height: 20, top: '80%', left: '52%', overflow: 'visible', display: 'flex', position: 'absolute', zIndex: 10 }} >
              <Svg>
                <SvgImage
                  href={{ uri: top3Data[0].flag_url }}
                  x={'0%'}
                  y={'0%'}
                  width={20}
                  height={20}
                />
              </Svg>
            </View>
          </Svg>
          <Svg width={podium2DimensionsInformation.width} height={podium2DimensionsInformation.height * 0.35} >
            <Text
              x="50%"
              y="50%"
              fill="white"
              fontSize={podium2DimensionsInformation.height * 0.08}
              fontWeight="800"
              textAnchor="middle"
              alignmentBaseline="middle">
              {top3Data[0].username}
            </Text>
          </Svg>

          <Svg width={podium2DimensionsInformation.width} height={podium2DimensionsInformation.height * 0.35} >
            <Rect
              x="23.5%"
              y="0%"
              width={podium1DimensionsInformation.width * 0.5}
              height={(podium1DimensionsInformation.height * 0.25) * 0.6}
              rx={podium1DimensionsInformation.height * 0.05}
              fill={'#9087E5'}
            />
            <Text
              x="40%"
              y="20%"
              fill="white"
              fontSize={podium1DimensionsInformation.width * 0.09}
              fontWeight="800"
              textAnchor="middle"
              alignmentBaseline="middle">
              {top3Data[0].total_score} QP
            </Text>
          </Svg>
        </View>
        <View style={{ borderWidth: 0, borderColor: '#000', width: podiumDimensions.width, height: '100%', flex: 2 }} onLayout={handleLayoutRect1} >
          <Svg width={podium1DimensionsInformation.width} height={podium1DimensionsReact.height} >
            {/* Pimer Lugar */}
            <Rect x={0} y={podium1DimensionsReact.height * 0.05} width={podium2DimensionsInformation.width} height={podium1DimensionsReact.height} fill="#9087E5" />
            <Polygon
              points={`
                ${0},${podium1DimensionsReact.height * 0.05}
                ${podium2DimensionsInformation.width},${podium1DimensionsReact.height * 0.05}
                ${podium2DimensionsInformation.width * 0.95},${0}
                ${podium2DimensionsInformation.width * 0.05},${0}
              `}
              fill="#AEA7EC"
            />

            <Text
              x="50%"
              y={podium1DimensionsReact.height * 0.25}
              fill="white"
              fontSize={podium1DimensionsInformation.width * 0.5}
              fontWeight="800"
              textAnchor="middle"
              alignmentBaseline="middle">
              1
            </Text>
          </Svg>
        </View>
      </View>
      <View
        style={{ alignItems: 'center', borderWidth: 0, borderColor: '#000', flex: 1, height: svgHeight }}
        onLayout={handleLayout}
      >
        <View style={{ borderWidth: 0, borderColor: '#000', width: podiumDimensions.width, flex: 1.4 }} onLayout={handleLayoutInformation3} >
          <Svg width={podium2DimensionsInformation.width} height={podium2DimensionsInformation.height * 0.7} >
            <View style={{ borderRadius: 40, width: 40, height: 40, top: '148%', left: '32%', overflow: 'hidden' }} >
              <Svg>
                <SvgImage
                  href={{ uri: top3Data[2].profile_mini_pictures_url }}
                  x={'0%'}
                  y={'0%'}
                  width={40}
                  height={40}
                />
              </Svg>
            </View>
            <View style={{ width: 20, height: 20, top: '218%', left: '52%', overflow: 'visible', display: 'flex', position: 'absolute', zIndex: 10 }} >
              <Svg>
                <SvgImage
                  href={{ uri: top3Data[1].flag_url }}
                  x={'0%'}
                  y={'0%'}
                  width={20}
                  height={20}
                />
              </Svg>
            </View>
          </Svg>
          <Svg width={podium2DimensionsInformation.width} height={podium2DimensionsInformation.height * 0.2} >
            <Text
              x="50%"
              y="60%"
              fill="white"
              fontSize={podium2DimensionsInformation.height * 0.08}
              fontWeight="800"
              textAnchor="middle"
              alignmentBaseline="middle">
              {top3Data[2].username}
            </Text>
          </Svg>

          <Svg width={podium2DimensionsInformation.width} height={podium2DimensionsInformation.height * 0.3} >
            <Rect
              x="23.5%"
              y="30%"
              width={podium1DimensionsInformation.width * 0.5}
              height={(podium1DimensionsInformation.height * 0.25) * 0.6}
              rx={podium1DimensionsInformation.height * 0.05}
              fill={'#9087E5'}
            />
            <Text
              x="40%"
              y="55%"
              fill="white"
              fontSize={podium1DimensionsInformation.width * 0.09}
              fontWeight="800"
              textAnchor="middle"
              alignmentBaseline="middle">
              {top3Data[2].total_score} QP
            </Text>
          </Svg>
        </View>
        <View style={{ borderWidth: 0, borderColor: '#000', width: podiumDimensions.width, height: '100%', flex: 1.6 }} onLayout={handleLayoutRect3} >
          <Svg width={podium3DimensionsInformation.width} height={podium3DimensionsReact.height} >
            {/* Tercer Lugar */}
            <Rect x={0} y={podium3DimensionsReact.height * 0.05} width={podium3DimensionsInformation.width} height={podium3DimensionsReact.height} fill="#9087E5" />
            <Polygon
              points={`
                ${0},${podium1DimensionsReact.height * 0.05}
                ${podium2DimensionsInformation.width},${podium1DimensionsReact.height * 0.05}
                ${podium2DimensionsInformation.width * 0.95},${0}
                ${0},${0}
              `}
              fill="#AEA7EC"
            />

            <Text
              x="50%"
              y={podium3DimensionsReact.height * 0.25}
              fill="white"
              fontSize={podium3DimensionsInformation.width * 0.4}
              fontWeight="800"
              textAnchor="middle"
              alignmentBaseline="middle">
              3
            </Text>
          </Svg>
        </View>
      </View>
    </View>
  );
};

export default PodiumSvg;
