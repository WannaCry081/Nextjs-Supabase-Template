import axios from "axios";
import { SITE_URL } from "@/constants/seo.constant";

export const axiosInstance = axios.create({
  baseURL: SITE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (request) => request,
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    return Promise.reject(error);
  }
);
