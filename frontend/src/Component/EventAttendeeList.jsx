import React, { useState } from "react";
import { FiRefreshCw, FiMail, FiCopy } from "react-icons/fi";
import { FaInfoCircle, FaTimes } from "react-icons/fa";

const AttendeeList = ({ eventId, attendees, onRefresh, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [emailFeedback, setEmailFeedback] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailDetails, setEmailDetails] = useState({ to: "", subject: "", body: "" });

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch =
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      attendee.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleSendEmail = (email, name) => {
    setEmailFeedback(null);

    // Simulate email action for testing
    if (window.confirm(`Simulate sending an email to ${email}? (Test mode)`)) {
      const subject = `Regarding Event Registration (${eventId})`;
      const body = `Dear ${name},\n\nWe are reaching out regarding your registration for the event. Please let us know how we can assist you.\n\nBest regards,\n[Your Event Team]`;
      
      // Set email details and open the modal
      setEmailDetails({ to: email, subject, body });
      setIsEmailModalOpen(true);
    }
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email).then(() => {
      setEmailFeedback(`Copied ${email} to clipboard!`);
    }).catch((error) => {
      console.error("Error copying email:", error);
      setEmailFeedback("Failed to copy email to clipboard.");
    });
  };

  const closeEmailModal = () => {
    setIsEmailModalOpen(false);
    setEmailDetails({ to: "", subject: "", body: "" });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-amber-950">Registered Attendees</h3>
          <p className="text-gray-600">{attendees.length} total registrations</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <input
              type="text"
              placeholder="Search attendees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D08860] focus:border-transparent transition-all w-full"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-2 top-3 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#D08860] focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 text-amber-700 hover:text-amber-800 disabled:opacity-50"
            title="Refresh attendees"
          >
            <FiRefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {emailFeedback && (
        <div className="mb-4 p-3 bg-amber-100 text-amber-800 rounded-lg text-sm">
          {emailFeedback}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-700"></div>
          <p className="mt-2 text-gray-600">Loading attendees...</p>
        </div>
      ) : filteredAttendees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAttendees.map((attendee) => (
            <div
              key={attendee._id}
              className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#D08860] hover:shadow-md transition-all duration-300 relative"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-[#D08860] text-white rounded-full flex items-center justify-center font-bold">
                  {attendee.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-amber-950">{attendee.name}</p>
                  <p className="text-sm text-gray-600">{attendee.email}</p>
                  <div className="flex flex-col space-y-1 mt-1">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>
                        {new Date(attendee.registeredAt).toLocaleDateString()} •{" "}
                        {attendee.tickets} ticket{attendee.tickets !== 1 ? "s" : ""}
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 font-semibold rounded-full ${
                          attendee.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {attendee.status}
                      </span>
                    </div>
                    {attendee.status === "cancelled" && (
                      <div className="text-xs text-gray-500 mt-1 space-y-1">
                        <p>
                          Cancelled: {new Date(attendee.cancelledAt).toLocaleDateString()}
                        </p>
                        <p>
                          Refund: {attendee.refundAmount.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </p>
                        {attendee.cancellationReason && (
                          <p title={attendee.cancellationReason}>
                            Reason: {attendee.cancellationReason.length > 20
                              ? `${attendee.cancellationReason.slice(0, 20)}...`
                              : attendee.cancellationReason}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute top-3 right-3 flex gap-1">
                <button
                  onClick={() => handleSendEmail(attendee.email, attendee.name)}
                  className="text-gray-500 hover:text-amber-700 p-1"
                  title="Simulate email (test mode)"
                >
                  <FiMail className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleCopyEmail(attendee.email)}
                  className="text-gray-500 hover:text-amber-700 p-1"
                  title="Copy email to clipboard"
                >
                  <FiCopy className="h-4 w-4" />
                </button>
                {attendee.cancellationReason && (
                  <button
                    className="text-gray-500 hover:text-amber-700 p-1"
                    title={attendee.cancellationReason}
                  >
                    <FaInfoCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.768-.231-1.47-.62-2.062M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.768.231-1.47.62-2.062M14 14h2.62M5.625 14h2.62m0 0a2.96 2.96 0 00.62 2.062M5.625 14H4a1 1 0 00-.707.293l-2 2a1 1 0 000 1.414l2 2a1 1 0 00.707.293h15a1 1 0 00.707-.293l2-2a1 1 0 000-1.414l-2-2a1 1 0 00-.707-.293H14zm0 0V10a2 2 0 10-4 0v4m0 0a2 2 0 104 0z"
            />
          </svg>
          <p className="text-gray-600 text-lg">
            {searchTerm || statusFilter !== "all"
              ? "No matching attendees found"
              : "No users registered yet"}
          </p>
          {(searchTerm || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="mt-2 text-amber-700 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Email Preview Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-amber-950">Email Preview (Test Mode)</h3>
              <button onClick={closeEmailModal} className="text-gray-500 hover:text-amber-700">
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">To:</label>
                <p className="mt-1 p-2 bg-gray-100 rounded-lg">{emailDetails.to}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject:</label>
                <p className="mt-1 p-2 bg-gray-100 rounded-lg">{emailDetails.subject}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Body:</label>
                <pre className="mt-1 p-2 bg-gray-100 rounded-lg whitespace-pre-wrap">
                  {emailDetails.body}
                </pre>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeEmailModal}
                className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendeeList;