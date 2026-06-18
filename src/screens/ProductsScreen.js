import React from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import SearchBox from "../components/SearchBox";
import ProductCard from "../components/ProductCard";
import { useSettings } from "../context/SettingsContext";

const productsText = {
  en: {
    searchPlaceholder: "Search by product name or category...",
    addNewProduct: "+ Add New Product",
    noProductsFound: "No products found",
  },

  ar: {
    searchPlaceholder: "ابحث حسب اسم المنتج أو التصنيف...",
    addNewProduct: "+ إضافة منتج جديد",
    noProductsFound: "لا توجد منتجات",
  },

  he: {
    searchPlaceholder: "חפש לפי שם מוצר או קטגוריה...",
    addNewProduct: "+ הוסף מוצר חדש",
    noProductsFound: "לא נמצאו מוצרים",
  },
};

export default function ProductsScreen({
  search,
  setSearch,
  filteredProducts,
  refreshing,
  onRefresh,
  openAddModal,
  openEditProduct,
  confirmDelete,
}) {
  const { settings, theme } = useSettings();

  function tr(key) {
    return (
      productsText[settings.language]?.[key] ||
      productsText.en[key] ||
      key
    );
  }

  return (
    <View style={[styles.listScreen, { backgroundColor: theme.background }]}>
      <SearchBox
        placeholder={tr("searchPlaceholder")}
        value={search}
        onChangeText={setSearch}
      />

      <Pressable
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={() => openAddModal("product")}
      >
        <Text style={styles.addButtonText}>{tr("addNewProduct")}</Text>
      </Pressable>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            openEditProduct={openEditProduct}
            confirmDelete={confirmDelete}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={[styles.emptyText, { color: theme.muted }]}>
              {tr("noProductsFound")}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listScreen: {
    flex: 1,
  },

  addButton: {
    marginHorizontal: 14,
    marginTop: 12,
    marginBottom: 10,
    borderRadius: 16,
    paddingVertical: 14,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
    textAlign: "center",
  },

  listContent: {
    padding: 14,
    paddingBottom: 40,
  },

  emptyBox: {
    padding: 30,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 15,
    textAlign: "center",
  },
});