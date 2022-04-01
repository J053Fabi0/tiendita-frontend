import { memo } from "react";
import { BadgesDiv, Price } from "./CardComponents";
import useBreakpoints from "../../../hooks/useBreakpoints";
import { Placeholder, Row, Col, Card } from "react-bootstrap";
import randomNumberInterval from "../../../utils/randomNumberInterval";

function CardPlaceholder() {
  const { lessThan } = useBreakpoints();

  return (
    <>
      <Placeholder as={Card.Title} animation="glow">
        <Placeholder xs={randomNumberInterval(8, 12)} />
      </Placeholder>

      <Placeholder as={Price} animation="glow">
        <Placeholder xs={randomNumberInterval(2, 4)} bg="secondary" />
      </Placeholder>

      <div className="mt-2" />
      <BadgesDiv>
        <Placeholder animation="glow">
          <Placeholder style={{ borderRadius: 5 }} xs={randomNumberInterval(2, 4)} bg="primary" />{" "}
          <Placeholder style={{ borderRadius: 5 }} xs={randomNumberInterval(2, 4)} bg="primary" />
        </Placeholder>
      </BadgesDiv>
      <div className="mt-2" />

      <Placeholder className="d-none d-md-block d-lg-none mb-1 mt-1" as="p" animation="glow">
        <Placeholder xs={4} />
      </Placeholder>

      {lessThan.small ? null : (
        <Row>
          <Col xs={12} sm={12} md={12} lg={7}>
            <Placeholder.Button variant="primary" xs={12} />
          </Col>
        </Row>
      )}
    </>
  );
}

export default memo(CardPlaceholder);
