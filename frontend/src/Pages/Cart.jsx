import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MarketplaceTitle from '../Component/MarketplaceTitle';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import CartTotal from '../Component/CartTotal';
import { toast } from 'react-toastify';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, checkAuth } = useContext(ShopContext);
  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    console.log('Cart data:', tempData);
    setCartData(tempData);
  }, [cartItems]);

  const handleCheckout = () => {
    console.log('Checkout button clicked');
    const token = localStorage.getItem('petOwnerToken');
    console.log('Token in handleCheckout:', token);
    
    if (token) {
      console.log('User is logged in, navigating to placeOrder');
      navigate('/placeOrder', { replace: true });
    } else {
      console.log('User is not logged in, navigating to login');
      toast.error('Please login to continue');
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className='border-t pt-14 ml-10 mr-10'>
      <div className='text-2xl mb-3'>
        <MarketplaceTitle text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id);

          return (
            <div
              key={index}
              className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
            >
              <div className='flex items-start gap-6'>
                {productData && productData.image && productData.image[0] ? (
                  <img
                    src={productData.image[0]}
                    alt={productData.name}
                    className='w-16 sm:w-20'
                    onError={() => console.error('Failed to load image:', productData.image[0])}
                  />
                ) : (
                  <div className='w-16 sm:w-20 h-16 sm:h-20 bg-gray-200 flex items-center justify-center'>
                    <span>No Image</span>
                  </div>
                )}
                <div>
                  <p className='text-xs sm:text-lg font-medium'>{productData?.name || 'Unknown Product'}</p>
                  <div className='flex items-center gap-5 mt-2'>
                    <p>
                      {currency}
                      {productData?.price || 'N/A'}
                    </p>
                    <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                  </div>
                </div>
              </div>
              <input
                onChange={(e) =>
                  e.target.value === '' || e.target.value === '0'
                    ? null
                    : updateQuantity(item._id, item.size, Number(e.target.value))
                }
                className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1'
                type='number'
                min={1}
                defaultValue={item.quantity}
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                src={assets.bin_icon}
                alt='delete'
                className='w-4 mr-4 sm:w-5 cursor-pointer'
              />
            </div>
          );
        })}
      </div>
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px] ml-10 mr-10'>
          <CartTotal />
          <div className='w-full text-end'>
            <button
              onClick={handleCheckout}
              className='bg-black text-white text-sm my-8 px-8 py-3 cursor-pointer'
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;