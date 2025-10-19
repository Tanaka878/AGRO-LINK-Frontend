import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  id: Number,
  productType: String,
  quantity: Number,
  pricePerUnit: Number,
  totalPrice: Number,
  farmerEmail: String,
  buyerEmail: String,
  status: String,
  orderTime: String,
  proofOfPaymentUrl: String, // 🆕 proof image URL
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
