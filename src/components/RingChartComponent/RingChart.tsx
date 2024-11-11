import React, { useEffect, useState } from 'react';
import { View, Text, useWindowDimensions, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import RingChartStyle from './style/RingChartStyles';

interface RingChartProps {
  progress?: number;      // Valor del progreso (0-100)
  color?: string;         // Color del anillo
  backgroundColor?: string; // Color de fondo del anillo
  children: React.ReactElement;
}

const validateSizes = (width: number, height: number) => {
  if (width < 412 && width > 411 && height < 915 && height > 914) {
    return {
      size: width * 0.5,
      x: (width * 0.8) * 0.2,
      y: 0,
      stroke: 10,
    };
  } else if (width < 541 && width > 539 && height < 937 && height > 935) {
    return {
      size: width * 0.3,
      x: (width * 0.8) * 0.2,
      y: 0,
      stroke: 10,
    };
  } else if (width < 541 && width > 540 && height < 926 && height > 925) {
    return {
      size: width * 0.2,
      x: (width * 0.8) * 0.13,
      y: 0,
      stroke: 8,
    };
  } else {
    return {
      size: width * 0.15,
      x: (width * 0.8) * 0.28,
      y: 0,
      stroke: 10,
    };
  }
};

const RingChart: React.FC<RingChartProps> = ({
  progress = 50,
  color = '#3498db',
  backgroundColor = '#e0e0e0',
  children,
}) => {
  const { width } = Dimensions.get('window');
  const [screenWidth, setScreenWidth] = useState(width);
  const [screenHeight, setScreenHeight] = useState(width);
  const [positionX, setPositionX] = useState(width);
  const [positionY, setPositionY] = useState(width);
  const [adjustedSize, setAdjustedSize] = useState(screenWidth);
  const [strokeWidth, setStrokeWidth] = useState(10);
  const [radius, setRadius] = useState((adjustedSize - strokeWidth) / 2);
  const [circumference, setCircumference] = useState(2 * Math.PI * radius);
  const [strokeDashoffset, setStrokeDashoffset] = useState(circumference - (progress / 100) * circumference);

  useEffect(() => {
    function updateDimension() {
      const { width: updateWidth, height: updateHeight } = Dimensions.get('window');
      const { size, x, y, stroke } = validateSizes(updateWidth, updateHeight);
      setScreenWidth(updateWidth * 0.8);
      setScreenHeight(updateHeight * 0.23);
      setPositionX(x);
      setPositionY(y);
      setStrokeWidth(stroke);
      setAdjustedSize(size);
      setRadius((adjustedSize - strokeWidth) / 2);
      setCircumference(2 * Math.PI * radius);
      setStrokeDashoffset(circumference - (progress / 100) * circumference);
    }

    updateDimension();
  }, [adjustedSize, circumference, progress, radius, strokeWidth, width]);

  return (
    <View style={[RingChartStyle.container, { width: screenWidth, height: screenHeight}]}>
      <Svg width={screenWidth} height={screenHeight}>
        {/* Fondo del anillo */}
        <Circle
          x={positionX}
          y={positionY}
          stroke={backgroundColor}
          fill="none"
          cx={adjustedSize / 2}
          cy={adjustedSize / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progreso del anillo */}
        <Circle
          x={positionX}
          y={positionY}
          stroke={color}
          fill="none"
          cx={adjustedSize / 2}
          cy={adjustedSize / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${adjustedSize / 2}, ${adjustedSize / 2}`}
        />
      </Svg>
      <View style={[RingChartStyle.center, { position: 'absolute', width: screenWidth, height: screenHeight }]}>
        {children}
      </View>
    </View>
  );
};

export default RingChart;
