import React, { useState, useEffect } from "react";
import axios from "axios";
import ReportChart from "../Component/EventReportChart";
import Footer from "../Component/EventFooter";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

const Notification = () => {
  const [registrationsPerEvent, setRegistrationsPerEvent] = useState([]);
  const [revenuePerEvent, setRevenuePerEvent] = useState([]);
  const [registrationTrends, setRegistrationTrends] = useState([]);
  const [eventStatusBreakdown, setEventStatusBreakdown] = useState([]);
  const [registrationsByLocation, setRegistrationsByLocation] = useState([]);
  const [refundedRegistrations, setRefundedRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const params = dateRange.start && dateRange.end ? {
          startDate: dateRange.start,
          endDate: dateRange.end,
        } : {};

        const [
          registrationsRes,
          revenueRes,
          trendsRes,
          statusRes,
          locationRes,
          refundsRes,
        ] = await Promise.all([
          api.get("/reports/registrations-per-event"),
          api.get("/reports/revenue-per-event", { params }),
          api.get("/reports/registration-trends", { params }),
          api.get("/reports/event-status-breakdown"),
          api.get("/reports/registrations-by-location"),
          api.get("/reports/refunded-registrations"),
        ]);

        setRegistrationsPerEvent(registrationsRes.data.data.map(item => ({
          label: item.eventTitle,
          value: item.totalRegistrations,
        })));
        setRevenuePerEvent(revenueRes.data.data.map(item => ({
          label: item.eventTitle,
          value: item.totalRevenue,
        })));
        setRegistrationTrends(trendsRes.data.data.map(item => ({
          label: item._id,
          value: item.totalRegistrations,
        })));
        setEventStatusBreakdown(statusRes.data.data.map(item => ({
          label: item._id,
          value: item.count,
        })));
        setRegistrationsByLocation(locationRes.data.data.map(item => ({
          label: item._id,
          value: item.totalRegistrations,
        })));
        setRefundedRegistrations(refundsRes.data.data);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Failed to load reports. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [dateRange.start, dateRange.end]);

  const handleExportCSV = (data, filename, isRefundReport = false) => {
    if (!data.length) {
      alert("No data available to export.");
      return;
    }
    let csvContent;
    if (isRefundReport) {
      csvContent = "data:text/csv;charset=utf-8," +
        ["Event Title,User Name,User Email,Tickets,Refund Amount,Cancelled At",
         ...data.map(item => 
           `"${item.eventTitle}","${item.userName}","${item.userEmail}",${item.tickets},${item.refundAmount},"${new Date(item.cancelledAt).toLocaleString()}"`
         )].join("\n");
    } else {
      csvContent = "data:text/csv;charset=utf-8," +
        ["Label,Value", ...data.map(item => `"${item.label}",${item.value}`)].join("\n");
    }
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="relative z-10 flex-grow max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center mt-20">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-amber-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-amber-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-amber-200 rounded"></div>
                  <div className="h-4 bg-amber-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-md max-w-4xl mx-auto">
            <div className="flex items-center">
              <div className="text-red-500">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-amber-900 mb-8">Event Analytics</h1>

            <div className="mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-100">
              <h2 className="text-lg font-semibold text-amber-900 mb-4">Filter Reports</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-amber-900">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-4 focus:border-amber-700 focus:ring-amber-700 sm:text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-amber-900">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-4 focus:border-amber-700 focus:ring-amber-700 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-4">
              <button
                onClick={() => handleExportCSV(registrationsPerEvent, "registrations_per_event")}
                className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all"
              >
                Export Registrations
              </button>
              <button
                onClick={() => handleExportCSV(revenuePerEvent, "revenue_per_event")}
                className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all"
              >
                Export Revenue
              </button>
              <button
                onClick={() => handleExportCSV(registrationTrends, "registration_trends")}
                className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all"
              >
                Export Trends
              </button>
              <button
                onClick={() => handleExportCSV(eventStatusBreakdown, "event_status_breakdown")}
                className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all"
              >
                Export Status
              </button>
              <button
                onClick={() => handleExportCSV(registrationsByLocation, "registrations_by_location")}
                className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all"
              >
                Export Locations
              </button>
              <button
                onClick={() => handleExportCSV(refundedRegistrations, "refunded_registrations", true)}
                className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-all"
              >
                Export Refunds
              </button>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <ReportChart
                type="bar"
                data={registrationsPerEvent}
                title="Registrations per Event"
              />
              <ReportChart
                type="bar"
                data={revenuePerEvent}
                title="Revenue per Event"
              />
              <ReportChart
                type="line"
                data={registrationTrends}
                title="Registration Trends Over Time"
              />
              <ReportChart
                type="pie"
                data={eventStatusBreakdown}
                title="Event Status Breakdown"
              />
              <ReportChart
                type="pie"
                data={registrationsByLocation}
                title="Registrations by Location"
              />
            </div>

            <div className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h2 className="text-lg font-semibold text-amber-900 mb-4">Refunded Registrations</h2>
              {refundedRegistrations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cancelled At</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {refundedRegistrations.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.eventTitle}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.userName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.userEmail}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tickets}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.refundAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(item.cancelledAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600">No refunded registrations found.</p>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Notification;