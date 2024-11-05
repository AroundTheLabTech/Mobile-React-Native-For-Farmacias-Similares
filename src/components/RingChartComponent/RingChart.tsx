import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import RingChartStyle from './style/RingChartStyles';

interface RingChartProps {
  size?: number;         // Tamaño del anillo
  strokeWidth?: number;   // Ancho del anillo
  progress?: number;      // Valor del progreso (0-100)
  color?: string;         // Color del anillo
  backgroundColor?: string; // Color de fondo del anillo
  children: React.ReactElement
}

const RingChart: React.FC<RingChartProps> = ({
  size = 100,
  strokeWidth = 10,
  progress = 50,
  color = '#3498db',
  backgroundColor = '#e0e0e0',
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={[RingChartStyle.container, { width: size, height: size }]}>
      <View style={RingChartStyle.ring} >
        <Svg width={size} height={size}>
          {/* Fondo del anillo */}
          <Circle
            stroke={backgroundColor}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Progreso del anillo */}
          <Circle
            stroke={color}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
      </View>
      <View style={RingChartStyle.center}>
        {children}
      </View>
    </View>
  );
};

export default RingChart;
