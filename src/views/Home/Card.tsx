import _ from "lodash";
import styled from "@emotion/styled";
import Product from "../../types/product.type";
import { Col, Row, Card as CardComponent, Badge, Spinner } from "react-bootstrap";
import { AllCenteredDiv, ButtonColored as CardButton } from "../../styles/mixins";
import { useTags } from "../../context/tagsAndCategoriesContext";

interface StyledProps {
  className?: string;
  children?: any;
}

const Container = styled(
  AllCenteredDiv.withComponent(({ className, children }: StyledProps) => (
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

const CardComponentM = styled(({ className, children }: StyledProps) => (
  <CardComponent className={className}>{children}</CardComponent>
))(({ theme: { colors } }: any) => ({
  "width": "100%",
  "flexDirection": "row",
  ":hover": { borderColor: colors.primary },
  "@media (max-width: 991px)": { flexDirection: "column", height: "auto" },
}));

const lineHeight = 1.2;
const maxLines = 2;
const buttonHeightInLines = 2;

const Text = styled(({ className, children }: StyledProps) => (
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

const Button = styled(({ className, children }: StyledProps) => (
  <CardButton className={className + " d-none d-md-inline-block"}>{children}</CardButton>
))({
  height: lineHeight * buttonHeightInLines + "em",
});

const SpinnerDiv = styled(({ className }: { className?: string }) => (
  <Col xs={12} className={className + " d-flex align-items-center justify-content-center"}>
    <Spinner animation="border" variant="secondary" />
  </Col>
))({ position: "absolute", top: "40%", left: "0" });

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
          <CardComponent.Body className="">
            {loading ? <SpinnerDiv /> : null}

            <div className={loading ? "invisible" : "visible"}>
              <CardComponent.Title>{product.name}</CardComponent.Title>
              <Text>{product.description}</Text>

              <div className={tags.length === 0 ? "" : "mt-2"} />
              {tags}
              <div className={tags.length === 0 ? "" : "mt-2"} />

              <p className="d-none d-md-block d-lg-none mb-1 mt-1">Stock: 5</p>
              <Row>
                <Col xs={12} sm={12} md={12} lg={7}>
                  <Button>Nueva venta</Button>
                </Col>
                <Col className="d-sm-flex d-md-none d-lg-flex justify-content-end">
                  <p className="text-end mt-0 mb-0 h-auto">Stock: 5</p>
                </Col>
              </Row>
            </div>
          </CardComponent.Body>
        </Col>
      </CardComponentM>
    </Container>
  );
}
