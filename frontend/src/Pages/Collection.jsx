import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../Component/Title';
import ProductItem from '../Component/ProductItem';
import { Link } from 'react-router-dom';
import { useProductContext } from '../Context/ProductContext';
import { FaSpinner } from 'react-icons/fa';

const Collection = () => {
  const { products, loading, error } = useProductContext();
  const shopContext = useContext(ShopContext);
  const search = shopContext?.search || '';
  const showSearch = shopContext?.showSearch || false;
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  const toggleCategory = (e) => {
    if(category.includes(e.target.value)){
      setCategory(prev=>prev.filter(item=>item!==e.target.value));
    }
    else{
      setCategory(prev=>[...prev,e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if(subCategory.includes(e.target.value)){
      setSubCategory(prev=>prev.filter(item=>item!==e.target.value));
    }
    else{
      setSubCategory(prev=>[...prev,e.target.value]);
    }
  };

  const applyFilter = () => {
    if (!products) return;
    
    let productsCopy = [...products];

    if(showSearch && search){
      productsCopy = productsCopy.filter(item=>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if(category.length>0){
      productsCopy = productsCopy.filter(item=>category.includes(item.category));
    }
    if(subCategory.length>0){
      productsCopy = productsCopy.filter(item=>subCategory.includes(item.subCategory));
    }

    setFilterProducts(productsCopy);
  };

  const sortProducts = () => {
    if (!filterProducts.length) return;
    
    let fpCopy = [...filterProducts];

    switch(sortType){
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b)=>a.price-b.price));
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b)=>b.price-a.price));
        break;

      default:
        applyFilter();
        break;
    }
  };

  useEffect(()=>{
    applyFilter();
  },[category, subCategory, search, showSearch, products]);

  useEffect(()=>{
    sortProducts();
  },[sortType]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600 text-xl mb-4">Error loading products</p>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="text-2xl mb-8">
          <Title text1="OUR" text2="COLLECTION" />
        </div>
        
        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 border-t">
          {/* Sidebar Filter Section */}
          <div className="min-w-60">
            <p onClick={() => setShowFilter(!showFilter)} className="my-2 mt-8 text-xl flex items-center cursor-pointer gap-2">
              FILTERS
            </p>

            {/* Category Filter */}
            <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden sm:block'}`}>
              <p className="mb-3 text-sm font-medium">CATEGORIES</p>
              <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                <label className="flex gap-2">
                  <input className="w-4" type="checkbox" value="Dog" onChange={toggleCategory} /> DOG
                </label>
                <label className="flex gap-2">
                  <input className="w-4" type="checkbox" value="Cat" onChange={toggleCategory} /> CAT
                </label>
                <label className="flex gap-2">
                  <input className="w-4" type="checkbox" value="Other" onChange={toggleCategory}/> OTHER
                </label>
              </div>
            </div>

            {/* Type Filter */}
            <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden sm:block'}`}>
              <p className="mb-3 text-sm font-medium">TYPE</p>
              <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                <label className="flex gap-2">
                  <input className="w-4" type="checkbox" value="Food" onChange={toggleSubCategory}/> FOOD
                </label>
                <label className="flex gap-2">
                  <input className="w-4" type="checkbox" value="Vitamin" onChange={toggleSubCategory}/> VITAMIN
                </label>
                <label className="flex gap-2">
                  <input className="w-4" type="checkbox" value="Medicine" onChange={toggleSubCategory} /> MEDICINE
                </label>
                <label className="flex gap-2">
                  <input className="w-4" type="checkbox" value="Other" onChange={toggleSubCategory} /> OTHER ACCESSORIES
                </label>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            <div className="flex justify-between items-center text-base sm:text-2xl mb-4 mt-5">
              <select 
                onChange={(e)=>setSortType(e.target.value)} 
                className="border-2 border-gray-300 text-sm px-2 py-1 rounded-md"
              >
                <option value="relevant">Sort by: Relevant</option>
                <option value="low-high">Sort by: Low to High</option>
                <option value="high-low">Sort by: High to Low</option>
              </select>
              <span className="text-sm text-gray-500">
                {filterProducts.length} products found
              </span>
            </div>

            {filterProducts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-600">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filterProducts.map((item) => (
                  <ProductItem key={item._id} product={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
