import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSettings } from "../context/SettingsContext";

const tabs = [
  { key: "dashboard", labelKey: "dashboard" },
  { key: "orders", labelKey: "orders" },
  { key: "products", labelKey: "products" },
  { key: "customers", labelKey: "customers" },
  { key: "reports", labelKey: "reports" },
  { key: "settings", labelKey: "settings" },
];

export default function Tabs({ activeScreen, onChangeScreen }) {
  const { t, theme } = useSettings();

  return (
    <View style={[styles.tabsWrapper, { backgroundColor: theme.background }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
      >
        {tabs.map((screen) => {
          const active = activeScreen === screen.key;

          return (
            <Pressable
              key={screen.key}
              style={[
                styles.tabButton,
                {
                  backgroundColor: active ? theme.primary : theme.card,
                  borderColor: active ? theme.primary : "#E5E7EB",
                },
              ]}
              onPress={() => onChangeScreen(screen.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: active ? "#FFFFFF" : theme.muted,
                  },
                ]}
              >
                {t(screen.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  tabsRow: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 8,
    gap: 8,
    flexDirection: "row",
  },

  tabButton: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 999,
    borderWidth: 1,
    minWidth: 105,
    alignItems: "center",
  },

  tabText: {
    fontWeight: "900",
    fontSize: 13,
  },
});