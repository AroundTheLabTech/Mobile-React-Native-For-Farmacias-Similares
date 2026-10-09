import React from 'react';
import Svg, {Rect, Line} from 'react-native-svg';

interface GameCardChipProps {
  width?: number;
  height?: number;
}

const GameCardChip: React.FC<GameCardChipProps> = ({
  width = 44,
  height = 34,
}) => (
  <Svg width={width} height={height} viewBox="0 0 44 34">
    <Rect
      x={0.5}
      y={0.5}
      width={43}
      height={33}
      rx={5}
      fill="#D4AF37"
      stroke="#B8960C"
      strokeWidth={1}
    />
    <Rect
      x={4}
      y={4}
      width={36}
      height={26}
      rx={3}
      fill="#E8C547"
      stroke="rgba(0,0,0,0.15)"
      strokeWidth={1}
    />
    <Line
      x1={28}
      y1={6}
      x2={28}
      y2={28}
      stroke="rgba(0,0,0,0.2)"
      strokeWidth={1}
    />
    <Line
      x1={8}
      y1={12}
      x2={24}
      y2={12}
      stroke="rgba(0,0,0,0.22)"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Line
      x1={8}
      y1={17}
      x2={24}
      y2={17}
      stroke="rgba(0,0,0,0.22)"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Line
      x1={8}
      y1={22}
      x2={24}
      y2={22}
      stroke="rgba(0,0,0,0.22)"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Line
      x1={32}
      y1={12}
      x2={38}
      y2={12}
      stroke="rgba(0,0,0,0.22)"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Line
      x1={32}
      y1={22}
      x2={38}
      y2={22}
      stroke="rgba(0,0,0,0.22)"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

export default GameCardChip;
