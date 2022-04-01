import TimePicker from "react-time-picker";
import DatePicker from "react-date-picker";
import Product from "../types/product.type";
import { ButtonColored } from "../styles/mixins";
import { useEffect, useReducer, useRef } from "react";
import { Modal, Form, InputGroup, FormControl, Row, Col } from "react-bootstrap";

const ACTIONS = Object.freeze({
  SET_SHOW: "set_show",
  SET_DATE: "set_date",
  SET_TIME: "set_time",
  SET_PRODUCT: "set_product",
  SET_QUANTITY: "set_quantity",
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
type Action = SetDate | SetTime | SetShow | SetProduct | SetQuantity | Reset;
const getTimeInFormat = (date = new Date()) => {
  const nowDate = new Date();
  const hours = nowDate.getHours();
  const minutes = nowDate.getMinutes();
  return `${hours <= 9 ? "0" : ""}${hours}:${minutes <= 9 ? "0" : ""}${minutes}`;
};
const defaultValues = (): Omit<State, "show"> => ({
  date: new Date(),
  quantity: { showedValue: "1", realValue: 1 },
  time: getTimeInFormat(),
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
      return { ...state, product: action.product };

    case ACTIONS.SET_QUANTITY:
      return { ...state, quantity: action.quantity };

    case ACTIONS.RESET:
      return { ...state, ...defaultValues() };

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
  const handleQuantityChange = (a: any) => {
    const newValueString = (a.target.value as string).replace(/\./g, "");
    const newValue = +newValueString;

    if (newValueString === "") {
      dispatch({ type: ACTIONS.SET_QUANTITY, quantity: { realValue: 0, showedValue: "" } });
    } else {
      if (isNaN(newValue)) return;
      if (newValue < 0) return;
      dispatch({
        type: ACTIONS.SET_QUANTITY,
        quantity: { realValue: newValue, showedValue: newValue.toString() },
      });
    }
  };

  return {
    show: state.show,
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
                      onChange={(v: Date) => dispatch({ type: ACTIONS.SET_DATE, date: v })}
                    />
                  </InputGroup>
                </Form.Group>

                {/* Time */}
                <Form.Group as={Col} className="mb-1 me-4" controlId="formFecha">
                  <Form.Label>Tiempo</Form.Label>
                  <InputGroup className="mb-3">
                    <TimePicker
                      format="hh-mm a"
                      maxTime={
                        ((a = new Date()) =>
                          a.getFullYear() === state.date.getFullYear() &&
                          a.getMonth() === state.date.getMonth() &&
                          a.getDate() === state.date.getDate())()
                          ? getTimeInFormat()
                          : undefined
                      }
                      value={state.time}
                      disableClock={true}
                      onChange={(v) => dispatch({ type: ACTIONS.SET_TIME, time: v.toString() })}
                    />
                  </InputGroup>
                </Form.Group>
              </Row>
            </Modal.Body>

            <Modal.Footer>
              <ButtonColored type="submit">Nueva venta</ButtonColored>
            </Modal.Footer>
          </Form>
        </Modal>
      ),
  };
}
