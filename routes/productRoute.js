import express from 'express';
import { createProduct, deleteProduct, getProducts, getProductsByCategory, getSingleProduct, updateProduct } from '../controllers/productController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminOnly.js';
import validate, { validCreateProduct } from '../validators/productValidator.js';


const productRoutes = express.Router()
productRoutes.post(`/createProduct`,authMiddleware,validate(validCreateProduct),adminOnly,createProduct)
productRoutes.patch(`/update/:id`, authMiddleware,adminOnly,updateProduct)
productRoutes.delete(`/delete/:id`,authMiddleware,adminOnly,deleteProduct)
productRoutes.get(`/getProduct`,getProducts)
productRoutes.get(`/getByCategory/:cat`,getProductsByCategory)
productRoutes.get(`/getSingleProduct/:id`, getSingleProduct)

export default productRoutes