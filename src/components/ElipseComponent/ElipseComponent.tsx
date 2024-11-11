import React from 'react';
import { View } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';

interface IEllipseComponent {
  width: number,
  height: number,
  color: string,
  hiden?: boolean
}

const EllipseComponent: React.FC<IEllipseComponent> = ({ width, height, color, hiden = false }) => {
  if (hiden) { return null; }



  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg height={height} width={width}>
        <Ellipse
          cx={width * 0.25}
          cy={height * 0.25}
          rx={width * 0.25}
          ry={height * 0.25}
          fill={color}
        />
      </Svg>
    </View>
  );
};

export default EllipseComponent;
