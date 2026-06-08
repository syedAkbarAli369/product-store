

import api from "./axios";

// TYPES
interface ProductData {
  title: string;
  description: string;
  imageUrl: string
}

interface UpdateProductData extends ProductData {
  id: string
}

interface CommentData {
  productId: string;
  content: string
}



// USERS API 
export const loginUser = async (
  userData: { email: string, password: string }
) => {
  const { data } = await api.post("/auth/login", userData)
  if (!data.success) throw new Error(data.message || "Login failed");

  return data
}

export const regsiterUser = async (
  formData: FormData
) => {
  const { data } = await api.post("/auth/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  if (!data.success) throw new Error(data.message || "Registration failed");

  return data
}

export const logoutUser = async () => {
  const { data } = await api.post("/auth/logout")
  return data
}

export const sendVerifyOtp = async () => {
  console.log("SEND OTP HIT")
  const { data } = await api.post("/auth/send-verify-otp")
  if (!data.success) throw new Error(data.message || "Failed to send OTP");

  return data
}

export const verifyEmail = async (otp: string) => {
  const { data } = await api.post("/auth/verify-account", { otp })
  if (!data.success) throw new Error(data.message || "Verification failed");

  return data
}

export const sendResetOtp = async (email: string) => {
  const { data } = await api.post("/auth/send-reset-otp", { email })
  if (!data.success) throw new Error(data.message || "Failed to send reset OTP");

  return data
}

export const resetPassword = async (
  formData: {
    email: string,
    otp: string,
    newPassword: string
  }
) => {
  const { data } = await api.post("/auth/reset-password", formData)
  if (!data.success) throw new Error(data.message || "Password reset failed");

  return data
}

export const verifyResetOtp = async ({ email, otp }: { email: string, otp: string }) => {
  const { data } = await api.post("/auth/verify-reset-otp", { email, otp })
  if (!data.success) throw new Error(data.message || "Invalid Reset OTP")
}


// PRODUCTS API
export const getAllProducts = async () => {
  const { data } = await api.get("/products")
  return data
}

export const getProductById = async (id: string) => {
  const { data } = await api.get(`/products/${id}`)
  return data

}

export const getMyProducts = async () => {
  const { data } = await api.get("/products/my")
  return data
}

export const createProduct = async (productData: ProductData) => {
  const { data } = await api.post("/products", productData)
  return data
}

export const updateProduct = async ({ id, ...productData }: UpdateProductData) => {
  const { data } = await api.put(`/products/${id}`, productData)
  return data
}

export const deleteProduct = async (id: string) => {
  const { data } = await api.delete(`/products/${id}`)
  return data
}



// COMMENTS API
export const createComment = async ({ productId, content }: CommentData) => {
  const { data } = await api.post(`/comments/${productId}`, { content })
  return data
}

export const deleteComment = async (commentId: string) => {
  const { data } = await api.delete(`/comments/${commentId}`)
  return data
}