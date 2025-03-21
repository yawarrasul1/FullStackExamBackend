const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController");
const { authenticate } = require("../middleware/authMiddleware");

// Public routes
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);

// Protected routes (requires login)
router.post("/", authenticate, ProductController.createProduct);
router.put("/:id", authenticate, ProductController.updateProduct);
router.delete("/:id", authenticate, ProductController.deleteProduct);

module.exports = router;
