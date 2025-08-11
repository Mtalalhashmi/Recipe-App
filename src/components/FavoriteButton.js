// src/components/FavoriteButton.js
import React, { useContext, useMemo, useRef } from 'react';
import { Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FavoritesContext } from '../context/FavoritesContext';

export default function FavoriteButton({ meal, size = 24, colorActive = 'tomato', colorInactive = '#fff' }) {
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);
  const fav = isFavorite(meal.idMeal);
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.2, useNativeDriver: true, speed: 20 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }),
    ]).start();
    toggleFavorite(meal);
  };

  const iconName = useMemo(() => (fav ? 'heart' : 'heart-outline'), [fav]);

  return (
    <Pressable onPress={handlePress} hitSlop={10}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons name={iconName} size={size} color={fav ? colorActive : colorInactive} />
      </Animated.View>
    </Pressable>
  );
}