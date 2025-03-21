const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get user’s cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate("items.product");
    if (!cart) return res.status(404).json({ message: "Cart is empty" });

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

// Update item quantity in cart
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(item => item.product.toString() === productId);

    if (!item) return res.status(404).json({ error: "Item not in cart" });

    item.quantity = quantity;

    await cart.save();
    res.json({ message: "Cart updated", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update cart" });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
      const { productId } = req.params;
  
      // Ensure the cart exists for this user
      const cart = await Cart.findOne({ user: req.user.userId });
  
      if (!cart) return res.status(404).json({ error: "Cart not found" });
  
      // Ensure product comparison works reliably
      const initialLength = cart.items.length;
  
      cart.items = cart.items.filter(
        (item) => 
            // {   console.log( '**',item.product.toString());
            //     console.log(productId);
            // }
            
         item.product.toString() !== productId
      );
      
  
      // Check if the item was actually removed
      if (cart.items.length === initialLength) {
        return res.status(404).json({ error: "Item not found in cart" });
      }
  
      // Force Mongoose to detect changes
      cart.markModified('items');
      await cart.save();
  
      res.json({ message: "Item removed from cart", cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to remove item from cart" });
    }
  };
  

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.json({ message: "Cart cleared", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
};
