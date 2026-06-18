import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ORDER_STATUSES } from "../constants/appConstants";
import { useSettings } from "../context/SettingsContext";

const orderCardText = {
  en: {
    unknownProduct: "Unknown Product",
    unknownCustomer: "Unknown",
    customer: "Customer",
    phone: "Phone",
    quantity: "Quantity",
    total: "Total",
    payment: "Payment",
    notes: "Notes",
    changeStatus: "Change Status",
    details: "Details",
    edit: "Edit",
    delete: "Delete",

    pending: "Pending",
    processing: "Processing",
    completed: "Completed",
    cancelled: "Cancelled",

    cash: "Cash",
    card: "Card",
    bank: "Bank Transfer",
    other: "Other",
  },

  ar: {
    unknownProduct: "منتج غير معروف",
    unknownCustomer: "غير معروف",
    customer: "الزبون",
    phone: "الهاتف",
    quantity: "الكمية",
    total: "المجموع",
    payment: "الدفع",
    notes: "ملاحظات",
    changeStatus: "تغيير الحالة",
    details: "تفاصيل",
    edit: "تعديل",
    delete: "حذف",

    pending: "معلق",
    processing: "قيد المعالجة",
    completed: "مكتمل",
    cancelled: "ملغي",

    cash: "نقدًا",
    card: "بطاقة",
    bank: "تحويل بنكي",
    other: "أخرى",
  },

  he: {
    unknownProduct: "מוצר לא ידוע",
    unknownCustomer: "לא ידוע",
    customer: "לקוח",
    phone: "טלפון",
    quantity: "כמות",
    total: "סה״כ",
    payment: "תשלום",
    notes: "הערות",
    changeStatus: "שינוי סטטוס",
    details: "פרטים",
    edit: "ערוך",
    delete: "מחק",

    pending: "ממתין",
    processing: "בטיפול",
    completed: "הושלם",
    cancelled: "בוטל",

    cash: "מזומן",
    card: "כרטיס",
    bank: "העברה בנקאית",
    other: "אחר",
  },
};

export default function OrderCard({
  item,
  getOrderUnitPrice,
  getOrderTotal,
  updateOrderStatus,
  openOrderDetails,
  openEditOrder,
  confirmDelete,
}) {
  const { settings, isRTL, theme, formatMoney } = useSettings();

  const unitPrice = getOrderUnitPrice(item);
  const total = getOrderTotal(item);

  function tr(key) {
    return (
      orderCardText[settings.language]?.[key] ||
      orderCardText.en[key] ||
      key
    );
  }

  function getStatusLabel(status) {
    return tr(status) || status;
  }

  function getPaymentLabel(paymentMethod) {
    return tr(paymentMethod) || paymentMethod || tr("cash");
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
            {item.productName || tr("unknownProduct")}
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
            {tr("customer")}: {item.customerName || tr("unknownCustomer")}
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
            {tr("phone")}: {item.customerPhone || tr("unknownCustomer")}
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
            {tr("quantity")}: {item.quantity || 1} × {formatMoney(unitPrice)}
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
            {tr("total")}: {formatMoney(total)}
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
            {tr("payment")}: {getPaymentLabel(item.paymentMethod)}
          </Text>
        </View>

        <View style={[styles.statusBadge, styles[`status_${item.status}`]]}>
          <Text style={styles.statusBadgeText}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>

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

      <Text
        style={[
          styles.smallTitle,
          {
            color: theme.text,
            textAlign: isRTL ? "right" : "left",
          },
        ]}
      >
        {tr("changeStatus")}
      </Text>

      <View
        style={[
          styles.statusActions,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        {ORDER_STATUSES.map((status) => (
          <Pressable
            key={status}
            style={[
              styles.statusActionButton,
              item.status === status && {
                backgroundColor: theme.primary,
                borderColor: theme.primary,
              },
            ]}
            onPress={() => updateOrderStatus(item, status)}
          >
            <Text
              style={[
                styles.statusActionText,
                item.status === status && styles.statusActionTextActive,
              ]}
            >
              {getStatusLabel(status)}
            </Text>
          </Pressable>
        ))}
      </View>

      <View
        style={[
          styles.cardActions,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <Pressable
          style={[styles.cardButton, styles.detailsButton]}
          onPress={() => openOrderDetails(item)}
        >
          <Text style={styles.cardButtonText}>{tr("details")}</Text>
        </Pressable>

        <Pressable
          style={[styles.cardButton, styles.editButton]}
          onPress={() => openEditOrder(item)}
        >
          <Text style={styles.cardButtonText}>{tr("edit")}</Text>
        </Pressable>

        <Pressable
          style={[styles.cardButton, styles.deleteButton]}
          onPress={() => confirmDelete("order", item)}
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

  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignSelf: "flex-start",
  },

  statusBadgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  status_pending: {
    backgroundColor: "#F59E0B",
  },

  status_processing: {
    backgroundColor: "#2563EB",
  },

  status_completed: {
    backgroundColor: "#16A34A",
  },

  status_cancelled: {
    backgroundColor: "#DC2626",
  },

  notesText: {
    backgroundColor: "#F9FAFB",
    color: "#374151",
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },

  smallTitle: {
    fontSize: 14,
    fontWeight: "900",
    marginTop: 12,
    marginBottom: 8,
  },

  statusActions: {
    flexWrap: "wrap",
    gap: 8,
  },

  statusActionButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  statusActionText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "800",
  },

  statusActionTextActive: {
    color: "#FFFFFF",
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

  detailsButton: {
    backgroundColor: "#2563EB",
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