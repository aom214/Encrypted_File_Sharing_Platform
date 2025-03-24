import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser, logoutUser } from "./redux/authSlice.js"; 
import Login from "./components/Login.js";
import Dashboard from "./components/Dashboard.js";
import Files from "./components/Files.js"; 
import PrivateRoute from "./components/PrivateRoute.js";
import Signup from "./components/Signup.js";
import RequestsPage from "./components/Notifications.js"; 
import AddFriendsPage from "./components/Addfrined.js";
import Home from "./components/Home.js";
import UserProfile from "./components/userprofile.js";

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.post(
          "https://cybersecurityproject-soi5.onrender.com/api/v1/user/GetUser",
          {},
          { withCredentials: true }
        );

        dispatch(setUser(response.data.user));
      } catch (error) {
        console.error("User fetch failed:", error.response?.data || error.message);
      }

      setLoading(false);
    };

    checkUser();
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  // ✅ Redirect function without alerts
  const redirectToLogin = () => <Navigate to="/login" />;

  // ✅ Reset state when logging out
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <PrivateRoute><Home onLogout={handleLogout} /></PrivateRoute> : redirectToLogin()} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
        <Route path="/profile" element={user ? <PrivateRoute><UserProfile onLogout={handleLogout} /></PrivateRoute> : redirectToLogin()} />
        <Route path="/share-file" element={user ? <PrivateRoute><Dashboard onLogout={handleLogout} /></PrivateRoute> : redirectToLogin()} />
        <Route path="/files" element={user ? <PrivateRoute><Files onLogout={handleLogout} /></PrivateRoute> : redirectToLogin()} />
        <Route path="/request" element={user ? <PrivateRoute><RequestsPage onLogout={handleLogout}/></PrivateRoute> : redirectToLogin()} />
        <Route path="/add-friends" element={user ? <PrivateRoute><AddFriendsPage onLogout={handleLogout}/></PrivateRoute> : redirectToLogin()} />
        
        {/* ✅ Catch-all route (Redirects to Home if no match is found) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
