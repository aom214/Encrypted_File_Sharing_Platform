import { useState, useEffect } from "react";
import CustomNavbar from "./Navbar.js";
import axios from "axios";
import "./Files.css";

const Files = ({ onLogout }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingFileId, setDownloadingFileId] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/user/AllFiles", {
          withCredentials: true,
        });
        const filesData = response.data.file || response.data || [];
        console.log("Fetched files:", filesData);
        setFiles(filesData);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch files");
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const handleDownload = async (fileId, fileName, fileType) => {
    try {
      setDownloadingFileId(fileId);
      console.log("Requesting decrypted file for ID:", fileId);

      const decryptResponse = await axios.get(
        `http://localhost:4000/api/v1/user/AllFiles/${fileId}/decrypt`,
        { withCredentials: true }
      );
      const decryptedFileUrl = decryptResponse.data.file;
      console.log("Decrypted file URL:", decryptedFileUrl);

      if (!decryptedFileUrl) {
        throw new Error("Decrypted file URL not found in response");
      }

      const fileResponse = await axios.get(decryptedFileUrl.secure_url, {
        responseType: "blob",
      });
      console.log("Decrypted file downloaded, Blob size:", fileResponse.data.size);

      const adjustedFileName = fileName.includes(fileType) ? fileName : `${fileName}${fileType}`;
      console.log("Adjusted filename:", adjustedFileName);

      const url = window.URL.createObjectURL(new Blob([fileResponse.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", adjustedFileName || "decrypted_file");
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      link.remove();
    } catch (err) {
      console.error("Download failed:", err.response?.data || err.message);
      alert(`Failed to download file: ${err.message}`);
    } finally {
      setDownloadingFileId(null);
    }
  };

  if (loading) return <div className="loading">Loading files...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      <CustomNavbar onLogout={onLogout} />
      <div className="files-container">
        <div className="files-card">
          <div className="header">
            <h2 className="files-title glitch" data-text="Received Files">Received Files</h2>
            <p className="files-count">{files.length} Files</p>
          </div>
          <div className="files-list">
            {files.length > 0 ? (
              files.map((file) => {
                const fileName = file.fileUrl.split("/").pop();
                const isDownloading = downloadingFileId === file._id;

                return (
                  <div key={file._id} className="file-item">
                    <div className="file-info">
                      <h4 className="file-name">{fileName}</h4>
                      <p className="file-sender">
                        From: {file.senderId?.firstName || "Unknown Sender"} (@{file.senderId?.username || "unknown"})
                      </p>
                      <p className="file-type">Type: {file.file_type}</p>
                      <p className="file-status">Status: {file.open ? "Opened" : "Not Opened"}</p>
                      <p className="file-date">
                        Received: {file.createdAt ? new Date(file.createdAt).toLocaleString() : "Unknown Date"}
                      </p>
                    </div>
                    <div className="file-actions">
                      {isDownloading ? (
                        <div className="downloading-text">
                          Downloading<span className="loader-dots">...</span>
                        </div>
                      ) : (
                        <button
                          className="action-button download-file"
                          onClick={() => handleDownload(file._id, fileName, file.file_type)}
                          disabled={isDownloading}
                        >
                          <span className="download-file-icon" role="img" aria-label="download-file">
                            ⬇️
                          </span>
                          <span className="download-file-text">Download</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="no-results">No files received.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Files;