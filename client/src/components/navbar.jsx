import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">NimiTech</div>

        {/* Hamburger for mobile */}
        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        </button>

        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          <li><a href="#about" onClick={() => setIsOpen(false)}>About</a></li>
          <li><a href="#services" onClick={() => setIsOpen(false)}>Services</a></li>
          <li><a href="#blogs" onClick={() => setIsOpen(false)}>Blogs</a></li>
          <li><a href="#care" onClick={() => setIsOpen(false)}>Care</a></li>
        </ul>
      </div>

      {/* Contact button */}
      <div className={`contact-btn-container ${isOpen ? 'mobile-open' : ''}`}>
        <button className="contact-btn">Welcome to NimiTechIT</button>
      </div>
    </nav>
  );
};

export default Navbar;
