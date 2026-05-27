import express from 'express';
import { getUser, login, register, updateUser } from '../controllers/authController.js';
import validate, { editUserSchema, loginSchema, registerSchema } from '../validators/authValidator.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const authRoutes = express.Router()

authRoutes.post(`/register`,validate(registerSchema), register)
authRoutes.post(`/login`, validate(loginSchema),login)
authRoutes.get(`/getUser`,authMiddleware, getUser)
authRoutes.patch(`/edit`, validate(editUserSchema),authMiddleware,updateUser)
export default authRoutes