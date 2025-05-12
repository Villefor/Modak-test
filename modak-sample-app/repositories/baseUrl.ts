import axios from "axios";

const baseUrlClient = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10_000,
});

export default baseUrlClient;
