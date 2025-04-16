import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser, logoutUser } from "./redux/authSlice";
import Login from "./components/Login";
import Signup from "./components/Signup";
import VerifyOtp from "./components/Verifyotp";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Files from "./components/Files";
import RequestsPage from "./components/Notifications";
import AddFriendsPage from "./components/Addfrined";
import UserProfile from "./components/userprofile";
import PrivateRoute from "./components/PrivateRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import EncryptFile from "./components/EncryptFile";
import DecryptFile from "./components/Decrypt"
import Admin from "./components/Admin"

// Loader Component
const Loader = () => (
  <div className="loader-container d-flex align-items-center justify-content-center vh-100">
    <div className="text-center">
      <div
        className="spinner-border text-primary"
        style={{ width: "3rem", height: "3rem" }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-light">Loading...</p>
    </div>
  </div>
);

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [initialLoading, setInitialLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkUser = async () => {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/v1/user/GetUser",
          {},
          { withCredentials: true }
        );
        console.log("Initial user check:", response.data);
        if (isMounted) {
          dispatch(setUser(response.data.user));
        }
      } catch (error) {
        console.error(
          "User fetch failed:",
          error.response?.data || error.message
        );
        if (isMounted) {
          dispatch(logoutUser());
        }
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    };

    // Skip checkUser during OTP flow
    if (window.location.pathname !== '/verify-otp') {
      checkUser();
    } else {
      setInitialLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  if (initialLoading) return <Loader />;

  const redirectToLogin = () => <Navigate to="/login" />;

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <Router>
      <AppRoutes
        user={user}
        redirectToLogin={redirectToLogin}
        handleLogout={handleLogout}
        setRouteLoading={setRouteLoading}
      />
      {routeLoading && <Loader />}
    </Router>
  );
};

const AppRoutes = ({
  user,
  redirectToLogin,
  handleLogout,
  setRouteLoading,
}) => {
  const location = useLocation();

  useEffect(() => {
    setRouteLoading(true);
    console.log(`Route changed to: ${location.pathname}, loading: true`);

    const timeout = setTimeout(() => {
      setRouteLoading(false);
      console.log("Route change timeout, loading: false");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [location.pathname, setRouteLoading]);

  console.log("User state:", user, "Path:", location.pathname);

  const stopLoading = () => {
    setRouteLoading(false);
    console.log("Component loaded, loading: false");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <PrivateRoute>
              <Admin onLogout={handleLogout} onLoadComplete={stopLoading} />
            </PrivateRoute>
          ) : (
            redirectToLogin()
          )
        }
      />
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/" />
          ) : (
            <Login onLoadComplete={stopLoading} />
          )
        }
      />
      <Route
        path="/signup"
        element={
          user ? (
            <Navigate to="/" />
          ) : (
            <Signup onLoadComplete={stopLoading} />
          )
        }
      />
      <Route
        path="/verify-otp"
        element={<VerifyOtp onLoadComplete={stopLoading} />}
      />
      <Route
        path="/profile"
        element={
          user ? (
            <PrivateRoute>
              <UserProfile onLogout={handleLogout} onLoadComplete={stopLoading} />
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
              <Dashboard onLogout={handleLogout} onLoadComplete={stopLoading} />
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
              <Files onLogout={handleLogout} onLoadComplete={stopLoading} />
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
              <RequestsPage onLogout={handleLogout} onLoadComplete={stopLoading} />
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
              <AddFriendsPage onLogout={handleLogout} onLoadComplete={stopLoading} />
            </PrivateRoute>
          ) : (
            redirectToLogin()
          )
        }
      />
      <Route
        path="/EncryptFile"
        element={
          user ? (
            <PrivateRoute>
              <EncryptFile onLogout={handleLogout} onLoadComplete={stopLoading} />
            </PrivateRoute>
          ) : (
            redirectToLogin()
          )
        }
      />
      <Route
        path="/DecryptFile"
        element={
          user ? (
            <PrivateRoute>
              <DecryptFile onLogout={handleLogout} onLoadComplete={stopLoading} />
            </PrivateRoute>
          ) : (
            redirectToLogin()
          )
        }
      />
      <Route
        path="/Admin"
        element={
          user ? (
            <PrivateRoute>
              <Admin onLogout={handleLogout} onLoadComplete={stopLoading} />
            </PrivateRoute>
          ) : (
            redirectToLogin()
          )
        }
      />
    </Routes>
  );
};

export default App;