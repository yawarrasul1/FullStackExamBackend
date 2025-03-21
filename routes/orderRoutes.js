const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderController");
const { authenticate } = require("../middleware/authMiddleware");

// Place an order
router.post("/", authenticate, OrderController.placeOrder);

// Get all orders for the logged-in user
router.get("/", authenticate, OrderController.getOrders);

// Get a specific order by ID
router.get("/:id", authenticate, OrderController.getOrderById);

// Cancel an order
router.put("/cancel/:id", authenticate, OrderController.cancelOrder);

module.exports = router;
