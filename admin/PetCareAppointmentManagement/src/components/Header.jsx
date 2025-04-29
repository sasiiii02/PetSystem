'use client';

import { Link, useLocation } from 'react-router-dom';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import {
  BellIcon,
  ChevronDownIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  ScissorsIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import image4 from '../assets/image4.jpg';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Refund Request', path: '/refund-request' },
  { name: 'Reports', path: '/reports' },
  { name: 'View Active Professionals', path: '/professionals/active' }, // New tab
];

const appointments = [
  { name: 'Vet Appointments', path: '/appointments/vet', icon: CalendarIcon },
  { name: 'Grooming Appointments', path: '/appointments/grooming', icon: ScissorsIcon },
  { name: 'Pet Training Appointments', path: '/appointments/training', icon: ClipboardDocumentCheckIcon },
  { name: 'Appointment History', path: '/appointments/history', icon: ClockIcon },
];

const professionalAvailability = [
  { name: 'Vet Availability', path: '/availability/vet', icon: CalendarIcon },
  { name: 'Groomer Availability', path: '/availability/groomer', icon: ScissorsIcon },
  { name: 'Pet Trainer Availability', path: '/availability/trainer', icon: ClipboardDocumentCheckIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar() {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('profToken');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Sidebar for Desktop */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:bg-white lg:shadow-md">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <img alt="Logo" src={image4} className="h-10 w-auto" />
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

            {/* Appointments Disclosure */}
            <Disclosure as="div" className="space-y-1">
              {({ open }) => (
                <>
                  <DisclosureButton
                    className={classNames(
                      open ? 'bg-amber-950 text-white' : 'text-gray-900 hover:bg-amber-950 hover:text-white',
                      'flex w-full items-center px-4 py-2 rounded-md text-sm font-medium transition'
                    )}
                  >
                    Appointments
                    <ChevronDownIcon
                      className={classNames(open ? 'rotate-180' : '', 'ml-auto h-5 w-5 text-gray-400')}
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="space-y-1 pl-4">
                    {appointments.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={classNames(
                          location.pathname === item.path
                            ? 'bg-amber-100 text-amber-900'
                            : 'text-gray-700 hover:bg-amber-100 hover:text-amber-900',
                          'flex items-center space-x-2 px-4 py-2 rounded-md text-sm transition'
                        )}
                      >
                        <item.icon className="h-5 w-5 text-gray-500" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>

            {/* Professionals Availability Disclosure */}
            <Disclosure as="div" className="space-y-1">
              {({ open }) => (
                <>
                  <DisclosureButton
                    className={classNames(
                      open ? 'bg-amber-950 text-white' : 'text-gray-900 hover:bg-amber-950 hover:text-white',
                      'flex w-full items-center px-4 py-2 rounded-md text-sm font-medium transition'
                    )}
                  >
                    Professionals Availability
                    <ChevronDownIcon
                      className={classNames(open ? 'rotate-180' : '', 'ml-auto h-5 w-5 text-gray-400')}
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="space-y-1 pl-4">
                    {professionalAvailability.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={classNames(
                          location.pathname === item.path
                            ? 'bg-amber-100 text-amber-900'
                            : 'text-gray-700 hover:bg-amber-100 hover:text-amber-900',
                          'flex items-center space-x-2 px-4 py-2 rounded-md text-sm transition'
                        )}
                      >
                        <item.icon className="h-5 w-5 text-gray-500" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </nav>

          {/* Bottom Section: Logout, Notifications & Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-4">
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full bg-amber-950 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-amber-900 transition"
              >
                Logout
              </button>

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
                          to="#"
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
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          to="#"
                          onClick={handleLogout}
                          className={classNames(
                            active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Sign out
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
              <img alt="Logo" src={image4} className="h-10 w-auto" />
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

                {/* Mobile Appointments Disclosure */}
                <Disclosure as="div" className="space-y-1">
                  {({ open: disclosureOpen }) => (
                    <>
                      <DisclosureButton
                        className={classNames(
                          disclosureOpen ? 'bg-amber-950 text-white' : 'text-gray-900 hover:bg-amber-950 hover:text-white',
                          'flex w-full items-center px-4 py-2 rounded-md text-sm font-medium transition'
                        )}
                      >
                        Appointments
                        <ChevronDownIcon
                          className={classNames(disclosureOpen ? 'rotate-180' : '', 'ml-auto h-5 w-5 text-gray-400')}
                        />
                      </DisclosureButton>
                      <DisclosurePanel className="space-y-1 pl-4">
                        {appointments.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className={classNames(
                              location.pathname === item.path
                                ? 'bg-amber-100 text-amber-900'
                                : 'text-gray-700 hover:bg-amber-100 hover:text-amber-900',
                              'flex items-center space-x-2 px-4 py-2 rounded-md text-sm transition'
                            )}
                          >
                            <item.icon className="h-5 w-5 text-gray-500" />
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>

                {/* Mobile Professionals Availability Disclosure */}
                <Disclosure as="div" className="space-y-1">
                  {({ open: disclosureOpen }) => (
                    <>
                      <DisclosureButton
                        className={classNames(
                          disclosureOpen ? 'bg-amber-950 text-white' : 'text-gray-900 hover:bg-amber-950 hover:text-white',
                          'flex w-full items-center px-4 py-2 rounded-md text-sm font-medium transition'
                        )}
                      >
                        Professionals Availability
                        <ChevronDownIcon
                          className={classNames(disclosureOpen ? 'rotate-180' : '', 'ml-auto h-5 w-5 text-gray-400')}
                        />
                      </DisclosureButton>
                      <DisclosurePanel className="space-y-1 pl-4">
                        {professionalAvailability.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className={classNames(
                              location.pathname === item.path
                                ? 'bg-amber-100 text-amber-900'
                                : 'text-gray-700 hover:bg-amber-100 hover:text-amber-900',
                              'flex items-center space-x-2 px-4 py-2 rounded-md text-sm transition'
                            )}
                          >
                            <item.icon className="h-5 w-5 text-gray-500" />
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </DisclosurePanel>
                    </>
                  )}
                </Disclosure>
              </div>
              <div className="p-4 border-t border-gray-200">
                <div className="space-y-4">
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full bg-amber-950 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-amber-900 transition"
                  >
                    Logout
                  </button>

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
                              to="#"
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
                        <MenuItem>
                          {({ active }) => (
                            <Link
                              to="#"
                              onClick={handleLogout}
                              className={classNames(
                                active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              Sign out
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