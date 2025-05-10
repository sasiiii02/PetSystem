import React from 'react';
import { assets } from '../assets/assets';

const StoreAdminNavbar = ({ setToken }) => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <div>
      <img className="w-[max(10%,80px)]" src={assets.logo} alt="" />
      </div>
      <div >
  <h1 className="text-3xl font-bold text-gray-800" style={{ letterSpacing: '30px' }}>Fluffy Care</h1>
  <h2 className="text-xl font-semibold text-gray-600 mt-1" style={{ letterSpacing: '10px' }}>Admin Panel</h2>
</div>
      
      <button
        onClick={() => setToken('')}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default StoreAdminNavbar;