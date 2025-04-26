'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg'

export default function UserHeader1() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed w-full top-0 left-0 z-50">
      {/* Navbar */}
      <header 
        className={`w-auto transition-all duration-300 ease-in-out ${
          scrolled 
            ? 'bg-[#F5EFEA] shadow-md py-2' 
            : 'bg-[#F5EFEA] py-4'
        }`}
      >
        <nav className="flex items-center justify-between px-6 lg:px-8 w-auto mx-auto" aria-label="Global">
          {/* Logo - Leftmost */}
          <div className="flex">
            <Link 
              to="/" 
              className="-m-1.5 p-1.5 group transition-transform duration-300 hover:scale-105"
            >
              <span className="sr-only">Pet Care</span>
              <img 
                src={logo}
                alt="Logo" 
                className="h-14 w-auto group-hover:rotate-6 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Navigation Links - Center */}
          <div className="hidden lg:flex lg:gap-x-12">
            {[
              { to: "/", label: "Home" },
              { to: "/events", label: "Events" },
              { to: "/adoption", label: "Adoption" },
              { to: "/appointment", label: "Appointment" },
              { to: "/marketplace", label: "Marketplace" },
              { to: "/profile", label: "Profile" },
              { to: "/contactus", label: "ContactUs" },
              { to: "/aboutus", label: "AboutUs" }
            ].map(({ to, label }) => (
              <Link 
                key={to} 
                to={to} 
                className="text-base font-semibold text-amber-950 hover:text-[#D08860] transition-colors duration-200 cursor-pointer relative group"
              >
                {label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D08860] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button and Logout - Rightmost */}
          <div className="flex items-center">
            {/* Mobile Menu Toggle */}
            <div className="flex lg:hidden mr-4">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 cursor-pointer hover:bg-gray-100 transition-all duration-300"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="size-7" aria-hidden="true" />
              </button>
            </div>

            {/* Logout Button */}
            <div className="hidden lg:block">
              <Link 
                to="/login" 
                className="block rounded-lg px-4 py-3 text-base font-semibold text-white bg-[#D08860] hover:bg-[#B3704D] transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                Log Out
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Dialog - Unchanged */}
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50 bg-black/30" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full bg-[#F5EFEA] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 animate-slide-in-right">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Pet Care</span>
                <img src="/logo.jpg" alt="Logo" className="h-14 w-auto" />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="size-7" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {/* Mobile Navigation Links */}
                  {[
                    { to: "/", label: "Home" },
                    { to: "/events", label: "Events" },
                    { to: "/adoption", label: "Adoption" },
                    { to: "/appointment", label: "Appointment" },
                    { to: "/marketplace", label: "Marketplace" },
                    { to: "/profile", label: "Profile" },
                    { to: "/contactus", label: "ContactUs" },
                    { to: "/aboutus", label: "AboutUs" }
                  ].map(({ to, label }) => (
                    <Link 
                      key={to} 
                      to={to} 
                      className="block rounded-lg px-3 py-2 text-lg font-semibold text-amber-950 hover:text-[#D08860] transition-colors duration-200 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Link 
                    to="/login" 
                    className="block rounded-lg px-3 py-2.5 text-lg font-semibold text-amber-950 hover:text-white transition-colors duration-300 hover:bg-[#D08860] cursor-pointer"
                  >
                    Log Out
                  </Link>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </div>
  );
}