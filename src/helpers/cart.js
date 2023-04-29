export const getCartSubTotal = (order, currency) => {
  let subTotal;
  const productTotals = order.orderItems.map(item => item.quantity * item.product[`price${currency}`]);
  const reducer = (prevValue, currentValue) => prevValue + currentValue;

  if (productTotals) {
    subTotal = productTotals.reduce(reducer);
  }

  return subTotal;
};
