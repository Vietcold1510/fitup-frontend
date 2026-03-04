// Định nghĩa interface để thống nhất cách gọi
export interface IStorage {
    getItem: (key: string) => string | null | Promise<string | null>;
    setItem: (key: string, value: string) => void | Promise<void>;
    removeItem: (key: string) => void | Promise<void>;
}

// Đây là "xương sống" để lưu trữ Access Token & Refresh Token
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER: 'user',
} as const;