import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.PROD
        ? "https://smart-campus-8lhk.onrender.com"
        : "http://localhost:8080",

    headers: {
        "Content-Type": "application/json",
    },
});

// Add /api automatically
api.interceptors.request.use(
    (config) => {

        // -----------------------------------
        // Fix API URL automatically
        // -----------------------------------

        if (config.url) {

            // If URL doesn't start with /api,
            // add /api
            if (!config.url.startsWith("/api/")) {
                config.url = `/api${config.url.startsWith("/") ? "" : "/"}${config.url}`;
            }
        }

        // -----------------------------------
        // JWT token
        // -----------------------------------

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

// -----------------------------------
// Response interceptor
// -----------------------------------

api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {

        if (error.response?.status === 401) {

            localStorage.clear();
            sessionStorage.clear();
        }

        return Promise.reject(error);
    }
);

export default api;