import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const backendUrl = 'http://localhost:5000';
const currency = '$. ';

const StoreAdminList = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stockInputs, setStockInputs] = useState({});

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching product list:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to fetch products');
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Remove product error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to remove product');
    }
  };

  const handleStockInput = (id, value) => {
    setStockInputs(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const increaseQuantity = async (id, currentQuantity) => {
    if (loading) return;
    const quantityToAdd = Number(stockInputs[id]) || 1;
    
    if (quantityToAdd <= 0) {
      toast.error('Please enter a positive number');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/product/update-quantity`,
        { 
          id, 
          quantity: currentQuantity + quantityToAdd 
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.data.success) {
        toast.success('Quantity increased successfully');
        setStockInputs(prev => ({ ...prev, [id]: '' })); // Clear input after success
        await fetchList();
      } else {
        toast.error(response.data.message || 'Failed to update quantity');
      }
    } catch (error) {
      console.error("Increase quantity error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to increase quantity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Quantity</b>
          <b className="text-center">Action</b>
          <b className="text-center">Stock</b>
        </div>
        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            <img className="w-12" src={item.image[0]} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <p className={`text-center ${item.quantity <= 5 ? 'text-red-600 font-medium' : ''}`}>
              {item.quantity}
            </p>
            <div className="flex justify-center items-center gap-2">
              <p
                onClick={() => removeProduct(item._id)}
                className="cursor-pointer text-lg hover:text-red-600 transition-colors"
              >
                X
              </p>
            </div>
            <div className="flex justify-center items-center gap-2">
              <input
                type="number"
                min="1"
                value={stockInputs[item._id] || ''}
                onChange={(e) => handleStockInput(item._id, e.target.value)}
                className="w-16 px-2 py-1 border rounded text-center"
                placeholder="Qty"
              />
              <button
                onClick={() => increaseQuantity(item._id, item.quantity)}
                disabled={loading}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  loading 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {loading ? 'Updating...' : '+ Add'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default StoreAdminList;