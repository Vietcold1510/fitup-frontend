import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export const useForgotPassword = () => {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState("");

    const { forgotPasswordMutation } = useAuth({
        onForgotPasswordSuccess: () => {
            // Chuyển thẳng tới màn hình nhập OTP + Mật khẩu mới
            navigation.navigate("ResetPassword", { 
                email: email.trim() 
            });
        }
    });

    const handleSend = () => {
        if (!email) return Alert.alert("Lỗi", "Vui lòng nhập email");
        forgotPasswordMutation.mutate({ email: email.trim() });
    };

    return { 
        email, 
        setEmail, 
        handleSend, 
        isLoading: forgotPasswordMutation.isPending,
        navigation 
    };
};