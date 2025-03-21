import colors from "./colors";

const theme = {
  colors,
};

export default theme;

declare module "@emotion/react" {
  export interface Theme {
    colors: typeof colors;
  }
}
