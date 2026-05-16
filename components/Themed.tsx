import React from 'react';
import { 
  Text as DefaultText, 
  View as DefaultView, 
  useColorScheme, 
  StyleSheet, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { useApp } from '../store/appContext';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { themeOverride } = useApp();
  const systemTheme = useColorScheme() ?? 'light';
  const theme = themeOverride ?? systemTheme;
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color, fontFamily: 'System' }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  
  if (!lightColor && !darkColor) {
    return <DefaultView style={style} {...otherProps} />;
  }
  
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

/**
 * ScreenContainer ensures dark mode reaches all screens and corners.
 */
export function ScreenContainer(props: ViewProps & { safeTop?: boolean }) {
  const { style, lightColor, darkColor, safeTop = true, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const insets = useSafeAreaInsets();
  const { themeOverride } = useApp();
  const systemTheme = useColorScheme() ?? 'light';
  const theme = themeOverride ?? systemTheme;

  return (
    <View 
      style={[
        { 
          flex: 1, 
          backgroundColor,
          // Add global top padding to prevent content from hitting the status bar/notch
          paddingTop: safeTop ? Math.max(insets.top, 16) : 0 
        }, 
        style
      ]} 
      {...otherProps}
    >
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      {props.children}
    </View>
  );
}

export function Card(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'card');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'border');
  const { themeOverride } = useApp();
  const systemTheme = useColorScheme() ?? 'light';
  const theme = themeOverride ?? systemTheme;

  return (
    <DefaultView 
      style={[
        { 
          backgroundColor, 
          borderColor, 
          borderWidth: 1, 
          borderRadius: 20, // More rounded for premium feel
          padding: 16,
          // Subtle shadow for light mode, deep shadow for dark mode
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: theme === 'dark' ? 0.4 : 0.05,
          shadowRadius: 12,
          elevation: 4,
        }, 
        style
      ]} 
      {...otherProps} 
    />
  );
}
