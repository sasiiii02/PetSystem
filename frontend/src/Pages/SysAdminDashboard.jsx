import React,{ useEffect } from 'react';
import { FaUserPlus, FaUsers, FaUserCog ,FaPaw} from 'react-icons/fa';
import { Link,useNavigate } from "react-router-dom";

function SysAdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (!adminToken) {
      navigate('/Login');
    }
  }, [navigate]);
  return (
    
    <div  className="absolute inset-0 bg-[url('./assets/sadash.jpg')] opacity-90 bg-cover bg-center flex items-center justify-center">
      <div className="bg-gradient-to-br from-[#F4E4D8] to-[#E6D5C1] opacity-90 transform transition-transform duration-600 p-8 rounded-lg shadow-xl w-4/5">
        <h1 className="text-3xl font-bold text-center text-[#4E2D21] mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="bg-[#D88C6D] text-white p-6 rounded-lg rounded-lg transform scale-90 hover:scale-100 transition-transform duration-300 shadow-md flex flex-col items-center hover:bg-[#4E2D21] transition">
            <FaUserPlus className="text-4xl mb-4" />
            <h2 className="text-xl font-semibold mb-2">Add Staff Member</h2>
            <Link to = '/ProfessionalRegistration'>
            <button className="bg-white text-[#D88C6D] px-4 py-2 rounded-lg hover:bg-gray-200 transition">Go to Add</button></Link>
          </div>

          <div className="bg-[#D88C6D] text-white p-6 rounded-lg rounded-lg transform scale-90 hover:scale-100 transition-transform duration-300 shadow-md flex flex-col items-center hover:bg-[#4E2D21] transition">
            <FaUsers className="text-4xl mb-4" />
            <h2 className="text-xl font-semibold mb-2">Manage Staff Members</h2>
            <Link to = '/ViewAllProfessionals'>
            <button className="bg-white text-[#D88C6D] px-4 py-2 rounded-lg hover:bg-gray-200 transition">View Staff</button></Link>
          </div>

          <div className="bg-[#D88C6D] text-white p-6 rounded-lg rounded-lg transform scale-90 hover:scale-100 transition-transform duration-300 shadow-md flex flex-col items-center hover:bg-[#4E2D21] transition">
            <FaUserCog className="text-4xl mb-4" />
            <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
            <Link to = '/UsersList'>
            <button className="bg-white text-[#D88C6D] px-4 py-2 rounded-lg hover:bg-gray-200 transition">View Users</button></Link>
          </div>
          <div className="bg-[#D88C6D] text-white p-6 rounded-lg rounded-lg transform scale-90 hover:scale-100 transition-transform duration-300 shadow-md flex flex-col items-center hover:bg-[#4E2D21] transition">
            <FaPaw className="text-4xl mb-4" />
            <h2 className="text-xl font-semibold mb-2">Admin Register</h2>
            <Link to = '/AdminRegister'>
            <button className="bg-white text-[#D88C6D] px-4 py-2 rounded-lg hover:bg-gray-200 transition">View Pets</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SysAdminDashboard;
