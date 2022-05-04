import styled from "@emotion/styled";
import StyledProp from "../../types/styledProp.type";
import { AllCenteredDiv } from "../../styles/mixins";
import { Col, Card as CardComponent, Row } from "react-bootstrap";

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

const CardComponentM = styled(CardComponent)(({ theme: { colors } }: any) => ({
  "width": "100%",
  "height": "100%",
  "flexDirection": "row",
  ":hover": { borderColor: colors.primary },
  "cursor": "pointer",
  "@media (max-width: 767px)": { flexDirection: "column", height: "auto" },
}));

const lineHeight = 1.2;
const maxLines = 1;

const Price = styled(({ className, children }: StyledProp) => (
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

const BadgesDiv = styled.div`
  overflow: auto;
  height: 33px; // 25.5
  max-height: 33px;
  @media screen and (max-width: 767px) {
    height: auto;
    max-height: 58px;
  }
`;

const RowBottom = styled(Row)({ bottom: 15 });

export { Container, CardComponentM, Price, BadgesDiv, RowBottom };
