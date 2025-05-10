'use client';

import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-[#F5EFEA] h-screen fixed w-64 z-50">
      {/* Sidebar for large screens */}
      <div className="hidden lg:flex flex-col h-full justify-between p-6 border-r border-gray-200">
        <div>
          <Link to="/admin/redirect/event_manager/dashboard" className="mb-6 block">
            <img src="/logo.jpg" alt="Logo" className="h-12 w-auto" />
          </Link>
          <nav className="flex flex-col gap-y-4">
            <Link to="/admin/redirect/event_manager/dashboard" className="text-sm font-semibold text-amber-950 hover:text-[#D08860] transition-colors duration-200">Home</Link>
            <Link to="/admin/redirect/event_manager/create" className="text-sm font-semibold text-amber-950 hover:text-[#D08860] transition-colors duration-200">Create Event</Link>
            <Link to="/admin/redirect/event_manager/events" className="text-sm font-semibold text-amber-950 hover:text-[#D08860] transition-colors duration-200">Events</Link>
            <Link to="/admin/redirect/event_manager/analytics" className="text-sm font-semibold text-amber-950 hover:text-[#D08860] transition-colors duration-200">Analytics</Link>
            <Link to="/admin/redirect/event_manager/profile" className="text-sm font-semibold text-amber-950 hover:text-[#D08860] transition-colors duration-200">Profile</Link>
          </nav>
        </div>
        <Link to="/admin/redirect/event_manager/logout" className="block rounded-lg px-3 py-2.5 text-base font-semibold text-white bg-[#D08860] hover:text-amber-900 transition-colors duration-200 hover:bg-[#D08860]">
          Log Out 
        </Link>
      </div>

      {/* Mobile toggle button */}
      <div className="lg:hidden p-4">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Bars3Icon className="size-6" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile Menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50 bg-black/25" />
        <DialogPanel className="fixed inset-y-0 left-0 z-50 w-64 bg-[#F5EFEA] px-6 py-6">
          <div className="flex items-center justify-between">
            <Link to="/admin/redirect/event_manager/dashboard" className="-m-1.5 p-1.5">
              <img src="/logo.jpg" alt="Logo" className="h-12 w-auto" />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="size-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="space-y-4">
              <Link to="/admin/redirect/event_manager/dashboard" className="block rounded-lg px-3 py-2 text-base font-semibold text-amber-950 hover:text-[#D08860]" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/admin/redirect/event_manager/create" className="block rounded-lg px-3 py-2 text-base font-semibold text-amber-950 hover:text-[#D08860]" onClick={() => setMobileMenuOpen(false)}>Create Event</Link>
              <Link to="/admin/redirect/event_manager/events" className="block rounded-lg px-3 py-2 text-base font-semibold text-amber-950 hover:text-[#D08860]" onClick={() => setMobileMenuOpen(false)}>Events</Link>
              <Link to="/admin/redirect/event_manager/analytics" className="block rounded-lg px-3 py-2 text-base font-semibold text-amber-950 hover:text-[#D08860]" onClick={() => setMobileMenuOpen(false)}>Analytics</Link>
              <Link to="/admin/redirect/event_manager/profile" className="block rounded-lg px-3 py-2 text-base font-semibold text-amber-950 hover:text-[#D08860]" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
            </div>
            <div className="mt-6">
              <Link to="/admin/redirect/event_manager/logout" className="block rounded-lg px-3 py-2.5 text-base font-semibold text-white bg-[#D08860] hover:text-amber-900 transition-colors duration-200 hover:bg-[#D08860]">
                Log Out
              </Link>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
}