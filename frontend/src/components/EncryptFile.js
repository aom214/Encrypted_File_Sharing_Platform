import { useState, useEffect } from "react";
import CustomNavbar from "./Navbar.js";
import "./Encrypt.css";
import bcrypt from "bcryptjs"; // For generating random bcrypt-style key

const Upload = ({ onLogout }) => {
  const [file, setFile] = useState(null);
  const [algorithm, setAlgorithm] = useState("rsa");
  const [key, setKey] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [keyError, setKeyError] = useState(null);
  const [decryptPass, setDecryptPass] = useState(null);
  const [showDecryptPass, setShowDecryptPass] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setSuccess(null);
    setDecryptPass(null);
    setShowDecryptPass(false);
  };

  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
    setKey(""); // Reset key when algorithm changes
    setKeyError(null); // Clear key error
    setDecryptPass(null);
    setShowDecryptPass(false);
  };

  const handleKeyChange = (e) => {
    const value = e.target.value;
    if (algorithm === "caesar") {
      // Allow only digits for Caesar Cipher
      if (/^\d*$/.test(value)) {
        setKey(value);
        setKeyError(null);
      } else {
        setKeyError("Caesar Cipher key must be a number.");
      }
    } else {
      // Allow any characters for RSA and AES
      setKey(value);
      setKeyError(null);
    }
  };

  const handleDownloadOriginalFile = () => {
    if (!file) return;
    const url = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file.name);
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  };

  const generateRandomBcryptKey = () => {
    const salt = bcrypt.genSaltSync(10);
    const randomString = Math.random().toString(36).substring(2, 15);
    return bcrypt.hashSync(randomString, salt).replace(/^\$2b\$10\$/, "");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    if (!key) {
      setError("Please enter an encryption key.");
      return;
    }
    if (algorithm === "caesar" && !/^\d+$/.test(key)) {
      setError("Caesar Cipher key must be a valid number.");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);
      setKeyError(null);
      setDecryptPass(null);
      setShowDecryptPass(false);

      // Simulate backend processing (no actual upload)
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay for "processing"

      // Set success message
      setSuccess("File processed successfully!");

      // Handle key return based on algorithm
      if (algorithm === "aes") {
        setDecryptPass(key); // Return the same key for AES
      } else if (algorithm === "rsa") {
        const randomKey = generateRandomBcryptKey();
        setDecryptPass(randomKey); // Return random bcrypt-style key for RSA
      }

      setShowDecryptPass(true);

      // Download the original uploaded file
      handleDownloadOriginalFile();

      // Clear form
      setFile(null);
      setKey("");
      document.getElementById("file-input").value = null;

      // Hide decrypt_pass after 10 seconds
      setTimeout(() => {
        setShowDecryptPass(false);
      }, 10000);
    } catch (err) {
      setError("Failed to process file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <CustomNavbar onLogout={onLogout} />
      <div className="upload-container">
        <div className="upload-card">
          <div className="header">
            <h2 className="upload-title glitch" data-text="Upload File">
              Encrypt File
            </h2>
          </div>
          <div className="upload-form">
            <div className="form-group">
              <label htmlFor="file-input" className="form-label">
                Select File
              </label>
              <input
                id="file-input"
                type="file"
                className="form-input"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="algorithm-select" className="form-label">
                Encryption Algorithm
              </label>
              <select
                id="algorithm-select"
                className="form-select"
                value={algorithm}
                onChange={handleAlgorithmChange}
                disabled={uploading}
              >
                <option value="rsa">RSA</option>
                <option value="aes">AES</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="key-input" className="form-label">
                Encryption Key
              </label>
              <input
                id="key-input"
                type="text"
                className={`form-input ${keyError ? "input-error" : ""}`}
                value={key}
                onChange={handleKeyChange}
                placeholder={
                  algorithm === "caesar"
                    ? "Enter a number (e.g., 3)"
                    : "Enter encryption key"
                }
                disabled={uploading}
              />
              {keyError && <div className="key-error">{keyError}</div>}
            </div>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            {showDecryptPass && decryptPass && (
              <div className="decrypt-pass">
                {algorithm === "aes" ? "Encryption Key" : "Private Key"}: <strong>{decryptPass}</strong> (This will disappear in 10 seconds)
              </div>
            )}
            <button
              className="action-button upload-file"
              onClick={handleUpload}
              disabled={uploading || keyError}
            >
              {uploading ? (
                <span>
                  Processing<span className="loader-dots">...</span>
                </span>
              ) : (
                <>
                  <span className="upload-file-icon" role="img" aria-label="upload-file">
                    ⬆️
                  </span>
                  <span className="upload-file-text">Process</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Upload;