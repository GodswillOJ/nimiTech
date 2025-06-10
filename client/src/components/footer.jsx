import React from 'react';

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-inner">

        {/* Left: Company Info */}
        <div className="footer-company">
          <img
            src="/logo192.png" // Replace with your actual logo path
            alt="Company Logo"
            className="footer-logo"
          />
          <p className="footer-contact">+1 (555) 123-4567</p>
          <p className="footer-contact">123 Main Street, New York, NY, USA</p>
          <div className="footer-links">
            <a href="/terms">Terms & Conditions</a>
            <a href="/about">About</a>
            <a href="/services">Services</a>
          </div>
        </div>

        {/* Right: Courses and Socials */}
        <div className="footer-sections">
          <div className="footer-section">
            <h2>Courses</h2>
            <ul>
              <li><a href="/courses/cybersecurity">Cybersecurity</a></li>
              <li><a href="/courses/web-dev">Web Development</a></li>
              <li><a href="/courses/ai">Artificial Intelligence</a></li>
              <li><a href="/courses/ml">Machine Learning</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h2>Follow Us</h2>
            <ul className="social-links">
              <li><a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a></li>
              <li><a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a></li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Footer;
