import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  label?: string;
  bgColor?: string;
  iconSize?: number;
  onFilterSelected?: (filter: string) => void;
};

const options = ['Tous', 'Cette semaine', 'Ce mois'];

export default function DateFilterButton({
  label = 'Filtrer',
  bgColor = '#FFF',
  iconSize = 18,
  onFilterSelected
}: Props) {

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('Tous');

  const handleSelect = (option: string) => {
    setSelectedFilter(option);
    setShowDropdown(false);
    if (onFilterSelected) onFilterSelected(option);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: bgColor }]}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <MaterialIcons name="filter-list" size={iconSize} color="#36454F" />
        <Text style={styles.label}>{selectedFilter}</Text>
      </TouchableOpacity>

      {showDropdown && (
        <View style={styles.dropdown}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.optionItem}
              onPress={() => handleSelect(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'flex-start',
    position: 'relative',
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  label: {
    color: '#36454F',
    fontSize: 12,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    top: 50, 
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: 140,
    zIndex: 10,
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 14,
    color: '#36454F',
  },
});
