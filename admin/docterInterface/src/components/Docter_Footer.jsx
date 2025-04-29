'use client';
import { Link } from 'react-router-dom';

export default function DoctorFooter() {
  return (
    <footer className="bg-[#D08860] text-white py-10 mt-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Explore */}
          <div>
            <h3 className="text-lg font-semibold text-amber-950 mb-3">Explore</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-amber-950">About Us</Link></li>
              <li><Link to="#" className="hover:text-amber-950">Our Services</Link></li>
              <li><Link to="#" className="hover:text-amber-950">Blog & Articles</Link></li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold text-amber-950 mb-3">Quick Actions</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-amber-950">Book an Appointment</Link></li>
              <li><Link to="#" className="hover:text-amber-950">Manage Schedule</Link></li>
              <li><Link to="#" className="hover:text-amber-950">Patient Records</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-lg font-semibold text-amber-950 mb-3">Support</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-amber-950">FAQs</Link></li>
              <li><Link to="#" className="hover:text-amber-950">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-amber-950">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-amber-950 mb-3">Connect With Us</h3>
            <div className="flex space-x-4">
              <Link to="#" className="hover:text-amber-950">Facebook</Link>
              <Link to="#" className="hover:text-amber-950">Twitter</Link>
              <Link to="#" className="hover:text-amber-950">Instagram</Link>
            </div>
          </div>
        </div>

        <hr className="border-gray-900 my-6" />

        <p className="text-amber-950 text-center text-sm">© {new Date().getFullYear()} DoctorCare. All rights reserved.</p>
      </div>
    </footer>
  );
}
