import Sale from "../types/sale.type";

const getTotal = (sale: Partial<Sale> & { quantity: number; product: { price: number } }) =>
  sale.specialPrice ?? sale.quantity * (sale.product.price ?? 0);

export default getTotal;
