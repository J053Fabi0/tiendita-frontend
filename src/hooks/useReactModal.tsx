import { useState } from "react";
import { Modal } from "react-bootstrap";

export default function useReactModal(
  title: JSX.Element | JSX.Element[] | string | null,
  body: JSX.Element | JSX.Element[] | string | null,
  footer: JSX.Element | JSX.Element[] | string | null,
  {
    size = "md",
    backdrop = true,
    animation = true,
    fullscreen = false,
    closeButton = false,
    showDefaultValue = false,
    verticallyCentered = false,
    handleClose = false as unknown as () => void,
  }: {
    handleClose?: () => void;
    animation?: boolean;
    closeButton?: boolean;
    backdrop?: true | "static";
    showDefaultValue?: boolean;
    verticallyCentered?: boolean;
    size?: "sm" | "md" | "lg" | "xl";
    fullscreen?: boolean | "sm-down" | "md-down" | "lg-down" | "xl-down" | "xxl-down";
  } = {}
) {
  const [show, setShow] = useState(showDefaultValue);
  if (!handleClose) handleClose = () => setShow(false);

  return {
    setShow,
    Modal: (
      <Modal
        show={show}
        backdrop={backdrop}
        onHide={handleClose}
        animation={animation}
        centered={verticallyCentered}
        size={size === "md" ? undefined : size}
        keyboard={backdrop === "static" ? false : undefined}
        fullscreen={fullscreen === false ? undefined : fullscreen}
      >
        {title !== null ? (
          <Modal.Header closeButton={closeButton}>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
        ) : null}
        {body !== null ? <Modal.Body>{body}</Modal.Body> : null}
        {footer !== null ? <Modal.Footer>{footer}</Modal.Footer> : null}
      </Modal>
    ),
  };
}
