import styled from "@emotion/styled";
import { Spinner } from "react-bootstrap";

export default function SpinnerLoading() {
  const SpinnerStyled = styled(({ className }: { className?: string }) => (
    <div className={`${className} d-flex align-items-center flex-column`} data-testid="spinnerLoading">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p className="pt-3">Cargando...</p>
    </div>
  ))({
    top: "50%",
    left: "50%",
    position: "absolute",
    transform: "translate(-50%, -50%)",
  });

  return <SpinnerStyled />;
}
