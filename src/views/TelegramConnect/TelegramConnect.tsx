import http from "../../http-common";
import constants from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import TelegramLoginButton from "telegram-login-button";
import SignInTelegramQuery from "../../types/signinTelegramQuery.type";

export default function TelegramConnect() {
  const navigate = useNavigate();

  const handleOnSubmit = async (values: SignInTelegramQuery) => {
    try {
      await http.patch("/personsTelegramID", values);
      alert("Listo. Ahora podrás iniciar sesión con Telegram.");
      navigate("/");
    } catch (e: any) {
      console.log(e);
      alert("Hubo un error");
    }
  };

  return (
    <TelegramLoginButton
      usePic
      className="w-auto"
      requestAccess={false}
      botName={constants.BOT_USERNAME}
      dataOnauth={(authData) => handleOnSubmit(authData)}
    />
  );
}
