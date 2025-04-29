"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import { toast } from 'react-toastify';

export default function UserHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhoneNumber, setRegPhoneNumber] = useState("");
  const [regCity, setRegCity] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [profilePic, setprofilePic] = useState("");
  const [regError, setRegError] = useState("");
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token")); // Added state to manage token
  const [intendedPath, setIntendedPath] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);


  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === "login") {
      setShowPassword(!showPassword);
    } else if (field === "register") {
      setShowRegPassword(!showRegPassword);
    } else if (field === "confirm") {
      setShowConPassword(!showConPassword);
    }
  };

  // Validate token by checking profile endpoint
  const validateToken = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({
          _id: data._id,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          city: data.city,
        }));
        setToken(data.token);
        setLoginOpen(false);
        setEmail("");
        setPassword("");
        navigate(intendedPath || "/");
      } else {
        setLoginError(data.message || "Invalid email or password");
      }
    } catch (error) {
      setLoginError(error.message || "Server error. Please try again.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError("");
    if (regPassword !== conPassword) {
      setRegError("Passwords do not match");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phoneNumber: regPhoneNumber,
          city: regCity,
          password: regPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.user.token);
        localStorage.setItem("user", JSON.stringify({
          _id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          phoneNumber: data.user.phoneNumber,
          city: data.user.city,
        })); // Store user data in localStorage
        setToken(data.user.token); // Update token state
        setRegisterOpen(false);
        setRegName(""); // Clear form fields
        setRegEmail("");
        setRegPhoneNumber("");
        setRegCity("");
        setRegPassword("");
        setConPassword("");
        navigate(intendedPath || "/");
      } else {
        setRegError(data.message || "Registration failed");
      }
    } catch (error) {
      setRegError(error.message || "Server error. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setIntendedPath("");
    setLoginOpen(false);
    setRegisterOpen(false);
    setEmail("");
    setPassword("");
    setRegName("");
    setRegEmail("");
    setRegPhoneNumber("");
    setRegCity("");
    setRegPassword("");
    setConPassword("");
    setLoginError("");
    setRegError("");
    navigate("/");
  };

  const handleNavClick = async (path) => {
    const publicRoutes = ["/", "/aboutus", "/contactus", "/events", "/appointment", "/adoption"];
    if (!token && !publicRoutes.includes(path)) {
      setIntendedPath(path);
      setLoginOpen(true);
    } else if (path === "/profile" && token) {
      const isValid = await validateToken();
      if (isValid) {
        setMobileMenuOpen(false);
        navigate(path);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setIntendedPath(path);
        setLoginOpen(true);
      }
    } else {
      setMobileMenuOpen(false);
      navigate(path);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Pet Care</span>
            <img src="/logo.jpg" alt="Pet Care Logo" className="h-10 w-auto rounded-md shadow-sm hover:shadow-md transition" />
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-amber-950 hover:bg-amber-50"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-8">
          <Link
            to="/"
            onClick={() => handleNavClick("/")}
            className="text-sm/6 font-semibold text-gray-900 hover:text-amber-700 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/appointment"
            onClick={() => handleNavClick("/appointment")}
            className="text-sm/6 font-semibold text-gray-900 hover:text-amber-700 transition-colors duration-200"
          >
            Appointment
          </Link>
          <Link
            to="/collection"
            onClick={() => handleNavClick("/collection")}
            className="text-sm/6 font-semibold text-gray-900 hover:text-amber-700 transition-colors duration-200"
          >
            Marketplace
          </Link>
          <Link
            to="/events"
            onClick={() => handleNavClick("/events")}
            className="text-sm/6 font-semibold text-gray-900 hover:text-amber-700 transition-colors duration-200"
          >
            Events
          </Link>
          <Link
            to="/adoption"
            onClick={() => handleNavClick("/adoption")}
            className="text-sm/6 font-semibold text-gray-900 hover:text-amber-700 transition-colors duration-200"
          >
            Adoption
          </Link>
          <Link
            to="/aboutus"
            onClick={() => handleNavClick("/aboutus")}
            className="text-sm/6 font-semibold text-gray-900 hover:text-amber-700 transition-colors duration-200"
          >
            About Us
          </Link>
          <Link
            to="/contactus"
            onClick={() => handleNavClick("/contactus")}
            className="text-sm/6 font-semibold text-gray-900 hover:text-amber-700 transition-colors duration-200"
          >
            Contact Us
          </Link>
          <Link
            to="/profile"
            onClick={() => handleNavClick("/profile")}
            className="text-sm/6 font-semibold text-gray-900 hover:text-amber-700 transition-colors duration-200"
          >
            Profile
          </Link>
         
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          {token ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors duration-200 font-medium"
            >
              Log Out
            </button>
          ) : (
            <>
              <button
                onClick={() => setLoginOpen(true)}
                className="px-4 py-2 bg-white text-amber-700 border border-amber-700 rounded-lg hover:bg-amber-50 transition-colors duration-200 font-medium"
              >
                Log In
              </button>
              <button
                onClick={() => setRegisterOpen(true)}
                className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors duration-200 font-medium"
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-amber-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Pet Care</span>
              <img src="/logo.jpg" alt="Logo" className="h-8 w-auto rounded-md" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-amber-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-amber-500/10">
              <div className="space-y-2 py-6">
                <Link
                  to="/"
                  onClick={() => handleNavClick("/")}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-amber-50 hover:text-amber-700"
                >
                  Home
                </Link>
                <Link
                  to="/appointment"
                  onClick={() => handleNavClick("/appointment")}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-amber-50 hover:text-amber-700"
                >
                  Appointment
                </Link>
                <Link
                  to="/collection"
                  onClick={() => handleNavClick("/collection")}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-amber-50 hover:text-amber-700"
                >
                  Marketplace
                </Link>
                <Link
                  to="/events"
                  onClick={() => handleNavClick("/events")}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-amber-50 hover:text-amber-700"
                >
                  Events
                </Link>
                <Link
                  to="/adoption"
                  onClick={() => handleNavClick("/adoption")}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-amber-50 hover:text-amber-700"
                >
                  Adoption
                </Link>
                <Link
                  to="/aboutus"
                  onClick={() => handleNavClick("/aboutus")}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-amber-50 hover:text-amber-700"
                >
                  About Us
                </Link>
                <Link
                  to="/contactus"
                  onClick={() => handleNavClick("/contactus")}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-amber-50 hover:text-amber-700"
                >
                  Contact Us
                </Link>
                <Link
                  to="/profile"
                  onClick={() => handleNavClick("/profile")}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-amber-50 hover:text-amber-700"
                >
                  Profile
                </Link>
              </div>
              <div className="py-6 space-y-2">
                {token ? (
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2.5 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors duration-200 font-medium"
                  >
                    Log Out
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setLoginOpen(true);
                      }}
                      className="w-full px-3 py-2.5 text-amber-700 border border-amber-700 rounded-lg bg-white hover:bg-amber-50 transition-colors duration-200 font-medium"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setRegisterOpen(true);
                      }}
                      className="w-full px-3 py-2.5 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors duration-200 font-medium"
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>

      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true"/>
        <div className="fixed inset-0 flex items-center justify-center p-8">
          <DialogPanel className="bg-white p-0 rounded-2xl shadow-2xl w-full max-w-[780px] border border-amber-100 max-h-[100vh] overflow-y-auto flex flex-col md:flex-row">
            <div
              className="w-full md:w-1/2 h-64 md:h-auto bg-cover bg-center rounded-lg bg-[url('./assets/UserLogin.jpg')]" aria-hidden="true">
              <div className="text-white text-center p-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome Back</h1>
                <p className="text-lg md:text-xl">Login to continue your journey</p>
              </div>
            </div>
            <div className="w-full md:w-1/2 p-8 md:max-w-96">
              <h1 className="text-2xl font-semibold text-center text-amber-950 mb-6">Welcome Back</h1>
              {loginError && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                  <p>{loginError}</p>
                </div>
              )}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-amber-950 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 bg-white text-gray-900"
                    value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com"
                  />
                </div>
                <div className="relative">
                  <label className="block text-amber-950 font-medium mb-1">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 bg-white text-gray-900"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("login")}
                    className="absolute right-3 top-10 text-gray-500 hover:text-amber-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me" type="checkbox" 
                      className="h-4 w-4 text-amber-700 focus:ring-amber-700 border-amber-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition-colors duration-300 font-medium mt-2">
                  Log In
                </button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-gray-900">
                  Don't have an account?{" "}
                  <button
                    onClick={() => {
                      setLoginOpen(false);
                      setRegisterOpen(true);
                    }}
                    className="text-amber-700 hover:underline font-medium"
                  >
                    Register
                  </button>
                </p>
              </div>
              <div className="mt-15 text-center">
                <p className="text-gray-900">
                  Are you staff member ?{" "}
                  <Link to="./StaffLogin">
                    <button
                      type="button"
                      className="text-amber-700 hover:underline font-medium"
                    >
                      Staff Member Login
                    </button>
                  </Link>
                </p>
              </div>
              <button
                onClick={() => setLoginOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-amber-700"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <Dialog open={registerOpen} onClose={() => setRegisterOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-8">
          <DialogPanel className="bg-white p-0 rounded-2xl shadow-2xl w-full max-w-[770px] border border-amber-100 max-h-[90vh] overflow-y-auto flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-8 md:max-w-96 overflow-y-auto scrollbar-hide">
              <h2 className="text-2xl font-semibold text-center text-amber-950 mb-6">Create Your Account</h2>
              {regError && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                  <p>{regError}</p>
                </div>
              )}
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-amber-950 font-medium mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 bg-white text-gray-900"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-amber-950 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 bg-white text-gray-900"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-amber-950 font-medium mb-1">Phone Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 bg-white text-gray-900"
                    value={regPhoneNumber}
                    onChange={(e) => setRegPhoneNumber(e.target.value)}
                    required
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div>
                  <label className="block text-amber-950 font-medium mb-1">City</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 bg-white text-gray-900"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    required
                    placeholder="Enter your city"
                  />
                </div>
                <div className="relative">
                  <label className="block text-amber-950 font-medium mb-1">Password</label>
                  <input
                    type={showRegPassword ? "text" : "password"}
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 bg-white text-gray-900"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("register")}
                    className="absolute right-3 top-9 text-gray-500 hover:text-amber-700"
                    aria-label={showRegPassword ? "Hide password" : "Show password"}
                  >
                    {showRegPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <label className="block text-amber-950 font-medium mb-1">Confirm Password</label>
                  <input
                    type={showConPassword ? "text" : "password"}
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 bg-white text-gray-900"
                    value={conPassword}
                    onChange={(e) => setConPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-9 text-gray-500 hover:text-amber-700"
                    aria-label={showConPassword ? "Hide password" : "Show password"}
                  >
                    {showConPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div>
                  <label className="block text-amber-950 font-medium mb-1">Profile Picture</label>
                  <input
                    type="file"
                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 bg-white text-gray-900"
                    value={profilePic}
                    onChange={(e) => setprofilePic(e.target.value)}
                    placeholder="Upload your Photo"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition-colors duration-300 font-medium mt-2"
                >
                  Create Account
                </button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-gray-900">
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setRegisterOpen(false);
                      setLoginOpen(true);
                    }}
                    className="text-amber-700 hover:underline font-medium"
                  >
                    Log In
                  </button>
                </p>
              </div>
              <button
                onClick={() => setRegisterOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-amber-700"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div
              className="w-full md:w-1/2 h-64 md:h-auto bg-cover bg-center rounded-lg bg-[url('./assets/UserRegister.jpg')]" aria-hidden="true">
              <div className="text-white text-center p-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Join with Us</h2>
                <p className="text-lg md:text-xl">Register to start your journey</p>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </header>
  );
}