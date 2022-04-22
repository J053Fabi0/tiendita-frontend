import _ from "lodash";
import { memo } from "react";
import CardPlaceholder from "./CardPlaceholder";
import Product from "../../../types/product.type";
import useBreakpoints from "../../../hooks/useBreakpoints";
import { useTags } from "../../../context/tagsAndCategoriesContext";
import randomNumberInterval from "../../../utils/randomNumberInterval";
import { Col, Card as CardComponent, Badge, Placeholder } from "react-bootstrap";
import { BadgesDiv, CardComponentM, Container, RowBottom } from "./CardComponents";

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
      <Badge key={tagID} pill bg="secondary" className="me-1">
        {allTagsObject[tagID]}
      </Badge>
    ) : (
      <Placeholder key={tagID} animation="glow">
        <Placeholder style={{ borderRadius: 5 }} xs={randomNumberInterval(2, 4)} bg="primary" />{" "}
      </Placeholder>
    )
  );

  const { lessOrEqualThan } = useBreakpoints();

  return (
    <Container>
      <CardComponentM>
        <Col onClick={() => handleOnClick(product)} className="position-relative">
          <CardComponent.Body className="h-100">
            {loading ? (
              <CardPlaceholder />
            ) : (
              <>
                <CardComponent.Title>{product.name}</CardComponent.Title>
                {tags.length === 0 && lessOrEqualThan.small ? null : (
                  <>
                    <div className="mt-2" />
                    <BadgesDiv>{tags.length === 0 ? <Badge className="invisible">.</Badge> : tags}</BadgesDiv>
                    <div className="mt-2" />
                  </>
                )}

                <div className="mt-4" />

                <RowBottom className="position-absolute w-100">
                  <Col className="d-flex">
                    <p className="mt-0 mb-0 w-50">${product.price}</p>
                    <p className="text-end mt-0 mb-0 w-50">Stock: {product.stock}</p>
                  </Col>
                </RowBottom>
              </>
            )}
          </CardComponent.Body>
        </Col>
      </CardComponentM>
    </Container>
  );
}

export default memo(Card);
