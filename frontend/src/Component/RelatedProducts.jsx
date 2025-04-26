import React from 'react';
import { useProductContext } from '../Context/ProductContext';
import ProductItem from '../Component/ProductItem';

const RelatedProducts = ({ currentProductId }) => {
  const { products } = useProductContext();
  const currentProduct = products.find(p => p.id === parseInt(currentProductId));
  
  if (!currentProduct) return null;

  const relatedProducts = products
    .filter(p => 
      p.id !== currentProduct.id && 
      (p.category === currentProduct.category || p.subCategory === currentProduct.subCategory)
    )
    .slice(0, 4);

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map(product => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
