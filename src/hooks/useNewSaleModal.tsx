import TimePicker from "react-time-picker";
import DatePicker from "react-date-picker";
import Product from "../types/product.type";
import useBreakpoints from "./useBreakpoints";
import { ButtonColored } from "../styles/mixins";
import { Fragment, useEffect, useReducer, useRef } from "react";
import { Modal, Form, InputGroup, FormControl, Row, Col, Button, ButtonGroup } from "react-bootstrap";

const ACTIONS = Object.freeze({
  SET_SHOW: "set_show",
  SET_DATE: "set_date",
  SET_TIME: "set_time",
  SET_PRODUCT: "set_product",
  SET_QUANTITY: "set_quantity",
  SET_SPECIAL_PRICE: "set_special_price",
  RESET: "reset",
} as const);

interface State {
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
}
interface SetDate {
  type: "set_date";
  date: Date;
}
interface SetTime {
  type: "set_time";
  time: string;
}
interface SetShow {
  type: "set_show";
  show: boolean;
}
interface SetProduct {
  type: "set_product";
  product: Product;
}
interface SetQuantity {
  type: "set_quantity";
  quantity: {
    realValue: number;
    showedValue: string;
  };
}
interface Reset {
  type: "reset";
}
interface SetSpecialPrice {
  type: "set_special_price";
  specialPrice: {
    exists?: boolean;
    total?: boolean;
    realValue?: number;
    showedValue?: string;
  };
}
type Action = SetDate | SetTime | SetShow | SetProduct | SetQuantity | Reset | SetSpecialPrice;
const getTimeInFormat = (date = new Date()) => {
  const nowDate = new Date();
  const hours = nowDate.getHours();
  const minutes = nowDate.getMinutes();
  return `${hours <= 9 ? "0" : ""}${hours}:${minutes <= 9 ? "0" : ""}${minutes}`;
};
const defaultValues = (product?: Product): Omit<State, "show"> => ({
  date: new Date(),
  quantity: { showedValue: "1", realValue: 1 },
  time: getTimeInFormat(),
  specialPrice: {
    exists: false,
    total: true,
    realValue: product ? product.price : 1,
    showedValue: product ? product.price.toString() : "1",
  },
});

function reducer(state: State, action: Action) {
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
      return { ...state, ...defaultValues(state.product) };

    case ACTIONS.SET_SPECIAL_PRICE:
      return { ...state, specialPrice: { ...state.specialPrice, ...action.specialPrice } };

    default:
      return state;
  }
}

export default function NewSaleModal() {
  const [state, dispatch] = useReducer(reducer, { show: false, ...defaultValues() });

  // Only reset the state if the product is different from the last one
  const lastProduct = useRef(state.product);
  useEffect(() => {
    if (lastProduct.current !== state.product) dispatch({ type: ACTIONS.RESET });
  }, [state.product]);

  const handleClose = () => dispatch({ type: ACTIONS.SET_SHOW, show: false });

  const handleNumberChange = (a: any, type: any, valueName: any) => {
    const newValueString = (a.target.value as string).replace(/\./g, "");
    const newValue = +newValueString;

    if (newValueString === "") {
      dispatch({ type, [valueName]: { realValue: 0, showedValue: "" } });
    } else if (!(isNaN(newValue) || newValue < 0)) {
      dispatch({ type, [valueName]: { realValue: newValue, showedValue: newValue.toString() } });
    }
  };
  const handleQuantityChange = (a: any) => handleNumberChange(a, ACTIONS.SET_QUANTITY, "quantity");
  const handleSpecialPriceChange = (a: any) => handleNumberChange(a, ACTIONS.SET_SPECIAL_PRICE, "specialPrice");

  const { medium } = useBreakpoints().lessOrEqualThan;

  return {
    show: state.show,
    date: (() => {
      const newDate = new Date(state.date);
      const [hour, minute] = state.time.split(":").map((s) => parseInt(s));
      newDate.setHours(hour, minute, 0, 0);
      return newDate;
    })(),
    setShow: (newValue: boolean) => dispatch({ type: ACTIONS.SET_SHOW, show: newValue }),
    setProduct: (newProduct: Product) => dispatch({ type: ACTIONS.SET_PRODUCT, product: newProduct }),
    modal:
      state.product === undefined ? null : (
        <Modal show={state.show && Boolean(state.product)} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {state.product.name} - ${state.product.price}
            </Modal.Title>
          </Modal.Header>

          <Form>
            <Modal.Body>
              {state.product.description ? <p>{state.product.description}</p> : null}

              {/* Quantity */}
              <Form.Group className="mb-1" controlId="formCantidad">
                <Form.Label>Cantidad</Form.Label>
                <InputGroup className="mb-3">
                  {/* <InputGroup.Text>$</InputGroup.Text> */}
                  <FormControl type="text" value={state.quantity.showedValue} onChange={handleQuantityChange} />
                </InputGroup>
              </Form.Group>

              <Row>
                {/* Date */}
                <Form.Group as={Col} className="mb-1" controlId="formFecha">
                  <Form.Label>Fecha</Form.Label>
                  <InputGroup className="mb-3">
                    <DatePicker
                      value={state.date}
                      format={"y-MM-dd"}
                      maxDate={new Date()}
                      onChange={(v: Date | null) => v !== null && dispatch({ type: ACTIONS.SET_DATE, date: v })}
                    />
                  </InputGroup>
                </Form.Group>

                {/* Time */}
                <Form.Group as={Col} className="mb-1 me-4" controlId="formHora">
                  <Form.Label>Tiempo</Form.Label>
                  <InputGroup className="mb-3">
                    <TimePicker
                      format="hh-mm a"
                      maxTime={
                        ((a = new Date(), b = state.date) =>
                          a.getFullYear() === b.getFullYear() &&
                          a.getMonth() === b.getMonth() &&
                          a.getDate() === b.getDate())()
                          ? getTimeInFormat()
                          : undefined
                      }
                      value={state.time}
                      disableClock={true}
                      onChange={(v) => v !== null && dispatch({ type: ACTIONS.SET_TIME, time: v.toString() })}
                    />
                  </InputGroup>
                </Form.Group>
              </Row>

              {/* Special price */}
              <Form.Group className="mb-1" controlId="formPrecioEspecial">
                <Form.Label>Precio especial</Form.Label>
                <InputGroup className="mb-3">
                  <ButtonGroup style={{ zIndex: 0 }} aria-label="Basic example">
                    <Button
                      variant={state.specialPrice.exists ? "secondary" : "danger"}
                      onClick={() =>
                        dispatch({ type: ACTIONS.SET_SPECIAL_PRICE, specialPrice: { exists: false } })
                      }
                    >
                      No
                    </Button>
                    <Button
                      variant={state.specialPrice.exists ? "success" : "secondary"}
                      onClick={() => dispatch({ type: ACTIONS.SET_SPECIAL_PRICE, specialPrice: { exists: true } })}
                    >
                      Sí
                    </Button>
                  </ButtonGroup>
                  {state.specialPrice.exists ? (
                    <Fragment>
                      <ButtonGroup
                        style={{ zIndex: 0 }}
                        aria-label="Basic example"
                        className={medium ? "mt-2 w-100" : "ms-2"}
                      >
                        <Button
                          variant={state.specialPrice.total ? "primary" : "secondary"}
                          onClick={() =>
                            dispatch({ type: ACTIONS.SET_SPECIAL_PRICE, specialPrice: { total: true } })
                          }
                        >
                          Total
                        </Button>
                        <Button
                          variant={state.specialPrice.total ? "secondary" : "primary"}
                          onClick={() =>
                            dispatch({ type: ACTIONS.SET_SPECIAL_PRICE, specialPrice: { total: false } })
                          }
                        >
                          c/u
                        </Button>

                        <FormControl
                          type="text"
                          onChange={handleSpecialPriceChange}
                          value={state.specialPrice.showedValue}
                          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                        />
                      </ButtonGroup>
                    </Fragment>
                  ) : null}
                </InputGroup>
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <ButtonColored type="submit">Nueva venta</ButtonColored>
            </Modal.Footer>
          </Form>
        </Modal>
      ),
  };
}
