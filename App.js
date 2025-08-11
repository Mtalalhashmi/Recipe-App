// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { enableScreens } from 'react-native-screens';

import AppNavigator from './src/navigation/AppNavigator';
import { FavoritesProvider } from './src/context/FavoritesContext';
import colors from './src/theme/colors';

enableScreens(true);

const LightNavTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: '#ffffff',
    text: colors.text,
    border: colors.border,
    notification: colors.primary,
  },
};

const DarkNavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: '#0B0D13',
    card: '#111827',
    text: '#F9FAFB',
    border: '#1F2937',
    notification: colors.primary,
  },
};

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? DarkNavTheme : LightNavTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <FavoritesProvider>
          <NavigationContainer theme={theme}>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
            <AppNavigator />
          </NavigationContainer>
        </FavoritesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}