import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Create a new order
export const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items.');
    }

    // Check that every product exists and has enough stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.name}`);
      }

      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(
          `Not enough stock for ${product.name}. Available: ${product.stock}`
        );
      }
    }

    // Create the order
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice,
    });

    // Reduce product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: -item.quantity,
          },
        }
      );
    }

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Get logged-in user's orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};