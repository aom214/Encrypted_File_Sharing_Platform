import React from "react";
import { Bar } from "react-chartjs-2";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import "bootstrap/dist/css/bootstrap.min.css";
import CustomNavbar from "./Navbar.js";
import "../styles/admin.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Admin = ({ onLogout }) => {
  // Static data
  const totalFiles = 150;
  const totalUsers = 75;
  const activeUsers = 50;
  const fileSharingData = {
    labels: [
      "10 days ago",
      "9 days ago",
      "8 days ago",
      "7 days ago",
      "6 days ago",
      "5 days ago",
      "4 days ago",
      "3 days ago",
      "2 days ago",
      "Yesterday",
    ],
    datasets: [
      {
        label: "Files Shared",
        data: [5, 8, 0, 12, 0, 0, 4, 15, 7, 10],
        backgroundColor: "rgba(0, 212, 255, 0.9)",
        borderColor: "#00d4ff",
        borderWidth: 1,
        hoverBackgroundColor: "#00b7eb",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
          font: {
            family: "'Roboto Mono', monospace",
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Files Shared in Last 10 Days",
        color: "#00d4ff",
        font: {
          family: "'Orbitron', sans-serif",
          size: 18,
          weight: "bold",
        },
        padding: {
          bottom: 15,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
          font: {
            family: "'Roboto Mono', monospace",
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#ffffff",
          font: {
            family: "'Roboto Mono', monospace",
          },
          stepSize: 5,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
  };

  return (
    <>
      <CustomNavbar onLogout={onLogout} />
      <MDBContainer fluid className="admin-container">
        <header className="admin-header">
          <h1 className="admin-title">TrustShare Admin Dashboard</h1>

          <p className="admin-subtitle">Real-Time System Insights</p>
        </header>

        <MDBRow className="g-4">
          <MDBCol md="6" lg="4">
            <MDBCard className="stat-card" aria-label="Total Files in Database">
              <MDBCardBody className="text-center">
                <h5 className="stat-title">Total Files</h5>
                <div className="stat-value">24</div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol md="6" lg="4">
            <MDBCard className="stat-card" aria-label="Total Users">
              <MDBCardBody className="text-center">
                <h5 className="stat-title">Total Users</h5>
                <div className="stat-value">11</div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol md="6" lg="4">
            <MDBCard className="stat-card" aria-label="Active Users">
              <MDBCardBody className="text-center">
                <h5 className="stat-title">Active Users</h5>
                <div className="stat-value">04</div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol xs="12">
            <MDBCard className="stat-card" aria-label="File Sharing Chart">
              <MDBCardBody>
                <h5 className="stat-title text-center">Files Shared (Last 10 Days)</h5>
                <div className="chart-wrapper">
                  <Bar data={fileSharingData} options={chartOptions} />
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default Admin;