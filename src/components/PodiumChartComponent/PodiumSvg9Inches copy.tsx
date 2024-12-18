/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View } from 'react-native';
import Svg, { Rect, Polygon, Text, Image as SvgImage } from 'react-native-svg';
import { TLeaderBoard } from '../../types/user';
import { responsiveHeight, responsiveWidth } from '../../../global-class';

interface PodiumSvg9InchesProps {
  top3Data: TLeaderBoard[]
}

const PodiumSvg9Inches: React.FC<PodiumSvg9InchesProps> = ({ top3Data }) => {
  // Definir las dimensiones fijas del SVG
  const svgHeight = responsiveHeight(250); // Alto fijo en píxeles
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
    <View style={{ alignItems: 'center', marginTop: responsiveHeight(50), borderWidth: 0, borderColor: '#000', flexDirection: 'row', paddingHorizontal: responsiveWidth(10) }}>
      <View
        style={{ alignItems: 'center', borderWidth: 0, borderColor: '#000', flex: 1, height: svgHeight }}
        onLayout={handleLayout}
      >
        <View style={{ borderWidth: 0, borderColor: '#000', width: responsiveWidth(podiumDimensions.width * 0.272), flex: 1.2 }} onLayout={handleLayoutInformation2} >
          <Svg width={responsiveWidth(podium2DimensionsInformation.width)} height={responsiveHeight(podium2DimensionsInformation.height * 0.2)} >
            <SvgImage
              href={{ uri: top3Data[1].profile_mini_pictures_url }}
              x={'8%'}
              y={'10%'}
              width={responsiveWidth(40)}
              height={responsiveHeight(40)}
            />
            <SvgImage
              href={{ uri: top3Data[1].flag_url }}
              x={'18%'}
              y={'78%'}
              width={responsiveWidth(12)}
              height={responsiveHeight(10)}
            />
          </Svg>
          <Svg width={responsiveWidth(podium2DimensionsInformation.width)} height={responsiveHeight(podium2DimensionsInformation.height * 0.1)} >
            <Text
              x="15%"
              y="50%"
              fill="white"
              fontSize={responsiveWidth(8)}
              fontWeight="800"
              textAnchor="middle"
              alignmentBaseline="middle">
              {top3Data[1].username}
            </Text>
          </Svg>

          <Svg width={responsiveWidth(podium2DimensionsInformation.width)} height={responsiveHeight(podium2DimensionsInformation.height * 0.2)} >
            <Rect
              x="10%"
              y="0%"
              width={responsiveWidth(podium1DimensionsInformation.width * 0.1)}
              height={responsiveHeight((podium1DimensionsInformation.height * 0.25) * 0.4)}
              rx={podium1DimensionsInformation.height * 0.05}
              fill={'#9087E5'}
            />
            <Text
              x="14%"
              y="22%"
              fill="white"
              fontSize={responsiveWidth(6)}
              fontWeight="800"
              textAnchor="middle"
              alignmentBaseline="middle">
              {top3Data[1].total_score} QP
            </Text>
          </Svg>
        </View>
        <View style={{ borderWidth: 0, borderColor: '#000', width: podiumDimensions.width, height: '100%', flex: 1.8 }} onLayout={handleLayoutRect2} >
          <Svg width={responsiveWidth(podium2DimensionsInformation.width * 0.44)} height={podium2DimensionsReact.height} >
            {/* Segundo Lugar */}
            <Rect x={0} y={podium2DimensionsReact.height * 0.05} width={responsiveWidth(podium2DimensionsInformation.width * 0.44)} height={podium2DimensionsReact.height} fill="#9087E5" />
            <Polygon
              points={`
                ${0},${podium2DimensionsReact.height * 0.05}
                ${responsiveWidth(podium2DimensionsInformation.width * 0.44)},${podium2DimensionsReact.height * 0.05}
                ${responsiveWidth(podium2DimensionsInformation.width * 0.44)},${0}
                ${podium2DimensionsInformation.width * 0.06},${0}
              `}
              fill="#AEA7EC"
            />

            <Text
              x="50%"
              y={responsiveHeight(60)}
              fill="white"
              fontSize={responsiveWidth(50)}
              fontWeight="800"
              textAnchor="middle"
              alignmentBaseline="middle">
              2
            </Text>
          </Svg>
        </View>
      </View>
      <View
        style={{ alignItems: 'center', borderWidth: 0, borderColor: '#000', flex: 0.99, height: svgHeight }}
        onLayout={handleLayout}
      >
        <View style={{ borderWidth: 0, borderColor: '#000', width: responsiveWidth(podiumDimensions.width * 0.34), flex: 1 }} onLayout={handleLayoutInformation1} >
          <Svg width={responsiveWidth(podium2DimensionsInformation.width)} height={responsiveHeight(podium2DimensionsInformation.height * 0.16)} >
            <View style={{ borderRadius: responsiveWidth(40), width: responsiveWidth(40), height: responsiveHeight(40), top: '-20%', left: '15%', overflow: 'hidden' }} >
              <Svg>
                <SvgImage
                  href={{ uri: top3Data[0].profile_mini_pictures_url }}
                  x={'0%'}
                  y={'0%'}
                  width={responsiveWidth(30)}
                  height={responsiveHeight(40)}
                  preserveAspectRatio="xMidYMid slice"
                />
              </Svg>
            </View>
            <View style={{ width: responsiveWidth(30), height: responsiveHeight(20), top: '45%', left: '23%', overflow: 'visible', display: 'flex', position: 'absolute', zIndex: 10 }} >
              <Svg>
                <SvgImage
                  href={{ uri: top3Data[0].flag_url }}
                  x={'0%'}
                  y={'0%'}
                  width={responsiveWidth(12)}
                  height={responsiveHeight(20)}
                />
              </Svg>
            </View>
          </Svg>
          <Svg width={responsiveWidth(podium2DimensionsInformation.width)} height={responsiveHeight(podium2DimensionsInformation.height * 0.1)} >
            <Text
              x="21%"
              y="50%"
              fill="white"
              fontSize={responsiveWidth(8)}
              fontWeight="800"
              textAnchor="middle"
              alignmentBaseline="middle">
              {top3Data[0].username}
            </Text>
          </Svg>

          <Svg width={responsiveWidth(podium2DimensionsInformation.width)} height={responsiveHeight(podium2DimensionsInformation.height * 0.15)} >
            <Rect
              x="15%"
              y="0%"
              width={responsiveWidth(podium1DimensionsInformation.width * 0.1)}
              height={responsiveHeight((podium1DimensionsInformation.height * 0.25) * 0.4)}
              rx={podium1DimensionsInformation.height * 0.05}
              fill={'#9087E5'}
            />
            <Text
              x="19%"
              y="30%"
              fill="white"
              fontSize={responsiveWidth(6)}
              fontWeight="800"
              textAnchor="middle"
              alignmentBaseline="middle">
              {top3Data[0].total_score} QP
            </Text>
          </Svg>
        </View>
        <View style={{ borderWidth: 0, borderColor: '#000', width: podiumDimensions.width, height: '100%', flex: 2 }} onLayout={handleLayoutRect1} >
          <Svg width={responsiveWidth(podium1DimensionsInformation.width * 0.44)} height={responsiveHeight(podium1DimensionsReact.height)} >
            {/* Pimer Lugar */}
            <Rect x={0} y={podium1DimensionsReact.height * 0.05} width={responsiveWidth(podium2DimensionsInformation.width * 0.44)} height={podium1DimensionsReact.height} fill="#9087E5" />
            <Polygon
              points={`
                ${0},${podium1DimensionsReact.height * 0.05}
                ${responsiveWidth(podium2DimensionsInformation.width * 0.44)},${podium1DimensionsReact.height * 0.05}
                ${responsiveWidth(podium2DimensionsInformation.width * 0.41)},${0}
                ${podium2DimensionsInformation.width * 0.05},${0}
              `}
              fill="#AEA7EC"
            />

            <Text
              x="40%"
              y={responsiveHeight(70)}
              fill="white"
              fontSize={responsiveWidth(60)}
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
          <Svg width={responsiveWidth(podium2DimensionsInformation.width)} height={responsiveHeight(podium2DimensionsInformation.height * 0.2)} >
            <View style={{ borderRadius: responsiveWidth(40), width: responsiveWidth(40), height: responsiveHeight(40), top: '50%', left: '8%', overflow: 'hidden' }} >
              <Svg>
                <SvgImage
                  href={{ uri: top3Data[2].profile_mini_pictures_url }}
                  x={'0%'}
                  y={'0%'}
                  width={responsiveWidth(40)}
                  height={responsiveHeight(40)}
                />
              </Svg>
            </View>
            <View style={{ width: responsiveWidth(20), height: responsiveHeight(20), top: '110%', left: '17.5%', overflow: 'visible', display: 'flex', position: 'absolute', zIndex: 10 }} >
              <Svg>
                <SvgImage
                  href={{ uri: top3Data[1].flag_url }}
                  x={'0%'}
                  y={'10%'}
                  width={responsiveWidth(12)}
                  height={responsiveHeight(20)}
                />
              </Svg>
            </View>
          </Svg>
          <Svg width={responsiveWidth(podium2DimensionsInformation.width)} height={responsiveHeight(podium2DimensionsInformation.height * 0.2)} >
            <Text
              x="16.1%"
              y="70%"
              fill="white"
              fontSize={responsiveWidth(10)}
              fontWeight="800"
              textAnchor="middle"
              alignmentBaseline="middle">
              {top3Data[2].username}
            </Text>
          </Svg>

          <Svg width={responsiveWidth(podium2DimensionsInformation.width)} height={responsiveHeight(podium2DimensionsInformation.height * 0.3)} >
            <Rect
              x="9%"
              y="0%"
              width={responsiveWidth(podium1DimensionsInformation.width * 0.1)}
              height={responsiveHeight((podium1DimensionsInformation.height * 0.25) * 0.4)}
              rx={podium1DimensionsInformation.height * 0.05}
              fill={'#9087E5'}
            />
            <Text
              x="13%"
              y="15%"
              fill="white"
              fontSize={responsiveWidth(6)}
              fontWeight="800"
              textAnchor="middle"
              alignmentBaseline="middle">
              {top3Data[2].total_score} QP
            </Text>
          </Svg>
        </View>
        <View style={{ borderWidth: 0, borderColor: '#000', width: podiumDimensions.width, height: '100%', flex: 1.6 }} onLayout={handleLayoutRect3} >
          <Svg width={responsiveWidth(podium3DimensionsInformation.width * 0.44)} height={responsiveHeight(podium3DimensionsReact.height)} >
            {/* Tercer Lugar */}
            <Rect x={0} y={podium3DimensionsReact.height * 0.05} width={podium3DimensionsInformation.width} height={podium3DimensionsReact.height} fill="#9087E5" />
            <Polygon
              points={`
                ${0},${podium1DimensionsReact.height * 0.05}
                ${responsiveWidth(podium2DimensionsInformation.width * 0.44)},${podium1DimensionsReact.height * 0.05}
                ${responsiveWidth(podium2DimensionsInformation.width * 0.4)},${0}
                ${0},${0}
              `}
              fill="#AEA7EC"
            />

            <Text
              x="40%"
              y={responsiveHeight(podium3DimensionsReact.height * 0.17)}
              fill="white"
              fontSize={responsiveWidth(35)}
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

export default PodiumSvg9Inches;
