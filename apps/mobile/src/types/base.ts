

export type ResponseData<T> = {
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
    path: string;
};

export type ResponseError = {
    statusCode: number;
    message: string;
    errors: ValidationErrorItem[];
    timestamp: string;
    path: string;
};


export type ValidationErrorItem = {
    field: string;
    message: string;
}


export type BaseResponePagination<T> = {
    items: T
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    }
}
export type BaseRequestPagination = {
    page: number;
    limit: number;
    sortOrder: 'ASC' | 'DESC'
}
