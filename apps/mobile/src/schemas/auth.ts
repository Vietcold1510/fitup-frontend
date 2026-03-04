import { z } from "zod";

export const RegisterBody = z.object({
    email: z.string().email("Email không đúng định dạng").min(1, "Email không được để trống"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const VerifyOtpBody = z.object({
    email: z.string().email("Email không đúng định dạng"),
    otp: z.string().min(1, "Mã OTP không được để trống"),
});

export const LoginBody = z.object({
    email: z.string().email("Email không đúng định dạng").min(1, "Email không được để trống"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const ForgotPasswordBody = z.object({
    email: z.string().email("Email không đúng định dạng"),
});

export const ResetPasswordBody = z.object({
    email: z.string().email("Email không đúng định dạng"),
    otp: z.string().min(1, "Mã OTP không được để trống"),
    newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
});

export type RegisterBodyType = z.infer<typeof RegisterBody>;
export type VerifyOtpBodyType = z.infer<typeof VerifyOtpBody>;
export type LoginBodyType = z.infer<typeof LoginBody>;
export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBody>;
export type ResetPasswordBodyType = z.infer<typeof ResetPasswordBody>;