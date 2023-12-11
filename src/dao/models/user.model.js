import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  first_name: {type: String, required: true },
  last_name: {type: String },
  email: {type: String, required: true, unique: true },
  password: {type: String },
  age: {type: Number, required: false },
  role: { type: String, default: 'user' },
}, {timestamps: true});

export default mongoose.model('User', userSchema);