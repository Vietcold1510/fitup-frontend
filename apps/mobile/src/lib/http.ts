import axios from "axios";

export const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
    headers: { "Content-Type": "application/json" }
});

// "Khung nền" để mọi request sau này không cần truyền Token thủ công
http.interceptors.request.use((config) => {
    // Logic này sẽ được app Web/Mobile inject storage vào
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// "Khung nền" xử lý lỗi tập trung (ví dụ 401 thì logout)
http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Tự động clear session hoặc redirect về login
        }
        return Promise.reject(error);
    }
);