import express from 'express';
import { login, register } from '../controllers/authController.js';
import validate, { loginSchema, registerSchema } from '../validators/authValidator.js';


const authRoutes = express.Router()

authRoutes.post(`/register`,validate(registerSchema), register)
authRoutes.post(`/login`, validate(loginSchema),login)
export default authRoutes