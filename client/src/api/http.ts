import axios from "axios";

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
});

http.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

http.interceptors.response.use(
  (r) => r,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      const url = (err?.config?.url || "").toString();

      const isAuthCall =
        url.includes("/users/sign-in") ||
        url.includes("/users/sign-up") ||
        url.includes("/users/refresh");

      if (!isAuthCall) {
        localStorage.removeItem("token");
        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
      }
    }
    return Promise.reject(err);
  }
);

export default http;

// Adds `Authorization: Bearer <token>` to each request when a token exists.
// On 401 responses (except for auth endpoints), clears the token and redirects the user to `/login`.