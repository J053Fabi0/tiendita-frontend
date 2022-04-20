import * as Yup from "yup";
import { Fragment } from "react";
import { useState } from "react";
import { PlusCircle } from "react-bootstrap-icons";
import { Formik, Form as FormikForm } from "formik";
import PostProduct from "../../types/PostProduct.type";
import { Button, Col, Container, Row, Modal, Form, InputGroup } from "react-bootstrap";

export default function Products() {
  const [show, setShow] = useState(false);

  const schema = Yup.object().shape({
    name: Yup.string().required("Requerido.").max(50, "Debe ser de 50 caracteres o menos."),
    price: Yup.number()
      .typeError("Ingresa un número.")
      .required("Requerido.")
      .moreThan(-1e-323, "Solo valores mayores o iguales a 0."),
    stock: Yup.number()
      .typeError("Ingresa un número.")
      .required("Requerido.")
      .integer("Únicamente valores enteros")
      .moreThan(-1e-323, "Solo valores mayores o iguales a 0."),
    tags: Yup.array(Yup.number()).optional(),
    enabled: Yup.boolean().default(true).optional(),
    description: Yup.string().optional(),
  });

  const validate = (values: PostProduct) => {
    const errors = {};

    return errors;
  };

  return (
    <Fragment>
      <Container className="mt-3">
        <Row>
          <Col className="d-flex justify-content-center">
            <Button className="d-flex align-items-center" onClick={() => setShow(true)}>
              <PlusCircle /> &nbsp;Nuevo producto
            </Button>
          </Col>
        </Row>
      </Container>

      <Modal show={show} onHide={() => setShow(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nuevo producto uu</Modal.Title>
        </Modal.Header>

        <Formik
          onSubmit={(values, { setSubmitting }) => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }}
          validate={validate}
          validationSchema={schema}
          initialValues={{ name: "", stock: 0, price: 0 }}
        >
          {({ handleSubmit, handleBlur, handleChange, touched, values, errors, isSubmitting, isValid }) => (
            <FormikForm onSubmit={handleSubmit}>
              <Modal.Body>
                <Row>
                  {/* Name */}
                  <Form.Group as={Col} xs={12} controlId="formName">
                    <Form.Label>Nombre</Form.Label>
                    <InputGroup className="mb-3" hasValidation>
                      <Form.Control
                        type="text"
                        name="name"
                        onBlur={handleBlur}
                        value={values.name}
                        disabled={isSubmitting}
                        onChange={handleChange}
                        isInvalid={!!touched.name && !!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  {/* Price */}
                  <Form.Group as={Col} xs={12} sm={6} controlId="formPrice">
                    <Form.Label>Precio</Form.Label>
                    <InputGroup className="mb-3" hasValidation>
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        name="price"
                        type="number"
                        onBlur={handleBlur}
                        value={values.price}
                        disabled={isSubmitting}
                        onChange={handleChange}
                        isInvalid={!!touched.price && !!errors.price}
                      />
                      <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  {/* Stock */}
                  <Form.Group as={Col} xs={12} sm={6} controlId="formStock">
                    <Form.Label>Stock</Form.Label>
                    <InputGroup className="mb-3" hasValidation>
                      <Form.Control
                        name="stock"
                        type="number"
                        onBlur={handleBlur}
                        value={values.stock}
                        disabled={isSubmitting}
                        onChange={handleChange}
                        isInvalid={!!touched.stock && !!errors.stock}
                      />
                      <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Row>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="success" type="submit" disabled={isSubmitting || !isValid}>
                  Crear
                </Button>
              </Modal.Footer>
            </FormikForm>
          )}
        </Formik>
      </Modal>
    </Fragment>
  );
}
