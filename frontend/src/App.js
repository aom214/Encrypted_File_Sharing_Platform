import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser, logoutUser } from "./redux/authSlice";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Files from "./components/Files";
import PrivateRoute from "./components/PrivateRoute";
import Signup from "./components/Signup";
import RequestsPage from "./components/Notifications";
import AddFriendsPage from "./components/Addfrined"; // Assuming typo; should be AddFriends.js?
import Home from "./components/Home";
import UserProfile from "./components/userprofile";

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // Prevent state updates after unmount

    const checkUser = async () => {
      try {
        const response = await axios.post(
          "https://cybersecurityproject-soi5.onrender.com/api/v1/user/GetUser",
          {},
          { withCredentials: true }
        );
        if (isMounted) {
          dispatch(setUser(response.data.user));
        }
      } catch (error) {
        console.error("User fetch failed:", error.response?.data || error.message);
        if (isMounted) {
          dispatch(logoutUser()); // Reset state on failure
        }
      } finally {
        if (isMounted) {
          setLoading(false); // Ensure loading completes
        }
      }
    };

    checkUser();

    return () => {
      isMounted = false; // Cleanup to avoid memory leaks
    };
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  const redirectToLogin = () => <Navigate to="/login" />;

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <PrivateRoute>
                <Home onLogout={handleLogout} />
              </PrivateRoute>
            ) : (
              redirectToLogin()
            )
          }
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/profile"
          element={
            user ? (
              <PrivateRoute>
                <UserProfile onLogout={handleLogout} />
              </PrivateRoute>
            ) : (
              redirectToLogin()
            )
          }
        />
        <Route
          path="/share-file"
          element={
            user ? (
              <PrivateRoute>
                <Dashboard onLogout={handleLogout} />
              </PrivateRoute>
            ) : (
              redirectToLogin()
            )
          }
        />
        <Route
          path="/files"
          element={
            user ? (
              <PrivateRoute>
                <Files onLogout={handleLogout} />
              </PrivateRoute>
            ) : (
              redirectToLogin()
            )
          }
        />
        <Route
          path="/request"
          element={
            user ? (
              <PrivateRoute>
                <RequestsPage onLogout={handleLogout} />
              </PrivateRoute>
            ) : (
              redirectToLogin()
            )
          }
        />
        <Route
          path="/add-friends"
          element={
            user ? (
              <PrivateRoute>
                <AddFriendsPage onLogout={handleLogout} />
              </PrivateRoute>
            ) : (
              redirectToLogin()
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;