import { Order } from "../models/orderModel.js";
import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

// Place an order from the current cart

export const placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price stock"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot place an order with an empty cart",
      });
    }

    // Build order items as snapshots so product changes don't affect old orders
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.price, 
    }));

    const shippingAddress = req.body.shippingAddress || req.user.address || {};

    const newOrder = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount: cart.totalPrice,
      shippingAddress,
    });

    // Clear the cart after placing the order
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error placing order", 
    });
  }
};

// Get all orders for the logged-in user

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching orders",
    });
  }
};


// Get a specific order by ID (must belong to logged-in user)

export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Prevent a user from viewing another user's order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching order",
    });
  }
};

// Cancel a pending order (user can only cancel their own pending orders)
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled — current status is '${order.status}'`,
      });
    }

    order.status = "cancelled";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error cancelling order",
    });
  }
};

// Get ALL orders — Admin only
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching all orders",
    });
  }
};

// Update order status — Admin only
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Prevent going backwards in the pipeline
    const pipeline = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = pipeline.indexOf(order.status);
    const newIndex = pipeline.indexOf(status);

    // Allow cancellation from any non-delivered stage, but block backwards status moves
    if (
      status !== "cancelled" &&
      order.status !== "cancelled" &&
      newIndex < currentIndex
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot move order status backwards from '${order.status}' to '${status}'`,
      });
    }

    if (order.status === "delivered" || order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: `Order is already '${order.status}' and cannot be updated`,
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to '${status}'`,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error updating order status",
    });
  }
};