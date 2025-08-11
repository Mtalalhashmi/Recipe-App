// src/context/FavoritesContext.js
import React, { createContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoritesContext = createContext();

const STORAGE_KEY_NEW = '@favorite_recipes';
const STORAGE_KEY_OLD = '@favorite_meals'; // migration support

const toMinimal = (item) => {
  if (!item) return null;
  const id = item.id ?? item.idMeal;
  if (!id) return null;
  return {
    id,
    title: item.title ?? item.strMeal ?? 'Untitled',
    image: item.image ?? item.strMealThumb ?? null,
    readyInMinutes: item.readyInMinutes ?? null,
    servings: item.servings ?? null,
    dishTypes: item.dishTypes ?? (item.strCategory ? [item.strCategory] : []),
    diets: item.diets ?? [],
  };
};

export const FavoritesProvider = ({ children }) => {
  const [map, setMap] = useState({}); // { [id]: recipeMinimal }

  useEffect(() => {
    (async () => {
      try {
        // Load new store first
        let raw = await AsyncStorage.getItem(STORAGE_KEY_NEW);
        if (!raw) {
          // Try migrate from old key
          const old = await AsyncStorage.getItem(STORAGE_KEY_OLD);
          if (old) {
            const oldObj = JSON.parse(old) || {};
            const migrated = {};
            Object.values(oldObj).forEach((m) => {
              const min = toMinimal(m);
              if (min) migrated[min.id] = min;
            });
            setMap(migrated);
            await AsyncStorage.setItem(STORAGE_KEY_NEW, JSON.stringify(migrated));
            // Optionally: await AsyncStorage.removeItem(STORAGE_KEY_OLD);
            return;
          }
        }
        if (raw) setMap(JSON.parse(raw));
      } catch (e) {
        console.warn('Failed to load favorites', e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY_NEW, JSON.stringify(map));
      } catch (e) {
        console.warn('Failed to save favorites', e);
      }
    })();
  }, [map]);

  const toggleFavorite = (item) => {
    const min = toMinimal(item);
    if (!min) return;
    setMap((prev) => {
      const exists = !!prev[min.id];
      if (exists) {
        const copy = { ...prev };
        delete copy[min.id];
        return copy;
      } else {
        return { ...prev, [min.id]: min };
      }
    });
  };

  const clearFavorites = () => setMap({});

  const isFavorite = (id) => !!map[id];

  const favorites = useMemo(() => Object.values(map), [map]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};