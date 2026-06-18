import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useSettings } from "../context/SettingsContext";

const detailsText = {
  en: {
    orderDetails: "Order Details",
    customerInformation: "Customer Information",
    productInformation: "Product Information",
    orderInformation: "Order Information",

    name: "Name",
    phone: "Phone",
    address: "Address",
    product: "Product",
    quantity: "Quantity",
    unitPrice: "Unit Price",
    total: "Total",
    status: "Status",
    paymentMethod: "Payment Method",
    date: "Date",
    time: "Time",
    notes: "Notes",
    close: "Close",
    unknown: "Unknown",

    pending: "Pending",
    processing: "Processing",
    completed: "Completed",
    cancelled: "Cancelled",

    cash: "Cash",
    card: "Card",
    creditCard: "Credit Card",
    bankTransfer: "Bank Transfer",
    paypal: "PayPal",
    other: "Other",
  },

  ar: {
    orderDetails: "تفاصيل الطلب",
    customerInformation: "معلومات الزبون",
    productInformation: "معلومات المنتج",
    orderInformation: "معلومات الطلب",

    name: "الاسم",
    phone: "الهاتف",
    address: "العنوان",
    product: "المنتج",
    quantity: "الكمية",
    unitPrice: "سعر الوحدة",
    total: "المجموع",
    status: "الحالة",
    paymentMethod: "طريقة الدفع",
    date: "التاريخ",
    time: "الوقت",
    notes: "ملاحظات",
    close: "إغلاق",
    unknown: "غير معروف",

    pending: "معلق",
    processing: "قيد المعالجة",
    completed: "مكتمل",
    cancelled: "ملغي",

    cash: "نقدًا",
    card: "بطاقة",
    creditCard: "بطاقة ائتمان",
    bankTransfer: "تحويل بنكي",
    paypal: "باي بال",
    other: "أخرى",
  },

  he: {
    orderDetails: "פרטי הזמנה",
    customerInformation: "פרטי לקוח",
    productInformation: "פרטי מוצר",
    orderInformation: "פרטי הזמנה",

    name: "שם",
    phone: "טלפון",
    address: "כתובת",
    product: "מוצר",
    quantity: "כמות",
    unitPrice: "מחיר יחידה",
    total: "סה״כ",
    status: "סטטוס",
    paymentMethod: "אמצעי תשלום",
    date: "תאריך",
    time: "שעה",
    notes: "הערות",
    close: "סגור",
    unknown: "לא ידוע",

    pending: "ממתין",
    processing: "בטיפול",
    completed: "הושלם",
    cancelled: "בוטל",

    cash: "מזומן",
    card: "כרטיס",
    creditCard: "כרטיס אשראי",
    bankTransfer: "העברה בנקאית",
    paypal: "פייפאל",
    other: "אחר",
  },
};

export default function OrderDetailsModal({
  detailsVisible,
  selectedOrder,
  closeOrderDetails,
  getOrderUnitPrice,
  getOrderTotal,
}) {
  const { isRTL, theme, formatMoney, settings } = useSettings();

  if (!selectedOrder) return null;

  const unitPrice = getOrderUnitPrice(selectedOrder);
  const total = getOrderTotal(selectedOrder);

  function tr(key) {
    return detailsText[settings.language]?.[key] || detailsText.en[key] || key;
  }

  function getDateLocale() {
    if (settings.language === "ar") return "ar";
    if (settings.language === "he") return "he-IL";
    return "en-US";
  }

  function getDateValue() {
    if (!selectedOrder.createdAt) return tr("unknown");

    return new Date(selectedOrder.createdAt).toLocaleDateString(
      getDateLocale()
    );
  }

  function getTimeValue() {
    if (!selectedOrder.createdAt) return tr("unknown");

    return new Date(selectedOrder.createdAt).toLocaleTimeString(
      getDateLocale()
    );
  }

  function normalizePaymentMethod(paymentMethod) {
    if (!paymentMethod) return "cash";

    if (paymentMethod === "credit_card") return "creditCard";
    if (paymentMethod === "creditCard") return "creditCard";

    if (paymentMethod === "bank_transfer") return "bankTransfer";
    if (paymentMethod === "bankTransfer") return "bankTransfer";

    return paymentMethod;
  }

  function getTranslatedValue(value, fallbackKey = "unknown") {
    if (!value) return tr(fallbackKey);

    const normalizedValue =
      value === "credit_card"
        ? "creditCard"
        : value === "bank_transfer"
        ? "bankTransfer"
        : value;

    return tr(normalizedValue) || value;
  }

  return (
    <Modal visible={detailsVisible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={closeOrderDetails}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.detailsBox, { backgroundColor: theme.card }]}>
              <Text
                style={[
                  styles.modalTitle,
                  {
                    color: theme.text,
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              >
                {tr("orderDetails")}
              </Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                <DetailsSection
                  title={tr("customerInformation")}
                  isRTL={isRTL}
                  theme={theme}
                >
                  <DetailsRow
                    label={tr("name")}
                    value={selectedOrder.customerName || tr("unknown")}
                    isRTL={isRTL}
                    theme={theme}
                  />

                  <DetailsRow
                    label={tr("phone")}
                    value={selectedOrder.customerPhone || tr("unknown")}
                    isRTL={isRTL}
                    theme={theme}
                  />

                  <DetailsRow
                    label={tr("address")}
                    value={selectedOrder.customerAddress || tr("unknown")}
                    isRTL={isRTL}
                    theme={theme}
                  />
                </DetailsSection>

                <DetailsSection
                  title={tr("productInformation")}
                  isRTL={isRTL}
                  theme={theme}
                >
                  <DetailsRow
                    label={tr("product")}
                    value={selectedOrder.productName || tr("unknown")}
                    isRTL={isRTL}
                    theme={theme}
                  />

                  <DetailsRow
                    label={tr("quantity")}
                    value={selectedOrder.quantity || 1}
                    isRTL={isRTL}
                    theme={theme}
                  />

                  <DetailsRow
                    label={tr("unitPrice")}
                    value={formatMoney(unitPrice)}
                    isRTL={isRTL}
                    theme={theme}
                  />

                  <Text
                    style={[
                      styles.detailsTotal,
                      {
                        color: theme.primary,
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {tr("total")}: {formatMoney(total)}
                  </Text>
                </DetailsSection>

                <DetailsSection
                  title={tr("orderInformation")}
                  isRTL={isRTL}
                  theme={theme}
                >
                  <DetailsRow
                    label={tr("status")}
                    value={getTranslatedValue(selectedOrder.status)}
                    isRTL={isRTL}
                    theme={theme}
                  />

                  <DetailsRow
                    label={tr("paymentMethod")}
                    value={getTranslatedValue(
                      normalizePaymentMethod(selectedOrder.paymentMethod),
                      "cash"
                    )}
                    isRTL={isRTL}
                    theme={theme}
                  />

                  <DetailsRow
                    label={tr("date")}
                    value={getDateValue()}
                    isRTL={isRTL}
                    theme={theme}
                  />

                  <DetailsRow
                    label={tr("time")}
                    value={getTimeValue()}
                    isRTL={isRTL}
                    theme={theme}
                  />
                </DetailsSection>

                {selectedOrder.notes ? (
                  <DetailsSection
                    title={tr("notes")}
                    isRTL={isRTL}
                    theme={theme}
                  >
                    <Text
                      style={[
                        styles.detailsText,
                        {
                          color: theme.text,
                          textAlign: isRTL ? "right" : "left",
                        },
                      ]}
                    >
                      {selectedOrder.notes}
                    </Text>
                  </DetailsSection>
                ) : null}

                <Pressable
                  style={styles.closeDetailsButton}
                  onPress={closeOrderDetails}
                >
                  <Text style={styles.closeDetailsButtonText}>
                    {tr("close")}
                  </Text>
                </Pressable>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

function DetailsSection({ title, children, isRTL, theme }) {
  return (
    <View style={styles.detailsSection}>
      <Text
        style={[
          styles.detailsSectionTitle,
          {
            color: theme.text,
            textAlign: isRTL ? "right" : "left",
          },
        ]}
      >
        {title}
      </Text>

      {children}
    </View>
  );
}

function DetailsRow({ label, value, isRTL, theme }) {
  return (
    <View
      style={[
        styles.detailsRow,
        { flexDirection: isRTL ? "row-reverse" : "row" },
      ]}
    >
      <Text
        style={[
          styles.detailsLabel,
          {
            color: theme.muted,
            textAlign: isRTL ? "right" : "left",
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.detailsValue,
          {
            color: theme.text,
            textAlign: isRTL ? "left" : "right",
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  detailsBox: {
    maxHeight: "82%",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 18,
  },

  modalTitle: {
    fontSize: 23,
    fontWeight: "900",
    marginBottom: 14,
  },

  detailsSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  detailsSectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8,
  },

  detailsRow: {
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 8,
  },

  detailsLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
  },

  detailsValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: "900",
  },

  detailsText: {
    fontSize: 14,
    marginBottom: 6,
  },

  detailsTotal: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 8,
  },

  closeDetailsButton: {
    backgroundColor: "#111827",
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 4,
    marginBottom: 12,
  },

  closeDetailsButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    textAlign: "center",
    fontSize: 15,
  },
});