'use client'

import React from "react";
import HeroSection1 from "../Component/HeroSection";
import Grid from "../Component/BentoGrid";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, Search, ArrowDown } from "lucide-react";

const AdoptionHomePage = () => {
  const navigate = useNavigate();

  const handleAddPetClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/pet-owner-dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-[#FFF5E6] to-[#FFF5E6] py-4 pt-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleAddPetClick}
              className="bg-[#D08860] text-white px-6 py-3 rounded-xl hover:bg-[#80533b] transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Plus size={20} />
              Add Your Pet For Adoption
            </button>
            <button
              onClick={() => navigate('/info_adoptable_pet')}
              className="bg-[#D08860] text-white px-6 py-3 rounded-xl hover:bg-[#80533b] transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Search size={20} />
              Find Your Perfect Companion
            </button>
            <button
              onClick={() => navigate('/pet-register-dashboard')}
              className="bg-[#D08860] text-white px-6 py-3 rounded-xl hover:bg-[#80533b] transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <FileText size={20} />
              My Adoption Dashboard
            </button>
            <button
              onClick={() => document.getElementById('grid-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#D08860] text-white px-6 py-3 rounded-xl hover:bg-[#80533b] transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <ArrowDown size={20} />
              Learn More
            </button>
          </div>
        </div>
      </div>
      <HeroSection1 />
    </>
  );
};

export default AdoptionHomePage;
