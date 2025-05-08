import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import MarketplaceTitle from '../Component/MarketplaceTitle';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { backendUrl, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('petOwnerToken');
        if (!token) {
          toast.error('Please login to view orders');
          navigate('/login');
          return;
        }

        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenData.userId;

        const response = await axios.post(
          `${backendUrl}/api/order/user`,
          { userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          toast.error(response.data.message || 'Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again');
          navigate('/login');
        } else {
          toast.error(error.response?.data?.message || 'Failed to fetch orders');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [backendUrl, navigate]);

  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-500';
      case 'Processing':
        return 'bg-yellow-500';
      default:
        return 'bg-red-500';
    }
  };

  if (loading) {
    return (
      <div className="border-t pt-16 mt-10 ml-10 mr-10 mb-10">
        <div className="text-2xl">
          <MarketplaceTitle text1="MY" text2="ORDERS" />
        </div>
        <p className="text-center text-gray-500 mt-4">Loading orders...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="border-t pt-16 mt-10 ml-10 mr-10 mb-10">
        <div className="text-2xl">
          <MarketplaceTitle text1="MY" text2="ORDERS" />
        </div>
        <p className="text-center text-gray-500 mt-4">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="border-t pt-16 mt-10 ml-10 mr-10 mb-10">
      <div className="text-2xl">
        <MarketplaceTitle text1="MY" text2="ORDERS" />
      </div>

      <div>
        {orders.map((order) => (
          <div
            key={order._id}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            {/* Order Items */}
            <div className="flex flex-col gap-4">
              {order.products.map((product, productIndex) => (
                <div key={productIndex} className="flex items-start gap-6">
                  {/* Product Image */}
                  <div className="flex items-start gap-6 text-sm">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-16 sm:w-20" />
                    ) : (
                      <p className="text-gray-500">No Image</p>
                    )}
                  </div>

                  {/* Product Details */}
                  <div>
                    <p className="sm:text-base font-medium">{product.name}</p>
                    <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                      <p className="text-lg">{currency}{product.price}</p>
                      <p>Quantity: {product.quantity}</p>
                      <p>Size: {product.size}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Status and Details */}
            <div className="md:w-1/2 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <p className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`}></p>
                <p className="text-sm md:text-base">{order.status || 'Pending'}</p>
              </div>
              <div className="text-sm text-gray-600">
                <p>Order Date: {new Date(order.date).toLocaleDateString()}</p>
                <p>Total: {currency}{order.totalPrice}</p>
                <p>Payment Method: {order.paymentMethod}</p>
              </div>
              <button 
                onClick={() => handleTrackOrder(order)}
                className="border px-4 py-2 text-sm font-medium rounded-sm self-end hover:bg-gray-100"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Tracking Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Order Tracking</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <p className={`w-2 h-2 rounded-full ${getStatusColor(selectedOrder.status)}`}></p>
                <p className="text-lg">Current Status: {selectedOrder.status || 'Pending'}</p>
              </div>
              <p className="text-gray-600">Order ID: {selectedOrder._id}</p>
              <p className="text-gray-600">Order Date: {new Date(selectedOrder.date).toLocaleDateString()}</p>
              <div className="mt-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
