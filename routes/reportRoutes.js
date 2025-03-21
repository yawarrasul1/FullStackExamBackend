const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/reportController");
const { authenticate } = require("../middleware/authMiddleware");

// Sales report
router.get("/sales", authenticate, ReportController.getSalesReport);

// Top products report
router.get("/top-products", authenticate, ReportController.getTopProducts);

// User orders summary report
router.get("/user-summary", authenticate, ReportController.getUserOrdersSummary);

// Inventory report (low stock)
router.get("/inventory", authenticate, ReportController.getInventoryReport);

module.exports = router;
