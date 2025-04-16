import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, setUsername } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCard,
  MDBCardBody,
} from 'mdb-react-ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Login.css';

const Login = ({ onLoadComplete }) => {
  const [username, setUsernameState] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setLoading(true); // Start loading
    try {
      const result = await dispatch(loginUser({ username, password })).unwrap();
      dispatch(setUsername(username));
      if (
        result.otpRequired ||
        result.message?.toLowerCase().includes("otp") ||
        result.message?.toLowerCase().includes("sent")
      ) {
        navigate('/verify-otp', { replace: true });
      } else {
        navigate('/');
      }
    } catch (error) {
      setLocalError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false); // Stop loading
      onLoadComplete();
    }
  };

  const dismissError = () => setLocalError(null);

  useEffect(() => {
    onLoadComplete();
  }, [onLoadComplete]);

  return (
    <MDBContainer fluid className="login-container login-page">
      <MDBRow className="d-flex justify-content-center w-100">
        <MDBCol md="8" lg="5">
          <MDBCard className="login-card">
            <MDBCardBody className="p-5">
              {localError && (
                <div className="error-notification mb-4">
                  <span>{localError}</span>
                  <button className="close-btn" onClick={dismissError}>
                    ×
                  </button>
                </div>
              )}

              <div className="text-center mb-5">
              
                <h4 className="mt-4 welcome-text">Trust Share Login</h4>
                <p className="sub-text">Access your secure account</p>
              </div>

              <form onSubmit={handleLogin}>
                <div className="input-group mb-4">
                  <label className="form-label stylish-label" htmlFor="username-input">
                    Username
                  </label>
                  <MDBInput
                    id="username-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsernameState(e.target.value)}
                    required
                    className="custom-input"
                    placeholder="Your username"
                    disabled={loading} // Disable input during loading
                  />
                </div>

                <div className="input-group mb-5">
                  <label className="form-label stylish-label" htmlFor="password-input">
                    Password
                  </label>
                  <MDBInput
                    id="password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="custom-input"
                    placeholder="Your password"
                    disabled={loading} // Disable input during loading
                  />
                </div>

                <div className="text-center mb-4">
                  <MDBBtn className="w-100 login-btn" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Securing Access...
                      </>
                    ) : (
                      'Login'
                    )}
                  </MDBBtn>
                </div>
              </form>

              <div className="text-center mt-4">
                <p className="signup-text">Not registered yet?</p>
                <MDBBtn outline className="sign-up-btn" onClick={() => navigate("/signup")} disabled={loading}>
                  Sign Up
                </MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Login;