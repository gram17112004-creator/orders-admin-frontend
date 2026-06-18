import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useSettings } from "../context/SettingsContext";

export default function StatCard({ value, label }) {
  const { isRTL, theme } = useSettings();

  return (
    <View style={[styles.statCard, { backgroundColor: theme.card }]}>
      <Text
        style={[
          styles.statValue,
          {
            color: theme.text,
            textAlign: isRTL ? "right" : "left",
          },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.statLabel,
          {
            color: theme.muted,
            textAlign: isRTL ? "right" : "left",
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    width: "48%",
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  statValue: {
    fontSize: 26,
    fontWeight: "900",
  },

  statLabel: {
    fontSize: 14,
    marginTop: 6,
  },
});