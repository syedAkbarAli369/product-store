

import { Response } from 'express'
import { getUserById } from '../db/queries'
import { AuthRequest } from '../middleware/userAuth'


export const getUserData = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const userId = req.user?.id

    const user = await getUserById(userId!)

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      })
    }

    return res.json({
      success: true,
      user
    })

  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message
    })

  }

}