import Filters from "./Filters";
import Caret from "./Sale/Caret";
import styled from "@emotion/styled";
import Sale from "../../types/sale.type";
import addCero from "../../utils/addCero";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SortOption from "./Sale/sortOption.type";
import SortMethod from "./Sale/sortMethod.type";
import useSalesSorted from "./Sale/useSalesSorted";
import { useIsAdmin } from "../../context/personContext";
import useRedirectIfTrue from "../../hooks/useRedirectIfTrue";
import { ChatLeftTextFill as Chat } from "react-bootstrap-icons";
import { useSelectedSales } from "../../context/selectedThingsContext";
import { Col, Container, Form, Row, Spinner, Table } from "react-bootstrap";
import { useSalesState, useLoadingSales, useFirstSalesLoad } from "../../context/salesContext";

export const getTotal = (sale: Sale) => sale.specialPrice ?? sale.quantity * (sale.product.price ?? 0);

const TD = styled.td(`cursor: pointer;`);
const FormCheck = styled(Form.Check)(`cursor: pointer;`);
const TH = styled.th(`cursor: pointer; :hover { text-decoration: underline; }`);

export default function Sales() {
  const isAdmin = useIsAdmin();
  useRedirectIfTrue(!isAdmin);

  const firstSalesLoad = useFirstSalesLoad();
  useEffect(firstSalesLoad, [firstSalesLoad]);

  const navigate = useNavigate();

  const sales = useSalesState();
  const loadingSales = useLoadingSales();
  const [salesSorted, setSalesSorted] = useState(sales);
  const [sortOption, setSortOption] = useState<SortOption>("date-up");
  const [salesSelected, { remove, push, clear }] = useSelectedSales();

  useSalesSorted(sales, setSalesSorted, sortOption);

  const handleSortOption = (method: SortMethod) => {
    const [actualMethod, direction] = sortOption.split("-") as [SortMethod, "up" | "down"];

    if (actualMethod === method)
      setSortOption((method + "-" + (direction === "up" ? "down" : "up")) as SortOption);
    else setSortOption((method + "-up") as SortOption);
  };

  return !isAdmin ? null : (
    <Container>
      <Filters />

      <Row className="mt-3">
        {loadingSales || sales.length === 0 ? (
          <Col xs={12} className="d-flex justify-content-center align-items-center">
            {loadingSales ? (
              <>
                <Spinner animation="border" size="sm" /> &#8194;Cargando...
              </>
            ) : (
              "No hay datos para los filtros seleccionados."
            )}
          </Col>
        ) : (
          <>
            <Col xs={12} className="overflow-auto">
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <TH onClick={() => handleSortOption("date")}>
                      Fecha <Caret sortOption={sortOption} sortMethod="date" />
                    </TH>
                    <TH onClick={() => handleSortOption("person")}>
                      Persona <Caret sortOption={sortOption} sortMethod="person" />
                    </TH>
                    <TH onClick={() => handleSortOption("product")}>
                      Producto <Caret sortOption={sortOption} sortMethod="product" />
                    </TH>
                    <TH onClick={() => handleSortOption("quantity")}>
                      Cantidad <Caret sortOption={sortOption} sortMethod="quantity" />
                    </TH>
                    <TH onClick={() => handleSortOption("total")}>
                      Total <Caret sortOption={sortOption} sortMethod="total" />
                    </TH>
                    <TH onClick={() => handleSortOption("creditcard")}>
                      💳 <Caret sortOption={sortOption} sortMethod="creditcard" />
                    </TH>
                    <TH onClick={() => (salesSelected.length > 0 ? clear() : push(...sales.map(({ id }) => id)))}>
                      <FormCheck
                        readOnly
                        type="checkbox"
                        checked={salesSelected.length > 0}
                        className="d-flex justify-content-center"
                      />
                    </TH>
                  </tr>
                </thead>
                <tbody>
                  {salesSorted.map((sale) => {
                    const date = new Date(sale.date);
                    const product = sale.product;
                    const total = getTotal(sale);
                    const dateString =
                      `${addCero(date.getDate())}/${addCero(date.getMonth() + 1)}/` +
                      `${date.getFullYear().toString().substring(2)} ` +
                      `${addCero(date.getHours())}:${addCero(date.getMinutes())}`;

                    const handleClick = () => navigate("./" + sale.id);

                    const handleCheck = () => {
                      const index = salesSelected.indexOf(sale.id);
                      if (index !== -1) remove(index);
                      else push(sale.id);
                    };

                    return (
                      <tr key={sale.id}>
                        <TD onClick={handleClick}>{dateString}</TD>
                        <TD onClick={handleClick}>{sale.person.name}</TD>
                        <TD onClick={handleClick}>
                          {product.name} {sale.comment ? <Chat /> : null}
                        </TD>
                        <TD onClick={handleClick}>{sale.quantity}</TD>
                        <TD onClick={handleClick}>${total}</TD>
                        <TD onClick={handleClick}>
                          {sale.cash !== total ? (sale.cash === 0 ? "Todo" : `$${sale.cash} en efectivo`) : "No"}
                        </TD>
                        <TD onClick={handleCheck}>
                          <FormCheck
                            type="checkbox"
                            readOnly={true}
                            className="d-flex justify-content-center"
                            checked={salesSelected.includes(sale.id)}
                          />
                        </TD>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>

            {salesSelected.length === 0 ? null : (
              <>
                <Col xs={12} className="w-100 d-flex justify-content-end">
                  <b>Cantidad:</b>&#8201;
                  {sales?.filter(({ id }) => salesSelected.includes(id)).reduce((c, s) => s.quantity + c, 0)}
                </Col>
                <Col xs={12} className="w-100 d-flex justify-content-end">
                  <b>Total seleccionado:</b>&#8201;$
                  {sales
                    ?.filter(({ id }) => salesSelected.includes(id))
                    .reduce((prev, sale) => prev + getTotal(sale), 0)}
                </Col>
                <Col xs={12} className="w-100 d-flex justify-content-end">
                  <b>Resto:</b>&#8201;$
                  {sales
                    ?.filter(({ id }) => !salesSelected.includes(id))
                    .reduce((prev, sale) => prev + getTotal(sale), 0)}
                </Col>
              </>
            )}

            <Col xs={12} className="w-100 d-flex justify-content-end">
              <b>Total:</b>&#8201;$
              {sales?.reduce((prev, sale) => prev + getTotal(sale), 0)}
            </Col>

            <div className="mt-3" />
          </>
        )}
      </Row>
    </Container>
  );
}
