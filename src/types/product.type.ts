export default interface Product {
  name: string;
  price: number;
  stock: number;
  description?: string;
  id: number;
  tags: number[];
  enabled?: boolean;
}
