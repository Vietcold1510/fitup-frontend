import { useEffect, useState, useRef } from 'react';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/workout';
import { workoutPlanRequest } from '@/api/workoutPlan';

export const useGeneratingPlan = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'GeneratingPlan'>>();
  const navigation = useNavigation<any>();
  
  // Lấy ID: 365920d39eb5455b815401562e0d0009 từ params
  const { onboardingProfileId } = route.params;

  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Đang kết nối AI...");
  const isApiProcessed = useRef(false);

  useEffect(() => {
    const autoGeneratePlan = async () => {
      console.log("-----------------------------------------");
      console.log("📡 [STEP 2] STARTING AUTO-GENERATE PLAN...");
      console.log("🔗 Using Profile ID:", onboardingProfileId);

      try {
        // GỌI API: POST /api/workout-plans/generate?onboardingProfileId=...
        const res = await workoutPlanRequest.generatePlan(onboardingProfileId);
        
        console.log("✅ [STEP 2] GENERATE SUCCESS!");
        console.log("📦 Server Response:", res.data);
        console.log("-----------------------------------------");
        
        isApiProcessed.current = true;
      } catch (error) {
        console.error("❌ [STEP 2] GENERATE FAILED:", error);
        setStatusMessage("Lỗi hệ thống AI. Đang thử lại...");
        // Có thể thêm logic retry ở đây nếu muốn
      }
    };

    autoGeneratePlan();

    // CHẠY PROGRESS GIẢ LẬP (Mô phỏng quá trình tính toán)
    let cur = 0;
    const messages = [
      "Đang phân tích chỉ số cơ thể...",
      "Đang thiết lập cường độ tập luyện...",
      "Đang tối ưu lộ trình các tuần...",
      "Hoàn tất! Đang chuẩn bị vào trang chủ..."
    ];

    const interval = setInterval(() => {
      cur += 1;
      if (cur <= 100) {
        setProgress(cur);
        const msgIdx = Math.floor((cur / 100) * (messages.length - 1));
        setStatusMessage(messages[msgIdx]);
      }

      // CHUYỂN TRANG: Khi đạt 100% VÀ Server đã báo OK
      if (cur >= 100) {
        if (isApiProcessed.current) {
          clearInterval(interval);
          console.log("🚀 [STEP 2] DONE -> REDIRECTING TO HOME");
          navigation.replace("Main"); 
        } else {
          // Nếu progress chạy xong mà API chưa xong (mạng chậm), giữ ở 99%
          setProgress(99);
          setStatusMessage("AI đang hoàn tất những bước cuối cùng...");
        }
      }
    }, 45); // ~4.5 giây tổng cộng

    return () => clearInterval(interval);
  }, [onboardingProfileId]);

  return { progress, statusMessage };
};