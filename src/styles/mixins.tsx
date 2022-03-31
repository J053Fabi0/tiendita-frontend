import styled from "@emotion/styled";
import { Button } from "react-bootstrap";

const BoldText = styled.p({ fontWeight: "bold" });

const AllCenteredDiv = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const ButtonColored = styled(({ className, children, ...props }: { className?: string; children?: any }) => (
  <Button variant="outline-light" className={className} {...props}>
    {children}
  </Button>
))(({ theme: { colors } }: any) => ({
  "backgroundColor": colors.buttonColor,
  "borderColor": colors.buttonColor,
  "color": colors.buttonText,
  ":hover": {
    backgroundColor: colors.buttonColor,
    borderColor: colors.buttonColor,
    color: colors.buttonText,
    filter: "brightness(90%)",
  },
  ":focus": {
    backgroundColor: colors.buttonColor,
    borderColor: colors.buttonColor,
    color: colors.buttonText,
    filter: "brightness(85%)",
  },
}));

export { BoldText, AllCenteredDiv, ButtonColored };
