import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  availability: Boolean,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
