import Order from '../models/Order.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

// POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('Order must contain at least one item');
  }

  // Reserve stock atomically so concurrent orders cannot oversell a product.
  const reservedItems = [];

  try {
    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        res.status(400);
        throw new Error('Item quantity must be at least 1');
      }

      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.product}`);
      }

      const update = await Product.updateOne(
        { _id: product._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
      if (update.modifiedCount !== 1) {
        res.status(400);
        throw new Error(`Not enough stock for ${product.name}`);
      }

      reservedItems.push({ product: product._id, quantity: item.quantity });
    }

    // TODO: total is currently calculated from prices sent by the client.
    // This should use prices from the database instead (see issue tracker).
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (err) {
    await Promise.all(
      reservedItems.map(({ product, quantity }) =>
        Product.updateOne({ _id: product }, { $inc: { stock: quantity } })
      )
    );
    throw err;
  }
});

// GET /api/orders/mine
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// GET /api/orders/:id
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isOwner = order.user._id.equals(req.user._id);
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not allowed to view this order');
  }
  res.json(order);
});

// GET /api/orders (admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

// PATCH /api/orders/:id/status (admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.status = req.body.status;
  await order.save();
  res.json(order);
});
