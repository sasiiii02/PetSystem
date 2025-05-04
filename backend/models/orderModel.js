import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: Number,
    price: Number,
  }],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  shippingAddress: String,
  createdAt: { type: Date, default: Date.now },
  paymentMethod:{type:String,required:true},
  payment:{type:Boolean,required:true,default:false},
  date:{type:Number,required:true},
});

const orderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default orderModel;