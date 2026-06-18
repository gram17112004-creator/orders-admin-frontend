import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import axios from "axios";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Header from "./src/components/Header";
import Tabs from "./src/components/Tabs";
import EntityModal from "./src/components/EntityModal";
import OrderDetailsModal from "./src/components/OrderDetailsModal";

import AuthScreen from "./src/screens/AuthScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import OrdersScreen from "./src/screens/OrdersScreen";
import ProductsScreen from "./src/screens/ProductsScreen";
import CustomersScreen from "./src/screens/CustomersScreen";
import ReportsScreen from "./src/screens/ReportsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

import {
  SettingsProvider,
  useSettings,
} from "./src/context/SettingsContext";

import {
  emptyCustomerForm,
  emptyOrderForm,
  emptyProductForm,
} from "./src/constants/appConstants";

import {
  customersUrl,
  extractArray,
  getAllData,
  ordersUrl,
  productsUrl,
} from "./src/api/api";

import { getOrderTotal, getOrderUnitPrice } from "./src/utils/orderUtils";

function MainApp() {
  const { theme, settings, isRTL, formatMoney } = useSettings();

  const [activeScreen, setActiveScreen] = useState("dashboard");

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("order");
  const [editingItem, setEditingItem] = useState(null);

  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [orderForm, setOrderForm] = useState(emptyOrderForm);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [customerForm, setCustomerForm] = useState(emptyCustomerForm);

  const [customerScreen, setCustomerScreen] = useState("products");
  const [customerProductSearch, setCustomerProductSearch] = useState("");

  const [cart, setCart] = useState([]);

  const [productDetailsVisible, setProductDetailsVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "cash",
    notes: "",
  });

  const [customerOrderDetailsVisible, setCustomerOrderDetailsVisible] =
    useState(false);

  const [selectedCustomerOrder, setSelectedCustomerOrder] = useState(null);

  const [customerOrderEditMode, setCustomerOrderEditMode] = useState(false);

  const [customerOrderEditForm, setCustomerOrderEditForm] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "cash",
    notes: "",
  });

  const isAdmin = currentUser?.role === "admin";

  const customerText = {
    en: {
      availableProducts: "Available Products",
      customerWelcome: "Browse products available in the store",
      category: "Category",
      price: "Price",
      stock: "Stock",
      available: "Available",
      outOfStock: "Out of Stock",
      unknownProduct: "Unknown Product",
      general: "General",
      noProducts: "No products available",
      logout: "Logout",
      customerMode: "Customer Mode",

      productsTab: "Products",
      myOrders: "My Orders",
      cart: "Cart",
      noOrdersYet: "You have no orders yet",
      noCartItems: "Your cart is empty",
      order: "Order",
      status: "Status",
      quantity: "Quantity",
      total: "Total",
      date: "Date",

      pending: "Pending",
      processing: "Processing",
      completed: "Completed",
      cancelled: "Cancelled",

      addToCart: "Add to Cart",
      addedToCartTitle: "Added",
      addedToCartMessage: "Product added to cart",
      remove: "Remove",
      checkout: "Checkout",
      checkoutTitle: "Complete Order",
      customerName: "Your Name",
      phone: "Phone Number",
      address: "Address",
      paymentMethod: "Payment Method",
      cash: "Cash",
      card: "Card",
      bank: "Bank Transfer",
      notes: "Notes",
      submitOrder: "Submit Order",
      cancel: "Cancel",
      cartTotal: "Cart Total",

      orderSuccessTitle: "Order Created",
      orderSuccessMessage: "Your order was sent successfully",
      orderErrorTitle: "Order Failed",
      cannotOrderOutOfStock: "This product is out of stock",
      enterName: "Please enter your name",
      enterPhone: "Please enter your phone number",
      enterAddress: "Please enter your address",

      orderDetails: "Order Details",
      editOrder: "Edit Order",
      saveChanges: "Save Changes",
      close: "Close",
      customerInfo: "Customer Info",
      items: "Items",
      cannotEditOrder: "This order cannot be edited",

      cancelOrder: "Cancel Order",
      cancelOrderTitle: "Cancel Order",
      cancelOrderConfirm:
        "Are you sure you want to cancel this order? The quantity will be returned to stock.",
      cancelOrderSuccessTitle: "Order Cancelled",
      cancelOrderSuccessMessage:
        "The order was cancelled and the quantity was returned to stock.",
      cannotCancelOrder: "This order cannot be cancelled",

      productDetails: "Product Details",
      viewDetails: "View Details",
      description: "Description",
      noDescription: "No description available",
      searchProduct: "Search product...",
      clearSearch: "Clear",
    },

    ar: {
      availableProducts: "المنتجات المتوفرة",
      customerWelcome: "تصفح المنتجات المتوفرة في المتجر",
      category: "التصنيف",
      price: "السعر",
      stock: "المخزون",
      available: "متوفر",
      outOfStock: "غير متوفر",
      unknownProduct: "منتج غير معروف",
      general: "عام",
      noProducts: "لا توجد منتجات متوفرة",
      logout: "تسجيل الخروج",
      customerMode: "وضع الزبون",

      productsTab: "المنتجات",
      myOrders: "طلباتي",
      cart: "السلة",
      noOrdersYet: "لا توجد طلبات حتى الآن",
      noCartItems: "السلة فارغة",
      order: "طلب",
      status: "الحالة",
      quantity: "الكمية",
      total: "المجموع",
      date: "التاريخ",

      pending: "معلق",
      processing: "قيد المعالجة",
      completed: "مكتمل",
      cancelled: "ملغي",

      addToCart: "أضف للسلة",
      addedToCartTitle: "تمت الإضافة",
      addedToCartMessage: "تمت إضافة المنتج إلى السلة",
      remove: "حذف",
      checkout: "إتمام الطلب",
      checkoutTitle: "إتمام الطلب",
      customerName: "اسمك",
      phone: "رقم الهاتف",
      address: "العنوان",
      paymentMethod: "طريقة الدفع",
      cash: "كاش",
      card: "بطاقة",
      bank: "تحويل بنكي",
      notes: "ملاحظات",
      submitOrder: "إرسال الطلب",
      cancel: "إلغاء",
      cartTotal: "مجموع السلة",

      orderSuccessTitle: "تم إنشاء الطلب",
      orderSuccessMessage: "تم إرسال طلبك بنجاح",
      orderErrorTitle: "فشل الطلب",
      cannotOrderOutOfStock: "هذا المنتج غير متوفر في المخزون",
      enterName: "الرجاء إدخال الاسم",
      enterPhone: "الرجاء إدخال رقم الهاتف",
      enterAddress: "الرجاء إدخال العنوان",

      orderDetails: "تفاصيل الطلب",
      editOrder: "تعديل الطلب",
      saveChanges: "حفظ التعديل",
      close: "إغلاق",
      customerInfo: "بيانات الزبون",
      items: "المنتجات",
      cannotEditOrder: "لا يمكن تعديل هذا الطلب",

      cancelOrder: "إلغاء الطلب",
      cancelOrderTitle: "إلغاء الطلب",
      cancelOrderConfirm:
        "هل أنت متأكد أنك تريد إلغاء هذا الطلب؟ سيتم إرجاع الكمية إلى المخزون.",
      cancelOrderSuccessTitle: "تم إلغاء الطلب",
      cancelOrderSuccessMessage:
        "تم إلغاء الطلب وإرجاع الكمية إلى المخزون.",
      cannotCancelOrder: "لا يمكن إلغاء هذا الطلب",

      productDetails: "تفاصيل المنتج",
      viewDetails: "تفاصيل المنتج",
      description: "الوصف",
      noDescription: "لا يوجد وصف متوفر",
      searchProduct: "ابحث عن منتج...",
      clearSearch: "مسح",
    },

    he: {
      availableProducts: "מוצרים זמינים",
      customerWelcome: "צפה במוצרים הזמינים בחנות",
      category: "קטגוריה",
      price: "מחיר",
      stock: "מלאי",
      available: "זמין",
      outOfStock: "אזל מהמלאי",
      unknownProduct: "מוצר לא ידוע",
      general: "כללי",
      noProducts: "אין מוצרים זמינים",
      logout: "התנתקות",
      customerMode: "מצב לקוח",

      productsTab: "מוצרים",
      myOrders: "ההזמנות שלי",
      cart: "עגלה",
      noOrdersYet: "אין לך הזמנות עדיין",
      noCartItems: "העגלה ריקה",
      order: "הזמנה",
      status: "סטטוס",
      quantity: "כמות",
      total: "סה״כ",
      date: "תאריך",

      pending: "ממתין",
      processing: "בטיפול",
      completed: "הושלם",
      cancelled: "בוטל",

      addToCart: "הוסף לעגלה",
      addedToCartTitle: "נוסף",
      addedToCartMessage: "המוצר נוסף לעגלה",
      remove: "הסר",
      checkout: "לתשלום",
      checkoutTitle: "השלמת הזמנה",
      customerName: "שם",
      phone: "טלפון",
      address: "כתובת",
      paymentMethod: "אמצעי תשלום",
      cash: "מזומן",
      card: "כרטיס",
      bank: "העברה בנקאית",
      notes: "הערות",
      submitOrder: "שלח הזמנה",
      cancel: "ביטול",
      cartTotal: "סה״כ עגלה",

      orderSuccessTitle: "ההזמנה נוצרה",
      orderSuccessMessage: "ההזמנה שלך נשלחה בהצלחה",
      orderErrorTitle: "ההזמנה נכשלה",
      cannotOrderOutOfStock: "המוצר אזל מהמלאי",
      enterName: "נא להזין שם",
      enterPhone: "נא להזין מספר טלפון",
      enterAddress: "נא להזין כתובת",

      orderDetails: "פרטי הזמנה",
      editOrder: "עריכת הזמנה",
      saveChanges: "שמירת שינויים",
      close: "סגור",
      customerInfo: "פרטי לקוח",
      items: "מוצרים",
      cannotEditOrder: "לא ניתן לערוך הזמנה זו",

      cancelOrder: "ביטול הזמנה",
      cancelOrderTitle: "ביטול הזמנה",
      cancelOrderConfirm:
        "האם אתה בטוח שברצונך לבטל הזמנה זו? הכמות תחזור למלאי.",
      cancelOrderSuccessTitle: "ההזמנה בוטלה",
      cancelOrderSuccessMessage:
        "ההזמנה בוטלה והכמות הוחזרה למלאי.",
      cannotCancelOrder: "לא ניתן לבטל הזמנה זו",

      productDetails: "פרטי מוצר",
      viewDetails: "פרטי מוצר",
      description: "תיאור",
      noDescription: "אין תיאור זמין",
      searchProduct: "חפש מוצר...",
      clearSearch: "נקה",
    },
  };

  useEffect(() => {
    loadStoredUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchAllData();
    }
  }, [currentUser]);

  function ct(key) {
    const language = settings?.language || "en";

    return customerText[language]?.[key] || customerText.en[key] || key;
  }

  async function loadStoredUser() {
    try {
      const storedUser = await AsyncStorage.getItem("currentUser");
      const storedToken = await AsyncStorage.getItem("authToken");

      if (storedToken) {
        axios.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
      }

      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log("LOAD USER ERROR:", error?.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogin(userData) {
    try {
      setCurrentUser(userData);

      if (userData?.token) {
        axios.defaults.headers.common.Authorization = `Bearer ${userData.token}`;
        await AsyncStorage.setItem("authToken", userData.token);
      }

      await AsyncStorage.setItem("currentUser", JSON.stringify(userData));
    } catch (error) {
      console.log("SAVE USER ERROR:", error?.message);
    }
  }

  async function handleLogout() {
    try {
      await AsyncStorage.removeItem("currentUser");
      await AsyncStorage.removeItem("authToken");

      delete axios.defaults.headers.common.Authorization;

      setCurrentUser(null);
      setActiveScreen("dashboard");
      setCustomerScreen("products");
      setCustomerProductSearch("");

      setOrders([]);
      setProducts([]);
      setCustomers([]);
      setStats(null);
      setSearch("");
      setStatusFilter("all");
      setCart([]);
      setProductDetailsVisible(false);
      setSelectedProduct(null);
      setCheckoutVisible(false);
      setCustomerOrderDetailsVisible(false);
      setSelectedCustomerOrder(null);
      setCustomerOrderEditMode(false);
    } catch (error) {
      console.log("LOGOUT ERROR:", error?.message);
    }
  }

  async function fetchAllData() {
    try {
      setLoading(true);

      const [ordersResult, productsResult, customersResult, statsResult] =
        await getAllData();

      if (ordersResult.status === "fulfilled") {
        setOrders(extractArray(ordersResult.value.data));
      }

      if (productsResult.status === "fulfilled") {
        setProducts(extractArray(productsResult.value.data));
      }

      if (customersResult.status === "fulfilled") {
        setCustomers(extractArray(customersResult.value.data));
      }

      if (statsResult.status === "fulfilled") {
        setStats(statsResult.value.data || null);
      }
    } catch (error) {
      showError("Failed to load data", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await fetchAllData();
  }

  const totalRevenue = useMemo(() => {
    return orders
      .filter((order) => order.status !== "cancelled")
      .reduce((sum, order) => sum + getOrderTotal(order), 0);
  }, [orders]);

  const pendingCount = useMemo(() => {
    return orders.filter((order) => order.status === "pending").length;
  }, [orders]);

  const completedCount = useMemo(() => {
    return orders.filter((order) => order.status === "completed").length;
  }, [orders]);

  const cancelledCount = useMemo(() => {
    return orders.filter((order) => order.status === "cancelled").length;
  }, [orders]);

  const lowStockProducts = useMemo(() => {
    return products.filter((product) => Number(product.stock || 0) <= 5);
  }, [products]);

  const todayRevenue = useMemo(() => {
    const today = new Date().toDateString();

    return orders
      .filter((order) => {
        if (!order.createdAt || order.status === "cancelled") return false;
        return new Date(order.createdAt).toDateString() === today;
      })
      .reduce((sum, order) => sum + getOrderTotal(order), 0);
  }, [orders]);

  const monthRevenue = useMemo(() => {
    const now = new Date();

    return orders
      .filter((order) => {
        if (!order.createdAt || order.status === "cancelled") return false;

        const orderDate = new Date(order.createdAt);

        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, order) => sum + getOrderTotal(order), 0);
  }, [orders]);

  const averageOrderValue = useMemo(() => {
    const validOrders = orders.filter((order) => order.status !== "cancelled");

    if (validOrders.length === 0) return 0;

    return (totalRevenue / validOrders.length).toFixed(2);
  }, [orders, totalRevenue]);

  const bestSellingProduct = useMemo(() => {
    const productMap = {};

    orders
      .filter((order) => order.status !== "cancelled")
      .forEach((order) => {
        const name = order.productName || order.productId?.name || "Unknown";

        if (!productMap[name]) {
          productMap[name] = {
            name,
            quantity: 0,
            revenue: 0,
          };
        }

        productMap[name].quantity += Number(order.quantity || 1);
        productMap[name].revenue += getOrderTotal(order);
      });

    const productsArray = Object.values(productMap);

    if (productsArray.length === 0) return null;

    return productsArray.sort((a, b) => b.quantity - a.quantity)[0];
  }, [orders]);

  const bestCustomer = useMemo(() => {
    const customerMap = {};

    orders
      .filter((order) => order.status !== "cancelled")
      .forEach((order) => {
        const name = order.customerName || order.customerId?.name || "Unknown";
        const phone = order.customerPhone || order.customerId?.phone || "";
        const key = phone || name;

        if (!customerMap[key]) {
          customerMap[key] = {
            name,
            phone,
            ordersCount: 0,
            revenue: 0,
          };
        }

        customerMap[key].ordersCount += 1;
        customerMap[key].revenue += getOrderTotal(order);
      });

    const customersArray = Object.values(customerMap);

    if (customersArray.length === 0) return null;

    return customersArray.sort((a, b) => b.revenue - a.revenue)[0];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const text = search.toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        (order.productName || "").toLowerCase().includes(text) ||
        (order.customerName || "").toLowerCase().includes(text) ||
        (order.customerPhone || "").toLowerCase().includes(text);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const filteredProducts = useMemo(() => {
    const text = search.toLowerCase();

    return products.filter((product) => {
      return (
        (product.name || "").toLowerCase().includes(text) ||
        (product.category || "").toLowerCase().includes(text) ||
        (product.description || "").toLowerCase().includes(text)
      );
    });
  }, [products, search]);

  const filteredCustomers = useMemo(() => {
    const text = search.toLowerCase();

    return customers.filter((customer) => {
      return (
        (customer.name || "").toLowerCase().includes(text) ||
        (customer.phone || "").toLowerCase().includes(text) ||
        (customer.address || "").toLowerCase().includes(text)
      );
    });
  }, [customers, search]);

  const customerOrders = useMemo(() => {
    const userEmail = (currentUser?.email || "").toLowerCase();
    const userName = (
      currentUser?.fullName ||
      currentUser?.name ||
      ""
    ).toLowerCase();

    return orders.filter((order) => {
      const orderCustomerName = (order.customerName || "").toLowerCase();
      const orderNotes = (order.notes || "").toLowerCase();

      const matchesEmail = userEmail && orderNotes.includes(userEmail);
      const matchesName = userName && orderCustomerName === userName;

      return matchesEmail || matchesName;
    });
  }, [orders, currentUser]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      return sum + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0);
  }, [cart]);

  const customerFilteredProducts = useMemo(() => {
    const text = customerProductSearch.trim().toLowerCase();

    if (!text) return products;

    return products.filter((product) => {
      return (
        (product.name || "").toLowerCase().includes(text) ||
        (product.category || "").toLowerCase().includes(text) ||
        (product.description || "").toLowerCase().includes(text)
      );
    });
  }, [products, customerProductSearch]);

  function resetSearchWhenSwitchScreen(screenKey) {
    setActiveScreen(screenKey);
    setSearch("");
    setStatusFilter("all");
  }

  function openAddModal(type) {
    setModalType(type);
    setEditingItem(null);

    if (type === "order") setOrderForm(emptyOrderForm);
    if (type === "product") setProductForm(emptyProductForm);
    if (type === "customer") setCustomerForm(emptyCustomerForm);

    setModalVisible(true);
  }

  function openEditOrder(order) {
    setModalType("order");
    setEditingItem(order);

    setOrderForm({
      customerId: order.customerId?._id || order.customerId || "",
      productId: order.productId?._id || order.productId || "",
      customerName: order.customerName || order.customerId?.name || "",
      customerPhone: order.customerPhone || order.customerId?.phone || "",
      customerAddress: order.customerAddress || order.customerId?.address || "",
      productName: order.productName || order.productId?.name || "",
      quantity: String(order.quantity || "1"),
      unitPrice: String(
        order.unitPrice ?? order.productId?.price ?? order.price ?? ""
      ),
      status: order.status || "pending",
      paymentMethod: order.paymentMethod || "cash",
      notes: order.notes || "",
    });

    setModalVisible(true);
  }

  function openEditProduct(product) {
    setModalType("product");
    setEditingItem(product);

    setProductForm({
      name: product.name || "",
      category: product.category || "",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      description: product.description || "",
    });

    setModalVisible(true);
  }

  function openEditCustomer(customer) {
    setModalType("customer");
    setEditingItem(customer);

    setCustomerForm({
      name: customer.name || "",
      phone: customer.phone || "",
      address: customer.address || "",
      notes: customer.notes || "",
    });

    setModalVisible(true);
  }

  function openOrderDetails(order) {
    setSelectedOrder(order);
    setDetailsVisible(true);
  }

  function closeOrderDetails() {
    setSelectedOrder(null);
    setDetailsVisible(false);
  }

  function closeModal() {
    Keyboard.dismiss();
    setModalVisible(false);
    setEditingItem(null);
  }

  function getCustomerOrderDate(order) {
    if (!order.createdAt) return "";

    const language = settings?.language || "en";

    const locale =
      language === "ar" ? "ar" : language === "he" ? "he-IL" : "en-US";

    return new Date(order.createdAt).toLocaleDateString(locale);
  }

  function getCustomerStatusColor(status) {
    if (status === "completed") return "#16A34A";
    if (status === "processing") return "#2563EB";
    if (status === "cancelled") return "#DC2626";
    return "#F59E0B";
  }

  function renderCustomerTabs() {
    return (
      <View
        style={[
          styles.customerTabsRow,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <Pressable
          style={[
            styles.customerTabButton,
            customerScreen === "products" && {
              backgroundColor: theme.primary,
              borderColor: theme.primary,
            },
          ]}
          onPress={() => setCustomerScreen("products")}
        >
          <Text
            style={[
              styles.customerTabText,
              {
                color: customerScreen === "products" ? "#FFFFFF" : theme.text,
              },
            ]}
          >
                        {ct("productsTab")}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.customerTabButton,
            customerScreen === "cart" && {
              backgroundColor: theme.primary,
              borderColor: theme.primary,
            },
          ]}
          onPress={() => setCustomerScreen("cart")}
        >
          <Text
            style={[
              styles.customerTabText,
              {
                color: customerScreen === "cart" ? "#FFFFFF" : theme.text,
              },
            ]}
          >
            {ct("cart")} ({cartCount})
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.customerTabButton,
            customerScreen === "orders" && {
              backgroundColor: theme.primary,
              borderColor: theme.primary,
            },
          ]}
          onPress={() => setCustomerScreen("orders")}
        >
          <Text
            style={[
              styles.customerTabText,
              {
                color: customerScreen === "orders" ? "#FFFFFF" : theme.text,
              },
            ]}
          >
            {ct("myOrders")}
          </Text>
        </Pressable>
      </View>
    );
  }

  function openProductDetails(product) {
    setSelectedProduct(product);
    setProductDetailsVisible(true);
  }

  function closeProductDetails() {
    setSelectedProduct(null);
    setProductDetailsVisible(false);
  }

  function addToCart(product) {
    const stock = Number(product.stock || 0);

    if (stock <= 0) {
      Alert.alert(ct("orderErrorTitle"), ct("cannotOrderOutOfStock"));
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product._id);

      if (existingItem) {
        if (existingItem.quantity >= stock) {
          Alert.alert(ct("orderErrorTitle"), ct("cannotOrderOutOfStock"));
          return prevCart;
        }

        return prevCart.map((item) => {
          if (item.id !== product._id) return item;

          return {
            ...item,
            quantity: item.quantity + 1,
          };
        });
      }

      return [
        ...prevCart,
        {
          id: product._id,
          name: product.name || ct("unknownProduct"),
          category: product.category || ct("general"),
          price: Number(product.price || 0),
          stock,
          quantity: 1,
        },
      ];
    });
  }

  function updateCartQuantity(productId, newQuantity) {
    setCart((prevCart) => {
      if (newQuantity <= 0) {
        return prevCart.filter((item) => item.id !== productId);
      }

      return prevCart.map((item) => {
        if (item.id !== productId) return item;

        const safeQuantity = Math.min(newQuantity, Number(item.stock || 1));

        return {
          ...item,
          quantity: safeQuantity,
        };
      });
    });
  }

  function removeCartItem(productId) {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }

  function openCheckout() {
    if (cart.length === 0) {
      Alert.alert(ct("cart"), ct("noCartItems"));
      return;
    }

    setCheckoutForm({
      name: currentUser?.fullName || currentUser?.name || "",
      phone: currentUser?.phone || "",
      address: "",
      paymentMethod: "cash",
      notes: "",
    });

    setCheckoutVisible(true);
  }

  function closeCheckout() {
    Keyboard.dismiss();
    setCheckoutVisible(false);
  }

  async function submitCheckout() {
    Keyboard.dismiss();

    if (cart.length === 0) {
      Alert.alert(ct("cart"), ct("noCartItems"));
      return;
    }

    if (!checkoutForm.name.trim()) {
      Alert.alert(ct("orderErrorTitle"), ct("enterName"));
      return;
    }

    if (!checkoutForm.phone.trim()) {
      Alert.alert(ct("orderErrorTitle"), ct("enterPhone"));
      return;
    }

    if (!checkoutForm.address.trim()) {
      Alert.alert(ct("orderErrorTitle"), ct("enterAddress"));
      return;
    }

    const itemsText = cart
      .map((item, index) => {
        const itemTotal = Number(item.price || 0) * Number(item.quantity || 1);

        return `${index + 1}. ${item.name} x ${item.quantity} = ${formatMoney(
          itemTotal
        )}`;
      })
      .join("\n");

    const firstItem = cart[0];

    const payload = {
      productId: firstItem?.id,
      customerName: checkoutForm.name.trim(),
      customerPhone: checkoutForm.phone.trim(),
      customerAddress: checkoutForm.address.trim(),
      productName: `Cart Order (${cart.length} items)`,
      quantity: 1,
      unitPrice: Number(cartTotal),
      status: "pending",
      paymentMethod: checkoutForm.paymentMethod,
      notes:
        `Customer email: ${currentUser?.email || ""}\n` +
        `Customer name: ${checkoutForm.name.trim()}\n` +
        `Phone: ${checkoutForm.phone.trim()}\n` +
        `Address: ${checkoutForm.address.trim()}\n` +
        `Payment: ${checkoutForm.paymentMethod}\n` +
        `Customer notes: ${checkoutForm.notes.trim()}\n\n` +
        `Items:\n${itemsText}`,
    };

    try {
      setLoading(true);

      await axios.post(ordersUrl, payload);

      setCart([]);
      setCheckoutVisible(false);
      setCustomerScreen("orders");

      Alert.alert(ct("orderSuccessTitle"), ct("orderSuccessMessage"));

      await fetchAllData();
    } catch (error) {
      showError(ct("orderErrorTitle"), error);
    } finally {
      setLoading(false);
    }
  }

  function readValueFromOrderNotes(notes, label) {
    const lines = String(notes || "").split("\n");

    const line = lines.find((item) =>
      item.toLowerCase().startsWith(label.toLowerCase() + ":")
    );

    if (!line) return "";

    return line.substring(line.indexOf(":") + 1).trim();
  }

  function getItemsTextFromOrder(order) {
    const notes = String(order?.notes || "");
    const index = notes.indexOf("Items:");

    if (index === -1) {
      return `${order?.productName || ct("unknownProduct")} x ${
        order?.quantity || 1
      }`;
    }

    return notes.slice(index).trim();
  }

  function canEditCustomerOrder(order) {
    const status = order?.status || "pending";

    return status === "pending" || status === "processing";
  }

  function canCancelCustomerOrder(order) {
    const status = order?.status || "pending";

    return status === "pending" || status === "processing";
  }

  async function cancelCustomerOrder(order) {
    if (!order?._id) return;

    if (!canCancelCustomerOrder(order)) {
      Alert.alert(ct("orderErrorTitle"), ct("cannotCancelOrder"));
      return;
    }

    Alert.alert(ct("cancelOrderTitle"), ct("cancelOrderConfirm"), [
      {
        text: ct("cancel"),
        style: "cancel",
      },
      {
        text: ct("cancelOrder"),
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);

            const response = await axios.patch(
              `${ordersUrl}/${order._id}/status`,
              {
                status: "cancelled",
              }
            );

            setSelectedCustomerOrder(response.data);
            setCustomerOrderEditMode(false);

            await fetchAllData();

            Alert.alert(
              ct("cancelOrderSuccessTitle"),
              ct("cancelOrderSuccessMessage")
            );
          } catch (error) {
            showError(ct("orderErrorTitle"), error);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  }

  function openCustomerOrderDetails(order) {
    setSelectedCustomerOrder(order);
    setCustomerOrderEditMode(false);

    setCustomerOrderEditForm({
      name:
        order.customerName ||
        readValueFromOrderNotes(order.notes, "Customer name") ||
        "",
      phone:
        order.customerPhone ||
        readValueFromOrderNotes(order.notes, "Phone") ||
        "",
      address:
        order.customerAddress ||
        readValueFromOrderNotes(order.notes, "Address") ||
        "",
      paymentMethod:
        order.paymentMethod ||
        readValueFromOrderNotes(order.notes, "Payment") ||
        "cash",
      notes: readValueFromOrderNotes(order.notes, "Customer notes") || "",
    });

    setCustomerOrderDetailsVisible(true);
  }

  function closeCustomerOrderDetails() {
    Keyboard.dismiss();
    setCustomerOrderDetailsVisible(false);
    setSelectedCustomerOrder(null);
    setCustomerOrderEditMode(false);
  }

  async function saveCustomerOrderEdit() {
    Keyboard.dismiss();

    if (!selectedCustomerOrder) return;

    if (!canEditCustomerOrder(selectedCustomerOrder)) {
      Alert.alert(ct("orderErrorTitle"), ct("cannotEditOrder"));
      return;
    }

    if (!customerOrderEditForm.name.trim()) {
      Alert.alert(ct("orderErrorTitle"), ct("enterName"));
      return;
    }

    if (!customerOrderEditForm.phone.trim()) {
      Alert.alert(ct("orderErrorTitle"), ct("enterPhone"));
      return;
    }

    if (!customerOrderEditForm.address.trim()) {
      Alert.alert(ct("orderErrorTitle"), ct("enterAddress"));
      return;
    }

    const itemsSection = getItemsTextFromOrder(selectedCustomerOrder);

    const payload = {
      customerName: customerOrderEditForm.name.trim(),
      customerPhone: customerOrderEditForm.phone.trim(),
      customerAddress: customerOrderEditForm.address.trim(),
      paymentMethod: customerOrderEditForm.paymentMethod,
      notes:
        `Customer email: ${currentUser?.email || ""}\n` +
        `Customer name: ${customerOrderEditForm.name.trim()}\n` +
        `Phone: ${customerOrderEditForm.phone.trim()}\n` +
        `Address: ${customerOrderEditForm.address.trim()}\n` +
        `Payment: ${customerOrderEditForm.paymentMethod}\n` +
        `Customer notes: ${customerOrderEditForm.notes.trim()}\n\n` +
        `${itemsSection}`,
    };

    try {
      setLoading(true);

      await axios.patch(`${ordersUrl}/${selectedCustomerOrder._id}`, payload);

      setSelectedCustomerOrder((prev) => ({
        ...prev,
        ...payload,
      }));

      setCustomerOrderEditMode(false);

      await fetchAllData();
    } catch (error) {
      showError(ct("orderErrorTitle"), error);
    } finally {
      setLoading(false);
    }
  }

  async function saveOrder() {
    Keyboard.dismiss();

    if (!orderForm.customerName.trim()) {
      Alert.alert("Warning", "Please enter the customer name");
      return;
    }

    if (!orderForm.productName.trim()) {
      Alert.alert("Warning", "Please enter the product name");
      return;
    }

    if (!orderForm.quantity || Number(orderForm.quantity) <= 0) {
      Alert.alert("Warning", "Please enter a valid quantity");
      return;
    }

    if (!orderForm.unitPrice || Number(orderForm.unitPrice) <= 0) {
      Alert.alert("Warning", "Please enter a valid unit price");
      return;
    }

    const payload = {
      customerId: orderForm.customerId || undefined,
      productId: orderForm.productId || undefined,
      customerName: orderForm.customerName.trim(),
      customerPhone: orderForm.customerPhone.trim(),
      customerAddress: orderForm.customerAddress.trim(),
      productName: orderForm.productName.trim(),
      quantity: Number(orderForm.quantity),
      unitPrice: Number(orderForm.unitPrice),
      status: orderForm.status,
      paymentMethod: orderForm.paymentMethod,
      notes: orderForm.notes.trim(),
    };

    try {
      setLoading(true);

      if (editingItem) {
        await axios.patch(`${ordersUrl}/${editingItem._id}`, payload);
      } else {
        await axios.post(ordersUrl, payload);
      }

      closeModal();
      await fetchAllData();
    } catch (error) {
      showError("Failed to save order", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveProduct() {
    Keyboard.dismiss();

    if (!productForm.name.trim()) {
      Alert.alert("Warning", "Please enter the product name");
      return;
    }

    if (!productForm.price || Number(productForm.price) < 0) {
      Alert.alert("Warning", "Please enter a valid price");
      return;
    }

    if (productForm.stock === "" || Number(productForm.stock) < 0) {
      Alert.alert("Warning", "Please enter a valid stock quantity");
      return;
    }

    const payload = {
      name: productForm.name.trim(),
      category: productForm.category.trim() || "General",
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      description: productForm.description.trim(),
    };

    try {
      setLoading(true);

      if (editingItem) {
        await axios.patch(`${productsUrl}/${editingItem._id}`, payload);
      } else {
        await axios.post(productsUrl, payload);
      }

      closeModal();
      await fetchAllData();
    } catch (error) {
      showError("Failed to save product", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveCustomer() {
    Keyboard.dismiss();

    if (!customerForm.name.trim()) {
      Alert.alert("Warning", "Please enter the customer name");
      return;
    }

    if (!customerForm.phone.trim()) {
      Alert.alert("Warning", "Please enter the phone number");
      return;
    }

    const payload = {
      name: customerForm.name.trim(),
      phone: customerForm.phone.trim(),
      address: customerForm.address.trim(),
      notes: customerForm.notes.trim(),
    };

    try {
      setLoading(true);

      if (editingItem) {
        await axios.patch(`${customersUrl}/${editingItem._id}`, payload);
      } else {
        await axios.post(customersUrl, payload);
      }

      closeModal();
      await fetchAllData();
    } catch (error) {
      showError("Failed to save customer", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveCurrentModal() {
    if (modalType === "order") await saveOrder();
    if (modalType === "product") await saveProduct();
    if (modalType === "customer") await saveCustomer();
  }

  async function updateOrderStatus(order, newStatus) {
    try {
      setLoading(true);

      await axios.patch(`${ordersUrl}/${order._id}/status`, {
        status: newStatus,
      });

      await fetchAllData();
    } catch (error) {
      showError("Failed to update order status", error);
    } finally {
      setLoading(false);
    }
  }

  function confirmDelete(type, item) {
    const titles = {
      order: "Delete Order",
      product: "Delete Product",
      customer: "Delete Customer",
    };

    const names = {
      order: item.productName,
      product: item.name,
      customer: item.name,
    };

    Alert.alert(titles[type], `Are you sure you want to delete ${names[type]}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteItem(type, item),
      },
    ]);
  }

  async function deleteItem(type, item) {
    try {
      setLoading(true);

      if (type === "order") {
        await axios.delete(`${ordersUrl}/${item._id}`);
      }

      if (type === "product") {
        await axios.delete(`${productsUrl}/${item._id}`);
      }

      if (type === "customer") {
        await axios.delete(`${customersUrl}/${item._id}`);
      }

      await fetchAllData();
    } catch (error) {
      showError("Failed to delete item", error);
    } finally {
      setLoading(false);
    }
  }

  function showError(title, error) {
    console.log("ERROR MESSAGE:", error?.message);
    console.log("ERROR CODE:", error?.code);
    console.log("ERROR RESPONSE:", error?.response?.data);
    console.log("ERROR URL:", error?.config?.url);

    Alert.alert(
      title,
      error?.response?.data?.message ||
        error?.message ||
        "Unknown error occurred"
    );
  }

  function getCustomerOrderCount(customer) {
    return orders.filter((order) => {
      return (
        order.customerPhone === customer.phone ||
        order.customerName === customer.name
      );
    }).length;
  }

  function getCustomerTotalPurchases(customer) {
    return orders
      .filter((order) => {
        return (
          order.status !== "cancelled" &&
          (order.customerPhone === customer.phone ||
            order.customerName === customer.name)
        );
      })
      .reduce((sum, order) => sum + getOrderTotal(order), 0);
  }

  function renderProductsList() {
    return (
      <View style={styles.productsSearchContainer}>
        <View
          style={[
            styles.customerSearchBox,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <TextInput
            style={[
              styles.customerSearchInput,
              { textAlign: isRTL ? "right" : "left" },
            ]}
            placeholder={ct("searchProduct")}
            placeholderTextColor="#777"
            value={customerProductSearch}
            onChangeText={setCustomerProductSearch}
          />

          {customerProductSearch.trim() ? (
            <Pressable
              style={styles.clearSearchButton}
              onPress={() => setCustomerProductSearch("")}
            >
              <Text style={styles.clearSearchText}>{ct("clearSearch")}</Text>
            </Pressable>
          ) : null}
        </View>

        <FlatList
          data={customerFilteredProducts}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.customerList}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={[styles.emptyText, { color: theme.muted }]}>
                {ct("noProducts")}
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const stock = Number(item.stock || 0);
            const available = stock > 0;

            return (
              <View
                style={[
                  styles.customerProductCard,
                  { backgroundColor: theme.card },
                ]}
              >
                <View
                  style={[
                    styles.customerProductHeader,
                    { flexDirection: isRTL ? "row-reverse" : "row" },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.customerProductTitle,
                        {
                          color: theme.text,
                          textAlign: isRTL ? "right" : "left",
                        },
                      ]}
                    >
                      {item.name || ct("unknownProduct")}
                    </Text>

                    <Text
                      style={[
                        styles.customerProductText,
                        {
                          color: theme.muted,
                          textAlign: isRTL ? "right" : "left",
                        },
                      ]}
                    >
                      {ct("category")}: {item.category || ct("general")}
                    </Text>

                    <Text
                      style={[
                        styles.customerProductStrong,
                        {
                          color: theme.text,
                          textAlign: isRTL ? "right" : "left",
                        },
                      ]}
                    >
                      {ct("price")}: {formatMoney(item.price)}
                    </Text>

                    <Text
                      style={[
                        styles.customerProductText,
                        {
                          color: theme.muted,
                          textAlign: isRTL ? "right" : "left",
                        },
                      ]}
                    >
                      {ct("stock")}: {stock}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.customerBadge,
                      {
                        backgroundColor: available ? "#16A34A" : "#DC2626",
                      },
                    ]}
                  >
                    <Text style={styles.customerBadgeText}>
                      {available ? ct("available") : ct("outOfStock")}
                    </Text>
                  </View>
                </View>

                <Pressable
                  style={[styles.detailsButton, { borderColor: theme.primary }]}
                  onPress={() => openProductDetails(item)}
                >
                  <Text
                    style={[
                      styles.detailsButtonText,
                      { color: theme.primary },
                    ]}
                  >
                    {ct("viewDetails")}
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.orderNowButton,
                    {
                      backgroundColor: available ? theme.primary : "#9CA3AF",
                    },
                  ]}
                  disabled={!available || loading}
                  onPress={() => addToCart(item)}
                >
                  <Text style={styles.orderNowButtonText}>
                    {ct("addToCart")}
                  </Text>
                </Pressable>
              </View>
            );
          }}
        />
      </View>
    );
  }

  function renderCartList() {
    return (
      <View style={styles.cartContainer}>
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.customerList}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={[styles.emptyText, { color: theme.muted }]}>
                {ct("noCartItems")}
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const itemTotal =
              Number(item.price || 0) * Number(item.quantity || 1);

            return (
              <View
                style={[
                  styles.cartItemCard,
                  { backgroundColor: theme.card },
                ]}
              >
                <Text
                  style={[
                    styles.customerProductTitle,
                    {
                      color: theme.text,
                      textAlign: isRTL ? "right" : "left",
                    },
                  ]}
                >
                  {item.name}
                </Text>

                <Text
                  style={[
                    styles.customerProductText,
                    {
                      color: theme.muted,
                      textAlign: isRTL ? "right" : "left",
                    },
                  ]}
                >
                  {ct("price")}: {formatMoney(item.price)}
                </Text>

                <Text
                  style={[
                    styles.customerProductStrong,
                    {
                      color: theme.text,
                      textAlign: isRTL ? "right" : "left",
                    },
                  ]}
                >
                  {ct("total")}: {formatMoney(itemTotal)}
                </Text>

                <View
                  style={[
                    styles.cartActionsRow,
                    { flexDirection: isRTL ? "row-reverse" : "row" },
                  ]}
                >
                  <Pressable
                    style={styles.qtyButton}
                    onPress={() =>
                      updateCartQuantity(item.id, item.quantity - 1)
                    }
                  >
                    <Text style={styles.qtyButtonText}>-</Text>
                  </Pressable>

                  <Text style={[styles.qtyText, { color: theme.text }]}>
                    {item.quantity}
                  </Text>

                  <Pressable
                    style={styles.qtyButton}
                    onPress={() =>
                      updateCartQuantity(item.id, item.quantity + 1)
                    }
                  >
                    <Text style={styles.qtyButtonText}>+</Text>
                  </Pressable>

                  <Pressable
                    style={styles.removeButton}
                    onPress={() => removeCartItem(item.id)}
                  >
                    <Text style={styles.removeButtonText}>{ct("remove")}</Text>
                  </Pressable>
                </View>
              </View>
            );
          }}
        />

        {cart.length > 0 ? (
          <View style={[styles.cartFooter, { backgroundColor: theme.card }]}>
            <Text
              style={[
                styles.cartTotalText,
                {
                  color: theme.text,
                  textAlign: isRTL ? "right" : "left",
                },
              ]}
            >
              {ct("cartTotal")}: {formatMoney(cartTotal)}
            </Text>

            <Pressable
              style={[styles.checkoutButton, { backgroundColor: theme.primary }]}
              onPress={openCheckout}
            >
              <Text style={styles.checkoutButtonText}>{ct("checkout")}</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    );
  }

  function renderOrdersList() {
    return (
      <FlatList
        data={customerOrders}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.customerList}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={[styles.emptyText, { color: theme.muted }]}>
              {ct("noOrdersYet")}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const total = getOrderTotal(item);

          return (
            <Pressable
              onPress={() => openCustomerOrderDetails(item)}
              style={[
                styles.customerOrderCard,
                { backgroundColor: theme.card },
              ]}
            >
              <View
                style={[
                  styles.customerProductHeader,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.customerOrderTitle,
                      {
                        color: theme.text,
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {item.productName || ct("unknownProduct")}
                  </Text>

                  <Text
                    style={[
                      styles.customerOrderText,
                      {
                        color: theme.muted,
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {ct("quantity")}: {item.quantity || 1}
                  </Text>

                  <Text
                    style={[
                      styles.customerOrderText,
                      {
                        color: theme.muted,
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {ct("total")}: {formatMoney(total)}
                  </Text>

                  <Text
                    style={[
                      styles.customerOrderText,
                      {
                        color: theme.muted,
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {ct("date")}: {getCustomerOrderDate(item)}
                  </Text>
                </View>

                <View
                  style={[
                    styles.customerStatusBadge,
                    {
                      backgroundColor: getCustomerStatusColor(item.status),
                    },
                  ]}
                >
                  <Text style={styles.customerBadgeText}>
                    {ct(item.status || "pending")}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    );
  }

  function renderProductDetailsModal() {
    if (!selectedProduct) return null;

    const stock = Number(selectedProduct.stock || 0);
    const available = stock > 0;

    return (
      <Modal
        visible={productDetailsVisible}
        transparent
        animationType="slide"
        onRequestClose={closeProductDetails}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.checkoutModal, { backgroundColor: theme.card }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={[
                  styles.checkoutTitle,
                  {
                    color: theme.text,
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              >
                {ct("productDetails")}
              </Text>

              <Text
                style={[
                  styles.customerProductTitle,
                  {
                    color: theme.text,
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              >
                {selectedProduct.name || ct("unknownProduct")}
              </Text>

              <Text
                style={[
                  styles.detailsText,
                  {
                    color: theme.muted,
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              >
                {ct("category")}: {selectedProduct.category || ct("general")}
              </Text>

              <Text
                style={[
                  styles.detailsText,
                  {
                    color: theme.muted,
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              >
                {ct("price")}: {formatMoney(selectedProduct.price)}
              </Text>

              <Text
                style={[
                  styles.detailsText,
                  {
                    color: theme.muted,
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              >
                {ct("stock")}: {stock}
              </Text>

              <View
                style={[
                  styles.customerBadge,
                  {
                    backgroundColor: available ? "#16A34A" : "#DC2626",
                    marginTop: 10,
                    marginBottom: 12,
                    alignSelf: isRTL ? "flex-end" : "flex-start",
                  },
                ]}
              >
                <Text style={styles.customerBadgeText}>
                  {available ? ct("available") : ct("outOfStock")}
                </Text>
              </View>

              <Text
                style={[
                  styles.detailsSectionTitle,
                  {
                    color: theme.text,
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              >
                {ct("description")}
              </Text>

              <Text
                style={[
                  styles.productDescriptionText,
                  {
                    color: theme.text,
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              >
                {selectedProduct.description?.trim()
                  ? selectedProduct.description
                  : ct("noDescription")}
              </Text>

              <Pressable
                style={[
                  styles.submitOrderButton,
                  {
                    backgroundColor: available ? theme.primary : "#9CA3AF",
                  },
                ]}
                disabled={!available || loading}
                onPress={() => {
                  addToCart(selectedProduct);
                  closeProductDetails();
                }}
              >
                <Text style={styles.submitOrderText}>{ct("addToCart")}</Text>
              </Pressable>

              <Pressable style={styles.cancelButton} onPress={closeProductDetails}>
                <Text style={styles.cancelButtonText}>{ct("close")}</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }

  function renderCheckoutModal() {
    return (
      <Modal
        visible={checkoutVisible}
        transparent
        animationType="slide"
        onRequestClose={closeCheckout}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.checkoutModal, { backgroundColor: theme.card }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={[
                  styles.checkoutTitle,
                  {
                    color: theme.text,
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              >
                {ct("checkoutTitle")}
              </Text>

              <TextInput
                style={[
                  styles.checkoutInput,
                  { textAlign: isRTL ? "right" : "left" },
                ]}
                placeholder={ct("customerName")}
                placeholderTextColor="#777"
                value={checkoutForm.name}
                onChangeText={(value) =>
                  setCheckoutForm((prev) => ({ ...prev, name: value }))
                }
              />

              <TextInput
                style={[
                  styles.checkoutInput,
                  { textAlign: isRTL ? "right" : "left" },
                ]}
                placeholder={ct("phone")}
                placeholderTextColor="#777"
                value={checkoutForm.phone}
                keyboardType="phone-pad"
                onChangeText={(value) =>
                  setCheckoutForm((prev) => ({ ...prev, phone: value }))
                }
              />

              <TextInput
                style={[
                  styles.checkoutInput,
                  { textAlign: isRTL ? "right" : "left" },
                ]}
                placeholder={ct("address")}
                placeholderTextColor="#777"
                value={checkoutForm.address}
                onChangeText={(value) =>
                  setCheckoutForm((prev) => ({ ...prev, address: value }))
                }
              />

              <Text
                style={[
                  styles.paymentTitle,
                  {
                    color: theme.text,
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              >
                {ct("paymentMethod")}
              </Text>

              <View
                style={[
                  styles.paymentRow,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
                {["cash", "card", "bank"].map((method) => {
                  const active = checkoutForm.paymentMethod === method;

                  return (
                    <Pressable
                      key={method}
                      style={[
                        styles.paymentButton,
                        active && {
                          backgroundColor: theme.primary,
                          borderColor: theme.primary,
                        },
                      ]}
                      onPress={() =>
                        setCheckoutForm((prev) => ({
                          ...prev,
                          paymentMethod: method,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.paymentButtonText,
                          {
                            color: active ? "#FFFFFF" : theme.text,
                          },
                        ]}
                      >
                        {ct(method)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <TextInput
                style={[
                  styles.checkoutInput,
                  styles.notesInput,
                  { textAlign: isRTL ? "right" : "left" },
                ]}
                placeholder={ct("notes")}
                placeholderTextColor="#777"
                value={checkoutForm.notes}
                multiline
                onChangeText={(value) =>
                  setCheckoutForm((prev) => ({ ...prev, notes: value }))
                }
              />

              <Text
                style={[
                  styles.cartTotalText,
                  {
                    color: theme.text,
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              >
                {ct("cartTotal")}: {formatMoney(cartTotal)}
              </Text>

              <Pressable
                style={[
                  styles.submitOrderButton,
                  { backgroundColor: theme.primary },
                ]}
                onPress={submitCheckout}
                disabled={loading}
              >
                <Text style={styles.submitOrderText}>{ct("submitOrder")}</Text>
              </Pressable>

              <Pressable style={styles.cancelButton} onPress={closeCheckout}>
                <Text style={styles.cancelButtonText}>{ct("cancel")}</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }

  function renderCustomerOrderDetailsModal() {
    if (!selectedCustomerOrder) return null;

    const orderTotal = getOrderTotal(selectedCustomerOrder);
    const itemsText = getItemsTextFromOrder(selectedCustomerOrder);
    const editable = canEditCustomerOrder(selectedCustomerOrder);
    const cancellable = canCancelCustomerOrder(selectedCustomerOrder);

    return (
      <Modal
        visible={customerOrderDetailsVisible}
        transparent
        animationType="slide"
        onRequestClose={closeCustomerOrderDetails}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.checkoutModal, { backgroundColor: theme.card }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={[
                  styles.checkoutTitle,
                  {
                    color: theme.text,
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
              >
                {ct("orderDetails")}
              </Text>

              {!customerOrderEditMode ? (
                <>
                  <Text
                    style={[
                      styles.detailsSectionTitle,
                      {
                        color: theme.text,
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {ct("customerInfo")}
                  </Text>

                  <Text
                    style={[
                      styles.detailsText,
                      {
                        color: theme.muted,
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {ct("customerName")}: {selectedCustomerOrder.customerName}
                  </Text>

                  <Text
                    style={[
                      styles.detailsText,
                      {
                        color: theme.muted,
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {ct("phone")}: {selectedCustomerOrder.customerPhone}
                  </Text>

                  <Text
                    style={[
                      styles.detailsText,
                      {
                        color: theme.muted,
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {ct("address")}: {selectedCustomerOrder.customerAddress}
                  </Text>

                  <Text
                    style={[
                      styles.detailsText,
                      {
                        color: theme.muted,
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {ct("paymentMethod")}:{" "}
                    {ct(selectedCustomerOrder.paymentMethod || "cash")}
                  </Text>

                  <Text
                    style={[
                      styles.detailsText,
                      {
                        color: theme.muted,
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {ct("status")}:{" "}
                    {ct(selectedCustomerOrder.status || "pending")}
                  </Text>

                  <Text
                    style={[
                      styles.detailsText,
                      {
                        color: theme.muted,
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {ct("date")}: {getCustomerOrderDate(selectedCustomerOrder)}
                  </Text>

                  <Text
                    style={[
                      styles.detailsSectionTitle,
                      {
                        color: theme.text,
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {ct("items")}
                  </Text>

                  <Text
                    style={[
                      styles.itemsText,
                      {
                        color: theme.text,
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {itemsText}
                  </Text>

                  <Text
                    style={[
                      styles.cartTotalText,
                      {
                        color: theme.text,
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {ct("total")}: {formatMoney(orderTotal)}
                  </Text>

                  {editable ? (
                    <Pressable
                      style={[
                        styles.submitOrderButton,
                        { backgroundColor: theme.primary },
                      ]}
                      onPress={() => setCustomerOrderEditMode(true)}
                      disabled={loading}
                    >
                      <Text style={styles.submitOrderText}>
                        {ct("editOrder")}
                      </Text>
                    </Pressable>
                  ) : null}

                  {cancellable ? (
                    <Pressable
                      style={styles.dangerButton}
                      onPress={() => cancelCustomerOrder(selectedCustomerOrder)}
                      disabled={loading}
                    >
                      <Text style={styles.dangerButtonText}>
                        {ct("cancelOrder")}
                      </Text>
                    </Pressable>
                  ) : null}

                  <Pressable
                    style={styles.cancelButton}
                    onPress={closeCustomerOrderDetails}
                  >
                    <Text style={styles.cancelButtonText}>{ct("close")}</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <TextInput
                    style={[
                      styles.checkoutInput,
                      { textAlign: isRTL ? "right" : "left" },
                    ]}
                    placeholder={ct("customerName")}
                    placeholderTextColor="#777"
                    value={customerOrderEditForm.name}
                    onChangeText={(value) =>
                      setCustomerOrderEditForm((prev) => ({
                        ...prev,
                        name: value,
                      }))
                    }
                  />

                  <TextInput
                    style={[
                      styles.checkoutInput,
                      { textAlign: isRTL ? "right" : "left" },
                    ]}
                    placeholder={ct("phone")}
                    placeholderTextColor="#777"
                    keyboardType="phone-pad"
                    value={customerOrderEditForm.phone}
                    onChangeText={(value) =>
                      setCustomerOrderEditForm((prev) => ({
                        ...prev,
                        phone: value,
                      }))
                    }
                  />

                  <TextInput
                    style={[
                      styles.checkoutInput,
                      { textAlign: isRTL ? "right" : "left" },
                    ]}
                    placeholder={ct("address")}
                    placeholderTextColor="#777"
                    value={customerOrderEditForm.address}
                    onChangeText={(value) =>
                      setCustomerOrderEditForm((prev) => ({
                        ...prev,
                        address: value,
                      }))
                    }
                  />

                  <Text
                    style={[
                      styles.paymentTitle,
                      {
                        color: theme.text,
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                  >
                    {ct("paymentMethod")}
                  </Text>

                  <View
                    style={[
                      styles.paymentRow,
                      { flexDirection: isRTL ? "row-reverse" : "row" },
                    ]}
                  >
                    {["cash", "card", "bank"].map((method) => {
                      const active =
                        customerOrderEditForm.paymentMethod === method;

                      return (
                        <Pressable
                          key={method}
                          style={[
                            styles.paymentButton,
                            active && {
                              backgroundColor: theme.primary,
                              borderColor: theme.primary,
                            },
                          ]}
                          onPress={() =>
                            setCustomerOrderEditForm((prev) => ({
                              ...prev,
                              paymentMethod: method,
                            }))
                          }
                        >
                          <Text
                            style={[
                              styles.paymentButtonText,
                              {
                                color: active ? "#FFFFFF" : theme.text,
                              },
                            ]}
                          >
                            {ct(method)}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <TextInput
                    style={[
                      styles.checkoutInput,
                      styles.notesInput,
                      { textAlign: isRTL ? "right" : "left" },
                    ]}
                    placeholder={ct("notes")}
                    placeholderTextColor="#777"
                    value={customerOrderEditForm.notes}
                    multiline
                    onChangeText={(value) =>
                      setCustomerOrderEditForm((prev) => ({
                        ...prev,
                        notes: value,
                      }))
                    }
                  />

                  <Pressable
                    style={[
                      styles.submitOrderButton,
                      { backgroundColor: theme.primary },
                    ]}
                    onPress={saveCustomerOrderEdit}
                    disabled={loading}
                  >
                    <Text style={styles.submitOrderText}>
                      {ct("saveChanges")}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.cancelButton}
                    onPress={() => setCustomerOrderEditMode(false)}
                  >
                    <Text style={styles.cancelButtonText}>{ct("cancel")}</Text>
                  </Pressable>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }

  function renderCustomerContent() {
    if (loading && !refreshing) {
      return (
        <View
          style={[
            styles.loadingBox,
            { backgroundColor: theme.background },
          ]}
        >
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading...
          </Text>
        </View>
      );
    }

    return (
      <View
        style={[
          styles.customerScreen,
          { backgroundColor: theme.background },
        ]}
      >
        <Text
          style={[
            styles.customerMode,
            {
              color: theme.primary,
              textAlign: isRTL ? "right" : "left",
            },
          ]}
        >
          {ct("customerMode")}
        </Text>

        <Text
          style={[
            styles.customerTitle,
            {
              color: theme.text,
              textAlign: isRTL ? "right" : "left",
            },
          ]}
        >
          {customerScreen === "products"
            ? ct("availableProducts")
            : customerScreen === "cart"
            ? ct("cart")
            : ct("myOrders")}
        </Text>

        <Text
          style={[
            styles.customerSubtitle,
            {
              color: theme.muted,
              textAlign: isRTL ? "right" : "left",
            },
          ]}
        >
          {customerScreen === "products"
            ? ct("customerWelcome")
            : currentUser?.email || ""}
        </Text>

        {renderCustomerTabs()}

        {customerScreen === "products" ? renderProductsList() : null}
        {customerScreen === "cart" ? renderCartList() : null}
        {customerScreen === "orders" ? renderOrdersList() : null}

        <Pressable style={styles.customerLogoutButton} onPress={handleLogout}>
          <Text style={styles.customerLogoutText}>{ct("logout")}</Text>
        </Pressable>

        {renderProductDetailsModal()}
        {renderCheckoutModal()}
        {renderCustomerOrderDetailsModal()}
      </View>
    );
  }

  function renderContent() {
    if (loading && !refreshing) {
      return (
        <View
          style={[
            styles.loadingBox,
            { backgroundColor: theme.background },
          ]}
        >
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading...
          </Text>
        </View>
      );
    }

    if (activeScreen === "dashboard") {
      return (
        <DashboardScreen
          orders={orders}
          products={products}
          customers={customers}
          stats={stats}
          refreshing={refreshing}
          onRefresh={onRefresh}
          totalRevenue={totalRevenue}
          pendingCount={pendingCount}
          lowStockProducts={lowStockProducts}
          getOrderTotal={getOrderTotal}
        />
      );
    }

    if (activeScreen === "orders") {
      return (
        <OrdersScreen
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          filteredOrders={filteredOrders}
          refreshing={refreshing}
          onRefresh={onRefresh}
          openAddModal={openAddModal}
          getOrderUnitPrice={getOrderUnitPrice}
          getOrderTotal={getOrderTotal}
          updateOrderStatus={updateOrderStatus}
          openOrderDetails={openOrderDetails}
          openEditOrder={openEditOrder}
          confirmDelete={confirmDelete}
        />
      );
    }

    if (activeScreen === "products") {
      return (
        <ProductsScreen
          search={search}
          setSearch={setSearch}
          filteredProducts={filteredProducts}
          refreshing={refreshing}
          onRefresh={onRefresh}
          openAddModal={openAddModal}
          openEditProduct={openEditProduct}
          confirmDelete={confirmDelete}
        />
      );
    }

    if (activeScreen === "customers") {
      return (
        <CustomersScreen
          search={search}
          setSearch={setSearch}
          filteredCustomers={filteredCustomers}
          refreshing={refreshing}
          onRefresh={onRefresh}
          openAddModal={openAddModal}
          getCustomerOrderCount={getCustomerOrderCount}
          getCustomerTotalPurchases={getCustomerTotalPurchases}
          openEditCustomer={openEditCustomer}
          confirmDelete={confirmDelete}
        />
      );
    }

    if (activeScreen === "reports") {
      return (
        <ReportsScreen
          refreshing={refreshing}
          onRefresh={onRefresh}
          totalRevenue={totalRevenue}
          todayRevenue={todayRevenue}
          monthRevenue={monthRevenue}
          averageOrderValue={averageOrderValue}
          completedCount={completedCount}
          cancelledCount={cancelledCount}
          pendingCount={pendingCount}
          products={products}
          customers={customers}
          lowStockProducts={lowStockProducts}
          bestSellingProduct={bestSellingProduct}
          bestCustomer={bestCustomer}
        />
      );
    }

    if (activeScreen === "settings") {
      return (
        <SettingsScreen
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      );
    }

    return null;
  }

  if (authLoading) {
    return (
      <View
        style={[
          styles.loadingBox,
          { backgroundColor: theme.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Loading...
        </Text>
      </View>
    );
  }

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  if (!isAdmin) {
    return (
      <View style={[styles.root, { backgroundColor: theme.background }]}>
        <ExpoStatusBar style="light" />

        <Header />

        <View style={styles.content}>{renderCustomerContent()}</View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ExpoStatusBar style="light" />

      <Header />

      <Tabs
        activeScreen={activeScreen}
        onChangeScreen={resetSearchWhenSwitchScreen}
      />

      <View style={styles.content}>{renderContent()}</View>

      <EntityModal
        modalVisible={modalVisible}
        modalType={modalType}
        editingItem={editingItem}
        closeModal={closeModal}
        saveCurrentModal={saveCurrentModal}
        orderForm={orderForm}
        setOrderForm={setOrderForm}
        productForm={productForm}
        setProductForm={setProductForm}
        customerForm={customerForm}
        setCustomerForm={setCustomerForm}
        customers={customers}
        products={products}
      />

      <OrderDetailsModal
        detailsVisible={detailsVisible}
        selectedOrder={selectedOrder}
        closeOrderDetails={closeOrderDetails}
        getOrderUnitPrice={getOrderUnitPrice}
        getOrderTotal={getOrderTotal}
      />
    </View>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <MainApp />
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  content: {
    flex: 1,
  },

  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
  },

  customerScreen: {
    flex: 1,
    padding: 14,
  },

  customerMode: {
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 6,
  },

  customerTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 6,
  },

  customerSubtitle: {
    fontSize: 15,
    marginBottom: 14,
  },

  customerTabsRow: {
    gap: 8,
    marginBottom: 14,
  },

  customerTabButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },

  customerTabText: {
    fontSize: 13,
    fontWeight: "900",
  },

  productsSearchContainer: {
    flex: 1,
  },

  customerSearchBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    alignItems: "center",
    gap: 8,
  },

  customerSearchInput: {
    flex: 1,
    color: "#111827",
    fontSize: 15,
    paddingVertical: 8,
  },

  clearSearchButton: {
    backgroundColor: "#DC2626",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  clearSearchText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  customerList: {
    paddingBottom: 90,
  },

  customerProductCard: {
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  customerProductHeader: {
    justifyContent: "space-between",
    gap: 10,
  },

  customerProductTitle: {
    fontSize: 20,
    fontWeight: "900",
  },

  customerProductText: {
    fontSize: 14,
    marginTop: 5,
  },

  customerProductStrong: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: "900",
  },

  customerBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignSelf: "flex-start",
  },

  customerBadgeText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 12,
  },

  detailsButton: {
    borderRadius: 14,
    paddingVertical: 13,
    marginTop: 14,
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
  },

  detailsButtonText: {
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },

  orderNowButton: {
    borderRadius: 14,
    paddingVertical: 13,
    marginTop: 10,
  },

  orderNowButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
    textAlign: "center",
  },

  cartContainer: {
    flex: 1,
  },

  cartItemCard: {
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cartActionsRow: {
    alignItems: "center",
    gap: 10,
    marginTop: 14,
  },

  qtyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },

  qtyButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  qtyText: {
    fontSize: 18,
    fontWeight: "900",
    minWidth: 30,
    textAlign: "center",
  },

  removeButton: {
    backgroundColor: "#DC2626",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },

  removeButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 13,
  },

  cartFooter: {
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cartTotalText: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
  },

  checkoutButton: {
    borderRadius: 14,
    paddingVertical: 14,
  },

  checkoutButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "900",
  },

  customerOrderCard: {
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  customerOrderTitle: {
    fontSize: 19,
    fontWeight: "900",
  },

  customerOrderText: {
    fontSize: 14,
    marginTop: 5,
  },

  customerStatusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignSelf: "flex-start",
  },

  customerLogoutButton: {
    backgroundColor: "#DC2626",
    borderRadius: 16,
    paddingVertical: 15,
    marginTop: 8,
  },

  customerLogoutText: {
    color: "#FFFFFF",
    fontWeight: "900",
    textAlign: "center",
    fontSize: 16,
  },

  emptyBox: {
    padding: 30,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 15,
    textAlign: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  checkoutModal: {
    maxHeight: "88%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
  },

  checkoutTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 16,
  },

  checkoutInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    marginBottom: 12,
    color: "#111827",
  },

  notesInput: {
    minHeight: 90,
    textAlignVertical: "top",
  },

  paymentTitle: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },

  paymentRow: {
    gap: 8,
    marginBottom: 12,
  },

  paymentButton: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 11,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  paymentButtonText: {
    fontSize: 13,
    fontWeight: "900",
  },

  submitOrderButton: {
    borderRadius: 16,
    paddingVertical: 15,
    marginTop: 6,
  },

  submitOrderText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },

  dangerButton: {
    borderRadius: 16,
    paddingVertical: 15,
    marginTop: 10,
    backgroundColor: "#DC2626",
  },

  dangerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },

  cancelButton: {
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 10,
    backgroundColor: "#E5E7EB",
  },

  cancelButtonText: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },

  detailsSectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    marginTop: 12,
    marginBottom: 8,
  },

  detailsText: {
    fontSize: 15,
    marginBottom: 7,
  },

  itemsText: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },

  productDescriptionText: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 14,
  },
});