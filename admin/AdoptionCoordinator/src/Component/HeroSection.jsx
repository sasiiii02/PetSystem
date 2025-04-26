'use client'
import React, { useRef } from 'react'
import { Heart, PawPrint, Shield } from 'lucide-react'
import Right_side from '../assets/Dog1.jpeg'
import Grid from './BentoGrid'

export default function HeroSection() {
  // Create a ref for the Grid section
  const gridSectionRef = useRef(null);

  // Function to handle smooth scrolling
  const scrollToGrid = () => {
    gridSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="bg-gradient-to-br from-[#FFF5E6] to-[#F5EFEA] min-h-screen flex items-center overflow-hidden">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative">
          {/* Background Decorative Elements */}
          <div 
            className="absolute -left-20 -top-20 w-72 h-72 bg-[#D08860]/10 rounded-full blur-2xl opacity-50"
            aria-hidden="true"
          />
          <div 
            className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#D08860]/10 rounded-full blur-3xl opacity-40"
            aria-hidden="true"
          />

          {/* Image Section */}
          <div className="relative group">
            <div className="rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]">
              <img 
                src={Right_side}
                alt="Adorable pet waiting for adoption" 
                className="w-full h-150 object-top object-cover transition-transform duration-300 group-hover:brightness-90 "
              />
            </div>
            <div className="absolute bottom-6 right-6 bg-white/80 rounded-full p-4 shadow-lg animate-pulse">
              <Heart className="text-[#D08860] w-10 h-10" fill="#D08860" fillOpacity={0.2} />
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            <div className="overflow-hidden">
              <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                Open Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D08860] to-[#B3704D]">Heart</span>, 
                <br />
                Open Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D08860] to-[#B3704D]">Home</span>
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
                  className="flex items-center space-x-4 bg-white/50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <item.icon className="text-[#D08860] w-7 h-7 flex-shrink-0" />
                  <span className="text-lg text-gray-800 font-medium">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-4">
              <a 
                href="/info_adoptable_pet"
                className="rounded-full bg-gradient-to-r from-[#D08860] to-[#B3704D] px-8 py-4 text-white font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
              >
                Find Your Perfect Companion
              </a>
              
              <button 
                onClick={scrollToGrid}
                className="rounded-full border-2 border-[#D08860] px-8 py-4 text-[#D08860] font-bold hover:bg-[#D08860]/10 transition-colors text-lg"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Section with Ref */}
      <div ref={gridSectionRef}>
        <Grid />
      </div>
    </>
  )
}