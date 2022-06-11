import axios from "axios";
import http from "../../../http-common";
import Sale from "../../../types/sale.type";
import addCero from "../../../utils/addCero";
import { useParams } from "react-router-dom";
import { useCallback, useState } from "react";
import useLoadData from "../../../hooks/useLoadData";
import useReactModal from "../../../hooks/useReactModal";
import { useIsAdmin } from "../../../context/personContext";
import useUpdateEffect from "../../../hooks/useUpdateEffect";
import useRedirectIfTrue from "../../../hooks/useRedirectIfTrue";
import useGoBackOrNavigate from "../../../hooks/useGoBackOrNavigate";
import { useSalesState, useReloadSales } from "../../../context/salesContext";
import { Breadcrumb, Button, Col, Container, Row, Spinner, Table } from "react-bootstrap";

export default function SaleView() {
  const isAdmin = useIsAdmin();
  const saleID = parseInt(useParams<{ id: string }>().id as string);

  useRedirectIfTrue(isNaN(saleID) || !isAdmin, "/ventas");

  const sales = useSalesState();
  const reloadSales = useReloadSales();

  const goBackOrNavigate = useGoBackOrNavigate();

  const [saleError, setSaleError] = useState<boolean | string>(false);
  const [sale, setSale] = useState(sales.find(({ id: thisID }) => thisID === saleID));

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

  const [dateString, setDateString] = useState(+date === 0 ? "" : getDateString(date));
  useUpdateEffect(() => setDateString(getDateString(date)), [date]);

  const total = sale ? sale.specialPrice ?? sale.quantity * (product?.price ?? 0) : 0;

  const [deleting, setDeleting] = useState(false);
  const handleDelete = useCallback(async () => {
    try {
      setDeleting(true);
      await http.delete("/sale", { data: { id: saleID } });
    } catch (e) {
      console.log(e);
    } finally {
      setDeleting(false);
      reloadSales(true);
      setDeleteModalShow(false);
      goBackOrNavigate(-1, "/");
    }
    // eslint-disable-next-line
  }, [saleID, setDeleting, reloadSales, goBackOrNavigate]);

  const { Modal: DeleteModal, setShow: setDeleteModalShow } = useReactModal(
    "¿Estás seguro de querer borrar la venta?",

    <div className="d-flex justify-content-end">
      <Button variant="danger" onClick={handleDelete} disabled={deleting}>
        {deleting ? <Spinner animation="border" size="sm" /> : "Borrar"}
      </Button>
      {deleting ? null : (
        <Button variant="secondary" onClick={() => setDeleteModalShow(false)} className="ms-2" disabled={deleting}>
          Cancelar
        </Button>
      )}
    </div>,
    null,

    { verticallyCentered: true }
  );

  return (
    <Container>
      <Breadcrumb className="mt-3">
        <Breadcrumb.Item onClick={() => goBackOrNavigate(-1, "/ventas")}>Ventas</Breadcrumb.Item>
        <Breadcrumb.Item active>Venta #{saleID}</Breadcrumb.Item>
      </Breadcrumb>

      {!!saleError ? (
        <h5 className="w-100 text-center">
          Hubo un error obteniendo la información de esta venta. Es posible que no exista.
        </h5>
      ) : !sale || !product || !person || !dateString ? (
        <div className="w-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" size="sm" /> &#8194;Cargando...
        </div>
      ) : (
        <Row>
          <Col xs={12}>
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
                {sale.comment === undefined ? null : (
                  <tr>
                    <th>Comentario</th>
                    <td>{sale.comment}</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>

          <Col className="mb-3">
            <Button variant="danger" onClick={() => setDeleteModalShow(true)}>
              Eliminar
            </Button>
          </Col>
        </Row>
      )}

      {DeleteModal}
    </Container>
  );
}
