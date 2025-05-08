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
      <div className="bg-amber-50 min-h-screen pt-32 px-4 md:px-16">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">My <span className="text-amber-800">Orders</span></h1>
        </div>
        <p className="text-center text-gray-500 mt-4">Loading orders...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-amber-50 min-h-screen pt-32 px-4 md:px-16">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">My <span className="text-amber-800">Orders</span></h1>
        </div>
        <p className="text-center text-gray-500 mt-4">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen pt-32 px-4 md:px-16">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">My <span className="text-amber-800">Orders</span></h1>
      </div>

      <div>
        {orders.map((order) => (
          <div
            key={order._id}
            className="py-6 mb-6 bg-white rounded-xl shadow-md border border-amber-200 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            {/* Order Items */}
            <div className="flex flex-col gap-4">
              {order.products.map((product, productIndex) => (
                <div key={productIndex} className="flex items-start gap-6">
                  {/* Product Image */}
                  <div className="flex items-start gap-6 text-sm">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-16 sm:w-20 rounded-lg border border-amber-200" />
                    ) : (
                      <p className="text-gray-500">No Image</p>
                    )}
                  </div>

                  {/* Product Details */}
                  <div>
                    <p className="sm:text-base font-semibold text-amber-900">{product.name}</p>
                    <div className="flex items-center gap-3 mt-2 text-base text-amber-700">
                      <p className="text-lg text-[#D08860] font-bold">{currency}{product.price}</p>
                      <p>Quantity: {product.quantity}</p>
                      <p className="px-2 bg-amber-100 text-amber-900 rounded-full border border-amber-200 font-medium">Size: {product.size}</p>
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
              <div className="text-sm text-amber-700">
                <p>Order Date: {new Date(order.date).toLocaleDateString()}</p>
                <p>Total: <span className="text-[#D08860] font-bold">{currency}{order.totalPrice}</span></p>
                <p>Payment Method: {order.paymentMethod}</p>
              </div>
              <button 
                onClick={() => handleTrackOrder(order)}
                className="border border-amber-200 px-4 py-2 text-sm font-medium rounded-full self-end hover:bg-amber-100 transition-all duration-200 mr-10"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Tracking Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-lg border border-amber-200">
            <h3 className="text-2xl font-bold mb-4 text-amber-900">Order Tracking</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <p className={`w-2 h-2 rounded-full ${getStatusColor(selectedOrder.status)}`}></p>
                <p className="text-lg text-amber-900">Current Status: {selectedOrder.status || 'Pending'}</p>
              </div>
              <p className="text-amber-700">Order ID: {selectedOrder._id}</p>
              <p className="text-amber-700">Order Date: {new Date(selectedOrder.date).toLocaleDateString()}</p>
              <div className="mt-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full bg-[#D08860] hover:bg-[#B3714E] text-white py-2 rounded-full font-bold shadow-md transition-all duration-200"
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
