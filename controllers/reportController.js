const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// Sales report (total revenue & orders within a date range)
exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const sales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    res.json(sales[0] || { totalRevenue: 0, totalOrders: 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch sales report" });
  }
};

// Top-selling products report
exports.getTopProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          price: "$product.price",
          totalSold: 1,
        },
      },
    ]);

    res.json(topProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch top products" });
  }
};

// User orders summary report
exports.getUserOrdersSummary = async (req, res) => {
  try {
    const userSummary = await Order.aggregate([
      {
        $group: {
          _id: "$user",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalPrice" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          username: "$user.username",
          email: "$user.email",
          totalOrders: 1,
          totalSpent: 1,
        },
      },
      { $sort: { totalSpent: -1 } },
    ]);

    res.json(userSummary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user orders summary" });
  }
};

// Inventory report (low stock alert)
exports.getInventoryReport = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({ stock: { $lt: 5 } }).select("name stock");

    res.json(lowStockProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch inventory report" });
  }
};
