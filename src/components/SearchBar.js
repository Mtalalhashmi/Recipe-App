// src/components/SearchBar.js
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

export default function SearchBar({
  value,
  onChangeText,
  onSubmitEditing,
  placeholder = 'Search by name or ingredient...',
  autoFocus = false,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search" size={18} color={colors.muted} style={{ marginRight: 8 }} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        autoFocus={autoFocus}
        onSubmitEditing={onSubmitEditing}
        style={styles.input}
        returnKeyType="search"
        clearButtonMode="never"
      />
      {value?.length ? (
        <TouchableOpacity onPress={() => onChangeText?.('')}>
          <Ionicons name="close-circle" size={20} color={colors.muted} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  input: { flex: 1, fontSize: 14, color: colors.text },
});