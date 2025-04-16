import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from './Navbar.js';
import ChatWidget from './ChatWidget.js';
import './Home.css';
import '../styles/ChatWidget.css';

const Home = ({ onLogout }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleScroll = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="home-container">
      <CustomNavbar onLogout={onLogout} />

      {/* Hero Section */}
      <section id="home" className={`hero ${isVisible ? 'fade-in' : ''}`}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title glitch" data-text="Share Files Securely">Share Files Securely</h1>
          <p className="hero-subtitle">An encrypted app which share files to other in encrypted manner</p>
          <button className="cta-btn" onClick={() => navigate("/share-file")}>
            Share Files
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <h2 className="section-title glitch" data-text="How your files are protected">How your files are protected</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="card-icon">🛡️</div>
            <h3>Secure Login</h3>
            <p>All login information are hashed no one can decrypt it.</p>
          </div>
          <div className="service-card">
            <div className="card-icon">🔒</div>
            <h3>Data Encryption</h3>
            <p>Files are being send end to end in encrypted manner.</p>
          </div>
          <div className="service-card">
            <div className="card-icon">⚔️</div>
            <h3>No-saving Files</h3>
            <p>Only decrypted files are being save in database this ensures that even if hacker gets your file they cannot able to decrypt it.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <h2 className="section-title glitch" data-text="Why Choose Us?">Why Choose Us?</h2>
        <p className="about-text">Transparency & Trust We believe in openness and security, ensuring you have complete control over your data.No hidden tracking, no unauthorized access—just secure file sharing, the way it should be.</p>
        <div className="stats">
          <div className="stat-item"><span>100+</span> Files in Databse</div>
          <div className="stat-item"><span>0</span> charge fees</div>
          <div className="stat-item"><span>99.9%</span> Threat proof</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Ahmedabad University. All rights reserved.</p>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default Home;