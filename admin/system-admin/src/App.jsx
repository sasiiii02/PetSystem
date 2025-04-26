// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SysAdminDashboard from './pages/SysAdminDashboard';
import './App.css';


function App() {
  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<SysAdminDashboard />} />
      <Route path="/user_admin" element={<SysAdminDashboard />} />
    
    </Routes>
   
  </BrowserRouter>
  );
}

export default App;