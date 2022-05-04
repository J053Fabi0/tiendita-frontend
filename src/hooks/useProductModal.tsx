import * as Yup from "yup";
import { useState } from "react";
import { Fragment } from "react";
import http from "../http-common";
import styled from "@emotion/styled";
import Product from "../types/product.type";
import { Formik, Form as FormikForm } from "formik";
import PostProduct from "../types/PostProduct.type";
import { useReloadProduct } from "../context/productsContext";
import { useTagsAndCategories } from "../context/tagsAndCategoriesContext";
import { Button, Col, Row, Modal, Form, InputGroup, Badge, Spinner } from "react-bootstrap";

const Tag = styled(Badge)`
  cursor: pointer;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  line-height: 0.7;
  font-size: 0.8rem;
  padding: 0.35em 0.6em;
  border: ${(props) => (props.selected ? "2px solid blue" : "2px solid transparent")};
`;

export default function useNewProductModal(product?: Product) {
  const [show, setShow] = useState(false);
  const reloadProduct = useReloadProduct();
  const tagsAndCategories = useTagsAndCategories();

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
    tags: Yup.array(Yup.number()),
    description: Yup.string().optional().max(400, "Debe ser de 400 caracteres o menos."),
  });

  const handleOnSubmitPost = async (values: PostProduct) => {
    const valuesCopy = { ...values };
    if (values.description === "") delete valuesCopy.description;
    if (values.tags && values.tags.length === 0) delete valuesCopy.tags;

    try {
      const id = (await http.post("/product", valuesCopy)).data.message as number;
      await reloadProduct(id);
      setShow(false);
    } catch (e) {
      console.error((e as any).response.data.error.description);
    }
  };
  const handleOnSubmitPatch = async (values: Product) => {
    const valuesToPatch: any = {};
    const productTags = product?.tags || [];
    const { tags: newTags, ...newInfo } = values;

    const newInfosKeys = Object.keys(newInfo);
    for (const newInfoKey of newInfosKeys)
      if ((product as any)[newInfoKey] !== (newInfo as any)[newInfoKey])
        valuesToPatch[newInfoKey] = (newInfo as any)[newInfoKey];

    const deleteTags = productTags.filter((tag) => !newTags.includes(tag));
    if (deleteTags.length > 0) valuesToPatch.deleteTags = deleteTags;

    const addTags = newTags.filter((tag) => !productTags.includes(tag));
    if (addTags.length > 0) valuesToPatch.addTags = addTags;

    try {
      await http.patch("/product", { ...valuesToPatch, id: product!.id });
      await reloadProduct(product!.id);
      setShow(false);
    } catch (e) {
      console.error((e as any).response.data.error.description);
    }
  };

  return {
    Modal: (
      <Modal show={show} onHide={() => setShow(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{product ? "Editar producto" : "Nuevo producto"}</Modal.Title>
        </Modal.Header>

        <Formik
          validationSchema={schema}
          onSubmit={(values, { setSubmitting }) =>
            (product ? handleOnSubmitPatch : handleOnSubmitPost)(values as any).then(() => setSubmitting(false))
          }
          initialValues={
            product ??
            ({
              name: "",
              tags: [],
              stock: undefined as unknown as number,
              price: undefined as unknown as number,
            } as PostProduct)
          }
        >
          {({ values, errors, touched, setValues, handleBlur, handleSubmit, handleChange, isSubmitting }) => (
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

                  {/* Description */}
                  <Form.Group as={Col} xs={12} controlId="formDescription">
                    <Form.Label>Descripción</Form.Label>
                    <InputGroup className="mb-3" hasValidation>
                      <Form.Control
                        type="text"
                        name="description"
                        onBlur={handleBlur}
                        placeholder="Opcional"
                        disabled={isSubmitting}
                        onChange={handleChange}
                        value={values.description}
                        isInvalid={!!touched.description && !!errors.description}
                      />
                      <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  {/* Tags */}
                  <Form.Group as={Col} xs={12} controlId="formStock">
                    <Form.Label className="mb-0">Tags (opcionales)</Form.Label>
                    <InputGroup className="mb-3">
                      {tagsAndCategories ? (
                        tagsAndCategories.map(({ id, name, tags }) => (
                          <Fragment key={id}>
                            <Col xs={12} className="mt-2">
                              · {name}
                            </Col>

                            {tags.map(({ id, name }) => (
                              <Tag
                                onClick={() => {
                                  const index = values.tags!.indexOf(id);
                                  index === -1
                                    ? setValues((prev) => ({ ...prev, tags: [...(prev.tags || []), id] }))
                                    : setValues((prev) => ({
                                        ...prev,
                                        tags: [...prev.tags!.slice(0, index), ...prev.tags!.slice(index + 1)],
                                      }));
                                }}
                                pill
                                key={id}
                                className="me-1 mt-1"
                                selected={values.tags!.includes(id)}
                                bg={values.tags!.includes(id) ? "primary" : "secondary"}
                              >
                                {name}
                              </Tag>
                            ))}
                          </Fragment>
                        ))
                      ) : (
                        <Spinner animation="border" size="sm" className="me-3" />
                      )}
                    </InputGroup>
                  </Form.Group>
                </Row>
              </Modal.Body>

              <Modal.Footer>
                <Button className="cursor-pointer" variant="success" type="submit" disabled={isSubmitting}>
                  {product ? "Editar" : "Crear"}
                </Button>
              </Modal.Footer>
            </FormikForm>
          )}
        </Formik>
      </Modal>
    ),

    show,
    setShow,
  };
}
