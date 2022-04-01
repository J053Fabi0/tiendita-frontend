import styled from "@emotion/styled";
import StyledProp from "../../../types/styledProp.type";
import { Col, Card as CardComponent } from "react-bootstrap";
import { AllCenteredDiv, ButtonColored as CardButton } from "../../../styles/mixins";

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
const maxLines = 1;
const buttonHeightInLines = 2;

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

const Button = styled(({ className, children, onClick }: any) => (
  <CardButton onClick={onClick} className={className}>
    {children}
  </CardButton>
))({
  height: lineHeight * buttonHeightInLines + "em",
});

const BadgesDiv = styled.div`
  overflow: auto;
  height: 33px; // 25.5
  max-height: 33px;
  @media screen and (max-width: 767px) {
    height: auto;
    max-height: 58px;
  }
`;

export { Container, CardComponentM, Price, Button, BadgesDiv };
