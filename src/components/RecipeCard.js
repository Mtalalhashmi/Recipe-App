// src/components/RecipeCard.js
import React from 'react';
import { TouchableOpacity, View, ImageBackground, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import { getRecipeImage, getRecipeTitle, getPrimaryTag } from '../utils/format';

export default function RecipeCard({
  recipe,
  meal, // backward compat
  onPress,
  rightAccessory,
  compact = false,
  style,
}) {
  const item = recipe || meal;
  const title = getRecipeTitle(item);
  const img = getRecipeImage(item);
  const tag = getPrimaryTag(item);

  return (
    <TouchableOpacity
      onPress={() => onPress?.(item)}
      activeOpacity={0.85}
      style={[styles.card, compact ? styles.compactCard : styles.regularCard, style]}
    >
      <ImageBackground source={img ? { uri: img } : null} style={styles.image} imageStyle={styles.imageRadius}>
        <View style={styles.overlay} />
        <View style={styles.topRow}>
          {tag ? (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{tag}</Text>
            </View>
          ) : <View />}
          <View style={styles.accessory}>{rightAccessory}</View>
        </View>

        <View style={styles.bottom}>
          <Text numberOfLines={2} style={styles.title}>{title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
  compactCard: { height: 170 },
  regularCard: { height: 200 },
  image: { flex: 1, justifyContent: 'space-between' },
  imageRadius: { borderRadius: 12 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay },
  topRow: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { color: '#111', fontSize: 12, fontWeight: '600' },
  accessory: { marginLeft: 8 },
  bottom: { padding: 12 },
  title: { color: '#fff', fontSize: 16, fontWeight: '700' },
});