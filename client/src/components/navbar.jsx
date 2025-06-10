import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/NimiTechLogo.png'; // Adjust the path as

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="NimiTechIT Logo" className="logo" />
          </Link>
        </div>

        {/* Hamburger for mobile */}
        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        </button>

        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          <li>
            <Link to="/#about" onClick={() => setIsOpen(false)}>
              About
            </Link>
          </li>
          <li>
            <Link to="/#services" onClick={() => setIsOpen(false)}>
              Services
            </Link>
          </li>
          <li>
            <Link to="/blogs" onClick={() => setIsOpen(false)}>
              Blogs
            </Link>
          </li>
          <li>
            <Link to="/#care" onClick={() => setIsOpen(false)}>
              Online training
            </Link>
          </li>
        </ul>
      </div>

      {/* Contact button */}
      <div className={`contact-btn-container ${isOpen ? 'mobile-open' : ''}`}>
        <button className="contact-btn">Contact support</button>
      </div>
    </nav>
  );
};

export default Navbar;
