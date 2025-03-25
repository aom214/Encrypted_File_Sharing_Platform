import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigation } from "react-router-dom";
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
import "bootstrap/dist/css/bootstrap.min.css"; // Assuming you're using Bootstrap globally

// Loader Component
const Loader = () => (
  <div className="loader-container d-flex align-items-center justify-content-center vh-100">
    <div className="text-center">
      <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-light">Loading...</p>
    </div>
  </div>
);

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true); // Initial loading state

  useEffect(() => {
    let isMounted = true;

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
          dispatch(logoutUser());
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkUser();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  // Show loader during initial user check
  if (loading) return <Loader />;

  const redirectToLogin = () => <Navigate to="/login" />;

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <Router>
      <AppWithLoader
        user={user}
        redirectToLogin={redirectToLogin}
        handleLogout={handleLogout}
      />
    </Router>
  );
};

// Separate component to handle route transitions with loader
const AppWithLoader = ({ user, redirectToLogin, handleLogout }) => {
  const [routeLoading, setRouteLoading] = useState(false);
  const navigation = useNavigation(); // Hook to detect navigation state (React Router v6.4+)

  // Detect navigation state changes
  useEffect(() => {
    if (navigation.state === "loading") {
      setRouteLoading(true);
    } else {
      setRouteLoading(false);
    }
  }, [navigation.state]);

  if (routeLoading) return <Loader />;

  return (
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
  );
};

export default App;