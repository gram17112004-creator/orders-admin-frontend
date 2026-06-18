import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useSettings } from "../context/SettingsContext";

const customerCardText = {
  en: {
    unknownCustomer: "Unknown Customer",
    unknown: "Unknown",
    phone: "Phone",
    address: "Address",
    ordersCount: "Orders Count",
    totalPurchases: "Total Purchases",
    notes: "Notes",
    edit: "Edit",
    delete: "Delete",
  },

  ar: {
    unknownCustomer: "زبون غير معروف",
    unknown: "غير معروف",
    phone: "الهاتف",
    address: "العنوان",
    ordersCount: "عدد الطلبات",
    totalPurchases: "إجمالي المشتريات",
    notes: "ملاحظات",
    edit: "تعديل",
    delete: "حذف",
  },

  he: {
    unknownCustomer: "לקוח לא ידוע",
    unknown: "לא ידוע",
    phone: "טלפון",
    address: "כתובת",
    ordersCount: "מספר הזמנות",
    totalPurchases: "סה״כ רכישות",
    notes: "הערות",
    edit: "ערוך",
    delete: "מחק",
  },
};

export default function CustomerCard({
  item,
  getCustomerOrderCount,
  getCustomerTotalPurchases,
  openEditCustomer,
  confirmDelete,
}) {
  const { settings, isRTL, theme, formatMoney } = useSettings();

  function tr(key) {
    return (
      customerCardText[settings.language]?.[key] ||
      customerCardText.en[key] ||
      key
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
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
            {item.name || tr("unknownCustomer")}
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
            {tr("phone")}: {item.phone || tr("unknown")}
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
            {tr("address")}: {item.address || tr("unknown")}
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
            {tr("ordersCount")}: {getCustomerOrderCount(item)}
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
            {tr("totalPurchases")}:{" "}
            {formatMoney(getCustomerTotalPurchases(item))}
          </Text>

          {item.notes ? (
            <Text
              style={[
                styles.notesText,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {tr("notes")}: {item.notes}
            </Text>
          ) : null}
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
          onPress={() => openEditCustomer(item)}
        >
          <Text style={styles.cardButtonText}>{tr("edit")}</Text>
        </Pressable>

        <Pressable
          style={[styles.cardButton, styles.deleteButton]}
          onPress={() => confirmDelete("customer", item)}
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