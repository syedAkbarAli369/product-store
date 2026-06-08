

import express from 'express'

import { register, login, logout, sendVerifyOtp, verifyEmail, sendResetOtp, resetPassword, isAuthenticated, verifyResetOTP } from '../controllers/authController'
import userAuth from '../middleware/userAuth'
import upload from '../middleware/upload'

const authRouter = express.Router()

authRouter.post("/register", upload.single("image"), register)

authRouter.post("/login", login)

authRouter.post("/logout", logout)

authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp)

authRouter.post("/verify-account", userAuth, verifyEmail)

authRouter.post("/send-reset-otp", sendResetOtp)

authRouter.post("/reset-password", resetPassword)

authRouter.post("/verify-reset-otp", verifyResetOTP)

authRouter.get("/is-authenticated", userAuth, isAuthenticated)


export default authRouter