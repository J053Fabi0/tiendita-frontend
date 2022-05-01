import * as Yup from "yup";
import http from "../http-common";
import { useEffect } from "react";
import Person from "../types/Person.type";
import useCookie from "../hooks/useCookie";
import SignInQuery from "../types/signinQuery.type";
import { Formik, Form as FormikForm } from "formik";
import { useLocalStorage } from "../hooks/useStorage";
import SignInResult from "../types/signInResult.type";
import { useContext, createContext, useState } from "react";
import { Alert, Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";

const AuthTokenContext = createContext<string>("");
const PersonContext = createContext<Person | null>(null);
const AuthTokenReadyContext = createContext<boolean>(false);
const LogOutContext = createContext<() => void>(null as any);

export const usePerson = () => useContext(PersonContext);
export const useLogOut = () => useContext(LogOutContext);
export const useAuthToken = () => useContext(AuthTokenContext);
export const useAuthTokenReady = () => useContext(AuthTokenReadyContext);

export function PersonsProvider(a: { children: any }) {
  const [error, setError] = useState<null | string>(null);
  const [person, setPerson] = useLocalStorage<Person | null>("person", null);
  const [authToken, setAuthToken] = useCookie("authtoken", "", { secure: true });
  const [authTokenReady, setAuthTokenReady] = useState<boolean>(false);

  useEffect(() => {
    if (authToken) {
      http.defaults.headers.common["Authorization"] = authToken;
      setAuthTokenReady(true);
    } else {
      delete http.defaults.headers.common["Authorization"];
      setAuthTokenReady(false);
    }
  }, [authToken]);

  const schema = Yup.object().shape({
    username: Yup.string().required("Requerido."),
    password: Yup.string().required("Requerido."),
  });

  const handleOnSubmit = async (values: SignInQuery) => {
    try {
      const { authToken, person } = (await http.get<SignInResult>("/signin", { params: { ...values } })).data
        .message;
      http.defaults.headers.common["Authorization"] = authToken;
      setAuthToken(authToken);
      setPerson(person);
      setShow(false);
    } catch (e: any) {
      if (e?.response?.data?.error === "Invalid data") {
        setError("Datos incorrectos");
        console.error(e.response.data.error);
      } else {
        console.log(e);
        setError("Hubo un error desconocido. Contacta a @SenorBinario por Telegram.");
      }
    }
  };

  const [show, setShow] = useState(authToken === "");
  const SignInModal = (
    <Modal show={show} onHide={() => setShow(false)} centered backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Iniciar sesión</Modal.Title>
      </Modal.Header>

      <Formik
        validationSchema={schema}
        initialValues={{ username: "", password: "" }}
        onSubmit={(values, { setSubmitting }) => handleOnSubmit(values).then(() => setSubmitting(false))}
      >
        {({ values, errors, touched, handleBlur, handleSubmit, handleChange, isSubmitting }) => (
          <FormikForm onSubmit={handleSubmit}>
            <Modal.Body>
              <Row>
                <Alert
                  dismissible
                  variant="danger"
                  transition={false}
                  show={error !== null}
                  onClose={() => setError(null)}
                >
                  {error}
                </Alert>

                {/* Username */}
                <Form.Group as={Col} xs={12} controlId="formUsername">
                  <Form.Label>Nombre de usuario</Form.Label>
                  <InputGroup className="mb-3" hasValidation>
                    <Form.Control
                      type="text"
                      name="username"
                      autoFocus={true}
                      onBlur={handleBlur}
                      value={values.username}
                      disabled={isSubmitting}
                      onChange={handleChange}
                      isInvalid={!!touched.username && !!errors.username}
                    />
                    <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Password */}
                <Form.Group as={Col} xs={12} controlId="formPassword">
                  <Form.Label>Contraseña</Form.Label>
                  <InputGroup className="mb-3" hasValidation>
                    <Form.Control
                      type="password"
                      name="password"
                      onBlur={handleBlur}
                      value={values.password}
                      disabled={isSubmitting}
                      onChange={handleChange}
                      isInvalid={!!touched.password && !!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Row>
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
              <Button className="cursor-pointer" variant="success" type="submit" disabled={isSubmitting}>
                Iniciar sesión
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  );

  return (
    <PersonContext.Provider value={person}>
      <AuthTokenReadyContext.Provider value={authTokenReady}>
        <AuthTokenContext.Provider value={authToken}>
          <LogOutContext.Provider
            value={() => {
              setShow(true);
              setPerson(null);
              setAuthToken("");
            }}
          >
            {/**/}
            {SignInModal}
            {a.children}
          </LogOutContext.Provider>
        </AuthTokenContext.Provider>
      </AuthTokenReadyContext.Provider>
    </PersonContext.Provider>
  );
}
