

import { Request, Response } from 'express'

import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'

import { ENV } from '../config/env'

import { createUser, getUserByEmail, getUserById, updatePassword, updateResetOtp, updateVerifyOtp, verfiyUserAccount } from '../db/queries'
import { AuthRequest } from '../middleware/userAuth'
import transporter from '../config/nodemailer'
import cloudinary from '../config/cloudinary'

export const isAuthenticated = async (
  req: AuthRequest,
  res: Response
) => {

  const userId = req.user?.id

  if (!userId) {
    return res.json({ success: false, message: "Not authenticated" })
  }

  const user = await getUserById(userId)
  if (!user) {
    return res.json({ success: false, message: "User not found" })

  }



  return res.json({
    success: true,
    message: "Authenticated",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      isVerified: user.isAccountVerified
    }
  })
}


// Register
export const register = async (
  req: Request,
  res: Response
) => {

  console.log("📥 Register endpoint hit with body:", req.body);

  const { name, email, password } = req.body

  let imageUrl = null

  if (req.file) {
    const uploaded = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "users" },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
        .end(req.file?.buffer)

    })

    imageUrl = uploaded.secure_url

  }

  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "Please fill all the fields"
    })
  }

  try {
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await createUser(name, email, hashedPassword, imageUrl)

    const token = jwt.sign(
      { id: user.id },
      ENV.JWT_SECRET!,
      { expiresIn: "7d" }
    )

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.json({
      success: true,
      message: "User registered successfully"
    })

  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message
    })
  }

}


// Login
export const login = async (
  req: Request,
  res: Response
) => {

  const { email, password } = req.body

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and Password Required"
    })
  }

  try {

    const user = await getUserByEmail(email)

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      })
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid credentials"
      })
    }

    const token = jwt.sign(
      { id: user.id },
      ENV.JWT_SECRET!,
      { expiresIn: "7d" }
    )

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
      success: true,
      message: "Login successful"
    })

  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message
    })
  }
}

// Logout
export const logout = async (
  req: Request,
  res: Response
) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  return res.json({
    success: true,
    message: "Logged out"
  });
};


// Send Verify Otp
export const sendVerifyOtp = async (
  req: AuthRequest,
  res: Response
) => {

  console.log("================================")
  console.log("OTP HIT")
  console.log("TIME:", new Date().toISOString())
  console.log("USER:", req.user?.id)
  console.log("================================")

  try {
    const userId = req.user?.id

    const user = await getUserById(userId!)

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      })
    }

    const otp = String(
      Math.floor(100000 + Math.random() * 900000)
    )

    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await updateVerifyOtp(
      user.id,
      otp,
      expiry
    )

    await transporter.sendMail({
      from: ENV.SENDER_EMAIL,
      to: user.email,
      subject: "Verify your account",
      text: `Your OTP is ${otp}`
    })
    console.log("EMAIL BLOCKED FOR RIGHT NOW")

    return res.json({
      success: true,
      message: "OTP sent"
    })

  } catch (error: any) {

    return res.json({
      success: false,
      message: error.message
    })

  }

}


// Verify Email
export const verifyEmail = async (
  req: AuthRequest,
  res: Response
) => {

  const { otp } = req.body

  try {
    const userId = req.user?.id

    const user = await getUserById(userId!)

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      })
    }

    console.log("OTP from user", otp)
    console.log("OTP in database", user.verifyOtp)

    if (user.verifyOtp !== otp) {
      return res.json({
        success: false,
        message: "Invalid OTP"
      })
    }

    if (user.verifyOtpExpiry!.getTime() < Date.now()) {
      return res.json({
        success: false,
        message: "OTP expired"
      })
    }

    await verfiyUserAccount(user.id)

    return res.json({
      success: true,
      message: "Account Verified"
    })


  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message
    })
  }

}


// Send Reset OTP
export const sendResetOtp = async (
  req: Request,
  res: Response
) => {

  const { email } = req.body

  try {
    const user = await getUserByEmail(email)

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      })
    }

    const otp = String(
      Math.floor(10000 + Math.random() * 900000)
    )

    const expiry = new Date(Date.now() + 15 * 60 * 1000)

    await updateResetOtp(
      user.id,
      otp,
      expiry
    )

    await transporter.sendMail({
      from: ENV.SENDER_EMAIL,
      to: user.email,
      subject: "Reset Password OTP",
      text: `Your reset OTP is ${otp}`
    })
    console.log("EMAIL BLOCKED")

    return res.json({
      success: true,
      message: "Reset OTP sent"
    })

  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message
    })

  }

}


// Reset Password
export const resetPassword = async (
  req: Request,
  res: Response
) => {
  const { email, otp, newPassword } = req.body

  try {

    const user = await getUserByEmail(email)

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      })
    }

    if (user.resetOtp !== otp) {
      return res.json({
        success: false,
        message: "Invalid OTP"
      })
    }

    if (user.resetOtpExpiry!.getTime() < Date.now()) {
      return res.json({
        success: false,
        message: "OTP expired"
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await updatePassword(
      user.id,
      hashedPassword
    )

    return res.json({
      success: true,
      message: "Password reset successful"
    })

  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message
    })

  }

}


// Verify Reset OTP 
export const verifyResetOTP = async (
  req: Request,
  res: Response
) => {
  const { email, otp } = req.body

  const user = await getUserByEmail(email)

  if (!user) {
    return res.json({
      success: false,
      message: "User not found"
    })
  }

  if (user.resetOtp !== otp) {
    return res.json({
      success: false,
      message: "Invalid OTP"
    })
  }

  if (user.resetOtpExpiry!.getTime() < Date.now()) {
    return res.json({
      success: false,
      message: "OTP expired"
    })
  }

  return res.json({
    success: true,
    message: "OTP verified"
  })
}