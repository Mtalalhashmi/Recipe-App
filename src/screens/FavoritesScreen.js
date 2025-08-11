// src/screens/FavoritesScreen.js
import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FavoritesContext } from '../context/FavoritesContext';
import RecipeCard from '../components/RecipeCard';
import colors from '../theme/colors';

export default function FavoritesScreen({ navigation }) {
  const { favorites, toggleFavorite, clearFavorites } = useContext(FavoritesContext);
  const count = favorites.length;

  const renderItem = ({ item }) => (
    <View style={styles.gridItem}>
      <RecipeCard
        compact
        recipe={item}
        onPress={(r) => navigation.navigate('RecipeDetails', { id: r.id })}
        rightAccessory={<Ionicons name="heart" size={20} color="tomato" />}
      />
    </View>
  );

  if (count === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="heart-outline" size={48} color={colors.muted} />
        <Text style={styles.emptyTitle}>No favorites yet</Text>
        <Text style={styles.emptySubtitle}>Find a recipe you love and tap the heart to save it.</Text>
        <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.ctaText}>Discover recipes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Saved recipes ({count})</Text>
        <TouchableOpacity onPress={clearFavorites} style={styles.clearBtn}>
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
          <Text style={styles.clearText}>Clear all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: 12, paddingBottom: 80 },
  gridItem: { flex: 1, margin: 6 },
  headerRow: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  clearBtn: { flexDirection: 'row', alignItems: 'center' },
  clearText: { marginLeft: 6, color: colors.danger, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: colors.background },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 12 },
  emptySubtitle: { color: colors.muted, marginTop: 6, textAlign: 'center' },
  cta: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  ctaText: { color: '#fff', fontWeight: '700' },
});