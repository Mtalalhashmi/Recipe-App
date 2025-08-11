// src/screens/RecipeDetailsScreen.js
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, StyleSheet, Share, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRecipeDetails } from '../api/recipeApi';
import { FavoritesContext } from '../context/FavoritesContext';
import { parseIngredients, parseSteps, stripHtml, getCalories, formatMinutes } from '../utils/format';
import colors from '../theme/colors';

export default function RecipeDetailsScreen({ route }) {
  const id = route.params?.id ?? route.params?.idMeal; // backward compat
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    (async () => {
      const r = await getRecipeDetails(id);
      setRecipe(r);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  if (!recipe) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Recipe not found</Text>
      </View>
    );
  }

  const ingredients = parseIngredients(recipe);
  const steps = parseSteps(recipe);
  const fav = isFavorite(recipe.id);
  const calories = getCalories(recipe);

  const onShare = async () => {
    try {
      await Share.share({
        message: `${recipe.title}\nReady in: ${formatMinutes(recipe.readyInMinutes)} • Servings: ${recipe.servings}\n\n${stripHtml(recipe.summary || '').slice(0, 250)}...\n\n${recipe.sourceUrl || ''}`,
      });
    } catch {}
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <Image source={{ uri: recipe.image }} style={{ width: '100%', height: 240 }} />
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.meta}>
            {formatMinutes(recipe.readyInMinutes)}
            {recipe.servings ? ` • ${recipe.servings} servings` : ''}
            {calories ? ` • ${calories} kcal` : ''}
          </Text>
          {!!recipe.diets?.length && (
            <Text style={[styles.meta, { marginTop: 2 }]}>{recipe.diets.join(' • ')}</Text>
          )}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={onShare} style={{ padding: 8 }}>
            <Ionicons name="share-social-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFavorite(recipe)} style={{ padding: 8 }}>
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={28} color={fav ? 'tomato' : '#333'} />
          </TouchableOpacity>
        </View>
      </View>

      {recipe.summary ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.paragraph}>{stripHtml(recipe.summary)}</Text>
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {ingredients.map((it, idx) => (
          <Text key={idx} style={styles.ingredient}>• {it}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        {steps.length ? (
          steps.map((s, i) => (
            <Text key={i} style={styles.step}>{i + 1}. {s}</Text>
          ))
        ) : recipe.instructions ? (
          <Text style={styles.paragraph}>{stripHtml(recipe.instructions)}</Text>
        ) : (
          <Text style={styles.paragraph}>No instructions provided.</Text>
        )}
      </View>

      {!!recipe.sourceUrl && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Source</Text>
          <TouchableOpacity onPress={() => Linking.openURL(recipe.sourceUrl)}>
            <Text style={{ color: '#007bff' }} numberOfLines={1}>{recipe.sourceUrl}</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', padding: 12, alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700' },
  meta: { color: '#666', marginTop: 4 },
  section: { padding: 12, backgroundColor: '#fff', marginTop: 8 },
  sectionTitle: { fontWeight: '700', marginBottom: 8, fontSize: 16 },
  ingredient: { marginBottom: 4, color: colors.text },
  step: { marginBottom: 8, lineHeight: 20, color: colors.text },
  paragraph: { lineHeight: 20, color: colors.text },
});