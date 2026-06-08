

import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ENV } from '../config/env'

export interface AuthRequest extends Request {
  user?: {
    id: number
  }
}

const userAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  const { token } = req.cookies

  if (!token) {
    return res.json({
      success: false,
      message: "Unauthorized"
    })
  }

  try {

    const decoded = jwt.verify(
      token,
      ENV.JWT_SECRET!
    ) as { id: number }

    req.user = {
      id: decoded.id
    }

    next()

  } catch (error) {

    return res.json({
      success: false,
      message: "Invalid token"
    })

  }

}

export default userAuth