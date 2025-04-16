import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import CustomNavbar from "./Navbar.js";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate(); // Define navigate function
  const [searchTerm, setSearchTerm] = useState("");
  const [friends, setFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "" });

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/user/friends/", {
          withCredentials: true,
        });
        const friendsData = response.data.friends || response.data || [];
        console.log("Fetched friends:", friendsData);
        setFriends(friendsData);
        setFilteredFriends(friendsData);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch friends");
        setLoading(false);
      }
    };
    fetchFriends();
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
    let updatedFriends = [...friends];

    console.log("Applying filters - Search:", search, "Filter:", currentFilter);
    console.log("Friends before filtering:", updatedFriends);

    if (search) {
      updatedFriends = updatedFriends.filter((friend) =>
        (friend.firstName?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (friend.username?.toLowerCase() || "").includes(search.toLowerCase())
      );
    }

    if (currentFilter !== "ALL") {
      updatedFriends = updatedFriends.filter((friend) => {
        const status = friend.status?.toLowerCase() || "";
        console.log(`Friend: ${friend.firstName}, Status: ${status}`);
        return status === currentFilter.toLowerCase();
      });
    }

    console.log("Friends after filtering:", updatedFriends);
    setFilteredFriends(updatedFriends);
  };

  const handleSendFileClick = (friend) => {
    setSelectedFriend(friend);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFriend(null);
    setFile(null);
    setUploading(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit.");
      return;
    }
    console.log("Selected file:", selectedFile);
    setFile(selectedFile);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("shared_file", file);

    console.log("Uploading file to:", `http://localhost:4000/api/v1/user/friends/${selectedFriend._id}/files/share/`);
    console.log("FormData contents:", formData.get("shared_file"));

    try {
      setUploading(true);
      const response = await axios.post(
        `http://localhost:4000/api/v1/user/friends/${selectedFriend._id}/files/share/`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("File shared successfully:", response.data);
      setNotification({
        show: true,
        message: `File shared with ${selectedFriend.firstName} successfully!`,
      });
      handleCloseModal();
      setTimeout(() => setNotification({ show: false, message: "" }), 3000);
    } catch (err) {
      console.error("File sharing failed:", err);
      console.error("Error response:", err.response?.data);
      alert(err.response?.data?.message || "Failed to share file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="loading">Loading friends...</div>;
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
            <h2 className="dashboard-title glitch" data-text="My User List">My Friend List</h2>
            <p className="friends-count"></p>
          </div>
          <div className="filter-section">
            <div className="search-section">
              <input
                type="text"
                placeholder="type to search"
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="find-friend-button" onClick={handleSearch}>
                Find Friend
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
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <div key={friend._id} className="friend-item">
                  <img
                    src={friend.profilePhoto || friend.profile_photo || "https://randomuser.me/api/portraits/lego/1.jpg"}
                    alt={friend.firstName}
                    className="friend-image"
                  />
                  <div className="friend-info">
                    <h4 className="friend-name">{friend.firstName}</h4>
                    <p className="friend-username">@{friend.username}</p>
                  </div>
                  <div className="friend-actions">
                    <button
                      className="action-button send-file"
                      onClick={() => handleSendFileClick(friend)}
                    >
                      <span className="send-file-icon" role="img" aria-label="send-file">📎</span>
                      <span className="send-file-text">Send File</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No friends found.</p>
            )}
          </div>
          <div className="add-user-section">
            <button className="add-user-button" onClick={() => navigate("/add-friends")}>
              Add Friend
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={handleCloseModal}>
              ×
            </button>
            <div className="modal-body">
              <div className="upload-icon">
                <span role="img" aria-label="cloud-upload">☁️</span>
                <span className="upload-arrow">↑</span>
              </div>
              <input
                type="file"
                className="file-input-visible"
                onChange={handleFileChange}
                disabled={uploading}
              />
              {file && <p className="selected-file">Selected: {file.name}</p>}
              <button
                className="submit-button"
                onClick={handleFileUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <span className="loader">Uploading...</span>
                ) : (
                  "Submit"
                )}
              </button>
              <p className="file-size-note">MAX file size is 10MB.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
