import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Title from '../Component/Title';

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { token, backendUrl } = useContext(ShopContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${backendUrl}/api/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        toast.error(response.data.message || 'Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId, token, backendUrl, navigate]);

  const getStatusStep = (status) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentStep = steps.indexOf(status?.toLowerCase() || 'pending');
    return currentStep === -1 ? 0 : currentStep;
  };

  if (loading) {
    return <div className="text-center py-8">Loading order details...</div>;
  }

  if (!order) {
    return <div className="text-center py-8">Order not found</div>;
  }

  return (
    <div className="border-t pt-16">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="text-2xl mb-8">
        <Title text1="TRACK" text2="ORDER" />
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <p className="text-gray-600">Order ID: {orderId}</p>
          <p className="text-gray-600">Placed on: {new Date(order.date).toLocaleDateString()}</p>
        </div>

        {/* Order Status Timeline */}
        <div className="relative">
          <div className="absolute left-0 top-5 w-full h-0.5 bg-gray-200"></div>
          <div 
            className="absolute left-0 top-5 h-0.5 bg-blue-500 transition-all duration-500"
            style={{ width: `${(getStatusStep(order.status) / 3) * 100}%` }}
          ></div>
          
          <div className="relative flex justify-between">
            {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, index) => {
              const isCompleted = getStatusStep(order.status) >= index;
              const isCurrent = getStatusStep(order.status) === index;
              
              return (
                <div key={step} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    } ${
                      isCurrent ? 'ring-4 ring-blue-200' : ''
                    }`}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <p className={`mt-2 text-sm ${isCurrent ? 'font-medium text-blue-500' : 'text-gray-500'}`}>
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="mt-12 border rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Order Details</h3>
          <div className="space-y-4">
            {order.products && order.products.map((product, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {product.quantity} {product.size && `| Size: ${product.size}`}
                  </p>
                </div>
                <p className="font-medium">${product.price}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between">
              <p className="font-medium">Total Amount:</p>
              <p className="font-medium">${order.totalPrice}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/orders')} 
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder; 