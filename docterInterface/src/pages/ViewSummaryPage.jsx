import { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ViewSummaryPage = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('profToken');

  const reportTypes = [
    { id: 'type-distribution', name: 'Appointment Type Distribution', chartType: 'pie' },
    { id: 'status-over-time', name: 'Appointment Status Over Time', chartType: 'bar' },
    { id: 'fee-distribution', name: 'Appointment Fee Distribution', chartType: 'pie' },
    { id: 'date-distribution', name: 'Appointment Date Distribution', chartType: 'bar' },
    { id: 'payment-status-distribution', name: 'Payment Status Distribution', chartType: 'pie' },
    { id: 'time-slot-distribution', name: 'Time Slot Distribution', chartType: 'pie' },
  ];

  useEffect(() => {
    const validateToken = async () => {
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
      } catch (error) {
        setError('Invalid token. Please log in again.');
        localStorage.removeItem('profToken');
        localStorage.removeItem('profRole');
        navigate('/professional/login');
      }
    };
    validateToken();
  }, [token, navigate]);

  const fetchReportData = async (reportId) => {
    setLoading(true);
    setError(null);
    setChartData(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/appointments/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      console.log(`${reportId} data:`, data); // Debug log

      if (!data || data.length === 0) {
        setError(`No data available for ${reportId.replace('-', ' ')}.`);
        return;
      }

      let chartConfig = null;
      switch (reportId) {
        case 'type-distribution':
          chartConfig = {
            labels: data.map((item) => item.appointmentType),
            datasets: [
              {
                label: 'Appointments by Type',
                data: data.map((item) => item.count),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              },
            ],
          };
          break;
        case 'status-over-time':
          const months = [...new Set(data.map((item) => `${item.year}-${item.month}`))].sort();
          chartConfig = {
            labels: months.map((m) => {
              const [year, month] = m.split('-');
              return new Date(year, month - 1).toLocaleString('default', { month: 'short', year: 'numeric' });
            }),
            datasets: ['scheduled', 'completed', 'cancelled'].map((status, index) => ({
              label: status.charAt(0).toUpperCase() + status.slice(1),
              data: months.map((month) => {
                const [year, monthNum] = month.split('-');
                const entry = data.find(
                  (d) => d.year === parseInt(year) && d.month === parseInt(monthNum) && d.status === status
                );
                return entry ? entry.count : 0;
              }),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'][index],
              stack: 'Stack 0',
            })),
          };
          break;
        case 'fee-distribution':
          chartConfig = {
            labels: data.map((item) => item.feeRange),
            datasets: [
              {
                label: 'Appointments by Fee Range',
                data: data.map((item) => item.count),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
              },
            ],
          };
          break;
        case 'date-distribution':
          chartConfig = {
            labels: data.map((item) =>
              new Date(item.year, item.month - 1).toLocaleString('default', { month: 'short', year: 'numeric' })
            ),
            datasets: [
              {
                label: 'Appointments by Month',
                data: data.map((item) => item.count),
                backgroundColor: '#36A2EB',
              },
            ],
          };
          break;
        case 'payment-status-distribution':
          chartConfig = {
            labels: data.map((item) => item.paymentStatus),
            datasets: [
              {
                label: 'Appointments by Payment Status',
                data: data.map((item) => item.count),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              },
            ],
          };
          break;
        case 'time-slot-distribution':
          chartConfig = {
            labels: data.map((item) => item.timeSlot),
            datasets: [
              {
                label: 'Appointments by Time Slot',
                data: data.map((item) => item.count),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              },
            ],
          };
          break;
        default:
          throw new Error('Unknown report type');
      }
      setChartData(chartConfig);
    } catch (error) {
      console.error(`Error fetching ${reportId}:`, error);
      let errorMessage = 'Failed to load data';
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

  const handleReportSelect = (reportId) => {
    setSelectedReport(reportId);
    fetchReportData(reportId);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-amber-950">Appointment Summary Reports</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Select a Report</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => (
            <div
              key={report.id}
              className={`p-4 rounded-md shadow-md cursor-pointer transition-colors ${
                selectedReport === report.id
                  ? 'bg-amber-100 border-amber-500 border-2'
                  : 'bg-white hover:bg-gray-100'
              }`}
              onClick={() => handleReportSelect(report.id)}
            >
              <h3 className="text-md font-medium">{report.name}</h3>
            </div>
          ))}
        </div>
      </div>
      {loading && <p className="text-gray-500">Loading report data...</p>}
      {!loading && !error && !chartData && selectedReport && (
        <p className="text-gray-500">No data available for this report.</p>
      )}
      {!loading && chartData && (
        <div className="bg-white p-6 rounded-md shadow-md">
          {reportTypes.find((r) => r.id === selectedReport)?.chartType === 'pie' ? (
            <Pie
              data={chartData}
              options={{
                plugins: {
                  legend: { position: 'top' },
                  tooltip: { enabled: true },
                  title: {
                    display: true,
                    text: reportTypes.find((r) => r.id === selectedReport)?.name,
                    font: { size: 18 },
                  },
                },
                maintainAspectRatio: false,
              }}
              height={400}
            />
          ) : (
            <Bar
              data={chartData}
              options={{
                plugins: {
                  legend: selectedReport === 'status-over-time' ? { position: 'top' } : { display: false },
                  tooltip: { enabled: true },
                  title: {
                    display: true,
                    text: reportTypes.find((r) => r.id === selectedReport)?.name,
                    font: { size: 18 },
                  },
                },
                scales: {
                  x: { title: { display: true, text: selectedReport === 'status-over-time' ? 'Month' : 'Category' } },
                  y: { title: { display: true, text: 'Number of Appointments' }, beginAtZero: true },
                },
                maintainAspectRatio: false,
              }}
              height={400}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ViewSummaryPage;