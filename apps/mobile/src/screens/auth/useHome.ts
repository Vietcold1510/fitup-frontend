import { useQuery } from "@tanstack/react-query";
import { http } from "@/lib/http";

export const useHome = () => {
  return useQuery({
    queryKey: ["homeData"],
    queryFn: async () => {
      // Giả sử API của Hàn là /user/dashboard hoặc /home
      const res = await http.get("/home");
      return res.data; // Trả về object chứa point, workouts, plan...
    },
    staleTime: 1000 * 60 * 5, // Dữ liệu được coi là mới trong 5 phút
  });
};  