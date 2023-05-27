const getTotal = (sale: { quantity: number; product: { price: number }; specialPrice?: number }) =>
  sale.specialPrice ?? sale.quantity * (sale.product.price ?? 0);

export default getTotal;
