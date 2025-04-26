import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShopContext } from '../context/ShopContext';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    products,
    removeFromCart,
    updateQuantity,
    getCartAmount,
    currency,
    delivery_fee
  } = useShopContext();

  const handleCheckout = () => {
    if (Object.keys(cartItems).length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/placeorder');
  };

  const handleQuantityChange = (itemId, size, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId, size);
    } else {
      updateQuantity(itemId, size, newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {Object.keys(cartItems).length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
            <Link
              to="/collection"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {Object.entries(cartItems).map(([itemId, sizes]) => {
                  const product = products.find(p => p._id === itemId);
                  if (!product) return null;

                  return Object.entries(sizes).map(([size, quantity]) => (
                    <div
                      key={`${itemId}-${size}`}
                      className="flex items-center p-4 border-b last:border-b-0"
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-gray-600">Size: {size}</p>
                        <p className="text-blue-600 font-semibold">
                          {currency} {product.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center">
                        <button
                          onClick={() => handleQuantityChange(itemId, size, quantity - 1)}
                          className="p-2 text-gray-600 hover:text-blue-600"
                        >
                          <FaMinus />
                        </button>
                        <span className="mx-4">{quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(itemId, size, quantity + 1)}
                          className="p-2 text-gray-600 hover:text-blue-600"
                        >
                          <FaPlus />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(itemId, size)}
                        className="ml-4 text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ));
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      {currency} {getCartAmount().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold">
                      {currency} {delivery_fee.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-semibold text-blue-600">
                        {currency} {(getCartAmount() + delivery_fee).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 