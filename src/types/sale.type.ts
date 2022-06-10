export default interface Sale {
  id: number; // the $loki of the sale
  date: number;
  cash: number;
  comment?: string;
  quantity: number;
  specialPrice?: number; // it may be present if there was a special price

  person: {
    id: number;
    name: string;
  };
  product: {
    id: number;
    name: string;
    price: number;
  };
}
