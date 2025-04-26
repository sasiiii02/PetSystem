import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShopContext } from '../context/ShopContext';
import { FaShoppingCart, FaStar, FaTag } from 'react-icons/fa';

const ProductItem = ({ product }) => {
  const { addToCart } = useShopContext();
  const [imageError, setImageError] = useState(false);

  // Calculate discount percentage if original price exists
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleImageError = () => {
    setImageError(true);
  };

  // Get image URL from product data
  const getImageUrl = () => {
    if (imageError) {
      // Return a simple colored div as placeholder
      return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
    }

    if (Array.isArray(product.image)) {
      return product.image[0]?.url || product.image[0] || '';
    }

    return product.image?.url || product.image || '';
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product._id, 'default');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <Link to={`/product/${product._id}`} className="block">
        {/* Image Container */}
        <div className="relative">
          <img
            src={getImageUrl()}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={handleImageError}
          />
          {discountPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
              -{discountPercentage}%
            </div>
          )}
          {product.inStock <= 5 && product.inStock > 0 && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
              Only {product.inStock} left!
            </div>
          )}
          {product.inStock === 0 && (
            <div className="absolute top-2 left-2 bg-gray-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4">
          {/* Category and Type */}
          <div className="flex gap-2 mb-2">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
              <FaTag className="mr-1" size={10} /> {product.category}
            </span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {product.subCategory}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Price Section */}
          <div className="flex items-end gap-2 mb-3">
            <span className="text-xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Additional Info */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-1" />
              <span>{product.rating || 4.5}</span>
            </div>
            <div className="flex items-center">
              <FaShoppingCart className="mr-1" />
              <span>{product.sold || 0} sold</span>
            </div>
          </div>
        </div>
      </Link>
      <button
        onClick={handleAddToCart}
        disabled={product.inStock === 0}
        className={`w-full py-2 px-4 text-white font-medium ${
          product.inStock === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {product.inStock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductItem;
