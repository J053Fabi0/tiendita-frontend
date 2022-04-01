import { useReducer } from "react";
import DatePicker from "react-date-picker";
import Product from "../types/product.type";
import { ButtonColored } from "../styles/mixins";
import { Modal, Form, InputGroup, FormControl } from "react-bootstrap";

const ACTIONS = Object.freeze({
  SET_SHOW: "set_show",
  SET_DATE: "set_date",
  SET_TIME: "set_time",
  SET_PRODUCT: "set_product",
  SET_QUANTITY: "set_quantity",
} as const);

interface State {
  show: boolean;
  date: Date;
  time: Date;
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
  time: Date;
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
type Action = SetDate | SetTime | SetShow | SetProduct | SetQuantity;

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

    default:
      return state;
  }
}

export default function NewSaleModal() {
  const [state, dispatch] = useReducer(reducer, {
    show: false,
    date: new Date(),
    time: new Date(),
    quantity: { showedValue: "1", realValue: 1 },
  });

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
    setProduct: (newProduct: Product) => dispatch({ type: ACTIONS.SET_PRODUCT, product: newProduct }),
    setShow: (newValue: boolean) => dispatch({ type: ACTIONS.SET_SHOW, show: newValue }),
    show: state.show,
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
              {/* Quantity */}
              <Form.Group className="mb-1" controlId="formCantidad">
                <Form.Label>Cantidad</Form.Label>
                <InputGroup className="mb-3">
                  {/* <InputGroup.Text>$</InputGroup.Text> */}
                  <FormControl type="text" value={state.quantity.showedValue} onChange={handleQuantityChange} />
                </InputGroup>
              </Form.Group>

              {/* Date */}
              <Form.Group className="mb-1" controlId="formFecha">
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
            </Modal.Body>

            <Modal.Footer>
              <ButtonColored type="submit">Nueva venta</ButtonColored>
            </Modal.Footer>
          </Form>
        </Modal>
      ),
  };
}
