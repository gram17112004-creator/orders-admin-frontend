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
import CustomerCard from "../components/CustomerCard";
import { useSettings } from "../context/SettingsContext";

const customersText = {
  en: {
    searchPlaceholder: "Search by customer name, phone, or address...",
    addNewCustomer: "+ Add New Customer",
    noCustomersFound: "No customers found",
  },

  ar: {
    searchPlaceholder: "ابحث حسب اسم الزبون أو الهاتف أو العنوان...",
    addNewCustomer: "+ إضافة زبون جديد",
    noCustomersFound: "لا يوجد زبائن",
  },

  he: {
    searchPlaceholder: "חפש לפי שם לקוח, טלפון או כתובת...",
    addNewCustomer: "+ הוסף לקוח חדש",
    noCustomersFound: "לא נמצאו לקוחות",
  },
};

export default function CustomersScreen({
  search,
  setSearch,
  filteredCustomers,
  refreshing,
  onRefresh,
  openAddModal,
  getCustomerOrderCount,
  getCustomerTotalPurchases,
  openEditCustomer,
  confirmDelete,
}) {
  const { settings, theme } = useSettings();

  function tr(key) {
    return (
      customersText[settings.language]?.[key] ||
      customersText.en[key] ||
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
        onPress={() => openAddModal("customer")}
      >
        <Text style={styles.addButtonText}>{tr("addNewCustomer")}</Text>
      </Pressable>

      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <CustomerCard
            item={item}
            getCustomerOrderCount={getCustomerOrderCount}
            getCustomerTotalPurchases={getCustomerTotalPurchases}
            openEditCustomer={openEditCustomer}
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
              {tr("noCustomersFound")}
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