import mongoose from 'mongoose';

const proofSchema = new mongoose.Schema({
  orderId: { type: Number, required: true, unique: true },
  proofUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Proof || mongoose.model('Proof', proofSchema);