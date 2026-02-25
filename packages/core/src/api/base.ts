// Giúp các API sau này (Product, Order...) luôn có kiểu dữ liệu chuẩn
export interface BaseResponse<T> {
    data: T;
    message: string;
    status: number;
}

// Ví dụ khi dùng: authRequest.login(): Promise<BaseResponse<LoginResType>>