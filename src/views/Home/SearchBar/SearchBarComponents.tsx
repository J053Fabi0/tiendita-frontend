import styled from "@emotion/styled";
import { Button, Form, InputGroup } from "react-bootstrap";

const SearchButton = styled(Button)(({ theme: { colors } }: any) => ({
  "borderTopRightRadius": "50rem",
  "borderBottomRightRadius": "50rem",
  "backgroundColor": colors.primary,
  ":hover": {
    backgroundColor: colors.primary,
  },
}));

const SearchInput = styled(Form.Control)({ borderTopLeftRadius: "50rem", borderBottomLeftRadius: "50rem" });

const SearchContainer = styled(InputGroup)({
  "width": "70%",
  "@media (max-width: 767px)": {
    // With medium devices (tablets, 768px and up)
    width: "100%",
  },
});

export { SearchButton, SearchInput, SearchContainer };
