import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useSettings } from "../context/SettingsContext";

const productCardText = {
  en: {
    unknownProduct: "Unknown Product",
    category: "Category",
    general: "General",
    price: "Price",
    stock: "Stock",
    available: "Available",
    lowStock: "Low Stock",
    outOfStock: "Out of Stock",
    edit: "Edit",
    delete: "Delete",
  },

  ar: {
    unknownProduct: "منتج غير معروف",
    category: "التصنيف",
    general: "عام",
    price: "السعر",
    stock: "المخزون",
    available: "متوفر",
    lowStock: "مخزون منخفض",
    outOfStock: "غير متوفر",
    edit: "تعديل",
    delete: "حذف",
  },

  he: {
    unknownProduct: "מוצר לא ידוע",
    category: "קטגוריה",
    general: "כללי",
    price: "מחיר",
    stock: "מלאי",
    available: "זמין",
    lowStock: "מלאי נמוך",
    outOfStock: "אזל מהמלאי",
    edit: "ערוך",
    delete: "מחק",
  },
};

export default function ProductCard({ item, openEditProduct, confirmDelete }) {
  const { settings, isRTL, theme, formatMoney } = useSettings();

  const stock = Number(item.stock || 0);
  const outOfStock = stock <= 0;
  const lowStock = stock > 0 && stock <= 5;

  function tr(key) {
    return (
      productCardText[settings.language]?.[key] ||
      productCardText.en[key] ||
      key
    );
  }

  function getBadgeText() {
    if (outOfStock) return tr("outOfStock");
    if (lowStock) return tr("lowStock");
    return tr("available");
  }

  function getBadgeStyle() {
    if (outOfStock) return styles.dangerBadge;
    if (lowStock) return styles.warningBadge;
    return styles.goodBadge;
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.productImage}
          resizeMode="cover"
        />
      ) : null}

      <View
        style={[
          styles.cardHeader,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <View style={styles.cardInfo}>
          <Text
            style={[
              styles.cardTitle,
              {
                color: theme.text,
                textAlign: isRTL ? "right" : "left",
              },
            ]}
          >
            {item.name || tr("unknownProduct")}
          </Text>

          <Text
            style={[
              styles.cardText,
              {
                color: theme.muted,
                textAlign: isRTL ? "right" : "left",
              },
            ]}
          >
            {tr("category")}: {item.category || tr("general")}
          </Text>

          <Text
            style={[
              styles.cardStrong,
              {
                color: theme.text,
                textAlign: isRTL ? "right" : "left",
              },
            ]}
          >
            {tr("price")}: {formatMoney(item.price)}
          </Text>

          <Text
            style={[
              styles.cardText,
              {
                color: theme.muted,
                textAlign: isRTL ? "right" : "left",
              },
            ]}
          >
            {tr("stock")}: {stock}
          </Text>

          {item.description ? (
            <Text
              style={[
                styles.notesText,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {item.description}
            </Text>
          ) : null}
        </View>

        <View style={getBadgeStyle()}>
          <Text style={styles.badgeText}>{getBadgeText()}</Text>
        </View>
      </View>

      <View
        style={[
          styles.cardActions,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <Pressable
          style={[styles.cardButton, styles.editButton]}
          onPress={() => openEditProduct(item)}
        >
          <Text style={styles.cardButtonText}>{tr("edit")}</Text>
        </Pressable>

        <Pressable
          style={[styles.cardButton, styles.deleteButton]}
          onPress={() => confirmDelete("product", item)}
        >
          <Text style={styles.cardButtonText}>{tr("delete")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  productImage: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: "#E5E7EB",
  },

  cardHeader: {
    justifyContent: "space-between",
    gap: 10,
  },

  cardInfo: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "900",
  },

  cardText: {
    fontSize: 14,
    marginTop: 5,
  },

  cardStrong: {
    fontSize: 15,
    marginTop: 5,
    fontWeight: "900",
  },

  warningBadge: {
    backgroundColor: "#F59E0B",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignSelf: "flex-start",
  },

  goodBadge: {
    backgroundColor: "#16A34A",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignSelf: "flex-start",
  },

  dangerBadge: {
    backgroundColor: "#DC2626",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignSelf: "flex-start",
  },

  badgeText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 12,
  },

  notesText: {
    backgroundColor: "#F9FAFB",
    color: "#374151",
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },

  cardActions: {
    gap: 10,
    marginTop: 14,
  },

  cardButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
  },

  editButton: {
    backgroundColor: "#111827",
  },

  deleteButton: {
    backgroundColor: "#DC2626",
  },

  cardButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    textAlign: "center",
    fontSize: 15,
  },
});