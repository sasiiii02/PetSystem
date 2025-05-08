import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const backendUrl = 'http://localhost:5000';
const currency = '$ ';

const StoreAdminOrders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/order/all`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setOrders(response.data.orders);
        // Extract unique categories from products
        const uniqueCategories = [...new Set(response.data.orders.flatMap(order => 
          order.products.map(product => product.name)
        ))];
        setCategories(['all', ...uniqueCategories]);
        setError(null);
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch orders';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/order/status/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Order status updated successfully');
        fetchOrders(); // Refresh orders after update
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setError('No authentication token found');
      setLoading(false);
    }
  }, [token]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredOrders = selectedCategory === 'all' 
    ? orders 
    : orders.filter(order => 
        order.products.some(product => product.name === selectedCategory)
      );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button 
          onClick={fetchOrders}
          className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800"
        >
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">No orders found</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>
      
      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Item:
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Items' : category}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">Customer</th>
              <th className="py-2 px-4 border-b">Items</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{order._id.slice(-6)}</td>
                <td className="py-2 px-4 border-b">
                  <div>
                    <p className="font-medium">{order.userId?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{order.userId?.email || 'N/A'}</p>
                  </div>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="max-w-xs">
                    {order.products && order.products.map((product, index) => (
                      <div key={index} className="flex justify-between items-center mb-1">
                        <span className="text-sm">{product.name}</span>
                        <span className="text-sm text-gray-600">
                          {product.quantity} x {currency}{product.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-2 px-4 border-b">{currency}{order.totalPrice}</td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={order.status || 'Pending'}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Payment Confirmed' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'Out for Delivery' ? 'bg-indigo-100 text-indigo-800' :
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    } border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Payment Confirmed">Payment Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-2 px-4 border-b">{formatDate(order.date || order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreAdminOrders;