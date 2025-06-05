import GradientScreen from '@/components/ui/GradientScreen';
import { LocationProvider } from '@/context/LocationContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Roboto_400Regular,
  });

  if (!loaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <LocationProvider>
          <View style={StyleSheet.absoluteFill}>
            <GradientScreen />
          </View>

          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
              animation: 'fade',
            }}
          >
            <Stack.Screen name='auth/LoginScreen' />
            <Stack.Screen name='auth/OTPScreen' />
            <Stack.Screen name='auth/UserDetailsScreen' />
            <Stack.Screen name='(tabs)' />
            <Stack.Screen name='+not-found' />
          </Stack>
        </LocationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
