import styled from "@emotion/styled";
import { Col } from "react-bootstrap";
import StyledProp from "../../../types/styledProp.type";

const FiltersBar = styled.div(({ theme: { colors } }: any) => ({
  "backgroundColor": colors.secondary,
  "display": "flex",
  "flexDirection": "column",
  "width": "100%",
  "borderRadius": 10,

  "paddingLeft": 20,
  "paddingTop": 10,
  "paddingBottom": 20,
  "*": { marginBottom: 0 },
}));

const FiltersContainer = styled(({ className, children }: StyledProp) => (
  <Col className={className} xs={3}>
    <FiltersBar>{children}</FiltersBar>
  </Col>
))({
  "maxWidth": 240,
  "@media (max-width: 991px) and (min-width: 767px)": { width: "33.3333333%", maxWidth: "33.3333333%" },
  "@media (max-width: 767px)": { width: "100%", paddingBottom: 20, maxWidth: "100%" },
});

const Category = styled.p({
  fontSize: 18,
  marginTop: 10,
  fontWeight: "bold",
});

const Tag = styled.a({
  "marginLeft": 20,
  "fontSize": 16,
  "color": "black",
  ":hover": { color: "black", cursor: "pointer", fontWeight: "bold" },
});

export { FiltersBar, FiltersContainer, Category, Tag };
