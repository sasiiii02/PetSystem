'use client'
import React, { useRef } from 'react'
import { Heart, PawPrint, Shield } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Right_side from '../assets/Dog1.jpeg'
import Grid from './BentoGrid'

export default function HeroSection() {
  const gridSectionRef = useRef(null);
  const navigate = useNavigate();

  const scrollToGrid = () => {
    gridSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      <div className="bg-gradient-to-br from-[#FFF5E6] via-[#FCF0E4] to-[#F5EFEA] min-h-screen flex items-center overflow-hidden relative pt-30 pb-15">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 w-96 h-96 bg-[#D08860]/10 rounded-full blur-3xl animate-pulse"/>
          <div className="absolute right-1/4 top-1/3 w-72 h-72 bg-[#B3704D]/10 rounded-full blur-2xl animate-pulse delay-700"/>
          <div className="absolute -right-20 -bottom-20 w-[500px] h-[500px] bg-[#D08860]/10 rounded-full blur-3xl animate-pulse delay-1000"/>
          <div className="absolute left-1/3 bottom-1/4 w-64 h-64 bg-[#B3704D]/10 rounded-full blur-2xl animate-pulse delay-500"/>
        </div>

        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#D08860]/20 to-[#B3704D]/20 rounded-3xl transform rotate-6 scale-105 transition-transform duration-300 group-hover:rotate-4"/>
            <div className="rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(211,136,96,0.3)] relative">
              <img 
                src={Right_side}
                alt="Adorable pet waiting for adoption" 
                className="w-full h-150 object-top object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
            </div>
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg transform group-hover:scale-110 transition-all duration-300">
              <Heart className="text-[#D08860] w-10 h-10 animate-pulse" fill="#D08860" fillOpacity={0.3} />
            </div>
          </div>

          <div className="space-y-8 transform transition-all duration-300 hover:translate-x-2">
            <div className="overflow-hidden">
              <h1 className="text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Open Your{' '}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D08860] to-[#B3704D] animate-gradient">Heart</span>
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#D08860] to-[#B3704D] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"/>
                </span>
                <br />
                Open Your{' '}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D08860] to-[#B3704D] animate-gradient">Home</span>
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#D08860] to-[#B3704D] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"/>
                </span>
              </h1>
            
              <p className="text-xl text-gray-700 leading-relaxed font-medium">
                Every pet deserves a second chance. By choosing adoption, you're not just rescuing a furry friend—you're gaining a loyal companion who will fill your life with unconditional love and joy.
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                { icon: PawPrint, text: "Rescue a furry friend in need" },
                { icon: Shield, text: "Create a bond that lasts a lifetime" },
                { icon: Heart, text: "Make a difference, one paw at a time" }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-4 bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-sm hover:shadow-lg 
                           transform hover:translate-x-2 transition-all duration-300 group border border-transparent
                           hover:border-[#D08860]/20"
                >
                  <div className="bg-gradient-to-br from-[#D08860]/10 to-[#B3704D]/10 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="text-[#D08860] w-7 h-7 flex-shrink-0" />
                  </div>
                  <span className="text-lg text-gray-800 font-medium">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleAddPetClick}
                className="rounded-2xl bg-gradient-to-r from-[#D08860] to-[#B3704D] p-1 shadow-lg hover:shadow-xl 
                         transform hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
              >
                <div className="px-6 py-3 rounded-xl flex items-center justify-center gap-2 
                              bg-gradient-to-r from-[#D08860] to-[#B3704D] group-hover:bg-transparent
                              transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-white font-semibold">Add Your Pet For Adoption</span>
                </div>
              </button>

              <Link 
                to="/info_adoptable_pet"
                className="rounded-2xl bg-gradient-to-r from-[#D08860] to-[#B3704D] p-1 shadow-lg hover:shadow-xl 
                         transform hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
              >
                <div className="px-6 py-3 rounded-xl flex items-center justify-center gap-2 
                              bg-gradient-to-r from-[#D08860] to-[#B3704D] group-hover:bg-transparent
                              transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-white font-semibold">Find Your Perfect Companion</span>
                </div>
              </Link>
              
              <button 
                onClick={scrollToGrid}
                className="rounded-2xl border-2 border-[#D08860] px-6 py-3 text-[#D08860] font-semibold
                         relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#D08860] to-[#B3704D] transform -translate-x-full 
                               group-hover:translate-x-0 transition-transform duration-300"/>
                <div className="relative flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-y-1 transition-transform group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <span className="group-hover:text-white transition-colors duration-300">Learn More</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div ref={gridSectionRef}>
        <Grid />
      </div>
    </>
  )
}