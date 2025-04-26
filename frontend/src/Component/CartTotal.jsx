import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const CartTotal = () => {
  const { getCartAmount } = useContext(ShopContext);
  const totalAmount = getCartAmount();

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${totalAmount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">$0.00</span>
        </div>
        <div className="border-t my-2"></div>
        <div className="flex justify-between">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-lg font-semibold">${totalAmount}</span>
        </div>
      </div>
    </div>
  );
};

export default CartTotal; 