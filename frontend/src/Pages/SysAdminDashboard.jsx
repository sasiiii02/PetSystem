import React, { useEffect, useState } from 'react';
import { UserPlus, Users, UserCog, Shield, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SysAdminDashboard = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (!adminToken) {
      navigate('/StaffLogin');
    } else {
      setAdminName(admin?.name || 'Admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/StaffLogin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4E4D8] to-[#E6D5C1] flex flex-col items-center justify-center p-6 sm:p-12">
      {/* Header with Logout */}
      <div className="w-full max-w-7xl flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#4E2D21]">
          Welcome, {adminName}
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-[#D88C6D] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#4E2D21] transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-7xl bg-white shadow-2xl rounded-3xl p-8 sm:p-12"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#4E2D21] mb-8 sm:mb-12">
          System Admin Dashboard
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Add Staff Member */}
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)' }}
            className="bg-white border-2 border-amber-200 rounded-xl p-6 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-all duration-300"
          >
            <UserPlus className="text-[#D88C6D] mb-4" size={40} />
            <h2 className="text-lg sm:text-xl font-semibold text-[#4E2D21] mb-4">Add Staff Member</h2>
            <Link to="/ProfessionalRegistration">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#D88C6D] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#4E2D21] transition-colors"
              >
                Go to Add
              </motion.button>
            </Link>
          </motion.div>

          {/* Manage Staff Members */}
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)' }}
            className="bg-white border-2 border-amber-200 rounded-xl p-6 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Users className="text-[#D88C6D] mb-4" size={40} />
            <h2 className="text-lg sm:text-xl font-semibold text-[#4E2D21] mb-4">Manage Staff Members</h2>
            <Link to="/ProfessionalsList">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#D88C6D] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#4E2D21] transition-colors"
              >
                View Staff
              </motion.button>
            </Link>
          </motion.div>

          {/* Manage Users */}
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)' }}
            className="bg-white border-2 border-amber-200 rounded-xl p-6 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-all duration-300"
          >
            <UserCog className="text-[#D88C6D] mb-4" size={40} />
            <h2 className="text-lg sm:text-xl font-semibold text-[#4E2D21] mb-4">Manage Users</h2>
            <Link to="/UsersList">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#D88C6D] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#4E2D21] transition-colors"
              >
                View Users
              </motion.button>
            </Link>
          </motion.div>

          {/* Admin Register */}
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)' }}
            className="bg-white border-2 border-amber-200 rounded-xl p-6 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Shield className="text-[#D88C6D] mb-4" size={40} />
            <h2 className="text-lg sm:text-xl font-semibold text-[#4E2D21] mb-4">Admin Register</h2>
            <Link to="/AdminRegister">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#D88C6D] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#4E2D21] transition-colors"
              >
                Go to Add
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SysAdminDashboard;