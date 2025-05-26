import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LinearGradient } from 'expo-linear-gradient';
import * as NavigationBar from 'expo-navigation-bar';
import { useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GradientScreen({
  children,
  style,
  ...props
}: ViewProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const background = useThemeColor({}, 'background');
  const gradientStart = useThemeColor(
    { light: '#d4f7dc', dark: '#263a2e' },
    'background'
  );
  const gradientEnd = useThemeColor(
    { light: '#ffffff', dark: '#181c1f' },
    'background'
  );

  const navigation = useNavigation();

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setStyle(colorScheme === 'dark' ? 'light' : 'dark');
    }
  }, [colorScheme]);

  return (
    <LinearGradient
      colors={[gradientStart, gradientEnd]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.15 }}
    >
      <SafeAreaView style={[styles.container]} edges={['top']} {...props}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
});
