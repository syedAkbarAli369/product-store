

import type { Request, Response } from 'express'
import * as queries from '../db/queries'
import { AuthRequest } from '../middleware/userAuth'


// Get all products 
export const getAllProducts = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const products = await queries.getAllProducts()

    return res.json({
      success: true,
      products
    })

  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message
    })
  }
}



// Get my products
export const getMyProducts = async (
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

    const products = await queries.getProductByUserId(userId)

    return res.json({
      success: true,
      products
    })

  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message
    })
  }
}



// Get product by id
export const getProductById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params

    const productId = Array.isArray(id) ? id[0] : id
    const product = await queries.getProductById(productId)

    if (!product) {
      return res.json({
        success: false,
        message: "Product not found"
      })
    }

    return res.json({
      success: true,
      product
    })

  } catch (error) {

  }

}



// Create product
export const createProduct = async (
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

    const { title, description, imageUrl, price } = req.body

    if (!title || !description || !imageUrl || price === undefined) {
      return res.json({
        success: false,
        message: "Title, Description, Image URL and Price required"
      })
    }

    const product = await queries.createProduct({ title, description, imageUrl, price, userId })

    return res.json({
      success: true,
      message: "Product created successfully",
      product
    })

  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message
    })

  }

}



// Update product 
export const updateProduct = async (
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

    const { id } = req.params

    const { title, description, imageUrl } = req.body

    const productId = Array.isArray(id) ? id[0] : id
    const existingProduct = await queries.getProductById(productId)

    if (!existingProduct) {
      return res.json({
        success: false,
        message: "Product not found"
      })
    }

    if (existingProduct.userId !== userId) {
      return res.json({
        success: false,
        message: "You can only update your own product"
      })
    }

    const product = await queries.updateProduct(productId, {
      title, description, imageUrl
    })

    return res.json({
      success: true,
      message: "Product updated successfully",
      product
    })

  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message
    })

  }

}



// Delete product
export const deleteProduct = async (
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

    const { id } = req.params

    const productId = Array.isArray(id) ? id[0] : id
    const existingProduct = await queries.getProductById(productId)

    if (!existingProduct) {
      return res.json({
        success: false,
        message: "Product not found"
      })
    }

    if (existingProduct.userId !== userId) {
      return res.json({
        success: false,
        message: "You can only delete your own product"
      })
    }

    await queries.deleteProduct(productId)

    return res.json({
      success: true,
      message: "Product deleted successfully",

    })

  } catch (error: any) {
    return res.json({
      success: false,
      message: error.message
    })

  }

}