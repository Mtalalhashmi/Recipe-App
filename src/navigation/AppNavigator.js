// src/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import RecipeDetailsScreen from '../screens/RecipeDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import colors from '../theme/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Discover' }} />
      <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} options={{ title: 'Recipe' }} />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favorites' }} />
      <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} options={{ title: 'Recipe' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarIcon: ({ color, size, focused }) => {
          let name = 'home-outline';
          if (route.name === 'HomeTab') name = focused ? 'home' : 'home-outline';
          if (route.name === 'FavoritesTab') name = focused ? 'heart' : 'heart-outline';
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="FavoritesTab" component={FavoritesStack} options={{ title: 'Favorites' }} />
    </Tab.Navigator>
  );
}