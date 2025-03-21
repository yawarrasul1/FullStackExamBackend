const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cartController");
const { authenticate } = require("../middleware/authMiddleware");

// Get the user’s cart
router.get("/", authenticate, CartController.getCart);

// Add product to cart
router.post("/add", authenticate, CartController.addToCart);

// Update product quantity in cart
router.put("/update", authenticate, CartController.updateCartItem);

// Remove product from cart
router.delete("/remove/:productId", authenticate, CartController.removeFromCart);

// Clear the entire cart
router.delete("/clear", authenticate, CartController.clearCart);

module.exports = router;
