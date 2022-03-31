import { Fragment } from "react";
import styled from "@emotion/styled";
import { Col, Placeholder } from "react-bootstrap";
import StyledProp from "../../types/styledProp.type";
import randomNumberInterval from "../../utils/randomNumberInterval";
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

export default function Filters() {
  const tagsAndCategories = useTagsAndCategories();
  const filtersTree: Array<any> = [];

  if (tagsAndCategories)
    for (let i = 0; i < tagsAndCategories.length; i++) {
      const { name, tags } = tagsAndCategories[i];
      filtersTree.push(<Category key={i}>{name}</Category>);

      for (let i = 0; i < tags.length; i++) filtersTree.push(<Tag key={tags[i].name}>{tags[i].name}</Tag>);
    }

  return (
    <FiltersContainer>
      {tagsAndCategories
        ? filtersTree
        : new Array(3).fill(0).map((_, i) => {
            const items = [];
            const numberItems = randomNumberInterval(3, 5);
            for (let i = 0; i < numberItems; i++)
              items.push(<Placeholder key={i} xs={randomNumberInterval(7, 9)} bg="secondary" />);

            return (
              <Fragment key={i}>
                <Placeholder key={"title"} as={Category} animation="glow">
                  <Placeholder xs={randomNumberInterval(7, 9)} />
                </Placeholder>
                <Placeholder as={Tag} animation="glow">
                  {items}
                </Placeholder>
              </Fragment>
            );
          })}
    </FiltersContainer>
  );
}
