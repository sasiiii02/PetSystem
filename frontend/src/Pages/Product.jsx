import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import RelatedProducts from '../component/RelatedProducts';
import { useProductContext } from '../Context/ProductContext';

const Product = () => {
    const { productId } = useParams();
    const { products, addToCart } = useProductContext();
    const product = products.find(p => p.id === parseInt(productId));
    const { currency } = useContext(ShopContext);
    const [productData, setProductData] = useState(null);
    const [image, setImage] = useState('');
    const [size, setSize] = useState('');
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const fetchProductData = () => {
            const foundProduct = products.find((item) => item._id === productId);
            if (foundProduct) {
                setProductData(foundProduct);
                setImage(foundProduct.image[0]);
                console.log("Product found:", foundProduct); // Debug
            } else {
                console.log("Product not found for ID:", productId); // Debug
            }
        };
        fetchProductData();
    }, [productId, products]);

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-auto rounded-lg"
                    />
                </div>
                <div>
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <p className="text-2xl font-semibold mb-4">${product.price}</p>
                    <p className="text-gray-600 mb-6">{product.description}</p>
                    <button
                        onClick={() => addToCart(product)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
            <RelatedProducts currentProductId={productId} />
        </div>
    );
};

export default Product;