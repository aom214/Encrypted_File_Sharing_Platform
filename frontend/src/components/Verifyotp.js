import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from 'mdb-react-ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Login.css';

const VerifyOtp = ({ onLoadComplete }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [localError, setLocalError] = useState(null);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!username) {
      console.log("No username found, redirecting to /login");
      navigate('/login');
    }
    inputRefs.current[0]?.focus();
    onLoadComplete();
  }, [username, navigate, onLoadComplete]);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    const digit = value.replace(/\D/g, '');
    if (digit.length <= 1) {
      newOtp[index] = digit;
      setOtp(newOtp);
      if (digit && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5].focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (!username) {
      setLocalError('Username not found. Please log in again.');
      navigate('/login');
      return;
    }
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setLocalError('Please enter a 6-digit OTP.');
      return;
    }
    try {
      console.log("Submitting OTP for username:", username, "OTP:", otpString);
      await dispatch(verifyOtp({ username, otp: otpString })).unwrap();
      console.log("OTP verification successful, navigating to: /");
      navigate('/');
    } catch (err) {
      console.log("OTP error:", err);
      setLocalError(err.message || 'OTP verification failed');
    } finally {
      onLoadComplete();
    }
  };

  const dismissError = () => setLocalError(null);

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
                <h4 className="mt-4 welcome-text">Verify OTP</h4>
                <p className="sub-text">Enter the 6-digit code sent to your email</p>
              </div>

              <form onSubmit={handleOtpSubmit}>
                <div className="otp-input-group mb-5">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      className="otp-input text-center"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      maxLength="1"
                      ref={(el) => (inputRefs.current[index] = el)}
                      disabled={loading}
                      required
                    />
                  ))}
                </div>

                <div className="text-center mb-4">
                  <MDBBtn className="w-100 login-btn" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Verifying...
                      </>
                    ) : (
                      'Verify OTP'
                    )}
                  </MDBBtn>
                </div>
              </form>

              <div className="text-center mt-4">
                <p className="signup-text">Need to log in again?</p>
                <MDBBtn outline className="sign-up-btn" onClick={() => navigate('/login')} disabled={loading}>
                  Back to Login
                </MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default VerifyOtp;