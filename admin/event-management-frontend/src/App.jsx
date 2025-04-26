// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import './App.css';
import MyEvents from './pages/MyEvents';
import EventDetails from './pages/EventDetails';
import EditEvent from './pages/EditEvent';
import Notification from './pages/Notification';



function App() {
  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/my-events" element={<MyEvents />} />
      <Route path="/event/:id" element={<EventDetails />} />
      <Route path="/edit-event/:id" element={<EditEvent />} />
      <Route path="/notifications" element={<Notification />} />


    </Routes>
   
  </BrowserRouter>
  );
}

export default App;