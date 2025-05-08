import React from 'react'
import { assets } from '../assets/assets'

const StoreAdminSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'add', label: 'Add Items', icon: assets.add_icon },
    { id: 'list', label: 'List Items', icon: assets.order_icon },
    { id: 'orders', label: 'Orders', icon: assets.order_icon },
  ];

  return (
    <div className='w-[18%] min-h-screen border-r-2 bg-white shadow-sm'>
      <div className='flex flex-col h-full'>
        <div className='p-6 border-b'>
          <h2 className='text-xl font-semibold text-amber-950'>Store Admin</h2>
        </div>
        
        <div className='flex-1 flex flex-col gap-2 p-4'>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <img className='w-5 h-5' src={item.icon} alt="" />
              <p className='hidden md:block'>{item.label}</p>
            </button>
          ))}
        </div>

        <div className='p-4 border-t'>
          <button
            onClick={onLogout}
            className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors'
          >
            <img className='w-5 h-5' src={assets.logout_icon || assets.order_icon} alt="Logout" />
            <p className='hidden md:block'>Logout</p>
          </button>
        </div>
        </div>
    </div>
  )
}

export default StoreAdminSidebar