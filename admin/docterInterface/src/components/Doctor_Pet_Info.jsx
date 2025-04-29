import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PetProfile = () => {
  const [petId, setPetId] = useState('');
  const [petData, setPetData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (loading) return;
    console.log('handleSearch called with petId:', petId);
    setError('');
    setPetData(null);
    setLoading(true);

    const token = localStorage.getItem('profToken');
    if (!token) {
      setError('Authentication required. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('profToken');
        localStorage.removeItem('profRole');
        setLoading(false);
        return;
      }
    } catch (err) {
      setError('Invalid token. Please log in again.');
      localStorage.removeItem('profToken');
      localStorage.removeItem('profRole');
      setLoading(false);
      return;
    }

    // Remove # if present to match database format
    const cleanPetId = petId.startsWith('#') ? petId.slice(1) : petId;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/appointments/pet/${cleanPetId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        }
      );

      setPetData(response.data.data);
    } catch (err) {
      console.error('API error:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Unauthorized. Please log in again.');
          localStorage.removeItem('profToken');
          localStorage.removeItem('profRole');
        } else if (err.response.status === 404) {
          setError('Pet not found. Please enter a valid Pet ID.');
        } else {
          setError(err.response.data.error || 'Error fetching pet medical records.');
        }
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    try {
      console.log('Generating PDF for petId:', petData.id);
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Pet Medical Reports for ${petData.id}`, 14, 20);

      let yOffset = 30;

      if (petData.medicalHistory.length > 0) {
        doc.setFontSize(14);
        doc.text('Medical History', 14, yOffset);
        autoTable(doc, {
          startY: yOffset + 5,
          head: [['Date', 'Diagnosis', 'Treatment']],
          body: petData.medicalHistory.map((item) => [
            item.date,
            item.diagnosis,
            item.treatment,
          ]),
          theme: 'striped',
        });
        yOffset = doc.lastAutoTable.finalY + 10;
      }

      if (petData.groomingHistory.length > 0) {
        doc.setFontSize(14);
        doc.text('Grooming History', 14, yOffset);
        autoTable(doc, {
          startY: yOffset + 5,
          head: [['Date', 'Service', 'Notes']],
          body: petData.groomingHistory.map((item) => [
            item.date,
            item.service,
            item.notes,
          ]),
          theme: 'striped',
        });
        yOffset = doc.lastAutoTable.finalY + 10;
      }

      if (petData.trainingHistory.length > 0) {
        doc.setFontSize(14);
        doc.text('Training History', 14, yOffset);
        autoTable(doc, {
          startY: yOffset + 5,
          head: [['Date', 'Focus', 'Notes']],
          body: petData.trainingHistory.map((item) => [
            item.date,
            item.focus,
            item.notes,
          ]),
          theme: 'striped',
        });
        yOffset = doc.lastAutoTable.finalY + 10;
      }

      if (petData.vaccinationHistory.length > 0) {
        doc.setFontSize(14);
        doc.text('Vaccination History', 14, yOffset);
        autoTable(doc, {
          startY: yOffset + 5,
          head: [['Date', 'Description', 'Doctor ID']],
          body: petData.vaccinationHistory.map((item) => [
            item.date,
            item.description,
            item.doctorId,
          ]),
          theme: 'striped',
        });
      }

      doc.save(`pet-medical-reports-${petData.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', {
        message: error.message,
        stack: error.stack,
      });
      alert('Failed to generate PDF: ' + error.message);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6"
      style={{
        backgroundImage: `linear-gradient(rgba(252, 242, 233, 0.5), rgba(243, 231, 220, 0.5))`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-amber-950 mb-4">Enter Pet ID</h2>
        <div className="flex">
          <input
            type="text"
            value={petId}
            onChange={(e) => setPetId(e.target.value)}
            placeholder="Enter Pet ID (e.g., pet001)"
            className="w-full px-3 py-2 border rounded-l-md focus:ring-2 focus:ring-amber-500 text-amber-950"
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            className="bg-amber-700 text-white px-4 py-2 rounded-r-md hover:bg-amber-600 disabled:bg-amber-400"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && <p className="text-red-700 mt-2">{error}</p>}
      </div>

      {petData && (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full">
          <div className="flex justify-end mb-4">
            <button
              onClick={downloadPDF}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Download PDF
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold border-b pb-2 text-amber-950">
              Medical Records for Pet {petData.id}
            </h3>

            <div className="mt-4">
              <h4 className="text-md font-semibold text-amber-700">Medical History</h4>
              {petData.medicalHistory.length > 0 ? (
                <table className="min-w-full bg-white border mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border">Date</th>
                      <th className="py-2 px-4 border">Diagnosis</th>
                      <th className="py-2 px-4 border">Treatment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {petData.medicalHistory.map((item, index) => (
                      <tr key={index} className="text-center">
                        <td className="py-2 px-4 border">{item.date}</td>
                        <td className="py-2 px-4 border">{item.diagnosis}</td>
                        <td className="py-2 px-4 border">{item.treatment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-amber-800 mt-2">No medical history available.</p>
              )}
            </div>

            <div className="mt-4">
              <h4 className="text-md font-semibold text-amber-700">Grooming History</h4>
              {petData.groomingHistory.length > 0 ? (
                <table className="min-w-full bg-white border mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border">Date</th>
                      <th className="py-2 px-4 border">Service</th>
                      <th className="py-2 px-4 border">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {petData.groomingHistory.map((item, index) => (
                      <tr key={index} className="text-center">
                        <td className="py-2 px-4 border">{item.date}</td>
                        <td className="py-2 px-4 border">{item.service}</td>
                        <td className="py-2 px-4 border">{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-amber-800 mt-2">No grooming history available.</p>
              )}
            </div>

            <div className="mt-4">
              <h4 className="text-md font-semibold text-amber-700">Training History</h4>
              {petData.trainingHistory.length > 0 ? (
                <table className="min-w-full bg-white border mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border">Date</th>
                      <th className="py-2 px-4 border">Focus</th>
                      <th className="py-2 px-4 border">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {petData.trainingHistory.map((item, index) => (
                      <tr key={index} className="text-center">
                        <td className="py-2 px-4 border">{item.date}</td>
                        <td className="py-2 px-4 border">{item.focus}</td>
                        <td className="py-2 px-4 border">{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-amber-800 mt-2">No training history available.</p>
              )}
            </div>

            <div className="mt-4">
              <h4 className="text-md font-semibold text-amber-700">Vaccination History</h4>
              {petData.vaccinationHistory.length > 0 ? (
                <table className="min-w-full bg-white border mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border">Date</th>
                      <th className="py-2 px-4 border">Description</th>
                      <th className="py-2 px-4 border">Doctor ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {petData.vaccinationHistory.map((item, index) => (
                      <tr key={index} className="text-center">
                        <td className="py-2 px-4 border">{item.date}</td>
                        <td className="py-2 px-4 border">{item.description}</td>
                        <td className="py-2 px-4 border">{item.doctorId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-amber-800 mt-2">No vaccination history available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetProfile;