import express from "express";
import {placeOrder,getUserOrders,getSingleOrder,cancelOrder,getAllOrders,updateOrderStatus,} from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminOnly.js";
import validate,{ placeOrderSchema, updateOrderStatusSchema } from "../validators/orderValidator.js"

const orderRoutes = express.Router();

// Customer routes
orderRoutes.post("/", authMiddleware,validate(placeOrderSchema) ,placeOrder);
orderRoutes.get("/", authMiddleware, getUserOrders);
orderRoutes.get("/admin/orders", authMiddleware, adminOnly, getAllOrders);
orderRoutes.put("/admin/orders/:id/status",authMiddleware,adminOnly,validate( updateOrderStatusSchema),updateOrderStatus);
orderRoutes.get("/:id", authMiddleware, getSingleOrder);
orderRoutes.put("/:id/cancel", authMiddleware, cancelOrder);


export default orderRoutes;