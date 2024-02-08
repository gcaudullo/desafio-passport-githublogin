import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: { type: String, required: true, unique: true, index: true },  //index: true (puede ayudar al hacer busquedas)
  password: { type: String },
  age: { type: Number, required: false },
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  role: { type: String, required: false, default: 'user', enum: ['user', 'admin'] },
}, { timestamps: true });

export default mongoose.model('User', userSchema);