import { useQuery } from "@tanstack/react-query";
import { userRequest } from "@/api/user";

type UsePointAmountOptions = {
  enabled?: boolean;
};

export function usePointAmount(options?: UsePointAmountOptions) {
  return useQuery({
    queryKey: ["me", "point-amount"],
    queryFn: async () => {
      const response = await userRequest.getMe();
      return response?.data?.data?.data?.pointAmount ?? 0;
    },
    enabled: options?.enabled ?? true,
  });
}
