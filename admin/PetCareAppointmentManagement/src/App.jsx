import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Header'; // Import the new Sidebar component
import Appointment_dashboard from './pages/Appointment_dashboard';
import Appointment_report from './pages/Appointment_report';
import App_history_page from './pages/Appoinment_for_history';
import Appointment_for_vet from './pages/Appointment_for_vet';
import Appointment_for_groomer from './pages/Appointment_for_groomer';
import Appointment_for_trainer from './pages/Appointment_for_trainer';
import Availability_for_vet from './pages/AvailabilityVetTable';
import Availability_for_groomer from './pages/AvailabilityGroomerTable';
import Availability_for_trainer from './pages/AvailabilityTrainerTable';
import CancelationReq from './pages/CancelationReqPage';
import ActiveProfessionals from './pages/ActiveProfessionals'

export default function App() {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <Routes>
            <Route path="/dashboard" element={<Appointment_dashboard />} />
            <Route path="/reports" element={<Appointment_report />} />
            <Route path="/appointments/history" element={<App_history_page />} />
            <Route path="/appointments/vet" element={<Appointment_for_vet />} />
            <Route path="/appointments/grooming" element={<Appointment_for_groomer />} />
            <Route path="/appointments/training" element={<Appointment_for_trainer />} />
            <Route path="/professionals/active" element={<ActiveProfessionals />} />
            <Route path="/availability/vet" element={<Availability_for_vet />} />
            <Route path="/availability/groomer" element={<Availability_for_groomer />} />
            <Route path="/availability/trainer" element={<Availability_for_trainer />} />
            <Route path="/refund-request" element={<CancelationReq />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}