import Caret from "./Sale/Caret";
import {
  useFrom,
  useUntil,
  useFromUpdate,
  useSalesState,
  useUntilUpdate,
  useLoadingSales,
  useFirstSalesLoad,
} from "../../context/salesContext";
import styled from "@emotion/styled";
import addCero from "../../utils/addCero";
import CustomToggle from "./CustomToggle";
import DatePicker from "react-date-picker";
import useArray from "../../hooks/useArray";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SortOption from "./Sale/sortOption.type";
import SortMethod from "./Sale/sortMethod.type";
import useSalesSorted from "./Sale/useSalesSorted";
import { useIsAdmin } from "../../context/personContext";
import { AlignEnd, AlignStart, ChatLeftTextFill } from "react-bootstrap-icons";
import useRedirectIfTrue from "../../hooks/useRedirectIfTrue";
import { Accordion, Card, Col, Container, Form, Nav, Row, Spinner, Table } from "react-bootstrap";

export default function Sales() {
  const isAdmin = useIsAdmin();
  useRedirectIfTrue(!isAdmin);

  const firstSalesLoad = useFirstSalesLoad();
  useEffect(firstSalesLoad, [firstSalesLoad]);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("");

  const from = useFrom();
  const until = useUntil();
  const sales = useSalesState();
  const setFrom = useFromUpdate();
  const setUntil = useUntilUpdate();
  const loadingSales = useLoadingSales();
  const [salesSorted, setSalesSorted] = useState(sales);
  const [sortOption, setSortOption] = useState<SortOption>("date-up");
  const [salesSelected, { remove, push, clear }] = useArray<number>();

  const handleTabSelect = (tab: string | null) => {
    if (tab === null) return;
    setActiveTab(tab !== activeTab ? tab : "");
  };

  useSalesSorted(sales, setSalesSorted, sortOption);

  const handleSortOption = (method: SortMethod) => {
    const [actualMethod, direction] = sortOption.split("-") as [SortMethod, "up" | "down"];

    if (actualMethod === method)
      setSortOption((method + "-" + (direction === "up" ? "down" : "up")) as SortOption);
    else setSortOption((method + "-up") as SortOption);
  };

  const TD = styled.td(`cursor: pointer;`);
  const TH = styled.th(`cursor: pointer; :hover { text-decoration: underline; }`);
  const FormCheck = styled(Form.Check)(`cursor: pointer;`);

  return !isAdmin ? null : (
    <Container>
      <Row className="mt-3">
        <Col className="d-flex justify-content-center">
          <Accordion className="w-100 d-flex align-items-center flex-column">
            <Nav variant="pills" activeKey={activeTab} defaultActiveKey="days" onSelect={handleTabSelect}>
              <CustomToggle eventKey="days">Día</CustomToggle>
              {/* <CustomToggle eventKey="persons">Personas</CustomToggle> */}
            </Nav>

            <Accordion.Collapse eventKey="days">
              <Card.Body>
                <AlignStart />{" "}
                <DatePicker
                  value={from}
                  format={"y-MM-dd"}
                  maxDate={new Date()}
                  disabled={loadingSales}
                  disableCalendar={loadingSales}
                  onChange={
                    ((from: Date) =>
                      setFrom(from === null ? new Date(new Date().setHours(0, 0, 0, 0)) : from)) as any
                  }
                />
                <br />
                <AlignEnd />{" "}
                <DatePicker
                  value={until}
                  format={"y-MM-dd"}
                  maxDate={new Date()}
                  disabled={loadingSales}
                  disableCalendar={loadingSales}
                  onChange={
                    ((until: Date) =>
                      setUntil(
                        until === null ? new Date() : new Date(new Date(until).setHours(23, 59, 59, 999))
                      )) as any
                  }
                />
              </Card.Body>
            </Accordion.Collapse>
          </Accordion>
        </Col>
      </Row>

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
                    const total = sale.specialPrice ?? sale.quantity * (product.price ?? 0);
                    const dateString =
                      `${addCero(date.getDate())}/${addCero(date.getMonth())}/` +
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
                          {product.name} {sale.comment ? <ChatLeftTextFill /> : null}
                        </TD>
                        <TD onClick={handleClick}>{sale.quantity}</TD>
                        <TD onClick={handleClick}>${total}</TD>
                        <TD onClick={handleClick}>
                          {sale.cash !== total
                            ? sale.cash === 0
                              ? "Todo"
                              : `$${total - sale.cash} en efectivo`
                            : "No"}
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
                  <b>Total seleccionado:</b>&#8201;$
                  {sales
                    ?.filter(({ id }) => salesSelected.includes(id))
                    .reduce(
                      (prev, sale) => prev + (sale.specialPrice ?? sale.quantity * (sale.product.price ?? 0)),
                      0
                    )}
                </Col>
                <Col xs={12} className="w-100 d-flex justify-content-end">
                  <b>Resto:</b>&#8201;$
                  {sales
                    ?.filter(({ id }) => !salesSelected.includes(id))
                    .reduce(
                      (prev, sale) => prev + (sale.specialPrice ?? sale.quantity * (sale.product.price ?? 0)),
                      0
                    )}
                </Col>
              </>
            )}

            <Col xs={12} className="w-100 d-flex justify-content-end">
              <b>Total:</b>&#8201;$
              {sales?.reduce(
                (prev, sale) => prev + (sale.specialPrice ?? sale.quantity * (sale.product.price ?? 0)),
                0
              )}
            </Col>

            <div className="mt-3" />
          </>
        )}
      </Row>
    </Container>
  );
}
