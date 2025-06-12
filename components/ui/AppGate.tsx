import { useLocation } from '@/context/LocationContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import GradientScreen from './GradientScreen';

const MIN_SPLASH_TIME = 2500;

const AppGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading } = useLocation();
  const [shouldShowSplash, setShouldShowSplash] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!loading) {
        setShouldShowSplash(false);
      }
    }, MIN_SPLASH_TIME);

    if (!loading) {
      const finishSplash = setTimeout(
        () => setShouldShowSplash(false),
        MIN_SPLASH_TIME
      );
      return () => clearTimeout(finishSplash);
    }

    return () => clearTimeout(timeout);
  }, [loading]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);

  if (loading || shouldShowSplash) {
    return (
      <GradientScreen>
        <View style={styles.container}>
          <View style={[styles.logo, { backgroundColor: primary }]}>
            <Text style={styles.logoText}>WYP</Text>
          </View>

          <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
            <Text style={[styles.splashText, { color: text }]}>
              The price is yours to name.
            </Text>
          </Animated.View>
        </View>
      </GradientScreen>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 1,
  },
  textContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  splashText: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
});

export default AppGate;
