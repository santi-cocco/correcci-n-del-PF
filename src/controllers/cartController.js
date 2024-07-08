import Cart from "../Dao/models/cart.js";

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    res.json({ status: 'success', message: 'Product removed from cart' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findById(cid);
    const product = cart.products.find(p => p.product.toString() === pid);
    if (product) {
      product.quantity = quantity;
      await cart.save();
      res.json({ status: 'success', cart });
    } else {
      res.status(404).json({ status: 'error', message: 'Product not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product');
    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
