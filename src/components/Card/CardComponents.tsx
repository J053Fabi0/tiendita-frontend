import styled from "@emotion/styled";
import { XCircle } from "react-bootstrap-icons";
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
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: colors.secondary,
  },
}));

const CardComponentM = styled(CardComponent)(({ theme: { colors } }: any) => ({
  "width": "100%",
  "height": "100%",
  "cursor": "pointer",
  "flexDirection": "row",
  ":hover": { borderColor: colors.primary },
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
  height: 33px; // 25.5
  max-height: 33px;

  overflow: auto;

  @media screen and (max-width: 767px) {
    height: auto;
    max-height: 58px;
  }
`;

const RowBottom = styled(Row)({ bottom: 15 });

const CloseButton = styled(XCircle)`
  border-width: 2px;
  border-radius: 50%;
  border-style: solid;
  border-color: white;

  z-index: 999;
  cursor: pointer;

  width: 1.6rem;
  height: 1.6rem;

  right: 0;
  top: -0.7rem;
  position: absolute;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: white;
  :hover {
    background-color: #aaa;
  }
`;

export { Container, CardComponentM, Price, BadgesDiv, RowBottom, CloseButton };
