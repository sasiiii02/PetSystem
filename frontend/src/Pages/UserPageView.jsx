'use client'

import React from "react";
import HeroSection1 from "../Component/HeroSection";
import Grid from "../Component/BentoGrid";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

const UserPageView = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-gradient-to-br from-[#F4E4D8] to-[#E6D5C1] py-4 mt-23">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-end">
            <button
              onClick={() => navigate('/pet-register-dashboard')}
              className="bg-[#D08860] text-white px-6 py-3 rounded-xl hover:bg-[#80533b] transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <FileText size={20} />
              My Adoption Dashboard
            </button>
          </div>
        </div>
      </div>
      <HeroSection1 />
    </>
  );
};

export default UserPageView;
