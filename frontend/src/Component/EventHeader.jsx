'use client';

import { useState } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { name: 'Home', path: '/admin/redirect/event_manager/dashboard' },
  { name: 'Create Event', path: '/admin/redirect/event_manager/create' },
  { name: 'Events', path: '/admin/redirect/event_manager/events' },
  { name: 'Analytics', path: '/admin/redirect/event_manager/analytics' },
  { name: 'Profile', path: '/admin/redirect/event_manager/profile' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Sidebar for Desktop */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:bg-white lg:shadow-md">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <img
              alt="Logo"
              src="/logo.jpg"
              className="h-10 w-auto"
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={classNames(
                  location.pathname === item.path
                    ? 'bg-amber-950 text-white'
                    : 'text-gray-900 hover:bg-amber-950 hover:text-white',
                  'block px-4 py-2 rounded-md text-sm font-medium transition'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Bottom Section: Logout, Notifications & Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-4">
              {/* Logout Button */}
              <Link
                to="/admin/redirect/event_manager/logout"
                className="w-full bg-gray-100 text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition block"
              >
                Log Out
              </Link>

              {/* Notifications & Profile */}
              <div className="flex items-center justify-between">
                {/* Notification Button */}
                <button className="relative p-2 rounded-full bg-white text-gray-900 hover:text-white hover:bg-amber-950 focus:outline-none focus:ring-2 focus:ring-white">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" />
                </button>

                {/* Profile Dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-white">
                    <img
                      alt="Profile"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="h-8 w-8 rounded-full"
                    />
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black/5 py-1">
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          to="/admin/redirect/event_manager/profile"
                          className={classNames(
                            active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Your Profile
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          to="#"
                          className={classNames(
                            active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Settings
                        </Link>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Disclosure as="div" className="lg:hidden">
        {({ open }) => (
          <>
            {/* Mobile Menu Button */}
            <div className="flex items-center justify-between p-4 bg-white shadow-md">
              <img
                alt="Logo"
                src="/logo.jpg"
                className="h-10 w-auto"
              />
              <DisclosureButton className="p-2 rounded-md bg-white text-gray-900 hover:bg-amber-950 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </DisclosureButton>
            </div>

            {/* Mobile Menu Panel */}
            <DisclosurePanel className="bg-white shadow-md">
              <div className="px-4 py-6 space-y-2">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={classNames(
                      location.pathname === item.path
                        ? 'bg-amber-950 text-white'
                        : 'text-gray-900 hover:bg-amber-950 hover:text-white',
                      'block px-4 py-2 rounded-md text-sm font-medium transition'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200">
                <div className="space-y-4">
                  {/* Logout Button */}
                  <Link
                    to="/admin/redirect/event_manager/logout"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full bg-gray-100 text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition block"
                  >
                    Log Out
                  </Link>

                  {/* Notifications & Profile */}
                  <div className="flex items-center justify-between">
                    <button className="relative p-2 rounded-full bg-white text-gray-900 hover:text-white hover:bg-amber-950 focus:outline-none focus:ring-2 focus:ring-white">
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" />
                    </button>
                    <Menu as="div" className="relative">
                      <MenuButton className="flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-white">
                        <img
                          alt="Profile"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          className="h-8 w-8 rounded-full"
                        />
                      </MenuButton>
                      <MenuItems className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black/5 py-1">
                        <MenuItem>
                          {({ active }) => (
                            <Link
                              to="/admin/redirect/event_manager/profile"
                              className={classNames(
                                active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              Your Profile
                            </Link>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <Link
                              to="#"
                              className={classNames(
                                active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              Settings
                            </Link>
                          )}
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </div>
                </div>
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    </>
  );
}