import axios from "axios";
import { API } from "./utils/constants";

const http = axios.create({ baseURL: API, headers: { "Content-type": "application/json" } });
export default http;
