import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import StatCard from "../components/StatCard";
import { useSettings } from "../context/SettingsContext";

const dashboardText = {
  en: {
    totalOrders: "Total Orders",
    revenue: "Revenue",
    products: "Products",
    customers: "Customers",
    pendingOrders: "Pending Orders",
    lowStock: "Low Stock",
    recentOrders: "Recent Orders",
    noRecentOrders: "No recent orders",
    lowStockProducts: "Low Stock Products",
    noLowStockProducts: "No low stock products",
    unknownProduct: "Unknown Product",
    unknownCustomer: "Unknown Customer",
    general: "General",
    remaining: "Remaining",
    alert: "Alert",
    pending: "Pending",
    processing: "Processing",
    completed: "Completed",
    cancelled: "Cancelled",
  },

  ar: {
    totalOrders: "إجمالي الطلبات",
    revenue: "الإيرادات",
    products: "المنتجات",
    customers: "الزبائن",
    pendingOrders: "الطلبات المعلقة",
    lowStock: "مخزون منخفض",
    recentOrders: "آخر الطلبات",
    noRecentOrders: "لا توجد طلبات حديثة",
    lowStockProducts: "منتجات منخفضة المخزون",
    noLowStockProducts: "لا توجد منتجات منخفضة المخزون",
    unknownProduct: "منتج غير معروف",
    unknownCustomer: "زبون غير معروف",
    general: "عام",
    remaining: "المتبقي",
    alert: "تنبيه",
    pending: "معلق",
    processing: "قيد المعالجة",
    completed: "مكتمل",
    cancelled: "ملغي",
  },

  he: {
    totalOrders: "סה״כ הזמנות",
    revenue: "הכנסות",
    products: "מוצרים",
    customers: "לקוחות",
    pendingOrders: "הזמנות ממתינות",
    lowStock: "מלאי נמוך",
    recentOrders: "הזמנות אחרונות",
    noRecentOrders: "אין הזמנות אחרונות",
    lowStockProducts: "מוצרים במלאי נמוך",
    noLowStockProducts: "אין מוצרים במלאי נמוך",
    unknownProduct: "מוצר לא ידוע",
    unknownCustomer: "לקוח לא ידוע",
    general: "כללי",
    remaining: "נותר",
    alert: "התראה",
    pending: "ממתין",
    processing: "בטיפול",
    completed: "הושלם",
    cancelled: "בוטל",
  },
};

export default function DashboardScreen({
  orders,
  products,
  customers,
  stats,
  refreshing,
  onRefresh,
  totalRevenue,
  pendingCount,
  lowStockProducts,
  getOrderTotal,
}) {
  const { settings, isRTL, theme, formatMoney } = useSettings();

  const recentOrders = orders.slice(0, 3);

  function tr(key) {
    return (
      dashboardText[settings.language]?.[key] ||
      dashboardText.en[key] ||
      key
    );
  }

  function getStatusLabel(status) {
    return tr(status) || status;
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
      <View
        style={[
          styles.statsGrid,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <StatCard
          value={stats?.totalOrders || orders.length}
          label={tr("totalOrders")}
        />

        <StatCard
          value={formatMoney(stats?.totalRevenue || totalRevenue)}
          label={tr("revenue")}
        />

        <StatCard
          value={stats?.totalProducts || products.length}
          label={tr("products")}
        />

        <StatCard
          value={stats?.totalCustomers || customers.length}
          label={tr("customers")}
        />

        <StatCard value={pendingCount} label={tr("pendingOrders")} />

        <StatCard value={lowStockProducts.length} label={tr("lowStock")} />
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
          {tr("recentOrders")}
        </Text>

        {recentOrders.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            {tr("noRecentOrders")}
          </Text>
        ) : (
          recentOrders.map((order) => (
            <View
              key={order._id}
              style={[
                styles.miniRow,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <View style={styles.miniInfo}>
                <Text
                  style={[
                    styles.miniTitle,
                    {
                      color: theme.text,
                      textAlign: isRTL ? "right" : "left",
                    },
                  ]}
                >
                  {order.productName || tr("unknownProduct")}
                </Text>

                <Text
                  style={[
                    styles.miniSub,
                    {
                      color: theme.muted,
                      textAlign: isRTL ? "right" : "left",
                    },
                  ]}
                >
                  {order.customerName || tr("unknownCustomer")} •{" "}
                  {formatMoney(getOrderTotal(order))}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadgeSmall,
                  styles[`status_${order.status}`],
                ]}
              >
                <Text style={styles.statusBadgeText}>
                  {getStatusLabel(order.status)}
                </Text>
              </View>
            </View>
          ))
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
          {tr("lowStockProducts")}
        </Text>

        {lowStockProducts.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            {tr("noLowStockProducts")}
          </Text>
        ) : (
          lowStockProducts.slice(0, 4).map((product) => (
            <View
              key={product._id}
              style={[
                styles.miniRow,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <View style={styles.miniInfo}>
                <Text
                  style={[
                    styles.miniTitle,
                    {
                      color: theme.text,
                      textAlign: isRTL ? "right" : "left",
                    },
                  ]}
                >
                  {product.name || tr("unknownProduct")}
                </Text>

                <Text
                  style={[
                    styles.miniSub,
                    {
                      color: theme.muted,
                      textAlign: isRTL ? "right" : "left",
                    },
                  ]}
                >
                  {product.category || tr("general")} • {tr("remaining")}:{" "}
                  {product.stock}
                </Text>
              </View>

              <Text style={styles.warningText}>{tr("alert")}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    padding: 14,
    paddingBottom: 40,
    minHeight: "100%",
  },

  statsGrid: {
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
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

  miniRow: {
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    gap: 10,
  },

  miniInfo: {
    flex: 1,
  },

  miniTitle: {
    fontSize: 15,
    fontWeight: "900",
  },

  miniSub: {
    fontSize: 13,
    marginTop: 3,
  },

  emptyText: {
    fontSize: 15,
    textAlign: "center",
  },

  statusBadgeSmall: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 6,
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

  warningText: {
    color: "#F59E0B",
    fontWeight: "900",
  },
});