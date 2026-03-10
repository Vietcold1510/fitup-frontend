import axios from "axios";
import { Alert } from "react-native";

export class EntityError extends Error {
    status: number;
    payload: {
        message: string;
        errors: { field: string; message: string }[];
    };
    constructor({ status, payload }: { status: number; payload: any }) {
        super("Entity Error");
        this.status = status;
        this.payload = payload;
    }
}

export const handleErrorApi = ({
    error,
    setError,
}: {
    error: any;
    setError?: (name: any, error: { type: string; message: string }) => void;
}) => {
    // 1. Trường hợp lỗi do Validation từ Server (Thường là 422 hoặc 400)
    if (axios.isAxiosError(error) && (error.response?.status === 422 || error.response?.status === 400)) {
        const payload = error.response.data;
        
        if (setError && payload.errors) {
            // Đẩy lỗi vào từng field của form (React Hook Form)
            payload.errors.forEach((item: any) => {
                setError(item.field, {
                    type: "server",
                    message: item.message,
                });
            });
        } else {
            // Nếu không có hàm setError, hiển thị thông báo chung
            Alert.alert("Lỗi dữ liệu", payload.message || "Vui lòng kiểm tra lại thông tin.");
        }
    } 
    // 2. Các lỗi HTTP khác (500, 404, 401...)
    else if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        
        // Xử lý riêng cho lỗi 401 (Hết hạn phiên đăng nhập)
        if (error.response?.status === 401) {
            Alert.alert("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại.");
            // Hàn có thể thêm logic logout hoặc xóa token tại đây
        } else {
            Alert.alert("Lỗi hệ thống", message);
        }
    } 
    // 3. Lỗi không xác định hoặc lỗi mạng (Network Error)
    else {
        Alert.alert("Thông báo", "Không thể kết nối tới máy chủ. Vui lòng thử lại sau.");
    }
};