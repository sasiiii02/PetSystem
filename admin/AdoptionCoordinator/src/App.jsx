import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import PetAdoptionDashboard from './Pages/AdminDashBoard'
import AdoptionScheduler from './Pages/HomeVisitScheduler'


export default function App() {
  return (
    <Router>
      <div>
        <Routes>

          <Route path='/' element={<PetAdoptionDashboard />} />
          <Route path="/schedule-visit" element={<AdoptionScheduler />} />
    
        </Routes>
      </div>
    </Router>
  )
}