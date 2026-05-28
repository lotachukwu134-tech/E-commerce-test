import express from 'express';
import { createProduct, deleteProduct, updateProduct } from '../controllers/productController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminOnly.js';


const productRoutes = express.Router()
productRoutes.post(`/createProduct`,authMiddleware,adminOnly,createProduct)
productRoutes.patch(`/update/:id`, authMiddleware,adminOnly,updateProduct)
productRoutes.delete(`/delete/:id`,authMiddleware,adminOnly,deleteProduct)

export default productRoutes