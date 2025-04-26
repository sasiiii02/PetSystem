// Dashboard.js
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventHostingSection from "../components/EventHostingSection";
import AttendeeSection from "../components/AttendeeSection";
import HeroSection from "../components/HeroSection"; // Import the new IntroSection component

const Dashboard = () => {
  return (
    <div className="bg-[#F5EFEA] min-h-screen">
      {/* Use the reusable IntroSection component */}
      <HeroSection
        title="Transform Your Ideas into Reality"
        subtitle="Empowering event organizers to connect, engage, and create memories that last"
        backgroundImage="/back.jpeg"
        buttonText="Get started"
        buttonLink="#"
      />

      <EventHostingSection />
      <AttendeeSection />
      <Footer />
    </div>
  );
};

export default Dashboard;
