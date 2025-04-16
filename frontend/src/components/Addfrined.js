import { useState, useEffect } from "react";
import CustomNavbar from "./Navbar.js";
import axios from "axios";
import "./Dashboard.css"; // Reusing styles for consistency

const AddFriendsPage = ({ onLogout }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "" }); // Notification state

  useEffect(() => {
    const fetchNonFriends = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/user/get_all_non_friends", {
          withCredentials: true,
        });
        const nonFriendsData = response.data["non-friends"] || [];
        setUsers(nonFriendsData);
        setFilteredUsers(nonFriendsData);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users");
        setLoading(false);
      }
    };
    fetchNonFriends();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    applyFilters(e.target.value);
  };

  const handleSearch = () => {
    applyFilters(searchTerm);
  };

  const applyFilters = (search) => {
    let updatedUsers = [...users];

    if (search) {
      updatedUsers = updatedUsers.filter((user) =>
        (user.firstName?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (user.username?.toLowerCase() || "").includes(search.toLowerCase())
      );
    }

    setFilteredUsers(updatedUsers);
  };

  const sendFriendRequest = async (userId, username) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/v1/user/request/${userId}`, {
        withCredentials: true,
      });
      // Show notification instead of alert
      setNotification({
        show: true,
        message: `Friend request sent to @${username}!`,
      });
      setTimeout(() => setNotification({ show: false, message: "" }), 3000); // Hide after 3 seconds

      // Remove the user from the list after sending a request
      setUsers(users.filter((user) => user._id !== userId));
      setFilteredUsers(filteredUsers.filter((user) => user._id !== userId));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send friend request.");
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      <CustomNavbar onLogout={onLogout} />
      <div className="dashboard-container">
        {/* Notification */}
        {notification.show && (
          <div className="notification">
            {notification.message}
          </div>
        )}
        <div className="dashboard-card">
          <div className="header">
            <h2 className="dashboard-title">Add Friends</h2>
            <p className="friends-count">{filteredUsers.length} Users Available</p>
          </div>

          <div className="filter-section">
            <div className="search-section">
              <input
                type="text"
                placeholder="Search for users"
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="find-friend-button" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>

          <div className="friends-list">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user._id} className="friend-item">
                  <img
                    src={user.profilePhoto || "https://randomuser.me/api/portraits/lego/1.jpg"}
                    alt={user.firstName}
                    className="friend-image"
                  />
                  <div className="friend-info">
                    <h4 className="friend-name">{user.firstName} {user.lastName}</h4>
                    <p className="friend-username">@{user.username}</p>
                  </div>
                  <div className="friend-actions">
                    <button
                      className="action-button send-file"
                      onClick={() => sendFriendRequest(user._id, user.username)}
                    >
                      <span className="send-file-icon" role="img" aria-label="add-friend">➕</span>
                      <span className="send-file-text">Add Friend</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No users found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddFriendsPage;
