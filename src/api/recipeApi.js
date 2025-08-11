// src/api/recipeApi.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const BASE_URL = 'https://api.spoonacular.com/recipes';

// Prefer env-configured key
const API_KEY =
  Constants?.expoConfig?.extra?.SPOONACULAR_API_KEY ||
  process.env.SPOONACULAR_API_KEY ||
  'YOUR_API_KEY'; // set via app.config.js or env (see note below)

const api = axios.create({ baseURL: BASE_URL });

// Attach API key to every request
api.interceptors.request.use((config) => {
  config.params = { ...(config.params || {}), apiKey: API_KEY };
  return config;
});

const TTL = {
  search: 60 * 60 * 1000,       // 1h
  details: 24 * 60 * 60 * 1000, // 24h
  random: 10 * 60 * 1000,       // 10m
};

function serialize(params) {
  if (!params) return '';
  const keys = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null)
    .sort();
  return keys.map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
}
const cacheKey = (path, params) => `@api_cache:${path}?${serialize(params)}`;

async function requestWithCache(path, params = {}, ttl = TTL.search) {
  const key = cacheKey(path, params);
  const cachedRaw = await AsyncStorage.getItem(key);
  if (cachedRaw) {
    try {
      const cached = JSON.parse(cachedRaw);
      if (Date.now() - cached.ts < ttl) return cached.data; // fresh cache
    } catch {}
  }
  try {
    const res = await api.get(path, { params });
    const data = res.data;
    await AsyncStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
    return data;
  } catch (e) {
    // Fallback to cache if available
    if (cachedRaw) {
      try {
        return JSON.parse(cachedRaw).data;
      } catch {}
    }
    return null;
  }
}

// Search with filters/pagination
export async function searchRecipes({
  query = '',
  diet,
  cuisine,
  type,
  offset = 0,
  number = 20,
  sort = 'popularity',
} = {}) {
  const params = {
    query: query || undefined,
    diet: diet || undefined,
    cuisine: cuisine || undefined,
    type: type || undefined,
    addRecipeInformation: true,
    instructionsRequired: false,
    sort,
    number,
    offset,
  };

  const data = await requestWithCache('complexSearch', params, TTL.search);
  return {
    results: data?.results || [],
    totalResults: data?.totalResults ?? 0,
  };
}

export async function getRecipeDetails(id) {
  if (!id) return null;
  const data = await requestWithCache(`${id}/information`, { includeNutrition: true }, TTL.details);
  return data || null;
}

export async function getRandomRecipes(n = 6, tags) {
  // tags: comma separated diet/type/cuisine (optional)
  const data = await requestWithCache('random', { number: n, tags }, TTL.random);
  return data?.recipes || [];
}

export function getSupportedDiets() {
  return ['Gluten Free', 'Ketogenic', 'Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 'Primal', 'Whole30', 'Low FODMAP', 'Dairy Free'];
}

export function getSupportedTypes() {
  return ['main course', 'side dish', 'dessert', 'appetizer', 'salad', 'bread', 'breakfast', 'soup', 'beverage', 'sauce', 'marinade', 'fingerfood', 'snack', 'drink'];
}