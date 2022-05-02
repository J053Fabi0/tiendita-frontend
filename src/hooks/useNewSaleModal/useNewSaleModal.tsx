import * as Yup from "yup";
import styled from "@emotion/styled";
import TimePicker from "react-time-picker";
import DatePicker from "react-date-picker";
import Values from "../../types/values.type";
import { Pencil } from "react-bootstrap-icons";
import Product from "../../types/product.type";
import useBreakpoints from "../useBreakpoints";
import validateYup from "../../utils/validateYup";
import { Formik, Form as FormikForm } from "formik";
import StyledProp from "../../types/styledProp.type";
import { usePerson } from "../../context/personContext";
import { Fragment, MouseEventHandler, useEffect, useReducer, useRef } from "react";
import { Modal, InputGroup, Button, Row, Col, ButtonGroup, Form } from "react-bootstrap";
import useReducerNewSaleModal, { ACTIONS, getTimeInFormat } from "./useReducerNewSaleModal";

export default function useNewSaleModal(
  handleOnSubmit: (values: Values, product: Product) => any | Promise<any>,
  onEdit?: MouseEventHandler<HTMLButtonElement>
) {
  const person = usePerson();
  const [state, dispatch] = useReducer(useReducerNewSaleModal, { show: false });

  // Only reset the state if the product is different from the last one
  const lastProduct = useRef(state.product);
  useEffect(() => {
    if (lastProduct.current !== state.product) dispatch({ type: ACTIONS.RESET });
  }, [state.product]);

  const handleClose = () => dispatch({ type: ACTIONS.SET_SHOW, show: false });

  const { medium } = useBreakpoints().lessOrEqualThan;

  const schema = Yup.object().shape({
    quantity: Yup.number()
      .typeError("Ingresa un número.")
      .required("Requerido.")
      .integer("Solo valores enteros.")
      .positive("Solo valores positivos."),
    date: Yup.string().required("Requerido."),
    time: Yup.string().required("Requerido."),
  });

  const validate = (values: Values) => {
    const errors: any = {};
    const maxCash = values.specialPriceExists
      ? values.specialPriceTotal
        ? values.specialPrice
        : values.specialPrice * values.quantity
      : (state.product?.price ?? 0) * values.quantity;

    const cash =
      !values.cardExists ||
      values.zeroCash ||
      validateYup(
        Yup.number()
          .required("Requerido.")
          .typeError("Ingresa un número.")
          .lessThan(
            maxCash,
            maxCash === values.cash
              ? 'Si quieres decir que pagó todo con tarjeta, usa el botón "Todo"'
              : `No pudo haber pagado eso. $${values.cash} es mayor que ` +
                  (values.specialPriceExists
                    ? `descuento que has aplicado.`
                    : `la cantidad total: $${(state.product?.price ?? 0) * values.quantity}.`)
          )
          .positive("Solo valores positivos."),
        values.cash
      );
    if (cash !== true) errors.cash = cash.join(" ");

    const specialPrice =
      !values.specialPriceExists ||
      validateYup(
        Yup.number()
          .typeError("Ingresa un número.")
          .required("Requerido")
          .moreThan(-1e-323, "Solo valores mayores o iguales a 0."),
        values.specialPrice
      );
    if (specialPrice !== true) errors.specialPrice = specialPrice.join(" ");

    return errors;
  };

  const EditButton = styled(({ className, children, onClick }: StyledProp) => (
    <button className={`btn-close ${className}`} onClick={onClick}>
      {children}
    </button>
  ))({
    display: "flex",
    background: "none",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "0 !important",
  });
  const CloseButton = styled(({ className, onClick }: StyledProp) => (
    <button className={`btn-close ${className}`} onClick={onClick} />
  ))({ marginLeft: "0 !important" });

  return {
    Modal:
      state.product === undefined ? null : (
        <Modal show={state.show && !!state.product} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton={person?.role === "employee"}>
            <Modal.Title>
              {state.product.name} - ${state.product.price}
            </Modal.Title>

            {person?.role === "admin" ? (
              <>
                <EditButton
                  onClick={(...params) => {
                    onEdit?.(...params);
                    dispatch({ type: ACTIONS.SET_SHOW, show: false });
                  }}
                >
                  <Pencil />
                </EditButton>
                <CloseButton onClick={() => dispatch({ type: ACTIONS.SET_SHOW, show: false })} />
              </>
            ) : null}
          </Modal.Header>

          <Formik
            onSubmit={(values, { setSubmitting }) => {
              const posiblePromise = handleOnSubmit(values, state.product as Product);
              posiblePromise instanceof Promise
                ? posiblePromise.then(() => setSubmitting(false))
                : setSubmitting(false);
            }}
            validationSchema={schema}
            validate={validate}
            initialValues={{
              quantity: 1,
              date: new Date(),
              time: getTimeInFormat(),

              cardExists: false,
              zeroCash: true,
              cash: 1,

              specialPriceTotal: true,
              specialPriceExists: false,
              specialPrice: 0,
            }}
          >
            {({ handleSubmit, handleBlur, handleChange, touched, values, errors, isSubmitting, isValid }) => (
              <FormikForm onSubmit={handleSubmit}>
                <Modal.Body>
                  <Row>
                    {state.product!.description ? <p>{state.product!.description}</p> : null}

                    {/* Quantity */}
                    <Form.Group as={Col} xs={12} controlId="formCantidad">
                      <Form.Label>Cantidad</Form.Label>
                      <InputGroup className="mb-3" hasValidation>
                        <Form.Control
                          type="number"
                          name="quantity"
                          onBlur={handleBlur}
                          style={{ zIndex: 0 }}
                          value={values.quantity}
                          disabled={isSubmitting}
                          onChange={handleChange}
                          isInvalid={!!touched.quantity && !!errors.quantity}
                        />
                        <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    {/* Date */}
                    <Form.Group as={Col} xs={12} sm={6} controlId="formFecha">
                      <Form.Label className="mb-1">Fecha</Form.Label>
                      <InputGroup className="mb-2">
                        <Form.Control
                          plaintext
                          as={DatePicker}
                          required={true}
                          format={"y-MM-dd"}
                          maxDate={new Date()}
                          className="mt-0 pt-0"
                          disabled={isSubmitting}
                          disableCalendar={isSubmitting}
                          value={values.date as unknown as string}
                          onCalendarClose={() => handleBlur({ target: { name: "date" } })}
                          onChange={
                            ((value: string) =>
                              handleChange({
                                target: { value: value === null ? "" : value, name: "date" },
                              })) as any
                          }
                          isInvalid={!!touched.date && !!errors.date}
                        />
                        <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    {/* Time */}
                    <Form.Group as={Col} xs={12} sm={6} controlId="formTiempo">
                      <Form.Label className="mb-1">Tiempo</Form.Label>
                      <InputGroup className="mb-2">
                        <Form.Control
                          plaintext
                          as={TimePicker}
                          required={true}
                          format="hh-mm a"
                          className="mt-0 pt-0"
                          disabled={isSubmitting}
                          maxTime={
                            ((a = new Date(), b = values.date) =>
                              a.getFullYear() === b.getFullYear() &&
                              a.getMonth() === b.getMonth() &&
                              a.getDate() === b.getDate())()
                              ? getTimeInFormat()
                              : undefined
                          }
                          value={values.time}
                          disableClock={true}
                          onClockClose={() => handleBlur({ target: { name: "time" } })}
                          onChange={
                            ((value: string) =>
                              handleChange({
                                target: { value: value === null ? "" : value, name: "time" },
                              })) as any
                          }
                          isInvalid={!!touched.time && !!errors.time}
                        />
                        <Form.Control.Feedback type="invalid">{errors.time}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    {/* Pago con tarjeta */}
                    <Form.Group as={Col} xs={12} controlId="formPagoTarjeta">
                      <Form.Label className="mb-1">Pagó con tarjeta</Form.Label>
                      <InputGroup className="mb-3">
                        <ButtonGroup style={{ zIndex: 0 }}>
                          <Button
                            disabled={isSubmitting}
                            variant={values.cardExists ? "secondary" : "danger"}
                            onClick={() => handleChange({ target: { name: "cardExists", value: false } })}
                          >
                            No
                          </Button>
                          <Button
                            disabled={isSubmitting}
                            variant={values.cardExists ? "success" : "secondary"}
                            onClick={() => handleChange({ target: { name: "cardExists", value: true } })}
                          >
                            Sí
                          </Button>
                        </ButtonGroup>
                        {values.cardExists ? (
                          <Fragment>
                            <ButtonGroup style={{ zIndex: 0 }} className="ms-2">
                              <Button
                                disabled={isSubmitting}
                                variant={values.zeroCash ? "primary" : "secondary"}
                                onClick={() => handleChange({ target: { name: "zeroCash", value: true } })}
                              >
                                Todo
                              </Button>
                              <Button
                                disabled={isSubmitting}
                                variant={values.zeroCash ? "secondary" : "primary"}
                                onClick={() => handleChange({ target: { name: "zeroCash", value: false } })}
                              >
                                Algo en efectivo
                              </Button>
                            </ButtonGroup>

                            {values.zeroCash ? null : (
                              <Form.Control
                                name="cash"
                                type="number"
                                onBlur={handleBlur}
                                value={values.cash}
                                disabled={isSubmitting}
                                onChange={handleChange}
                                style={{ borderRadius: ".25rem" }}
                                placeholder="¿Cuánto fue en efectivo?"
                                className={medium ? "mt-2 w-100" : "ms-2"}
                                isInvalid={!!touched.cash && !!errors.cash}
                              />
                            )}
                            <Form.Control.Feedback type="invalid">{errors.cash}</Form.Control.Feedback>
                          </Fragment>
                        ) : null}
                      </InputGroup>
                    </Form.Group>

                    {/* Precio especial */}
                    <Form.Group as={Col} xs={12} controlId="formPrecioEspecial">
                      <Form.Label className="mb-1">Precio especial / descuento</Form.Label>
                      <InputGroup className="mb-3" hasValidation>
                        <ButtonGroup style={{ zIndex: 0 }}>
                          <Button
                            disabled={isSubmitting}
                            variant={values.specialPriceExists ? "secondary" : "danger"}
                            onClick={() => handleChange({ target: { name: "specialPriceExists", value: false } })}
                          >
                            No
                          </Button>
                          <Button
                            disabled={isSubmitting}
                            variant={values.specialPriceExists ? "success" : "secondary"}
                            onClick={() => handleChange({ target: { name: "specialPriceExists", value: true } })}
                          >
                            Sí
                          </Button>
                        </ButtonGroup>
                        {values.specialPriceExists ? (
                          <Fragment>
                            <ButtonGroup style={{ zIndex: 0 }} className={"ms-2"}>
                              <Button
                                disabled={isSubmitting}
                                variant={values.specialPriceTotal ? "primary" : "secondary"}
                                onClick={() =>
                                  handleChange({ target: { name: "specialPriceTotal", value: true } })
                                }
                              >
                                Total
                              </Button>
                              <Button
                                disabled={isSubmitting}
                                variant={values.specialPriceTotal ? "secondary" : "primary"}
                                onClick={() =>
                                  handleChange({ target: { name: "specialPriceTotal", value: false } })
                                }
                              >
                                c/u
                              </Button>
                            </ButtonGroup>

                            <Form.Control
                              type="number"
                              placeholder={
                                values.specialPriceTotal
                                  ? "¿Cuánto cobraste en total?"
                                  : "¿Cuánto cobraste por producto?"
                              }
                              name="specialPrice"
                              onBlur={handleBlur}
                              disabled={isSubmitting}
                              onChange={handleChange}
                              value={values.specialPrice}
                              style={{ borderRadius: ".25rem" }}
                              className={medium ? "mt-2 w-100" : "ms-2"}
                              isInvalid={!!touched.specialPrice && !!errors.specialPrice}
                            />
                            <Form.Control.Feedback type="invalid">{errors.specialPrice}</Form.Control.Feedback>
                          </Fragment>
                        ) : null}
                      </InputGroup>
                    </Form.Group>
                  </Row>
                </Modal.Body>

                <Modal.Footer>
                  <Button variant="success" type="submit" disabled={isSubmitting || !isValid}>
                    Nueva venta
                  </Button>
                </Modal.Footer>
              </FormikForm>
            )}
          </Formik>
        </Modal>
      ),

    show: state.show,
    setShow: (newValue: boolean) => dispatch({ type: ACTIONS.SET_SHOW, show: newValue }),
    product: state.product,
    setProduct: (newProduct: Product) => dispatch({ type: ACTIONS.SET_PRODUCT, product: newProduct }),
  };
}
