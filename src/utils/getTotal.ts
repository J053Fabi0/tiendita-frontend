const getTotal = (sale: { quantity: number; product: { price: number }; specialPrice?: number }) =>
  sale.quantity * (sale.specialPrice ?? sale.product.price ?? 0);

export default getTotal;
