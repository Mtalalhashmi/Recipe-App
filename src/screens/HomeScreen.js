// src/screens/HomeScreen.js
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, SafeAreaView, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import FavoriteButton from '../components/FavoriteButton';
import { FavoritesContext } from '../context/FavoritesContext';
import { searchRecipes, getRandomRecipes, getSupportedDiets, getSupportedTypes } from '../api/recipeApi';
import colors from '../theme/colors';

const PAGE_SIZE = 20;

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState(null);
  const [diet, setDiet] = useState(null);

  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const [suggested, setSuggested] = useState([]);
  const [loadingSuggest, setLoadingSuggest] = useState(false);

  const diets = getSupportedDiets();
  const types = getSupportedTypes();
  const { favorites } = useContext(FavoritesContext);

  // Initial suggestions
  useEffect(() => {
    refreshSuggestions();
  }, []);

  const refreshSuggestions = async () => {
    setLoadingSuggest(true);
    const picks = await getRandomRecipes(6);
    setSuggested(picks);
    setLoadingSuggest(false);
  };

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      resetAndSearch();
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, type, diet]);

  const resetAndSearch = async () => {
    if (!query && !type && !diet) {
      setResults([]);
      setTotal(0);
      setOffset(0);
      return;
    }
    setLoading(true);
    const { results: r, totalResults } = await searchRecipes({
      query,
      type,
      diet,
      number: PAGE_SIZE,
      offset: 0,
    });
    setResults(r);
    setTotal(totalResults);
    setOffset(r.length);
    setLoading(false);
  };

  const loadMore = useCallback(async () => {
    if (loading) return;
    if (results.length >= total) return;
    setLoading(true);
    const { results: r } = await searchRecipes({
      query,
      type,
      diet,
      number: PAGE_SIZE,
      offset,
    });
    setResults((prev) => [...prev, ...r]);
    setOffset((prev) => prev + r.length);
    setLoading(false);
  }, [loading, results.length, total, query, type, diet, offset]);

  const openDetails = (item) => navigation.navigate('RecipeDetails', { id: item.id });

  const renderItem = ({ item }) => (
    <RecipeCard
      recipe={item}
      onPress={openDetails}
      rightAccessory={<FavoriteButton meal={item} colorInactive="#fff" />}
    />
  );

  const showSuggestions = !query && !type && !diet;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 12 }}>
        <SearchBar value={query} onChangeText={setQuery} />
        {/* Types */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          <Chip label="All types" active={!type} onPress={() => setType(null)} />
          {types.slice(0, 10).map((t) => (
            <Chip key={t} label={t} active={type === t} onPress={() => setType(t)} />
          ))}
        </ScrollView>
        {/* Diets */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
          <Chip label="All diets" active={!diet} onPress={() => setDiet(null)} />
          {diets.slice(0, 8).map((d) => (
            <Chip key={d} label={d} active={diet === d} onPress={() => setDiet(d)} />
          ))}
        </ScrollView>
      </View>

      {loading && results.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" />
      ) : showSuggestions ? (
        <FlatList
          data={suggested}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12, paddingBottom: 80, rowGap: 12 }}
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Suggested for you</Text>
                <TouchableOpacity onPress={refreshSuggestions} disabled={loadingSuggest}>
                  <View style={styles.refreshRow}>
                    <Ionicons name="refresh" size={16} color={colors.primary} />
                    <Text style={styles.refreshText}>{loadingSuggest ? 'Refreshing...' : 'Refresh'}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <Text style={{ color: colors.muted, marginTop: 2 }}>Tap a card to view details</Text>
            </View>
          }
        />
      ) : results.length === 0 ? (
        <View style={{ marginTop: 40, alignItems: 'center', paddingHorizontal: 16 }}>
          <Text style={{ color: colors.muted }}>No recipes found</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12, paddingBottom: 80, rowGap: 12 }}
          onEndReachedThreshold={0.4}
          onEndReached={loadMore}
          ListFooterComponent={
            results.length < total ? <ActivityIndicator style={{ marginVertical: 16 }} /> : <View style={{ height: 8 }} />
          }
        />
      )}
    </SafeAreaView>
  );
}

function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    marginRight: 8,
    backgroundColor: '#fff',
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: { color: colors.text, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  header: { paddingHorizontal: 12, marginBottom: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  refreshRow: { flexDirection: 'row', alignItems: 'center' },
  refreshText: { marginLeft: 6, color: colors.primary, fontWeight: '700' },
});