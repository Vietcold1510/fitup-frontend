import axios from "axios";
import { tokenStorage } from "./storage";

export const http = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "https://fitupproject.onrender.com",
  timeout: 60000, // Tăng lên 30 giây cho Render Cold Start
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  async (config) => {
    const token = await tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// "Khung nền" để mọi request sau này không cần truyền Token thủ công
http.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

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