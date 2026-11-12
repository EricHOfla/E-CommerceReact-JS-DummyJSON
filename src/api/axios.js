import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://dummyjson.com",
  timeout: 15000,
  headers: { Accept: "application/json" },
});

export default api;
