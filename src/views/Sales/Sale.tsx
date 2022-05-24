import axios from "axios";
import { useState } from "react";
import http from "../../http-common";
import Sale from "../../types/sale.type";
import addCero from "../../utils/addCero";
import { useParams } from "react-router-dom";
import useLoadData from "../../hooks/useLoadData";
import { useIsAdmin } from "../../context/personContext";
import useUpdateEffect from "../../hooks/useUpdateEffect";
import { useSalesState } from "../../context/salesContext";
import useRedirectIfTrue from "../../hooks/useRedirectIfTrue";
import useGoBackOrNavigate from "../../hooks/useGoBackOrNavigate";
import { Breadcrumb, Col, Container, Row, Spinner, Table } from "react-bootstrap";

export default function SaleView() {
  const isAdmin = useIsAdmin();
  const saleID = parseInt(useParams<{ id: string }>().id as string);

  useRedirectIfTrue(isNaN(saleID) || !isAdmin, "/ventas");

  const sales = useSalesState();

  const goBackOrNavigate = useGoBackOrNavigate();

  const [saleError, setSaleError] = useState<boolean | string>(false);
  const [sale, setSale] = useState(sales.find(({ id: thisID }) => thisID === saleID));
  useUpdateEffect(() => setSale(sales.find(({ id: thisID }) => thisID === saleID)), [sales]);

  useLoadData(
    [isAdmin, sale, setSale],
    setSale as any,
    () => http.get<{ message: Sale }>("/sale", { params: { id: saleID } }),
    {
      conditionToStart: isAdmin && !sale && !isNaN(saleID),
      retryAfterError: false,

      handleError: (e) => {
        if (axios.isAxiosError(e)) console.log(e.response?.data.error);
        setSaleError(true);
      },
    }
  );

  const product = sale?.product;
  const person = sale?.person;

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
        <Breadcrumb.Item onClick={() => goBackOrNavigate(-1, "/ventas")}>Ventas</Breadcrumb.Item>
        <Breadcrumb.Item active>Venta #{saleID}</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col xs={12}>
          {!!saleError ? (
            <h5 className="w-100 text-center">
              Hubo un error obteniendo la información de esta venta. Es posible que no exista.
            </h5>
          ) : !sale || !product || !person ? (
            <div className="w-100 d-flex justify-content-center align-items-center">
              <Spinner animation="border" size="sm" /> &#8194;Cargando...
            </div>
          ) : (
            <Table striped bordered size="sm">
              <tbody>
                <tr>
                  <th>Fecha</th>
                  <td>{dateString}</td>
                </tr>
                <tr>
                  <th>Persona</th>
                  <td>{person.name}</td>
                </tr>
                <tr>
                  <th>Producto</th>
                  <td>{product.name}</td>
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
