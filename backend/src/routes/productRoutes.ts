

import { Router } from 'express'
import { createProduct, getAllProducts, getMyProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController'
import userAuth from '../middleware/userAuth'

const router = Router()


router.get("/", getAllProducts)

router.get("/my", userAuth, getMyProducts)

router.get("/:id", getProductById)

router.post("/", userAuth, createProduct)

router.put("/:id", userAuth, updateProduct)

router.delete("/:id", userAuth, deleteProduct)

export default router