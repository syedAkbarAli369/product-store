

import type { Response } from 'express'

import * as queries from '../db/queries'

import { AuthRequest } from '../middleware/userAuth'


// Create comment
export const createComment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.json({
        success: false,
        message: "Unauthorized"
      })
    }

    let { productId } = req.params
    if (Array.isArray(productId)) productId = productId[0]

    const { content } = req.body

    if (!content) {
      return res.json({
        success: false,
        message: "Comment content required"
      })
    }

    // check product exists
    const product = await queries.getProductById(productId)

    if (!product) {
      return res.json({
        success: false,
        message: "Product not found"
      })
    }

    const comment = await queries.createComment({
      content,
      userId,
      productId
    })

    return res.json({
      success: true,
      message: "Comment created successfully",
      comment
    })

  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message
    })
  }

}



// Delete comment
export const deleteComment = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const userId = req.user?.id

    if (!userId) {
      return res.json({
        success: false,
        message: "Unauthorized"
      })
    }

    let { commentId } = req.params
    if (Array.isArray(commentId)) commentId = commentId[0]

    const existingComment = await queries.getCommentById(commentId)

    if (!existingComment) {
      return res.json({
        success: false,
        message: "Comment not found"
      })
    }

    if (existingComment.userId !== userId) {
      return res.json({
        success: false,
        message: "You can only delete your own comments"
      })
    }

    await queries.deleteComment(commentId)

    return res.json({
      success: true,
      message: "Comment deleted successfully"
    })

  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message
    })

  }

}