export default interface PostProduct {
  name: string;
  price: number;
  stock: number;
  tags?: number[];
  enabled?: boolean;
  description?: string;
}
