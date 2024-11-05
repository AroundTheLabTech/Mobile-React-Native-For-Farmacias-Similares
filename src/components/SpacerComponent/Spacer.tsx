import React from 'react';
import { View } from 'react-native';

interface ISpacer {
  size?: number
}

const Spacer: React.FC<ISpacer> = ({ size = 10 }) => {

  return (
    <View style={{ height: size }} />
  );
};

export default Spacer;
