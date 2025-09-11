import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

interface USILogoProps {
  size?: number;
  color?: string;
}

export default function USILogo({ size = 40, color = '#000000' }: USILogoProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="50" fill={color} />
        
        {/* USI Letters */}
        <Path
          d="M20 35 L20 65 Q20 70 25 70 L35 70 Q40 70 40 65 L40 50 Q40 45 35 45 L25 45"
          fill="white"
          strokeWidth="3"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        <Path
          d="M45 35 L45 65 M45 35 Q45 30 50 30 L60 30 Q65 30 65 35 L65 45 Q65 50 60 50 L50 50 Q45 50 45 55 L45 65 Q45 70 50 70 L60 70 Q65 70 65 65"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        <Path
          d="M75 35 L75 65 M75 35 L85 35 M75 50 L82 50"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});