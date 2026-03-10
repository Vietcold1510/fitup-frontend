import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_info';

export const tokenStorage = {
  // 1. Lưu Token và thông tin User
  saveAuth: async (token: string, user?: any) => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      if (user) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    } catch (error) {
      console.error("Lỗi khi lưu token:", error);
    }
  },

  // 2. Lấy Token ra để gắn vào Header API
  getToken: async () => {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },

  // 3. Đăng xuất (Xóa sạch)
  clearAuth: async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  }
};