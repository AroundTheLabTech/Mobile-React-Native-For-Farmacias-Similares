import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import RingChartStyle from './style/RingChartStyles';

interface RingChartProps {
  progress?: number;      // Valor del progreso (0-100)
  color?: string;         // Color del anillo
  backgroundColor?: string; // Color de fondo del anillo
  children: React.ReactElement;
}

const screenDimensions: Record<string, { width: number; height: number; height2: number }> = {
  '480p': {
    width: 540.8450776871839,
    height: 787.6056443819616,
    height2: 787.6056443819616,
  },
  '720p': {
    width: 540.8450413639423,
    height: 945.727648718338,
    height2: 945.727648718338,
  },
  '1080p': {
    width: 540,
    height: 949.5,
    height2: 949.5,
  },
  '2040p': {
    width: 411.42857142857144,
    height: 914.2857142857143,
    height2: 890.2857142857143,
  },
  '2040pH': {
    width: 914.2857142857143,
    height: 387.42857142857144,
    height2: 387.42857142857144,
  },
};

const validateSizes = (width: number, height: number) => {
  if (
    screenDimensions['480p'].width === width &&
    screenDimensions['480p'].height === height
  ) {
    return {
      size: width * 0.1,
      x: (width * 0.8) * 0.105,
      y: 0,
      stroke: 6,
    };
  } else if (
    screenDimensions['720p'].width === width &&
    screenDimensions['720p'].height === height
  ) {
    return {
      size: width * 0.2,
      x: (width * 0.8) * 0.13,
      y: 0,
      stroke: 8,
    };
  } else if (
    screenDimensions['1080p'].width === width &&
    screenDimensions['1080p'].height === height
  ) {
    return {
      size: width * 0.3,
      x: (width * 0.8) * 0.19,
      y: 0,
      stroke: 10,
    };
  } else if (
    screenDimensions['2040p'].width === width &&
    (screenDimensions['2040p'].height === height || screenDimensions['2040p'].height2 === height)
  ) {
    return {
      size: width * 0.5,
      x: (width * 0.8) * 0.2,
      y: 0,
      stroke: 12,
    };
  } else if (
    screenDimensions['2040pH'].width === width &&
    (screenDimensions['2040pH'].height === height || screenDimensions['2040pH'].height2 === height)
  ) {
    return {
      size: width * 0.2,
      x: (width * 0.8) * 0.37,
      y: 0,
      stroke: 12,
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
      if (updateWidth > updateHeight) {
        setScreenHeight(updateHeight * 0.5);
      } else {
        setScreenHeight(updateHeight * 0.24);
      }
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

  const [ringhDimensions, setRinghDimensions] = useState({ width: 0, height: 0 });

  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout; // Obtener el ancho
    console.log(width, height);
    setRinghDimensions({ width, height });
  };


  return (
    <View style={[RingChartStyle.container, { width: screenWidth, height: screenHeight}]} onLayout={handleLayout}>
      <Svg width={ringhDimensions.width} height={ringhDimensions.height}>
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
