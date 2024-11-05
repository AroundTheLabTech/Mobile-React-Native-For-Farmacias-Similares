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

  return (<View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Svg height={height} width={width}>
      <Ellipse
        cx={width / 2}
        cy={height / 2}
        rx={width / 2}
        ry={height / 2}
        fill={color}
      />
    </Svg>
  </View>
  )
};

export default EllipseComponent;
