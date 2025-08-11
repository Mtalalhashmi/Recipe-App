// src/theme/styles.js
import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  row: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginVertical: 8 },
  chip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: { fontWeight: '600', color: colors.text, fontSize: 12 },
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
  },
});