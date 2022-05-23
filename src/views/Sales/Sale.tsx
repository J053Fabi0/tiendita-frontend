import { useEffect, useState } from "react";
import addCero from "../../utils/addCero";
import { useIsAdmin } from "../../context/personContext";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../context/productsContext";
import useRedirectIfTrue from "../../hooks/useRedirectIfTrue";
import { Breadcrumb, Col, Container, Row, Table } from "react-bootstrap";
import { useFirstSalesLoad, useLoadingSales, useSalesState } from "../../context/salesContext";
import { useFirstPersonsLoad, useLoadingPersons, usePersons } from "../../context/personsContext";
import useUpdateEffect from "../../hooks/useUpdateEffect";

export default function SaleView() {
  const isAdmin = useIsAdmin();
  const saleID = parseInt(useParams<{ id: string }>().id as string);

  useRedirectIfTrue(isNaN(saleID) || !isAdmin, "/ventas");

  const firstPersonsLoad = useFirstPersonsLoad();
  useEffect(firstPersonsLoad, [firstPersonsLoad]);

  const persons = usePersons();
  const sales = useSalesState();

  const navigate = useNavigate();
  const products = useProducts();
  const loadingSales = useLoadingSales();
  const loadingPersons = useLoadingPersons();

  const [sale, setSale] = useState(sales.find(({ id: thisID }) => thisID === saleID));
  useUpdateEffect(() => setSale(sales.find(({ id: thisID }) => thisID === saleID)), [sales]);

  useRedirectIfTrue(!sale, "/ventas");

  const [product, setProduct] = useState(
    sale ? products?.find(({ id: thisID }) => thisID === sale.product) : undefined
  );
  useUpdateEffect(
    () => setProduct(sale ? products?.find(({ id: thisID }) => thisID === sale.product) : undefined),
    [products, sale]
  );

  const [person, setPerson] = useState(persons.find(({ id: thisID }) => thisID === sale?.person));
  useUpdateEffect(() => setPerson(persons.find(({ id: thisID }) => thisID === sale?.person)), [persons, sale]);

  const [date, setDate] = useState(new Date(sale?.date ?? 0));
  useUpdateEffect(() => setDate(new Date(sale?.date ?? 0)), [sale]);

  const getDateString = (date: Date) =>
    `${addCero(date.getDate())}/${addCero(date.getMonth())}/` +
    `${date.getFullYear().toString().substring(2)} ` +
    `${addCero(date.getHours())}:${addCero(date.getMinutes())}`;

  const [dateString, setDateString] = useState(getDateString(date));
  useUpdateEffect(() => setDateString(getDateString(date)), [date]);

  const total = sale ? sale.specialPrice ?? sale.quantity * (product?.price ?? 0) : 0;

  return (
    <Container>
      <Breadcrumb className="mt-3">
        <Breadcrumb.Item onClick={() => navigate(-1)}>Ventas</Breadcrumb.Item>
        <Breadcrumb.Item active>{saleID}</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col xs={12}>
          {!sale ? (
            "Cargando..."
          ) : (
            <Table striped bordered size="sm">
              <tbody>
                <tr>
                  <th>Fecha</th>
                  <td>{dateString}</td>
                </tr>
                <tr>
                  <th>Persona</th>
                  <td>{loadingPersons ? "Cargando..." : person?.name}</td>
                </tr>
                <tr>
                  <th>Producto</th>
                  <td>{!product ? "Cargando..." : product.name}</td>
                </tr>
                <tr>
                  <th>Cantidad</th>
                  <td>{sale.quantity}</td>
                </tr>
                <tr>
                  <th>Total</th>
                  <td>${!product && !sale.specialPrice ? "Cargando..." : total}</td>
                </tr>
                <tr>
                  <th>Tarjeta</th>
                  <td>
                    {sale.cash !== total ? (sale.cash === 0 ? "Todo" : `$${total - sale.cash} en efectivo`) : "No"}
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
}
