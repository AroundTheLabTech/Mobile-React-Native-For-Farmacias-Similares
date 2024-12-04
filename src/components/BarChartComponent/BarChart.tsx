import React, {  } from 'react';
import { Dimensions, View } from 'react-native';
import { Svg, Rect, G, Text as SVGText, Line, Ellipse } from 'react-native-svg';
import { colors, fontSizes, fontWeight } from '../../../global-class';
import BarChartStyles from './style/BarChartStyles';
import { divideNumberIntoPortions } from '../../utils/helpers';

interface Stat {
  label: string;
  value: number;
  maxValue: number;
}

interface CategoryData {
  category: string;
  stats: Stat[];
}

interface GroupedBarChartProps {
  data: CategoryData[];
  barColor?: string;
  listOfColors: string[];
}

const BarChart: React.FC<GroupedBarChartProps> = ({ data, listOfColors }) => {
  const chartHeight = 150; // Altura total del gráfico
  const { width: screenWidth } = Dimensions.get('window');

  if(!data) {
    return null;
  }

  return (
    <View style={BarChartStyles.container}>
      <Svg height="250" width="100%">
        {data.map((e, index) => {
          const x = index * 100;

          if (!e.category) {
            return null;
          }

          return (
            <G key={index} x={x}>
              <Ellipse x={index + 10} y={5} cx={5} cy={5} rx={5} ry={5} fill={listOfColors[index]} />
              <SVGText
                x={25}
                y={15}
                fontSize={fontSizes.xs}
                fill={colors.primary}
                textAnchor="start"
                fontWeight={fontWeight.xxxl}
              >
                {e.category}
              </SVGText>
            </G>);
        })}

        {/* Líneas horizontales y etiquetas de porcentaje */}
        {divideNumberIntoPortions(100).map((percentage, index) => {
          const y = chartHeight - (percentage / 100) * chartHeight + 40;

          return (
            <G key={index}>
              {/* Línea horizontal interrumpida */}
              <Line
                x1="25"
                x2={screenWidth}
                y1={y}
                y2={y}
                stroke={colors.primaryDegrad50}
                strokeDasharray="6 6"
                strokeWidth="1"
              />
              {/* Etiqueta de porcentaje en el eje izquierdo */}
              <SVGText
                x="5"
                y={y + 4}
                fontSize={fontSizes.xs}
                fill={colors.primary}
                textAnchor="start"
                fontWeight={fontWeight.xxxl}
              >
                {percentage}%
              </SVGText>
            </G>
          );
        })}

        {/* Barras de datos */}
        {data.map((categoryData, categoryIndex) => {
          // const groupOffset = categoryIndex > 0 ? categoryIndex * 80 : 5; // Espacio entre categorías
          const barWidth = ((screenWidth * 0.8) / 3) * 0.3;
          const groupOffset = (categoryIndex > 0 ? (screenWidth * 0.16) * categoryIndex : screenWidth * 0.01) + barWidth; // Espacio entre categorías

          return (
            <G key={categoryIndex} x={groupOffset}>

              {/* Barras individuales de la categoría */}
              {categoryData.stats.map((stat, statIndex) => {
                // const barHeight = (stat.value / stat.maxValue) * chartHeight;
                const barHeight = (stat.value / stat.maxValue) * chartHeight;
                // const x = barWidth * (categoryIndex > 0 ? categoryIndex * 2 : 1); // Espacio entre barras
                const x =  groupOffset * 0.4;
                const y = chartHeight - barHeight + 40;

                return (
                  <G key={statIndex} x={x}>
                    {/* Barra */}
                    <Rect
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill={listOfColors[categoryIndex]}
                      rx="5"
                    />
                    {/* Etiqueta de la métrica */}
                    <SVGText
                      x={barWidth * 0.5}
                      y={y + barHeight + 20} // Ajusta la posición vertical de la etiqueta
                      fontSize={fontSizes.xxxs}
                      fill={colors.primary}
                      textAnchor="middle"
                      fontWeight={fontWeight.xxxl}
                    >
                      {stat.value}
                      {/**
                       / {stat.maxValue}
                      */}
                    </SVGText>
                    <SVGText
                      x={barWidth * 0.5}
                      y={y + barHeight + 35} // Ajusta la posición vertical de la etiqueta
                      fontSize={fontSizes.xxxs}
                      fill={colors.primary}
                      fontWeight={fontWeight.xxxl}
                      textAnchor="middle"
                    >
                      {stat.label}
                    </SVGText>
                  </G>
                );
              })}
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

export default BarChart;
