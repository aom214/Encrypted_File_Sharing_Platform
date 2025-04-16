import { useState } from "react";
import CustomNavbar from "./Navbar.js";
import "./Decrypt.css";

const Decrypt = ({ onLogout }) => {
  const [file, setFile] = useState(null);
  const [algorithm, setAlgorithm] = useState("rsa");
  const [pass, setPass] = useState("");
  const [decrypting, setDecrypting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passError, setPassError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setSuccess(null);
  };

  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
    setPass(""); // Reset password when algorithm changes
    setPassError(null); // Clear password error
  };

  const handlePassChange = (e) => {
    const value = e.target.value;
    if (algorithm === "caesar") {
      // Allow only digits for Caesar Cipher
      if (/^\d*$/.test(value)) {
        setPass(value);
        setPassError(null);
      } else {
        setPassError("Caesar Cipher password must be a number.");
      }
    } else {
      // Allow any characters for RSA and AES
      setPass(value);
      setPassError(null);
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

  const handleDecrypt = async () => {
    if (!file) {
      setError("Please select a file to decrypt.");
      return;
    }
    if (!pass) {
      setError("Please enter a decryption password.");
      return;
    }
    if (algorithm === "caesar" && !/^\d+$/.test(pass)) {
      setError("Caesar Cipher password must be a valid number.");
      return;
    }

    try {
      setDecrypting(true);
      setError(null);
      setSuccess(null);
      setPassError(null);

      // Simulate decryption processing (no backend call)
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay for "decrypting"

      // Set success message
      setSuccess("File decrypted successfully!");

      // Download the original uploaded file
      handleDownloadOriginalFile();

      // Clear form
      setFile(null);
      setPass("");
      document.getElementById("file-input").value = null;
    } catch (err) {
      setError("Failed to decrypt file.");
    } finally {
      setDecrypting(false);
    }
  };

  return (
    <>
      <CustomNavbar onLogout={onLogout} />
      <div className="decrypt-container">
        <div className="decrypt-card">
          <div className="header">
            <h2 className="decrypt-title glitch" data-text="Decrypt File">
              Decrypt File
            </h2>
          </div>
          <div className="decrypt-form">
            <div className="form-group">
              <label htmlFor="file-input" className="form-label">
                Select File
              </label>
              <input
                id="file-input"
                type="file"
                className="form-input"
                onChange={handleFileChange}
                disabled={decrypting}
              />
            </div>
            <div className="form-group">
              <label htmlFor="algorithm-select" className="form-label">
                Which Algorithm was used
              </label>
              <select
                id="algorithm-select"
                className="form-select"
                value={algorithm}
                onChange={handleAlgorithmChange}
                disabled={decrypting}
              >
                <option value="rsa">RSA</option>
                <option value="aes">AES</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="pass-input" className="form-label">
                Decryption Password
              </label>
              <input
                id="pass-input"
                type="text"
                className={`form-input ${passError ? "input-error" : ""}`}
                value={pass}
                onChange={handlePassChange}
                placeholder={
                  algorithm === "caesar"
                    ? "Enter a number (e.g., 3)"
                    : "Enter decryption password"
                }
                disabled={decrypting}
              />
              {passError && <div className="pass-error">{passError}</div>}
            </div>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <button
              className="action-button decrypt-file"
              onClick={handleDecrypt}
              disabled={decrypting || passError}
            >
              {decrypting ? (
                <span>
                  Decrypting<span className="loader-dots">...</span>
                </span>
              ) : (
                <>
                  <span
                    className="decrypt-file-icon"
                    role="img"
                    aria-label="decrypt-file"
                  >
                    🔓
                  </span>
                  <span className="decrypt-file-text">Decrypt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Decrypt;