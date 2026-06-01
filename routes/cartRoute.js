import express from "express";
import {getCart,addToCart,updateCartItem,removeCartItem,clearCart,} from "../controllers/cartController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validate,{addToCartSchema,updateCartItemSchema} from "../validators/cartValidator.js";

const cartRoutes = express.Router();

cartRoutes.get("/", authMiddleware, getCart);
cartRoutes.post("/add", authMiddleware,validate(addToCartSchema) ,addToCart);
cartRoutes.put("/update/:itemId", authMiddleware,validate(updateCartItemSchema) ,updateCartItem);
cartRoutes.delete("/remove/:itemId", authMiddleware, removeCartItem);
cartRoutes.delete("/clear", authMiddleware, clearCart);

export default cartRoutes;