import axios from "axios";

const PROD_API = import.meta.env.VITE_API_BASE || "/api";
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : PROD_API;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});
