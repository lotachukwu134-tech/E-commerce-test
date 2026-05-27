import express from 'express';
import { createProduct, updateProduct } from '../controllers/productController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminOnly.js';


const productRoutes = express.Router()
productRoutes.post(`/createProduct`,authMiddleware,adminOnly,createProduct)
productRoutes.patch(`/updated`, authMiddleware,adminOnly,updateProduct)

export default productRoutes