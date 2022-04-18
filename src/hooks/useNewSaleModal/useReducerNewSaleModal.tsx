import { Action, State } from "../../types/useNewSaleModal.type";

const ACTIONS = Object.freeze({
  SET_PRODUCT: "set_product",
  SET_SHOW: "set_show",
  RESET: "reset",
} as const);

const getTimeInFormat = (date = new Date()) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours <= 9 ? "0" : ""}${hours}:${minutes <= 9 ? "0" : ""}${minutes}`;
};

export default function useReducerNewSaleModal(state: State, action: Action) {
  switch (action.type) {
    case ACTIONS.SET_SHOW:
      return { ...state, show: action.show };

    case ACTIONS.SET_PRODUCT:
      return {
        ...{ ...state, product: action.product },
        specialPrice: {
          ...{ realValue: action.product.price, showedValue: action.product.price.toString() },
        },
      };

    case ACTIONS.RESET:
      return { ...state };

    default:
      return state;
  }
}

export { ACTIONS, getTimeInFormat };
