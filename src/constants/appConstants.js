export const API_BASE_URL = "http://192.168.1.101:5000/api";

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "completed",
  "cancelled",
];

export const statusLabels = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const paymentMethods = ["cash", "card", "bank", "other"];

export const paymentLabels = {
  cash: "Cash",
  card: "Card",
  bank: "Bank Transfer",
  other: "Other",
};

export const screens = [
  { key: "dashboard", label: "Dashboard" },
  { key: "orders", label: "Orders" },
  { key: "products", label: "Products" },
  { key: "customers", label: "Customers" },
  { key: "reports", label: "Reports" },
  { key: "settings", label: "Settings" },
];

export const emptyOrderForm = {
  customerId: "",
  productId: "",
  customerName: "",
  customerPhone: "",
  customerAddress: "",
  productName: "",
  quantity: "1",
  unitPrice: "",
  status: "pending",
  paymentMethod: "cash",
  notes: "",
};

export const emptyProductForm = {
  name: "",
  category: "",
  price: "",
  stock: "",
  description: "",
};

export const emptyCustomerForm = {
  name: "",
  phone: "",
  address: "",
  notes: "",
};