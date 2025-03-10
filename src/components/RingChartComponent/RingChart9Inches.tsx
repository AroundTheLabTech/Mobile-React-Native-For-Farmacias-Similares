import React, { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import RingChart9InchesStyle from './style/RingChartStyles';

interface RingChart9InchesProps {
  progress?: number;      // Valor del progreso (0-100)
  color?: string;         // Color del anillo
  backgroundColor?: string; // Color de fondo del anillo
  children: React.ReactElement;
}

const RingChart9Inches: React.FC<RingChart9InchesProps> = ({
  progress = 50,
  color = '#3498db',
  backgroundColor = '#e0e0e0',
  children,
}) => {
  const [ringhDimensions, setRinghDimensions] = useState({ width: 0, height: 0 });

  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout; // Obtener el ancho
    setRinghDimensions({ width, height });
  };


  return (
    <View style={RingChart9InchesStyle.container} onLayout={handleLayout}>
      <Svg width={ringhDimensions.width} height={ringhDimensions.height}>
        {/* Fondo del anillo */}
        <Circle
          x={0}
          y={-(ringhDimensions.height * 0.22)}
          stroke={backgroundColor}
          fill="none"
          cx={ringhDimensions.width / 2}
          cy={ringhDimensions.width / 3.5}
          r={(ringhDimensions.height - 10) / 2.5}
          strokeWidth={20}
        />
        {/* Progreso del anillo */}
        <Circle
          x={0}
          y={-(ringhDimensions.height * 0.22)}
          stroke={color}
          fill="none"
          cx={ringhDimensions.width / 1.4}
          cy={ringhDimensions.width / 2}
          r={(ringhDimensions.height - 10) / 2.5}
          strokeWidth={20}
          strokeDasharray={`${(2 * Math.PI * ((ringhDimensions.height - 10) / 2))} ${(2 * Math.PI * ((ringhDimensions.height - 10) / 2))}`}
          strokeDashoffset={(2 * Math.PI * ((ringhDimensions.height - 10) / 2)) - (progress / 100) * (2 * Math.PI * ((ringhDimensions.height - 10) / 2))}
          strokeLinecap="round"
          rotation="-90"
          origin={`${ringhDimensions.width / 2}, ${ringhDimensions.width / 2}`}
        />
      </Svg>
      <View style={RingChart9InchesStyle.center}>
        {children}
      </View>
    </View>
  );
};

export default RingChart9Inches;
