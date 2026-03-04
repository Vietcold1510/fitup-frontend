import axios from "axios";
import { toast } from "sonner"; // Đảm bảo đã pnpm add sonner trong core

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
    duration,
}: {
    error: any;
    setError?: (name: any, error: { type: string; message: string }) => void;
    duration?: number;
}) => {
    // Trường hợp lỗi do Validation từ Server (422 hoặc 400 tùy API của FitUp)
    if (axios.isAxiosError(error) && error.response?.status === 422) {
        const payload = error.response.data;
        if (setError && payload.errors) {
            payload.errors.forEach((item: any) => {
                setError(item.field, {
                    type: "server",
                    message: item.message,
                });
            });
        } else {
            toast.error(payload.message || "Lỗi dữ liệu", { duration });
        }
    } else if (axios.isAxiosError(error)) {
        // Các lỗi HTTP khác (500, 404, 401...)
        const message = error.response?.data?.message || error.message;
        toast.error(message, { duration });
    } else {
        // Lỗi không xác định
        toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau", { duration });
    }
};