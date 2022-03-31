import _ from "lodash";
import styled from "@emotion/styled";
import Product from "../../types/product.type";
import StyledProp from "../../types/styledProp.type";
import { useTags } from "../../context/tagsAndCategoriesContext";
import { AllCenteredDiv, ButtonColored as CardButton } from "../../styles/mixins";
import { Col, Row, Card as CardComponent, Badge, Placeholder } from "react-bootstrap";

const Container = styled(
  AllCenteredDiv.withComponent(({ className, children }: StyledProp) => (
    <Col xs={12} md={6} xl={4} className={className}>
      {children}
    </Col>
  ))
)(({ theme: { colors } }: any) => ({
  "marginBottom": 20,

  "& > .card": {
    backgroundColor: colors.secondary,
    borderColor: "transparent",
    borderWidth: 1,
  },
}));

const CardComponentM = styled(({ className, children }: StyledProp) => (
  <CardComponent className={className}>{children}</CardComponent>
))(({ theme: { colors } }: any) => ({
  "width": "100%",
  "height": "100%",
  "flexDirection": "row",
  ":hover": { borderColor: colors.primary },
  "@media (max-width: 991px)": { flexDirection: "column", height: "auto" },
}));

const lineHeight = 1.2;
const maxLines = 2;
const buttonHeightInLines = 2;

const Text = styled(({ className, children }: StyledProp) => (
  <CardComponent.Text className={className + " mb-0"}>{children}</CardComponent.Text>
))(() => ({
  "overflow": "hidden",
  "display": "-webkit-box",
  "textOverflow": "ellipsis",
  "WebkitBoxOrient": "vertical",
  "WebkitLineClamp": maxLines,
  "height": lineHeight * maxLines + "em",
  "lineHeight": lineHeight + "em",
  "@media (max-width: 991px)": {
    WebkitLineClamp: maxLines,
    height: lineHeight * maxLines + "em",
    maxHeight: lineHeight * maxLines + "em",
  },
  "@media (max-width: 767px)": { WebkitLineClamp: maxLines, height: "auto" },
}));

const Button = styled(({ className, children }: StyledProp) => (
  <CardButton className={className + " d-none d-md-inline-block"}>{children}</CardButton>
))({
  height: lineHeight * buttonHeightInLines + "em",
});

export default function Card({
  product = { description: "", name: "", price: 1, stock: 1, id: 1, tags: [] },
  loading,
}: {
  product?: Product;
  loading?: boolean | undefined;
}) {
  const allTags = useTags();
  const allTagsObject = allTags ? _.transform(allTags, (obj, { id, name }) => (obj[id] = name), {} as any) : {};
  const tags = product.tags.map((tagID) => (
    <Badge key={tagID} pill bg="primary" className="me-1">
      {allTagsObject[tagID]}
    </Badge>
  ));

  return (
    <Container>
      <CardComponentM>
        <Col>
          <CardComponent.Body className="h-100">
            {loading ? (
              <>
                <Placeholder as={CardComponent.Title} animation="glow">
                  <Placeholder xs={12} />
                </Placeholder>
                <Placeholder as={Text} animation="glow">
                  <Placeholder xs={7} bg="secondary" /> <Placeholder xs={4} bg="secondary" />{" "}
                  <Placeholder xs={4} bg="secondary" /> <Placeholder xs={6} bg="secondary" />{" "}
                  <Placeholder xs={8} bg="secondary" />
                </Placeholder>

                <div className="mt-2" />
                <Placeholder animation="glow">
                  <Placeholder style={{ borderRadius: 5 }} xs={3} bg="primary" />{" "}
                  <Placeholder style={{ borderRadius: 5 }} xs={4} bg="primary" />
                </Placeholder>
                <div className="mt-2" />

                <Placeholder className="d-none d-md-block d-lg-none mb-1 mt-1" as="p" animation="glow">
                  <Placeholder xs={4} />
                </Placeholder>

                <Row>
                  <Col xs={12} sm={12} md={12} lg={7}>
                    <Placeholder.Button variant="primary" xs={12} />
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <CardComponent.Title>{product.name}</CardComponent.Title>
                <Text>{product.description}</Text>

                <div className="mt-2" />
                {tags.length === 0 ? <Badge className="invisible">.</Badge> : tags}
                <div className="mt-2" />

                <p className="d-none d-md-block d-lg-none mb-1 mt-1">Stock: 5</p>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={7}>
                    <Button>Nueva venta</Button>
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
