import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/NimiTechLogo1.png'; // Adjust the path as needed
import logo2 from '../assets/NimiTechLogo2.png'; // Adjust the path as needed
import { SocialLinks } from './business/landing_page/BusinessItem';
import { useMediaQuery } from '@mui/material';

const Footer = () => {
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:900px)');

  return (
    <div className="footer-container">
      <div className="footer-inner">
        {/* Left: Company Info */}
        <div className="footer-company">
          <div className="logo" style={{ display: 'flex', alignItems: 'center', margin: '4rem 0' }}>
            <Link to="/" className="logo-link">
              <img src={logo} alt="NimiTechIT Logo" className="logo" style={{ height: '90px' }} />
              <img src={logo2} alt="NimiTechIT Logo2" className="logo_2" />
            </Link>
          </div>
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
              <li>
                <a href="/courses/cybersecurity">Cybersecurity</a>
              </li>
              <li>
                <a href="/courses/web-dev">Web Development</a>
              </li>
              <li>
                <a href="/courses/ai">Artificial Intelligence</a>
              </li>
              <li>
                <a href="/courses/ml">Machine Learning</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <div style={{ flex: '1 1 300px', minWidth: '250px' }}>
              <h3
                style={{
                  marginTop: isSmallScreen ? '10px' : isMediumScreen ? '0' : '0',
                  marginBottom: '10px',
                  color: '#000',
                }}
              >
                Follow us on
              </h3>
              <SocialLinks />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
