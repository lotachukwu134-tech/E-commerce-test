import express from "express";
import {getCart,addToCart,updateCartItem,removeCartItem,clearCart,} from "../controllers/cartController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const cartRoutes = express.Router();

cartRoutes.get("/", authMiddleware, getCart);
cartRoutes.post("/add", authMiddleware, addToCart);
cartRoutes.put("/update/:itemId", authMiddleware, updateCartItem);
cartRoutes.delete("/remove/:itemId", authMiddleware, removeCartItem);
cartRoutes.delete("/clear", authMiddleware, clearCart);

export default cartRoutes;