import { useContext, useState, useEffect } from 'react'
import Title from '../Component/Title'
import CartTotal from '../Component/CartTotal'
import { ShopContext } from '../context/ShopContext'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { BACKEND_URL } from '../config'

const PlaceOrder = () => {
  const { cartItems, getCartAmount, setCartItems, token } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [method, setMethod] = useState('COD');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });
  
  // Check if user is logged in
  useEffect(() => {
    if (!token) {
      // Store the current URL to return after login
      localStorage.setItem('returnUrl', location.pathname);
      toast.error("Please login to place an order");
      navigate('/login');
    }
  }, [token, navigate, location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!token) {
      // Store the current URL to return after login
      localStorage.setItem('returnUrl', location.pathname);
      toast.error("Please login to place an order");
      navigate('/login');
      return;
    }
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.street || !formData.city || !formData.state || !formData.zipCode || !formData.country || !formData.phone) {
        toast.error("Please fill in all required fields");
        return;
    }

    try {
        // Prepare cart items for order
        const orderItems = [];
        for (const itemId in cartItems) {
            if (typeof cartItems[itemId] === 'object') {
                for (const size in cartItems[itemId]) {
                    const quantity = cartItems[itemId][size];
                    if (quantity > 0) {
                        orderItems.push({
                            _id: itemId,
                            size: size,
                            quantity: quantity
                        });
                    }
                }
            }
        }

        if (orderItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        const orderData = {
            userId: localStorage.getItem('userId'),
            items: orderItems,
            amount: getCartAmount(),
            address: `${formData.firstName} ${formData.lastName}\n${formData.street}\n${formData.city}, ${formData.state} ${formData.zipCode}\n${formData.country}\nPhone: ${formData.phone}\nEmail: ${formData.email}`
        };

        console.log("Sending order data:", orderData);

        let response;
        if (method === "Stripe") {
            response = await axios.post(`${BACKEND_URL}/api/order/stripe`, orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setCartItems({});
                localStorage.setItem('cartItems', JSON.stringify({}));
                window.location.href = response.data.session_url;
            }
        } else {
            response = await axios.post(`${BACKEND_URL}/api/order/cod`, orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Order response:", response.data);
            
            if (response.data.success) {
                // Clear cart after successful order
                setCartItems({});
                localStorage.setItem('cartItems', JSON.stringify({}));
                
                // Show success message
                toast.success("Order placed successfully!");
                
                // Navigate to orders page
                navigate('/orders');
            } else {
                toast.error(response.data.message || "Failed to place order");
            }
        }
    } catch (error) {
        console.error("Order placement error:", error);
        if (error.response) {
            console.error("Error response:", error.response.data);
            toast.error(error.response.data.message || "Failed to place order");
        } else if (error.request) {
            console.error("Error request:", error.request);
            toast.error("No response from server. Please try again.");
        } else {
            console.error("Error message:", error.message);
            toast.error("An error occurred. Please try again.");
        }
    }
  };

  return (
    <form onSubmit={handlePlaceOrder} className='flex flex-col sm:flex-row	justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t' >
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

        <div className='text-xl sm:text-2xl my-3'>
              <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        <div className='flex gap-3'>
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type='text' 
            name='firstName'
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder='First Name'
            required
          />
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type='text' 
            name='lastName'
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder='Last Name'
            required
          />
        </div>

        <input 
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
          type='email' 
          name='email'
          value={formData.email}
          onChange={handleInputChange}
          placeholder='Email address'
          required
        />
        <input 
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
          type='text' 
          name='street'
          value={formData.street}
          onChange={handleInputChange}
          placeholder='Street'
          required
        />

        <div className='flex gap-3'>
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type='text' 
            name='city'
            value={formData.city}
            onChange={handleInputChange}
            placeholder='City'
            required
          />
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type='text' 
            name='state'
            value={formData.state}
            onChange={handleInputChange}
            placeholder='State'
            required
          />
        </div>

        <div className='flex gap-3'>
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type='number' 
            name='zipCode'
            value={formData.zipCode}
            onChange={handleInputChange}
            placeholder='Zip Code'
            required
          />
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type='text' 
            name='country'
            value={formData.country}
            onChange={handleInputChange}
            placeholder='Country'
            required
          />
        </div>

        <input 
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
          type='tel' 
          name='phone'
          value={formData.phone}
          onChange={handleInputChange}
          placeholder='Phone'
          required
        />

        <div className='mt-8'>
          <div className='mt-8 min-w-80'>
            <CartTotal/>
          </div>

          <div className='mt-12'>
            <Title text1={'PAYMENT'} text2={'METHOD'} />
            <div className='flex gap-3 flex-col lg:flex-row'>
              <div className='flex items-center gap-3 border p-2 px-3 cursor-pointer' onClick={() => setMethod('Stripe')}>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'Stripe' ? 'bg-green-400' : ''}`}></p>
                <span className='text-gray-500 text-sm font-medium mx-4'>Credit Card</span>
              </div>

              <div className='flex items-center gap-3 border p-2 px-3 cursor-pointer' onClick={() => setMethod('COD')}>
                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'COD' ? 'bg-green-400' : ''}`}></p>
                <p className='text-gray-500 text-sm font-medium mx-4'>Cash on Delivery</p>
              </div>
            </div>

            <div className='w-full text-end mt-8'>
              <button type="submit" className='bg-black text-white px-16 py-3 text-sm cursor-pointer'>PLACE ORDER</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
