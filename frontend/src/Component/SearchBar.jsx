import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);

    return showSearch ? (
        <div className='text-center'> 
            <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2 bg-white bg-opacity-60 backdrop-blur-md mt-0'> {/* ✅ Optional subtle background styling */}
                <input 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    className='flex-1 outline-none bg-transparent text-sm' 
                    type='text' 
                    placeholder='Search' 
                />
                <img 
                    onClick={() => setShowSearch(false)} 
                    className='inline w-3 cursor-pointer' 
                    src={assets.cross_icon} 
                    alt="Close Search" 
                />
            </div>
        </div>
    ) : null;
};

export default SearchBar;
