import React from "react";
import { Keyboard, StyleSheet, TextInput } from "react-native";

import { useSettings } from "../context/SettingsContext";

export default function SearchBox({ placeholder, value, onChangeText }) {
  const { isRTL, theme } = useSettings();

  return (
    <TextInput
      style={[
        styles.searchInput,
        {
          backgroundColor: theme.card,
          color: theme.text,
          textAlign: isRTL ? "right" : "left",
        },
      ]}
      placeholder={placeholder}
      placeholderTextColor={theme.muted}
      value={value}
      onChangeText={onChangeText}
      returnKeyType="search"
      onSubmitEditing={Keyboard.dismiss}
    />
  );
}

const styles = StyleSheet.create({
  searchInput: {
    marginHorizontal: 14,
    marginTop: 6,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});