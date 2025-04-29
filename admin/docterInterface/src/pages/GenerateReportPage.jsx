import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const GenerateReportPage = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [petsUsersData, setPetsUsersData] = useState([]);
  const [showIncomeTable, setShowIncomeTable] = useState(false);
  const [showPetsUsersTable, setShowPetsUsersTable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('profToken');

  useEffect(() => {
    const validateTokenAndFetchData = async () => {
      if (!token) {
        setError('No authentication token found. Please log in.');
        navigate('/professional/login');
        return;
      }
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('profToken');
          localStorage.removeItem('profRole');
          navigate('/professional/login');
          return;
        }
        if (!['vet', 'groomer', 'pet-trainer'].includes(decoded.role)) {
          setError('Unauthorized role.');
          navigate('/professional/dashboard');
          return;
        }
        setLoading(true);
        setError(null);

        const [incomeResponse, petsUsersResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/appointments/income-report', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/appointments/pets-users-report', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log('Income report data:', incomeResponse.data);
        console.log('Pets-users report data:', petsUsersResponse.data);

        setIncomeData(incomeResponse.data);
        setPetsUsersData(petsUsersResponse.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
        let errorMessage = 'Failed to load reports';
        if (error.response) {
          if (error.response.status === 401) {
            errorMessage = 'Session expired. Please log in again.';
            localStorage.removeItem('profToken');
            localStorage.removeItem('profRole');
            navigate('/professional/login');
          } else {
            errorMessage = error.response.data.message || `Server error (Status: ${error.response.status})`;
          }
        } else {
          errorMessage = `Network error: ${error.message}`;
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    validateTokenAndFetchData();
  }, [token, navigate]);

  const downloadPDF = (reportType) => {
    try {
      console.log('Generating PDF for:', reportType);
      console.log('Income data:', incomeData);
      console.log('Pets-users data:', petsUsersData);

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(
        reportType === 'income' ? 'Monthly Appointment Income Report' : 'Pets and Users Report',
        14,
        20
      );

      if (reportType === 'income') {
        if (!incomeData || !Array.isArray(incomeData)) {
          throw new Error('Invalid incomeData');
        }
        autoTable(doc, {
          startY: 30,
          head: [['Month', 'Total Income ($)', 'Number of Appointments']],
          body: incomeData.map((item) => {
            if (!item.year || !item.month || item.totalIncome == null || item.appointmentCount == null) {
              console.warn('Invalid income item:', item);
              return ['N/A', '0.00', '0'];
            }
            return [
              new Date(item.year, item.month - 1).toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              }),
              item.totalIncome.toFixed(2),
              item.appointmentCount,
            ];
          }),
          theme: 'striped',
        });
      } else {
        if (!petsUsersData || !Array.isArray(petsUsersData)) {
          throw new Error('Invalid petsUsersData');
        }
        autoTable(doc, {
          startY: 30,
          head: [['Pet Name', 'Pet Breed', 'Owner Name', 'Owner Email', 'Owner Phone']],
          body: petsUsersData.map((item) => {
            if (!item.petName || !item.petType || !item.ownerName) {
              console.warn('Invalid pet item:', item);
              return ['N/A', 'N/A', 'N/A', 'N/A', 'N/A'];
            }
            return [
              item.petName,
              item.petType,
              item.ownerName,
              item.ownerEmail,
              item.ownerPhone,
            ];
          }),
          theme: 'striped',
        });
      }

      console.log('Saving PDF:', `${reportType}-report.pdf`);
      doc.save(`${reportType}-report.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', {
        message: error.message,
        stack: error.stack,
        reportType,
      });
      alert('Failed to generate PDF: ' + error.message);
    }
  };

  const downloadExcel = (reportType) => {
    let data, headers, fileName;
    if (reportType === 'income') {
      headers = ['Month', 'Total Income ($)', 'Number of Appointments'];
      data = incomeData.map((item) => ({
        Month: new Date(item.year, item.month - 1).toLocaleString('default', {
          month: 'long',
          year: 'numeric',
        }),
        'Total Income ($)': item.totalIncome.toFixed(2),
        'Number of Appointments': item.appointmentCount,
      }));
      fileName = 'income-report.xlsx';
    } else {
      headers = ['Pet Name', 'Pet Breed', 'Owner Name', 'Owner Email', 'Owner Phone'];
      data = petsUsersData.map((item) => ({
        'Pet Name': item.petName,
        'Pet Breed': item.petType,
        'Owner Name': item.ownerName,
        'Owner Email': item.ownerEmail,
        'Owner Phone': item.ownerPhone,
      }));
      fileName = 'pets-users-report.xlsx';
    }

    const ws = XLSX.utils.json_to_sheet(data, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-amber-950">Generate Reports</h1>
      {loading && <p className="text-gray-500">Loading report data...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {!loading && !error && (
        <div className="space-y-8">
          {/* Monthly Appointment Income Report */}
          <div className="bg-white p-6 rounded-md shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Monthly Appointment Income</h2>
              <div className="space-x-2">
                <button
                  onClick={() => setShowIncomeTable(!showIncomeTable)}
                  className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                >
                  {showIncomeTable ? 'Hide' : 'View'}
                </button>
                <button
                  onClick={() => downloadPDF('income')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => downloadExcel('income')}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Download Excel
                </button>
              </div>
            </div>
            {showIncomeTable && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border">Month</th>
                      <th className="py-2 px-4 border">Total Income ($)</th>
                      <th className="py-2 px-4 border">Number of Appointments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomeData.length > 0 ? (
                      incomeData.map((item, index) => (
                        <tr key={index} className="text-center">
                          <td className="py-2 px-4 border">
                            {new Date(item.year, item.month - 1).toLocaleString('default', {
                              month: 'long',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="py-2 px-4 border">{item.totalIncome.toFixed(2)}</td>
                          <td className="py-2 px-4 border">{item.appointmentCount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="py-2 px-4 text-gray-500">
                          No income data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pets and Users Report */}
          <div className="bg-white p-6 rounded-md shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Pets and Their Users</h2>
              <div className="space-x-2">
                <button
                  onClick={() => setShowPetsUsersTable(!showPetsUsersTable)}
                  className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                >
                  {showPetsUsersTable ? 'Hide' : 'View'}
                </button>
                <button
                  onClick={() => downloadPDF('pets-users')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => downloadExcel('pets-users')}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Download Excel
                </button>
              </div>
            </div>
            {showPetsUsersTable && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border">Pet Name</th>
                      <th className="py-2 px-4 border">Pet Breed</th>
                      <th className="py-2 px-4 border">Owner Name</th>
                      <th className="py-2 px-4 border">Owner Email</th>
                      <th className="py-2 px-4 border">Owner Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {petsUsersData.length > 0 ? (
                      petsUsersData.map((item, index) => (
                        <tr key={index} className="text-center">
                          <td className="py-2 px-4 border">{item.petName}</td>
                          <td className="py-2 px-4 border">{item.petType}</td>
                          <td className="py-2 px-4 border">{item.ownerName}</td>
                          <td className="py-2 px-4 border">{item.ownerEmail}</td>
                          <td className="py-2 px-4 border">{item.ownerPhone}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-2 px-4 text-gray-500">
                          No pets or user data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateReportPage;