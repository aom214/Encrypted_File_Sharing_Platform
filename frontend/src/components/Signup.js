import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../redux/registerSlice";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Login.css";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.register);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    profilePhoto: null,
  });

  const [localError, setLocalError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setFormData((prev) => ({ ...prev, profilePhoto: null }));
        setLocalError("Only image files (PNG, JPG, JPEG, GIF, WebP) are allowed.");
        return;
      }
      setFormData((prev) => ({ ...prev, profilePhoto: file }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      const result = await dispatch(registerUser(formData)).unwrap();
      navigate("/login");
    } catch (err) {
      setLocalError(err.message || "Signup failed. Please try again.");
    }
  };

  const dismissError = () => setLocalError(null);

  const input_group={
    "width":"140px"
  }

  return (
    <MDBContainer fluid className="login-container signup-page">
      <MDBRow className="d-flex justify-content-center w-100">
        <MDBCol md="8" lg="5">
          <MDBCard className="login-card">
            <MDBCardBody className="p-5">
              {(localError || (error && !loading)) && (
                <div className="error-notification mb-4">
                  <span>{localError || error}</span>
                  <button className="close-btn" onClick={dismissError}>
                    ×
                  </button>
                </div>
              )}

              <div className="text-center mb-5">
                <img
                  src="https://i.imgur.com/pMW2Ee2.png"
                  className="logo"
                  alt="CyberSec Logo"
                />
                <h4 className="mt-4 welcome-text">Cyber Security Signup</h4>
                <p className="sub-text">Register to secure your access</p>
              </div>

              <form onSubmit={handleSignup}>
                <div className="input-group mb-4">
                  <label className="form-label stylish-label" htmlFor="firstName-input">
                    First Name
                  </label>
                  <MDBInput
                    id="firstName-input"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="custom-input"
                    style={{'width':'314px'}}
                    placeholder="Your first name"
                  />
                </div>

                <div className="input-group mb-4">
                  <label className="form-label stylish-label" htmlFor="lastName-input">
                    Last Name
                  </label>
                  <MDBInput
                    id="lastName-input"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="custom-input"
                    style={{'width':'314px'}}
                    placeholder="Your last name"
                  />
                </div>

                <div className="input-group mb-4">
                  <label className="form-label stylish-label" htmlFor="email-input">
                    Email
                  </label>
                  <MDBInput
                    id="email-input"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="custom-input"
                    style={{'width':'314px'}}
                    placeholder="Your email"
                  />
                </div>

                <div className="input-group mb-4">
                  <label className="form-label stylish-label"  htmlFor="username-input">
                    Username
                  </label>
                  <MDBInput
                    id="username-input"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    style={{'width':'314px'}}
                    className="custom-input"
                    placeholder="Your username"
                  />
                </div>

                <div className="input-group mb-5">
                  <label className="form-label stylish-label" htmlFor="password-input">
                    Password
                  </label>
                  <MDBInput
                    id="password-input"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="custom-input"
                    placeholder="Your password"
                    style={{'width':'314px'}}
                  />
                </div>

                <div className="input-group mb-5">
                  <label className="form-label stylish-label" htmlFor="photo-input">
                    Photo
                  </label>
                  <input
                    id="photo-input"
                    type="file"
                    className="custom-file-input"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{'width':'314px'}}
                  />
                </div>

                <div className="text-center mb-4">
                  <MDBBtn className="w-100 login-btn" type="submit" disabled={loading}>
                    {loading ? "Securing Access..." : "Register"}
                  </MDBBtn>
                </div>
              </form>

              <div className="text-center mt-4">
                <p className="signup-text">Already registered?</p>
                <MDBBtn outline className="sign-up-btn" onClick={() => navigate("/login")}>
                  Login
                </MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Signup;