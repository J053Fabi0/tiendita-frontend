import axios from "axios";
import { API } from "./utils/constants";

export default axios.create({
  baseURL: API,
  headers: {
    "Content-type": "application/json",
  },
});
