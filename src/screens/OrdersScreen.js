import React from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import SearchBox from "../components/SearchBox";
import OrderCard from "../components/OrderCard";
import { ORDER_STATUSES } from "../constants/appConstants";
import { useSettings } from "../context/SettingsContext";

const ordersText = {
  en: {
    all: "All",
    pending: "Pending",
    processing: "Processing",
    completed: "Completed",
    cancelled: "Cancelled",
    searchPlaceholder: "Search by product, customer, or phone...",
    addNewOrder: "+ Add New Order",
    noOrdersFound: "No orders found",
  },

  ar: {
    all: "الكل",
    pending: "معلق",
    processing: "قيد المعالجة",
    completed: "مكتمل",
    cancelled: "ملغي",
    searchPlaceholder: "ابحث حسب المنتج أو الزبون أو الهاتف...",
    addNewOrder: "+ إضافة طلب جديد",
    noOrdersFound: "لا توجد طلبات",
  },

  he: {
    all: "הכל",
    pending: "ממתין",
    processing: "בטיפול",
    completed: "הושלם",
    cancelled: "בוטל",
    searchPlaceholder: "חפש לפי מוצר, לקוח או טלפון...",
    addNewOrder: "+ הוסף הזמנה חדשה",
    noOrdersFound: "לא נמצאו הזמנות",
  },
};

export default function OrdersScreen({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  filteredOrders,
  refreshing,
  onRefresh,
  openAddModal,
  getOrderUnitPrice,
  getOrderTotal,
  updateOrderStatus,
  openOrderDetails,
  openEditOrder,
  confirmDelete,
}) {
  const { settings, theme } = useSettings();

  function tr(key) {
    return ordersText[settings.language]?.[key] || ordersText.en[key] || key;
  }

  function renderFilterButton(status) {
    const active = statusFilter === status;

    return (
      <Pressable
        key={status}
        style={[
          styles.filterButton,
          {
            backgroundColor: active ? theme.primary : theme.card,
            borderColor: active ? theme.primary : "#E5E7EB",
          },
        ]}
        onPress={() => setStatusFilter(status)}
      >
        <Text
          style={[
            styles.filterButtonText,
            {
              color: active ? "#FFFFFF" : theme.text,
            },
          ]}
          numberOfLines={1}
        >
          {status === "all" ? tr("all") : tr(status)}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={[styles.listScreen, { backgroundColor: theme.background }]}>
      <SearchBox
        placeholder={tr("searchPlaceholder")}
        value={search}
        onChangeText={setSearch}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {renderFilterButton("all")}
        {ORDER_STATUSES.map(renderFilterButton)}
      </ScrollView>

      <Pressable
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={() => openAddModal("order")}
      >
        <Text style={styles.addButtonText}>{tr("addNewOrder")}</Text>
      </Pressable>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <OrderCard
            item={item}
            getOrderUnitPrice={getOrderUnitPrice}
            getOrderTotal={getOrderTotal}
            updateOrderStatus={updateOrderStatus}
            openOrderDetails={openOrderDetails}
            openEditOrder={openEditOrder}
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
              {tr("noOrdersFound")}
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

  filtersRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
    flexDirection: "row",
  },

  filterButton: {
    minWidth: 112,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  filterButtonText: {
    fontWeight: "800",
    fontSize: 13,
    textAlign: "center",
  },

  addButton: {
    marginHorizontal: 14,
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