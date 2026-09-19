import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.PROD
        ? "https://smart-campus-8lhk.onrender.com/api"
        : "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(
    (config) => {
        const token =
            sessionStorage.getItem("token") ||
            localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
        }

        return Promise.reject(error);
    }
);

export default api;