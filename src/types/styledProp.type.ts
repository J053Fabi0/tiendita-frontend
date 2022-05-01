import { MouseEventHandler } from "react";

export default interface StyledProp {
  className?: string;
  children?: any;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}
