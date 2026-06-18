export function getOrderUnitPrice(order) {
  return Number(order.unitPrice ?? order.price ?? order.productId?.price ?? 0);
}

export function getOrderTotal(order) {
  const savedTotal = Number(order.totalPrice ?? 0);

  if (savedTotal > 0) {
    return savedTotal;
  }

  return Number(order.quantity || 1) * getOrderUnitPrice(order);
}

export function getCustomerOrderCount(customer, orders) {
  return orders.filter((order) => {
    return (
      order.customerPhone === customer.phone ||
      order.customerName === customer.name
    );
  }).length;
}