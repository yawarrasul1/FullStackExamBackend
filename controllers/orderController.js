const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Place a new order
exports.placeOrder = async (req, res) => {
    try {
      const { items, total,  userDetails } = req.body;
  
      const userId = req.user.userId;
  
      if (!items || items.length === 0) return res.status(400).json({ error: 'Cart is empty' });
  
      const order = new Order({
        user: userId,
        items,
        totalPrice : total,
        shippingAddress : userDetails.shippingAddress,
        paymentMethod : userDetails.paymentMethod
      });
  
      await order.save();
      res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to place order' });
    }
  };

// Get order history for user
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }) .populate('items.product').sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get order details
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
};

// Cancel an order (if it's still in processing)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ error: "Order not found" });

    
    if (order.status !== "Pending") {
      return res.status(400).json({ error: "Order cannot be canceled" });
    }

    order.status = "Canceled";
    await order.save();

    res.json({ message: "Order canceled successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to cancel order" });
  }
};
