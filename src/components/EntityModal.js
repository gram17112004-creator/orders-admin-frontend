import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { ORDER_STATUSES, paymentMethods } from "../constants/appConstants";
import { useSettings } from "../context/SettingsContext";

const modalText = {
  en: {
    addOrder: "Add Order",
    editOrder: "Edit Order",
    addProduct: "Add Product",
    editProduct: "Edit Product",
    addCustomer: "Add Customer",
    editCustomer: "Edit Customer",

    selectExistingCustomer: "Select Existing Customer",
    noCustomersYet: "No customers yet",
    selectExistingProduct: "Select Existing Product",
    noProductsYet: "No products yet",

    customerName: "Customer Name",
    phoneNumber: "Phone Number",
    address: "Address",
    productName: "Product Name",
    quantity: "Quantity",
    unitPrice: "Unit Price",
    total: "Total",
    notes: "Notes",

    paymentMethod: "Payment Method",
    orderStatus: "Order Status",

    category: "Category",
    price: "Price",
    stockQuantity: "Stock Quantity",
    productDescription: "Product Description",

    general: "General",
    stock: "Stock",
    outOfStock: "Out of Stock",

    save: "Save",
    cancel: "Cancel",

    pending: "Pending",
    processing: "Processing",
    completed: "Completed",
    cancelled: "Cancelled",

    cash: "Cash",
    card: "Card",
    creditCard: "Credit Card",
    bank: "Bank Transfer",
    bankTransfer: "Bank Transfer",
    transfer: "Bank Transfer",
    paypal: "PayPal",
    other: "Other",
  },

  ar: {
    addOrder: "إضافة طلب",
    editOrder: "تعديل طلب",
    addProduct: "إضافة منتج",
    editProduct: "تعديل منتج",
    addCustomer: "إضافة زبون",
    editCustomer: "تعديل زبون",

    selectExistingCustomer: "اختيار زبون موجود",
    noCustomersYet: "لا يوجد زبائن بعد",
    selectExistingProduct: "اختيار منتج موجود",
    noProductsYet: "لا يوجد منتجات بعد",

    customerName: "اسم الزبون",
    phoneNumber: "رقم الهاتف",
    address: "العنوان",
    productName: "اسم المنتج",
    quantity: "الكمية",
    unitPrice: "سعر الوحدة",
    total: "المجموع",
    notes: "ملاحظات",

    paymentMethod: "طريقة الدفع",
    orderStatus: "حالة الطلب",

    category: "التصنيف",
    price: "السعر",
    stockQuantity: "كمية المخزون",
    productDescription: "وصف المنتج",

    general: "عام",
    stock: "المخزون",
    outOfStock: "غير متوفر",

    save: "حفظ",
    cancel: "إلغاء",

    pending: "معلق",
    processing: "قيد المعالجة",
    completed: "مكتمل",
    cancelled: "ملغي",

    cash: "نقدًا",
    card: "بطاقة",
    creditCard: "بطاقة ائتمان",
    bank: "تحويل بنكي",
    bankTransfer: "تحويل بنكي",
    transfer: "تحويل بنكي",
    paypal: "باي بال",
    other: "أخرى",
  },

  he: {
    addOrder: "הוספת הזמנה",
    editOrder: "עריכת הזמנה",
    addProduct: "הוספת מוצר",
    editProduct: "עריכת מוצר",
    addCustomer: "הוספת לקוח",
    editCustomer: "עריכת לקוח",

    selectExistingCustomer: "בחר לקוח קיים",
    noCustomersYet: "אין לקוחות עדיין",
    selectExistingProduct: "בחר מוצר קיים",
    noProductsYet: "אין מוצרים עדיין",

    customerName: "שם לקוח",
    phoneNumber: "מספר טלפון",
    address: "כתובת",
    productName: "שם מוצר",
    quantity: "כמות",
    unitPrice: "מחיר יחידה",
    total: "סה״כ",
    notes: "הערות",

    paymentMethod: "אמצעי תשלום",
    orderStatus: "סטטוס הזמנה",

    category: "קטגוריה",
    price: "מחיר",
    stockQuantity: "כמות במלאי",
    productDescription: "תיאור מוצר",

    general: "כללי",
    stock: "מלאי",
    outOfStock: "אזל מהמלאי",

    save: "שמור",
    cancel: "ביטול",

    pending: "ממתין",
    processing: "בטיפול",
    completed: "הושלם",
    cancelled: "בוטל",

    cash: "מזומן",
    card: "כרטיס",
    creditCard: "כרטיס אשראי",
    bank: "העברה בנקאית",
    bankTransfer: "העברה בנקאית",
    transfer: "העברה בנקאית",
    paypal: "פייפאל",
    other: "אחר",
  },
};

export default function EntityModal({
  modalVisible,
  modalType,
  editingItem,
  closeModal,
  saveCurrentModal,

  orderForm,
  setOrderForm,
  productForm,
  setProductForm,
  customerForm,
  setCustomerForm,

  customers,
  products,
}) {
  const { settings, isRTL, theme, formatMoney } = useSettings();

  function tr(key) {
    return modalText[settings.language]?.[key] || modalText.en[key] || key;
  }

  function getStatusLabel(status) {
    return tr(status) || status;
  }

  function getPaymentLabel(method) {
    return tr(method) || method;
  }

  function renderTextInput({
    placeholder,
    value,
    onChangeText,
    keyboardType = "default",
    multiline = false,
  }) {
    return (
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          {
            textAlign: isRTL ? "right" : "left",
            color: theme.text,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.muted}
        value={value}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        returnKeyType={keyboardType === "numeric" ? "done" : "next"}
        onSubmitEditing={Keyboard.dismiss}
        onChangeText={onChangeText}
      />
    );
  }

  function renderChoiceRow(items, currentValue, onSelect, labelGetter) {
    return (
      <View
        style={[
          styles.modalChoiceRow,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        {items.map((item) => {
          const active = currentValue === item;

          return (
            <Pressable
              key={item}
              style={[
                styles.choiceButton,
                active && {
                  backgroundColor: theme.primary,
                  borderColor: theme.primary,
                },
              ]}
              onPress={() => {
                Keyboard.dismiss();
                onSelect(item);
              }}
            >
              <Text
                style={[
                  styles.choiceText,
                  active && styles.activeChoiceText,
                ]}
              >
                {labelGetter ? labelGetter(item) : item}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  function renderOrderForm() {
    return (
      <>
        <Text
          style={[
            styles.smallTitle,
            {
              color: theme.text,
              textAlign: isRTL ? "right" : "left",
            },
          ]}
        >
          {tr("selectExistingCustomer")}
        </Text>

        <View style={styles.selectList}>
          {customers.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.muted }]}>
              {tr("noCustomersYet")}
            </Text>
          ) : (
            customers.map((customer) => (
              <Pressable
                key={customer._id}
                style={[
                  styles.selectItem,
                  orderForm.customerId === customer._id && styles.selectedItem,
                ]}
                onPress={() => {
                  setOrderForm((prev) => ({
                    ...prev,
                    customerId: customer._id,
                    customerName: customer.name,
                    customerPhone: customer.phone,
                    customerAddress: customer.address || "",
                  }));
                }}
              >
                <Text
                  style={[
                    styles.selectItemTitle,
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                >
                  {customer.name}
                </Text>

                <Text
                  style={[
                    styles.selectItemSub,
                    { textAlign: isRTL ? "right" : "left" },
                  ]}
                >
                  {customer.phone}
                </Text>
              </Pressable>
            ))
          )}
        </View>

        {renderTextInput({
          placeholder: tr("customerName"),
          value: orderForm.customerName,
          onChangeText: (text) =>
            setOrderForm((prev) => ({ ...prev, customerName: text })),
        })}

        {renderTextInput({
          placeholder: tr("phoneNumber"),
          value: orderForm.customerPhone,
          keyboardType: "phone-pad",
          onChangeText: (text) =>
            setOrderForm((prev) => ({ ...prev, customerPhone: text })),
        })}

        {renderTextInput({
          placeholder: tr("address"),
          value: orderForm.customerAddress,
          onChangeText: (text) =>
            setOrderForm((prev) => ({ ...prev, customerAddress: text })),
        })}

        <Text
          style={[
            styles.smallTitle,
            {
              color: theme.text,
              textAlign: isRTL ? "right" : "left",
            },
          ]}
        >
          {tr("selectExistingProduct")}
        </Text>

        <View style={styles.selectList}>
          {products.length === 0 ? (
            <Text style={[styles.emptyText, { color: theme.muted }]}>
              {tr("noProductsYet")}
            </Text>
          ) : (
            products.map((product) => {
              const outOfStock = Number(product.stock || 0) <= 0;

              return (
                <Pressable
                  key={product._id}
                  disabled={outOfStock}
                  style={[
                    styles.selectItem,
                    outOfStock && styles.disabledItem,
                    orderForm.productId === product._id && styles.selectedItem,
                  ]}
                  onPress={() => {
                    setOrderForm((prev) => ({
                      ...prev,
                      productId: product._id,
                      productName: product.name,
                      unitPrice: String(product.price),
                    }));
                  }}
                >
                  <Text
                    style={[
                      styles.selectItemTitle,
                      { textAlign: isRTL ? "right" : "left" },
                    ]}
                  >
                    {product.name}
                  </Text>

                  <Text
                    style={[
                      styles.selectItemSub,
                      { textAlign: isRTL ? "right" : "left" },
                    ]}
                  >
                    {product.category || tr("general")} •{" "}
                    {formatMoney(product.price)} • {tr("stock")}:{" "}
                    {product.stock}
                    {outOfStock ? ` • ${tr("outOfStock")}` : ""}
                  </Text>
                </Pressable>
              );
            })
          )}
        </View>

        {renderTextInput({
          placeholder: tr("productName"),
          value: orderForm.productName,
          onChangeText: (text) =>
            setOrderForm((prev) => ({ ...prev, productName: text })),
        })}

        {renderTextInput({
          placeholder: tr("quantity"),
          value: orderForm.quantity,
          keyboardType: "numeric",
          onChangeText: (text) =>
            setOrderForm((prev) => ({ ...prev, quantity: text })),
        })}

        {renderTextInput({
          placeholder: tr("unitPrice"),
          value: orderForm.unitPrice,
          keyboardType: "numeric",
          onChangeText: (text) =>
            setOrderForm((prev) => ({ ...prev, unitPrice: text })),
        })}

        <View style={styles.totalPreview}>
          <Text
            style={[
              styles.totalPreviewText,
              { textAlign: isRTL ? "right" : "left" },
            ]}
          >
            {tr("total")}:{" "}
            {formatMoney(
              Number(orderForm.quantity || 0) *
                Number(orderForm.unitPrice || 0)
            )}
          </Text>
        </View>

        {renderTextInput({
          placeholder: tr("notes"),
          value: orderForm.notes,
          multiline: true,
          onChangeText: (text) =>
            setOrderForm((prev) => ({ ...prev, notes: text })),
        })}

        <Text
          style={[
            styles.smallTitle,
            {
              color: theme.text,
              textAlign: isRTL ? "right" : "left",
            },
          ]}
        >
          {tr("paymentMethod")}
        </Text>

        {renderChoiceRow(
          paymentMethods,
          orderForm.paymentMethod,
          (method) =>
            setOrderForm((prev) => ({ ...prev, paymentMethod: method })),
          getPaymentLabel
        )}

        <Text
          style={[
            styles.smallTitle,
            {
              color: theme.text,
              textAlign: isRTL ? "right" : "left",
            },
          ]}
        >
          {tr("orderStatus")}
        </Text>

        {renderChoiceRow(
          ORDER_STATUSES,
          orderForm.status,
          (status) => setOrderForm((prev) => ({ ...prev, status })),
          getStatusLabel
        )}
      </>
    );
  }

  function renderProductForm() {
    return (
      <>
        {renderTextInput({
          placeholder: tr("productName"),
          value: productForm.name,
          onChangeText: (text) =>
            setProductForm((prev) => ({ ...prev, name: text })),
        })}

        {renderTextInput({
          placeholder: tr("category"),
          value: productForm.category,
          onChangeText: (text) =>
            setProductForm((prev) => ({ ...prev, category: text })),
        })}

        {renderTextInput({
          placeholder: tr("price"),
          value: productForm.price,
          keyboardType: "numeric",
          onChangeText: (text) =>
            setProductForm((prev) => ({ ...prev, price: text })),
        })}

        {renderTextInput({
          placeholder: tr("stockQuantity"),
          value: productForm.stock,
          keyboardType: "numeric",
          onChangeText: (text) =>
            setProductForm((prev) => ({ ...prev, stock: text })),
        })}

        {renderTextInput({
          placeholder: tr("productDescription"),
          value: productForm.description,
          multiline: true,
          onChangeText: (text) =>
            setProductForm((prev) => ({ ...prev, description: text })),
        })}
      </>
    );
  }

  function renderCustomerForm() {
    return (
      <>
        {renderTextInput({
          placeholder: tr("customerName"),
          value: customerForm.name,
          onChangeText: (text) =>
            setCustomerForm((prev) => ({ ...prev, name: text })),
        })}

        {renderTextInput({
          placeholder: tr("phoneNumber"),
          value: customerForm.phone,
          keyboardType: "phone-pad",
          onChangeText: (text) =>
            setCustomerForm((prev) => ({ ...prev, phone: text })),
        })}

        {renderTextInput({
          placeholder: tr("address"),
          value: customerForm.address,
          onChangeText: (text) =>
            setCustomerForm((prev) => ({ ...prev, address: text })),
        })}

        {renderTextInput({
          placeholder: tr("notes"),
          value: customerForm.notes,
          multiline: true,
          onChangeText: (text) =>
            setCustomerForm((prev) => ({ ...prev, notes: text })),
        })}
      </>
    );
  }

  function getModalTitle() {
    if (modalType === "order") {
      return editingItem ? tr("editOrder") : tr("addOrder");
    }

    if (modalType === "product") {
      return editingItem ? tr("editProduct") : tr("addProduct");
    }

    return editingItem ? tr("editCustomer") : tr("addCustomer");
  }

  function renderModalContent() {
    if (modalType === "order") return renderOrderForm();
    if (modalType === "product") return renderProductForm();
    return renderCustomerForm();
  }

  return (
    <Modal visible={modalVisible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardBox}
          >
            <TouchableWithoutFeedback>
              <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
                <Text
                  style={[
                    styles.modalTitle,
                    {
                      color: theme.text,
                      textAlign: isRTL ? "right" : "left",
                    },
                  ]}
                >
                  {getModalTitle()}
                </Text>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  {renderModalContent()}

                  <View
                    style={[
                      styles.modalActions,
                      { flexDirection: isRTL ? "row-reverse" : "row" },
                    ]}
                  >
                    <Pressable
                      style={[styles.saveButton, { backgroundColor: theme.primary }]}
                      onPress={saveCurrentModal}
                    >
                      <Text style={styles.saveButtonText}>{tr("save")}</Text>
                    </Pressable>

                    <Pressable style={styles.cancelButton} onPress={closeModal}>
                      <Text style={styles.cancelButtonText}>{tr("cancel")}</Text>
                    </Pressable>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  keyboardBox: {
    width: "100%",
  },

  modalBox: {
    maxHeight: "88%",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 18,
  },

  modalTitle: {
    fontSize: 23,
    fontWeight: "900",
    marginBottom: 14,
  },

  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    fontSize: 15,
  },

  multilineInput: {
    minHeight: 90,
  },

  smallTitle: {
    fontSize: 14,
    fontWeight: "900",
    marginTop: 12,
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 15,
    textAlign: "center",
  },

  selectList: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 8,
    marginBottom: 10,
    maxHeight: 170,
  },

  selectItem: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  selectedItem: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },

  disabledItem: {
    opacity: 0.45,
  },

  selectItemTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#111827",
  },

  selectItemSub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 3,
  },

  totalPreview: {
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },

  totalPreviewText: {
    color: "#1D4ED8",
    fontWeight: "900",
    fontSize: 16,
  },

  modalChoiceRow: {
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },

  choiceButton: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  choiceText: {
    color: "#374151",
    fontWeight: "800",
    fontSize: 12,
  },

  activeChoiceText: {
    color: "#FFFFFF",
  },

  modalActions: {
    gap: 10,
    marginTop: 12,
    marginBottom: 12,
  },

  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    textAlign: "center",
    fontSize: 15,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    paddingVertical: 14,
    borderRadius: 14,
  },

  cancelButtonText: {
    color: "#111827",
    fontWeight: "900",
    textAlign: "center",
    fontSize: 15,
  },
});