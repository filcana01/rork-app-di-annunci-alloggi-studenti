import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { useApp } from '@/hooks/use-app-context';
import { Colors, Shadows, Typography, Spacing, BorderRadius } from '@/constants/colors';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterPress: () => void;
}

export default function SearchBar({ onSearch, onFilterPress }: SearchBarProps) {
  const { t } = useApp();
  const [query, setQuery] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.text.secondary} />
        <TextInput
          style={styles.input}
          placeholder={t.search.searchPlaceholder}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => onSearch(query)}
          returnKeyType="search"
        />
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <SlidersHorizontal size={20} color={Colors.text.inverse} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.primary,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.medium,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.text.primary,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
});