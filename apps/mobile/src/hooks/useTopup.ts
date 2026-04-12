import { useEffect } from "react"; // 👈 QUAN TRỌNG: Phải import cái này
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { topupRequest } from "@/api/topup";
import { TopupCreateRequest } from "@/types/topup";

// 1. Hook lấy tỉ giá (Type 1: Topup, Type 2: Withdraw)
export const useConversionRates = () => useQuery({
  queryKey: ["conversion-rates"],
  queryFn: topupRequest.getConversionRates,
  select: (res) => res.data.data,
});

// 2. Hook lấy lịch sử giao dịch
export const useTopupHistory = () => useQuery({
  queryKey: ["topup-history"],
  queryFn: topupRequest.getMyTopups,
  select: (res) => res.data.data,
});

// 3. Mutation tạo đơn nạp tiền mới
export const useCreateTopup = () => useMutation({
  mutationFn: (body: TopupCreateRequest) => topupRequest.createTopup(body),
});

// 4. Hook theo dõi chi tiết thanh toán (Polling mỗi 5s)
export const useTopupDetail = (paymentId: string) => useQuery({
  queryKey: ["topup-detail", paymentId],
  queryFn: () => topupRequest.getTopupDetail(paymentId),
  enabled: !!paymentId,
  refetchInterval: (query: any) => {
    // Truy cập an toàn vào state dữ liệu của Query
    const dataFromApi = query.state.data?.data?.data;
    // Nếu status = 0 (Pending) thì tiếp tục quét, ngược lại thì dừng
    return dataFromApi?.status === 0 ? 5000 : false;
  },
  select: (res) => res.data.data,
});

// 5. Hook xác thực kết quả trả về từ PayOS (Thay thế onSuccess)
export const useVerifyTopup = (params: string) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ["verify-topup", params],
    queryFn: () => topupRequest.verifyPayOSReturn(params),
    enabled: !!params,
    select: (res: any) => res.data.data, 
  });

  // 💡 Xử lý Side Effect: Tự động làm mới số dư khi thanh toán thành công
  useEffect(() => {
    // code "00" là mã thành công của PayOS
    if (query.data?.code === "00" || query.data?.status === "PAID") {
      console.log("✅ Thanh toán khớp lệnh, đang cập nhật số dư...");
      
      // Làm mới toàn bộ các dữ liệu liên quan đến tiền tệ
      queryClient.invalidateQueries({ queryKey: ["point-amount"] });
      queryClient.invalidateQueries({ queryKey: ["topup-history"] });
    }
  }, [query.data, queryClient]);

  return query;
};