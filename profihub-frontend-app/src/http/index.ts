import axios, { AxiosResponse } from "axios";

export const API_BASE_URL = "http://localhost:2000/api";


import {AuthResponse} from '../models/Response/AuthResponse'


function applyAuthInterceptors(instance: ReturnType<typeof axios.create>) {

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });


  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response?.status === 401 &&
        !originalRequest._isRetry
      ) {
        originalRequest._isRetry = true;
        try {
          const res: AxiosResponse<AuthResponse> =
            await axios.get(
              `${API_BASE_URL}/auth/refresh`,
              { withCredentials: true }
            );
          localStorage.setItem("token", res.data.accessToken);
          return instance.request(originalRequest);
        } catch {
          console.error("Unauthorized user, redirect to login");

        }
      }
      return Promise.reject(error);
    }
  );
}


export const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  withCredentials: true,
});
applyAuthInterceptors(authApi);

export const catalogApi = axios.create({
  baseURL: `${API_BASE_URL}/catalog`,
  withCredentials: true,
});
applyAuthInterceptors(catalogApi);

export const accMgmtApi = axios.create({
  baseURL: `${API_BASE_URL}/acc-mgmt`,
  withCredentials: true,
});
applyAuthInterceptors(accMgmtApi);
