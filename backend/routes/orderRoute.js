import express from 'express';
import { 
  placeOrderStripe, 
  getUserOrders, 
  getOrderDetails, 
  updateOrderStatus,
  placeOrder,
  verifyStripe
} from '../controllers/orderController.js';
import authUser from '../middleware/auth.js';


const orderRouter = express.Router();

// Admin routes


// User routes
orderRouter.post('/user', authUser, getUserOrders);
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/cod', authUser, placeOrder);
orderRouter.post('/details', authUser, getOrderDetails);

orderRouter.post('/place',authUser,getUserOrders);

orderRouter.get('/:orderId', authUser, getOrderDetails);
orderRouter.put('/:orderId/status', authUser, updateOrderStatus);


orderRouter.post('/verify',authUser,verifyStripe);
export default orderRouter; 