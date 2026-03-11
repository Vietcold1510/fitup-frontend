import { useEffect, useState, useRef } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { workoutPlanRequest } from "../api/workoutPlan";

export const useGeneratingPlan = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  // Nhận ID từ màn hình Onboarding
  const onboardingProfileId = route.params?.onboardingProfileId;

  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Đang khởi tạo AI...");
  const isApiDone = useRef(false);

  useEffect(() => {
    if (!onboardingProfileId) {
      console.error("❌ Không tìm thấy ID để tạo bài tập!");
      return;
    }

    const triggerGenerate = async () => {
      try {
        console.log("📡 [STEP 2] Đang tự động POST Generate cho ID:", onboardingProfileId);
        
        // Gọi API tạo lộ trình
        await workoutPlanRequest.generatePlan(onboardingProfileId);
        
        console.log("✅ [STEP 2] SERVER ĐÃ TẠO XONG LỘ TRÌNH!");
        
        // Xóa cache cũ để Home cập nhật dữ liệu mới nhất
        await queryClient.invalidateQueries({ queryKey: ["home-workout-plans"] });
        
        isApiDone.current = true;
      } catch (error) {
        console.error("❌ [STEP 2] LỖI API GENERATE:", error);
        setStatusMessage("Đang nỗ lực kết nối lại...");
      }
    };

    triggerGenerate();

    // Quản lý thanh Progress (4 giây)
    let cur = 0;
    const interval = setInterval(() => {
      // Nếu API xong thì chạy nhanh (step 5), chưa xong thì bò chậm (step 1)
      const increment = isApiDone.current ? 5 : 1;
      
      if (cur < 99 || isApiDone.current) {
        cur += increment;
      }

      if (cur >= 100) {
        cur = 100;
        setProgress(100);
        if (isApiDone.current) {
          clearInterval(interval);
          console.log("🚀 [STEP 2] HOÀN TẤT -> CHUYỂN VỀ HOME");
          navigation.replace("Main"); 
        }
      } else {
        setProgress(cur);
        // Cập nhật text theo tiến độ
        if (cur < 40) setStatusMessage("Đang phân tích mục tiêu...");
        else if (cur < 80) setStatusMessage("Đang thiết lập bài tập...");
        else setStatusMessage("Sắp xong rồi...");
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onboardingProfileId]);

  return { 
    progress, 
    statusMessage, 
    onboardingProfileId 
  };
};