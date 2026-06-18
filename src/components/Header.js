import React from "react";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import { useSettings } from "../context/SettingsContext";

export default function Header() {
  const { t, theme, isRTL } = useSettings();

  return (
    <View style={[styles.header, { backgroundColor: theme.header }]}>
      <Text
        style={[
          styles.headerTitle,
          {
            textAlign: isRTL ? "right" : "left",
          },
        ]}
      >
        {t("appTitle")}
      </Text>

      <Text
        style={[
          styles.headerSubtitle,
          {
            textAlign: isRTL ? "right" : "left",
          },
        ]}
      >
        {t("appSubtitle")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 58 : (StatusBar.currentHeight || 0) + 18,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
  },

  headerSubtitle: {
    color: "#CBD5E1",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
});