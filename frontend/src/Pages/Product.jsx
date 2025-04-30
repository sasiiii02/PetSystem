import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../Component/RelatedProducts';

const Product = () => {
    const { ProductId } = useParams();
    const { products, currency ,addToCart } = useContext(ShopContext);
    const [ProductData, setProductData] = useState(null);
    const [image, setImage] = useState('');
    const [size, setSize] = useState('');
    const [activeTab, setActiveTab] = useState('description'); // Track which tab is active

    useEffect(() => {
        const fetchProductData = () => {
            const foundProduct = products.find((item) => item._id.toString() === ProductId);
            if (foundProduct) {
                setProductData(foundProduct);
                setImage(foundProduct.image[0]);
                return null;
            }
        };
        fetchProductData();
    }, [ProductId, products]);

    if (!ProductData) return <div className='opacity-0'></div>;

    return (
        <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 mt-20 ml-20 mr-10'>
            <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
                {/* Image Section */}
                <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
                    <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
                        {ProductData.image.map((item, index) => (
                            <img
                                onClick={() => setImage(item)}
                                src={item}
                                key={index}
                                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer'
                                alt={`Product thumbnail ${index}`}
                            />
                        ))}
                    </div>
                    <div className='w-full sm:w-[80%]'>
                        <img className='w-full h-auto' src={image} alt='Selected product' />
                    </div>
                </div>

                {/* Product Details */}
                <div className='flex-1'>
                    <h1 className='font-medium text-2xl'>{ProductData.name}</h1>
                    
                    {/* Star Ratings */}
                    <div className='flex items-center gap-1 mt-2'>
                        <img src={assets.star_icon} alt='' className='w-3.5'/>
                        <img src={assets.star_icon} alt='' className='w-3.5'/>
                        <img src={assets.star_icon} alt='' className='w-3.5'/>
                        <img src={assets.star_icon} alt='' className='w-3.5'/>
                        <img src={assets.star_dull_icon} alt='' className='w-3.5'/>
                        <p className='pl-2'>(122)</p>         
                    </div>

                    <p className='mt-5 text-3xl font-medium'>{currency}{ProductData.price}</p>
                    <p className='mt-5 text-gray-500 md:w-4/5'>{ProductData.description}</p>

                    {/* Size Selection */}
                    <div className='flex flex-col gap-4 my-8'>
                        <p>Select Size</p>
                        <div className='flex gap-2'>
                            {ProductData.sizes?.map((item, index) => (
                                <button
                                    onClick={() => setSize(item)}
                                    className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`}
                                    key={index}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button onClick={()=>addToCart(ProductData._id,size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
                    <hr className='mt-8 sm:w-4/5'/> 
                    <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
                        <p>✅ 100% Original Product</p>
                        <p>💰 Cash on delivery available</p>
                        <p>🔄 Easy return & exchange policy</p>
                    </div>        
                </div>  
            </div>

            {/* Description & Reviews Section */}
            <div className='mt-20'>
                <div className='flex'>
                    <button 
                        className={`border px-5 py-3 text-sm ${activeTab === 'description' ? 'bg-gray-100 font-bold' : ''}`}
                        onClick={() => setActiveTab('description')}
                    >
                        Description
                    </button>
                    <button 
                        className={`border px-5 py-3 text-sm ${activeTab === 'reviews' ? 'bg-gray-100 font-bold' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews (122)
                    </button>
                </div>  

                {/* Show Content Based on Active Tab */}
                {activeTab === 'description' && (
                    <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores exercitationem voluptate, quo alias, ea inventore molestias corporis officia doloribus modi fuga laborum consectetur molestiae architecto dolorem! Placeat deserunt voluptatem sit.</p>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore suscipit blanditiis pariatur molestias. Porro quas repellendus, in sequi obcaecati laboriosam tempora veritatis voluptatem nesciunt reiciendis repudiandae ipsum est provident eos?</p>
                    </div>  
                )}

                {activeTab === 'reviews' && (
                    <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
                        <p>⭐️⭐️⭐️⭐️☆ - "Great product, high quality!" - <b>John D.</b></p>
                        <p>⭐️⭐️⭐️⭐️⭐️ - "Exactly what I was looking for!" - <b>Sarah L.</b></p>
                        <p>⭐️⭐️⭐️☆☆ - "It’s okay, could be better." - <b>Mark T.</b></p>
                    </div>  
                )}
            </div>

            {/* Related Products */}
            <RelatedProducts category={ProductData?.category} subCategory={ProductData?.subCategory} />
        </div>
    );
};

export default Product;
