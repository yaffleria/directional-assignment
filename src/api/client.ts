import { Api } from "./api";

export const api = new Api({
  baseURL: "https://fe-hiring-rest-api.vercel.app",
});

export const setAuthToken = (token: string) => {
  api.instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Add response interceptor for error handling if needed
api.instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear token and redirect to login if needed
      // window.location.href = "/login"; // Simple redirect
    }
    return Promise.reject(error);
  }
);
