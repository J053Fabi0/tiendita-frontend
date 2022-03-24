import React from "react";
import styled from "@emotion/styled";
import { Col, Spinner } from "react-bootstrap";
import { useTagsAndCategories } from "../../context/tagsAndCategoriesContext";

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

const FiltersContainer = styled(({ className, children }: { className?: string; children: any }) => (
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

const SpinnerDiv = styled(({ className }: { className?: string }) => (
  <Col xs={12} className={className + " d-flex align-items-center justify-content-center"}>
    <Spinner animation="border" variant="secondary" />
  </Col>
))({ paddingRight: 20, paddingTop: 10 });

export default function Filters() {
  const tagsAndCategories = useTagsAndCategories();
  const filtersTree: Array<any> = [];

  if (tagsAndCategories)
    for (let i = 0; i < tagsAndCategories.length; i++) {
      const { name, tags } = tagsAndCategories[i];
      filtersTree.push(<Category key={i}>{name}</Category>);

      for (let i = 0; i < tags.length; i++) filtersTree.push(<Tag key={tags[i].name}>{tags[i].name}</Tag>);
    }

  return <FiltersContainer>{tagsAndCategories ? filtersTree : <SpinnerDiv />}</FiltersContainer>;
}
