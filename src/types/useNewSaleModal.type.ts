import Product from "./product.type";

export interface State {
  show: boolean;
  date: Date;
  time: string;
  product?: Product | undefined;
  quantity: {
    realValue: number;
    showedValue: string;
  };
  specialPrice: {
    exists: boolean;
    total: boolean;
    realValue: number;
    showedValue: string;
  };
  cash: {
    exists: boolean;
    zeroCash: boolean;
    realValue: number;
    showedValue: string;
  };
}
export interface SetDate {
  type: "set_date";
  date: Date;
}
export interface SetTime {
  type: "set_time";
  time: string;
}
export interface SetShow {
  type: "set_show";
  show: boolean;
}
export interface SetProduct {
  type: "set_product";
  product: Product;
}
export interface SetQuantity {
  type: "set_quantity";
  quantity: {
    realValue: number;
    showedValue: string;
  };
}
export interface Reset {
  type: "reset";
}
export interface SetSpecialPrice {
  type: "set_special_price";
  specialPrice: {
    exists?: boolean;
    total?: boolean;
    realValue?: number;
    showedValue?: string;
  };
}
export interface SetCash {
  type: "set_cash";
  cash: {
    exists?: boolean;
    zeroCash?: boolean;
    realValue?: number;
    showedValue?: string;
  };
}
export type Action = SetDate | SetTime | SetShow | SetProduct | SetQuantity | Reset | SetSpecialPrice | SetCash;
