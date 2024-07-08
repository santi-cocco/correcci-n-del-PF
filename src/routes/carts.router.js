import { Router } from 'express';
import { 
  deleteProductFromCart, 
  updateCart, 
  updateProductQuantity, 
  clearCart, 
  getCart 
} from '../controllers/cartController.js';

const routerC = Router();

routerC.get('/:cid', getCart);

routerC.post('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await Cart.findById(cid);
    cart.products.push({ product: pid, quantity });
    await cart.save();
    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

routerC.delete('/:cid/products/:pid', deleteProductFromCart);
routerC.put('/:cid', updateCart);
routerC.put('/:cid/products/:pid', updateProductQuantity);
routerC.delete('/:cid', clearCart);

export default routerC;
