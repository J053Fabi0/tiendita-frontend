export default interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  tags: number[];
  enabled?: boolean;
  description?: string;
}
