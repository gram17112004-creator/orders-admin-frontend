import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useSettings } from "../context/SettingsContext";

const reportsText = {
  en: {
    salesSummary: "Sales Summary",
    totalRevenue: "Total Revenue",
    todaySales: "Today Sales",
    thisMonthSales: "This Month Sales",
    averageOrderValue: "Average Order Value",
    completedOrders: "Completed Orders",
    cancelledOrders: "Cancelled Orders",
    pendingOrders: "Pending Orders",

    bestSellingProduct: "Best Selling Product",
    productName: "Product Name",
    soldQuantity: "Sold Quantity",
    productRevenue: "Product Revenue",
    noSalesData: "No sales data available yet",

    topCustomer: "Top Customer",
    customerName: "Customer Name",
    phoneNumber: "Phone Number",
    ordersCount: "Orders Count",
    totalPurchases: "Total Purchases",
    unknown: "Unknown",
    noCustomerData: "No customer data available yet",

    systemStatus: "System Status",
    productsCount: "Products Count",
    customersCount: "Customers Count",
    lowStockProducts: "Low Stock Products",
  },

  ar: {
    salesSummary: "ملخص المبيعات",
    totalRevenue: "إجمالي الإيرادات",
    todaySales: "مبيعات اليوم",
    thisMonthSales: "مبيعات هذا الشهر",
    averageOrderValue: "متوسط قيمة الطلب",
    completedOrders: "الطلبات المكتملة",
    cancelledOrders: "الطلبات الملغية",
    pendingOrders: "الطلبات المعلقة",

    bestSellingProduct: "المنتج الأكثر مبيعًا",
    productName: "اسم المنتج",
    soldQuantity: "الكمية المباعة",
    productRevenue: "إيرادات المنتج",
    noSalesData: "لا توجد بيانات مبيعات حتى الآن",

    topCustomer: "أفضل زبون",
    customerName: "اسم الزبون",
    phoneNumber: "رقم الهاتف",
    ordersCount: "عدد الطلبات",
    totalPurchases: "إجمالي المشتريات",
    unknown: "غير معروف",
    noCustomerData: "لا توجد بيانات زبائن حتى الآن",

    systemStatus: "حالة النظام",
    productsCount: "عدد المنتجات",
    customersCount: "عدد الزبائن",
    lowStockProducts: "منتجات منخفضة المخزون",
  },

  he: {
    salesSummary: "סיכום מכירות",
    totalRevenue: "סה״כ הכנסות",
    todaySales: "מכירות היום",
    thisMonthSales: "מכירות החודש",
    averageOrderValue: "ממוצע ערך הזמנה",
    completedOrders: "הזמנות שהושלמו",
    cancelledOrders: "הזמנות שבוטלו",
    pendingOrders: "הזמנות ממתינות",

    bestSellingProduct: "המוצר הנמכר ביותר",
    productName: "שם מוצר",
    soldQuantity: "כמות שנמכרה",
    productRevenue: "הכנסות מהמוצר",
    noSalesData: "אין נתוני מכירות עדיין",

    topCustomer: "הלקוח המוביל",
    customerName: "שם לקוח",
    phoneNumber: "מספר טלפון",
    ordersCount: "מספר הזמנות",
    totalPurchases: "סה״כ רכישות",
    unknown: "לא ידוע",
    noCustomerData: "אין נתוני לקוחות עדיין",

    systemStatus: "מצב המערכת",
    productsCount: "מספר מוצרים",
    customersCount: "מספר לקוחות",
    lowStockProducts: "מוצרים במלאי נמוך",
  },
};

export default function ReportsScreen({
  refreshing,
  onRefresh,
  totalRevenue,
  todayRevenue,
  monthRevenue,
  averageOrderValue,
  completedCount,
  cancelledCount,
  pendingCount,
  products,
  customers,
  lowStockProducts,
  bestSellingProduct,
  bestCustomer,
}) {
  const { settings, isRTL, theme, formatMoney } = useSettings();

  function tr(key) {
    return (
      reportsText[settings.language]?.[key] ||
      reportsText.en[key] ||
      key
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.screenContent,
        { backgroundColor: theme.background },
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.text,
              textAlign: isRTL ? "right" : "left",
            },
          ]}
        >
          {tr("salesSummary")}
        </Text>

        <ReportRow
          label={tr("totalRevenue")}
          value={formatMoney(totalRevenue)}
          isRTL={isRTL}
          theme={theme}
        />

        <ReportRow
          label={tr("todaySales")}
          value={formatMoney(todayRevenue)}
          isRTL={isRTL}
          theme={theme}
        />

        <ReportRow
          label={tr("thisMonthSales")}
          value={formatMoney(monthRevenue)}
          isRTL={isRTL}
          theme={theme}
        />

        <ReportRow
          label={tr("averageOrderValue")}
          value={formatMoney(averageOrderValue)}
          isRTL={isRTL}
          theme={theme}
        />

        <ReportRow
          label={tr("completedOrders")}
          value={completedCount}
          isRTL={isRTL}
          theme={theme}
        />

        <ReportRow
          label={tr("cancelledOrders")}
          value={cancelledCount}
          isRTL={isRTL}
          theme={theme}
        />

        <ReportRow
          label={tr("pendingOrders")}
          value={pendingCount}
          isRTL={isRTL}
          theme={theme}
        />
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.text,
              textAlign: isRTL ? "right" : "left",
            },
          ]}
        >
          {tr("bestSellingProduct")}
        </Text>

        {bestSellingProduct ? (
          <>
            <ReportRow
              label={tr("productName")}
              value={bestSellingProduct.name}
              isRTL={isRTL}
              theme={theme}
            />

            <ReportRow
              label={tr("soldQuantity")}
              value={bestSellingProduct.quantity}
              isRTL={isRTL}
              theme={theme}
            />

            <ReportRow
              label={tr("productRevenue")}
              value={formatMoney(bestSellingProduct.revenue)}
              isRTL={isRTL}
              theme={theme}
            />
          </>
        ) : (
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            {tr("noSalesData")}
          </Text>
        )}
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.text,
              textAlign: isRTL ? "right" : "left",
            },
          ]}
        >
          {tr("topCustomer")}
        </Text>

        {bestCustomer ? (
          <>
            <ReportRow
              label={tr("customerName")}
              value={bestCustomer.name}
              isRTL={isRTL}
              theme={theme}
            />

            <ReportRow
              label={tr("phoneNumber")}
              value={bestCustomer.phone || tr("unknown")}
              isRTL={isRTL}
              theme={theme}
            />

            <ReportRow
              label={tr("ordersCount")}
              value={bestCustomer.ordersCount}
              isRTL={isRTL}
              theme={theme}
            />

            <ReportRow
              label={tr("totalPurchases")}
              value={formatMoney(bestCustomer.revenue)}
              isRTL={isRTL}
              theme={theme}
            />
          </>
        ) : (
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            {tr("noCustomerData")}
          </Text>
        )}
      </View>

      <View style={[styles.sectionCard, { backgroundColor: theme.card }]}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.text,
              textAlign: isRTL ? "right" : "left",
            },
          ]}
        >
          {tr("systemStatus")}
        </Text>

        <ReportRow
          label={tr("productsCount")}
          value={products.length}
          isRTL={isRTL}
          theme={theme}
        />

        <ReportRow
          label={tr("customersCount")}
          value={customers.length}
          isRTL={isRTL}
          theme={theme}
        />

        <ReportRow
          label={tr("lowStockProducts")}
          value={lowStockProducts.length}
          isRTL={isRTL}
          theme={theme}
        />
      </View>
    </ScrollView>
  );
}

function ReportRow({ label, value, isRTL, theme }) {
  return (
    <View
      style={[
        styles.reportRow,
        { flexDirection: isRTL ? "row-reverse" : "row" },
      ]}
    >
      <Text
        style={[
          styles.reportLabel,
          {
            color: theme.text,
            textAlign: isRTL ? "right" : "left",
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.reportValue,
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
  screenContent: {
    padding: 14,
    paddingBottom: 40,
    minHeight: "100%",
  },

  sectionCard: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 10,
  },

  reportRow: {
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 10,
  },

  reportLabel: {
    fontWeight: "800",
    flex: 1,
  },

  reportValue: {
    fontWeight: "900",
  },

  emptyText: {
    fontSize: 15,
    textAlign: "center",
  },
});