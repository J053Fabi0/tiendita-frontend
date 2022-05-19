export default interface Sale {
  id: number; // the $loki of the sale
  date: number;
  cash: number;
  person: number;
  product: number;
  quantity: number;
  specialPrice?: number; // it may be present if there was a special price
}
