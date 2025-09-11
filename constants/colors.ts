// Black and white color palette with USI branding
export const Colors = {
  // Primary colors - black and white only
  primary: {
    50: '#FFFFFF',
    100: '#F8F8F8',
    200: '#F0F0F0',
    300: '#E8E8E8',
    400: '#D0D0D0',
    500: '#000000', // Main black
    600: '#1A1A1A',
    700: '#333333',
    800: '#4D4D4D',
    900: '#666666',
  },
  
  // Neutral grays for clean, academic look
  neutral: {
    50: '#FFFFFF',
    100: '#F8F8F8',
    200: '#F0F0F0',
    300: '#E8E8E8',
    400: '#D0D0D0',
    500: '#B8B8B8',
    600: '#A0A0A0',
    700: '#888888',
    800: '#404040',
    900: '#000000',
  },
  
  // Semantic colors - keeping minimal black/white theme
  success: '#000000',
  warning: '#666666',
  error: '#000000',
  info: '#333333',
  
  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F8F8',
    tertiary: '#F0F0F0',
    dark: '#000000',
  },
  
  // Text colors
  text: {
    primary: '#000000',
    secondary: '#333333',
    tertiary: '#666666',
    inverse: '#FFFFFF',
    muted: '#888888',
  },
  
  // Border colors
  border: {
    light: '#F0F0F0',
    medium: '#E8E8E8',
    dark: '#D0D0D0',
    black: '#000000',
  },
};

// Shadow presets for consistent elevation
export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Typography scale
export const Typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing scale
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

// Border radius scale
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
};