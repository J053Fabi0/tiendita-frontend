import { Action, State } from "../../types/useNewSaleModal.type";

const ACTIONS = Object.freeze({
  SET_SHOW: "set_show",
  SET_DATE: "set_date",
  SET_TIME: "set_time",
  SET_PRODUCT: "set_product",
  SET_QUANTITY: "set_quantity",
  SET_SPECIAL_PRICE: "set_special_price",
  SET_CASH: "set_cash",
  RESET: "reset",
} as const);

const getTimeInFormat = (date = new Date()) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours <= 9 ? "0" : ""}${hours}:${minutes <= 9 ? "0" : ""}${minutes}`;
};
const defaultValues = (): Omit<State, "show"> => ({
  date: new Date(),
  quantity: { showedValue: "1", realValue: 1 },
  time: getTimeInFormat(),
  specialPrice: {
    exists: false,
    total: true,
    realValue: 0,
    showedValue: "",
  },
  cash: {
    exists: false,
    zeroCash: true,
    realValue: 0,
    showedValue: "",
  },
});

export default function useReducerNewSaleModal(state: State, action: Action) {
  switch (action.type) {
    case ACTIONS.SET_DATE:
      return { ...state, date: action.date };

    case ACTIONS.SET_TIME:
      return { ...state, time: action.time };

    case ACTIONS.SET_SHOW:
      return { ...state, show: action.show };

    case ACTIONS.SET_PRODUCT:
      return {
        ...{ ...state, product: action.product },
        specialPrice: {
          ...state.specialPrice,
          ...{ realValue: action.product.price, showedValue: action.product.price.toString() },
        },
      };

    case ACTIONS.SET_QUANTITY:
      return { ...state, quantity: action.quantity };

    case ACTIONS.RESET:
      return { ...state, ...defaultValues() };

    case ACTIONS.SET_SPECIAL_PRICE:
      return { ...state, specialPrice: { ...state.specialPrice, ...action.specialPrice } };

    case ACTIONS.SET_CASH:
      return { ...state, cash: { ...state.cash, ...action.cash } };

    default:
      return state;
  }
}

export { ACTIONS, defaultValues, getTimeInFormat };
