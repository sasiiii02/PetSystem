'use client';

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#D08860] text-white py-10 ">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Explore (User and General Links) */}
          <div>
            <h3 className="text-lg font-semibold text-amber-950 mb-3">Explore</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-amber-950">About Us</Link></li>
              <li><Link to="/events" className="hover:text-amber-950">Browse Events</Link></li>
              <li><Link to="/blog" className="hover:text-amber-950">Blog</Link></li>
              <li><Link to="/faqs" className="hover:text-amber-950">FAQs</Link></li>
            </ul>
          </div>

          {/* Pet Owner / User Links */}
          <div>
            <h3 className="text-lg font-semibold text-amber-950 mb-3">For Pet Owners</h3>
            <ul className="space-y-2">
              <li><Link to="/adoption" className="hover:text-amber-950">Pet Adoption</Link></li>
              <li><Link to="/marketplace" className="hover:text-amber-950">Marketplace</Link></li>
              <li><Link to="/profile" className="hover:text-amber-950">Profile</Link></li>
              <li><Link to="/notifications" className="hover:text-amber-950">Notifications</Link></li>
              <li><Link to="/appointments" className="hover:text-amber-950">Book Vet Appointment</Link></li> {/* Added Vet Appointment link */}
            </ul>
          </div>

          {/* Help and Legal (Support and policy-related links) */}
          <div>
            <h3 className="text-lg font-semibold text-amber-950 mb-3">Help & Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/support" className="hover:text-amber-950">Support</Link></li>
              <li><Link to="/contact-us" className="hover:text-amber-950">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-amber-950">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-amber-950">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-amber-950 mb-3">Follow Us</h3>
            <div className="flex space-x-4">
              <Link to="#" className="hover:text-amber-950">Facebook</Link>
              <Link to="#" className="hover:text-amber-950">Twitter</Link>
              <Link to="#" className="hover:text-amber-950">Instagram</Link>
            </div>
          </div>
        </div>

        <hr className="border-gray-900 my-6" />

        <p className="text-amber-950 text-center text-sm">© {new Date().getFullYear()} Pet Care System. All rights reserved.</p>
      </div>
    </footer>
  );
}