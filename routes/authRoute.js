import express from 'express';
import { changePassword, getUser, login, register, updateUser } from '../controllers/authController.js';
import validate, { changeUserPasswordSchema, editUserSchema, loginSchema, registerSchema } from '../validators/authValidator.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const authRoutes = express.Router()

authRoutes.post(`/register`,validate(registerSchema), register)
authRoutes.post(`/login`, validate(loginSchema),login)
authRoutes.get(`/me`,authMiddleware, getUser)
authRoutes.patch(`/me`,authMiddleware ,validate(editUserSchema),updateUser)
authRoutes.put(`/changePassword`, validate(changeUserPasswordSchema),authMiddleware, changePassword)
export default authRoutes