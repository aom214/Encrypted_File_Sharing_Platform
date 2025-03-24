import { useState, useEffect } from "react";
import CustomNavbar from "./Navbar.js";
import axios from "axios";
import "./Dashboard.css"; // Reusing Dashboard styles for consistency

const RequestsPage = ({ onLogout }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [notification, setNotification] = useState({ show: false, message: "" });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("https://cybersecurityproject-soi5.onrender.com/api/v1/user/get_all_requests", {
          withCredentials: true,
        });
        const requestsData = response.data.all_requests || [];
        console.log("Full API response:", response.data);
        console.log("Fetched requests:", requestsData);
        // Log status for each request
        requestsData.forEach((req, index) => console.log(`Request ${index} status:`, req.status));
        setRequests(requestsData);
        setFilteredRequests(requestsData);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch requests");
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    applyFilters(e.target.value, filter);
  };

  const handleSearch = () => {
    applyFilters(searchTerm, filter);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    applyFilters(searchTerm, newFilter);
  };

  const applyFilters = (search, currentFilter) => {
    let updatedRequests = [...requests];

    if (search) {
      updatedRequests = updatedRequests.filter((req) =>
        (req.sender?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (req.receivers?.toLowerCase() || "").includes(search.toLowerCase())
      );
    }

    if (currentFilter !== "ALL") {
      updatedRequests = updatedRequests.filter((req) =>
        (req.status || "").toLowerCase() === currentFilter.toLowerCase()
      );
    }

    setFilteredRequests(updatedRequests);
  };

  const handleAccept = async (requestId, sender) => {
    try {
      await axios.post(`https://cybersecurityproject-soi5.onrender.com/api/v1/user/request/${requestId}/accept`, {}, {
        withCredentials: true,
      });
      setRequests(requests.filter((req) => req._id !== requestId));
      setFilteredRequests(filteredRequests.filter((req) => req._id !== requestId));
      setNotification({
        show: true,
        message: `Request from ${sender || "Unknown"} accepted!`,
      });
      setTimeout(() => setNotification({ show: false, message: "" }), 3000);
    } catch (err) {
      alert(`Error accepting request: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDecline = async (requestId, sender) => {
    try {
      await axios.post(`https://cybersecurityproject-soi5.onrender.com/api/v1/user/request/${requestId}/decline`, {}, {
        withCredentials: true,
      });
      setRequests(requests.filter((req) => req._id !== requestId));
      setFilteredRequests(filteredRequests.filter((req) => req._id !== requestId));
      setNotification({
        show: true,
        message: `Request from ${sender || "Unknown"} declined!`,
      });
      setTimeout(() => setNotification({ show: false, message: "" }), 3000);
    } catch (err) {
      alert(`Error declining request: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <div className="loading">Loading requests...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      <CustomNavbar onLogout={onLogout} />
      <div className="dashboard-container">
        {notification.show && (
          <div className="notification">
            {notification.message}
          </div>
        )}
        <div className="dashboard-card">
          <div className="header">
            <h2 className="dashboard-title glitch" data-text="User Requests">User Requests</h2>
            <p className="friends-count">{filteredRequests.length} Requests</p>
          </div>

          <div className="filter-section">
            <div className="search-section">
              <input
                type="text"
                placeholder="Search by sender/receiver"
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="find-friend-button" onClick={handleSearch}>
                Search
              </button>
            </div>
            <div className="filter-buttons">
              <button
                className={`filter-button ${filter === "ALL" ? "active" : ""}`}
                onClick={() => handleFilterChange("ALL")}
              >
                ALL
              </button>
              
            </div>
          </div>

          <div className="friends-list">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <div key={req._id} className="friend-item">
                  <div className="friend-info">
                    <h4 className="friend-name">Name: {req.sender.firstName || "Unknown"}</h4>
                    <p className="friend-username">username: {req.sender.username || "Unknown"}</p>
                    <p className="file-date">Requested At: {new Date(req.createdAt).toLocaleString()}</p>
                    <p className="file-status">Status: {req.status || "Not Set"}</p>
                  </div>
                  <div className="friend-actions">
                    {/* Always show Accept and Decline buttons */}
                    <button
                      className="action-button accept-button"
                      onClick={() => handleAccept(req._id, req.sender)}
                    >
                      <span className="action-icon" role="img" aria-label="accept">✅</span>
                      Accept
                    </button>
                    <button
                      className="action-button decline-button"
                      onClick={() => handleDecline(req._id, req.sender)}
                    >
                      <span className="action-icon" role="img" aria-label="decline">❌</span>
                      Decline
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No requests found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestsPage;
