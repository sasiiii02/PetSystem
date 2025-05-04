import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import MarketplaceTitle from '../Component/MarketplaceTitle';

const Orders = () => {
  const { products, currency } = useContext(ShopContext);

  // Check if products is undefined or not an array to prevent runtime errors
  if (!products || !Array.isArray(products)) {
    return <p className="text-center text-red-500">No orders available.</p>;
  }

  return (
    <div className="border-t pt-16 mt-10 ml-10 mr-10 mb-10" >
      <div className="text-2xl">
        <MarketplaceTitle text1="MY" text2="ORDERS" />
      </div>

      <div>
        {products.slice(1, 4).map((item, index) => (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            {/* Product Image */}
            <div className="flex items-start gap-6 text-sm">
              {item.image && item.image.length > 0 ? (
                <img src={item.image[0]} alt="Product" className="w-16 sm:w-20" />
              ) : (
                <p className="text-gray-500">No Image</p>
              )}
            </div>

            {/* Product Details */}
            <div>
              <p className="sm:text-base font-medium">{item.Name}</p>
              <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                <p className="text-lg">{currency}{item.price}</p>
                <p>Quantity</p>
                <p>Size</p>
              </div>
              <p>
                Date: <span className="text-gray-400">25, June</span>
              </p>
            </div>

            {/* Order Status and Track Order Button */}
            <div className="md:w-1/2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <p className="w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">Ready To Ship</p>
              </div>
              <button className="border px-4 py-2 text-sm font-medium rounded-sm">
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
