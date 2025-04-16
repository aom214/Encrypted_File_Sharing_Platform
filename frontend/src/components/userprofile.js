import { useState, useEffect } from "react";
import CustomNavbar from "./Navbar.js";
import axios from "axios";
import "./Dashboard.css"; // Reusing Dashboard styles for consistency

const UserProfilePage = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "" });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/user/profile", {
          withCredentials: true,
        });
        console.log("User profile data:", response.data);
        setUser(response.data.user); // Access nested 'user' object
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user profile");
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  if (loading) return <div className="loading">Loading profile...</div>;
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
            <h2 className="dashboard-title glitch" data-text="User Profile">User Profile</h2>
          </div>

          <div className="profile-content">
            <img
              src={user.profilePhoto || "https://randomuser.me/api/portraits/lego/1.jpg"}
              alt={`${user.firstName} ${user.lastName}`}
              className="profile-image"
            />
            <div className="profile-info">
              <h3 className="friend-name">
                {user.firstName} {user.lastName}
              </h3>
              <p className="friend-username">@{user.username}</p>
              <p className="profile-detail">Email: {user.email}</p>
              {/* Assuming no 'createdAt' in your data; adjust if available */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
