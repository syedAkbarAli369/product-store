

import { eq } from 'drizzle-orm'
import { db } from './index'
import { comments, NewComment, NewProduct, products, users } from './schema'

// USER QUERIES

// Get user by email
export const getUserByEmail = async (email: string) => {

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))

  return user[0]
}

// Get user by id
export const getUserById = async (id: number) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, id))

  return user[0]
}

// Create user
export const createUser = async (
  name: string,
  email: string,
  password: string,
  imageUrl: string | null
) => {
  const user = await db
    .insert(users)
    .values({
      name,
      email,
      password,
      imageUrl
    })
    .returning()

  return user[0]

}

// Update verify otp
export const updateVerifyOtp = async (
  id: number,
  otp: string,
  expiry: Date
) => {

  await db
    .update(users)
    .set({
      verifyOtp: otp,
      verifyOtpExpiry: expiry
    })
    .where(eq(users.id, id))
}

// Verify user account
export const verfiyUserAccount = async (
  id: number
) => {

  await db
    .update(users)
    .set({
      isAccountVerified: true,
      verifyOtp: null,
      verifyOtpExpiry: null
    })
    .where(eq(users.id, id))
}

// Update reset otp
export const updateResetOtp = async (
  id: number,
  otp: string,
  expiry: Date
) => {

  await db
    .update(users)
    .set({
      resetOtp: otp,
      resetOtpExpiry: expiry
    })
    .where(eq(users.id, id))

}

// Update password
export const updatePassword = async (
  id: number,
  password: string
) => {

  await db
    .update(users)
    .set({
      password,
      resetOtp: null,
      resetOtpExpiry: null
    })
    .where(eq(users.id, id))

}


// PRODUCT QUERIES

// Create product
export const createProduct = async (data: NewProduct) => {
  const [product] = await db
    .insert(products)
    .values(data)
    .returning()

  return product

}

// Get all products
export const getAllProducts = async () => {
  return db.query.products.findMany({
    with: { user: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)]
  })
}

// Get product by id 
export const getProductById = async (id: string) => {
  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      user: true,
      comments: {
        with: { user: true },
        orderBy: (comments, { desc }) => [desc(comments.createdAt)]
      }
    }
  })
}

// Get product by user id
export const getProductByUserId = async (userId: number) => {
  return db.query.products.findMany({
    where: eq(products.userId, userId),
    with: { user: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)]
  })
}

// Update product 
export const updateProduct = async (
  id: string, data: Partial<NewProduct>
) => {
  const existingProduct = await getProductById(id)
  if (!existingProduct) {
    throw new Error(`Product with id: ${id} not found`)
  }

  const [product] = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning()

  return product

}

// Delete product 
export const deleteProduct = async (id: string) => {
  const existingProduct = await getProductById(id)
  if (!existingProduct) {
    throw new Error(`Product with id: ${id} not found`)
  }
  const [product] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning()

  return product

}


// COMMENT QUERIES

// Create comment 
export const createComment = async (data: NewComment) => {
  const [comment] = await db
    .insert(comments)
    .values(data)
    .returning()

  return comment

}

// Get comment by id
export const getCommentById = async (id: string) => {
  return db.query.comments.findFirst({
    where: eq(comments.id, id),
    with: { user: true }
  })

}

// Delete comment
export const deleteComment = async (id: string) => {
  const existingComment = await getCommentById(id)

  if (!existingComment) {
    throw new Error(`Comment with id: ${id} not found`)
  }

  const [comment] = await db
    .delete(comments)
    .where(eq(comments.id, id))
    .returning()

  return comment

}



