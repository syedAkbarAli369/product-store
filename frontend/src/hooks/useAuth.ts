

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createComment, loginUser, logoutUser, regsiterUser, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail, verifyResetOtp } from '../lib/api'

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: regsiterUser
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser
  })
}

export const useSendVerifyOtp = () => {
  return useMutation({
    mutationFn: sendVerifyOtp
  })
}

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyEmail
  })
}

export const useSendResetOtp = () => {
  return useMutation({
    mutationFn: sendResetOtp
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword
  })
}

export const useVerifyResetOtp = () => {
  return useMutation({
    mutationFn: verifyResetOtp
  })
}

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });
};