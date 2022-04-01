import _ from "lodash";
import { memo, useRef } from "react";
import CardPlaceholder from "./CardPlaceholder";
import Product from "../../../types/product.type";
import useBreakpoints from "../../../hooks/useBreakpoints";
import { useTags } from "../../../context/tagsAndCategoriesContext";
import randomNumberInterval from "../../../utils/randomNumberInterval";
import { Col, Row, Card as CardComponent, Badge, Placeholder } from "react-bootstrap";
import { BadgesDiv, Button, CardComponentM, Container, Price } from "./CardComponents";

function Card({
  loading,
  handleOnClick = () => undefined,
  product = { description: "", name: "", price: 1, stock: 1, id: 1, tags: [] },
}: {
  product?: Product;
  loading?: boolean | undefined;
  handleOnClick?: (a: Product) => void;
}) {
  const allTags = useTags();
  const allTagsObject = allTags ? _.transform(allTags, (obj, { id, name }) => (obj[id] = name), {} as any) : {};
  const tags = product.tags.map((tagID) =>
    allTagsObject[tagID] ? (
      <Badge key={tagID} pill bg="primary" className="me-1">
        {allTagsObject[tagID]}
      </Badge>
    ) : (
      <Placeholder key={tagID} animation="glow">
        <Placeholder style={{ borderRadius: 5 }} xs={randomNumberInterval(2, 4)} bg="primary" />{" "}
      </Placeholder>
    )
  );

  const stockRowRef = useRef() as any;
  const handleCardClick = () => {
    if (stockRowRef.current.children[0].clientHeight === 0) handleOnClick(product);
  };

  const { lessThan, greaterThan } = useBreakpoints();

  return (
    <Container>
      <CardComponentM>
        <Col onClick={handleCardClick}>
          <CardComponent.Body className="h-100">
            {loading ? (
              <CardPlaceholder />
            ) : (
              <>
                <CardComponent.Title>{product.name}</CardComponent.Title>
                {greaterThan.medium ? <Price>${product.price}</Price> : null}

                {tags.length === 0 && lessThan.small ? null : (
                  <>
                    <div className="mt-2" />
                    <BadgesDiv>{tags.length === 0 ? <Badge className="invisible">.</Badge> : tags}</BadgesDiv>
                    <div className="mt-2" />
                  </>
                )}

                <p className="d-none d-md-block d-lg-none mb-1 mt-1">Stock: 5</p>
                <Row ref={stockRowRef}>
                  <Col xs={6} md={12} lg={7}>
                    {lessThan.small ? (
                      <Price>${product.price}</Price>
                    ) : (
                      <Button onClick={() => handleOnClick(product)}>Nueva venta</Button>
                    )}
                  </Col>
                  <Col className="d-sm-flex d-md-none d-lg-flex justify-content-end">
                    <p className="text-end mt-0 mb-0 h-auto">Stock: {product.stock}</p>
                  </Col>
                </Row>
              </>
            )}
          </CardComponent.Body>
        </Col>
      </CardComponentM>
    </Container>
  );
}

export default memo(Card);
