

import { Router } from "express";

import userAuth from "../middleware/userAuth";

import * as commentController from '../controllers/commentController'

const router = Router()

router.post("/:productId", userAuth, commentController.createComment)

router.delete("/:commentId", userAuth, commentController.deleteComment)

export default router