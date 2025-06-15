import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/NimiTechLogo1.png'; // Adjust the path as
import logo2 from '../assets/NimiTechLogo2.png'; // Adjust the path as

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup on unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-left">
        <div className="logo_wrapper">
          <Link to="/" className="logo-link">
            <img src={logo} alt="NimiTechIT Logo" className="logo" />
            <img src={logo2} alt="NimiTechIT Logo2" className="logo_2" />
          </Link>
        </div>

        {/* Hamburger for mobile */}

        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          <li>
            <Link to="/#about" onClick={() => setIsOpen(false)}>
              About Us
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
          {isOpen && (
            <div className="contact-us-mobile">
              <button className="contact-btn-mobile" onClick={() => setIsOpen(false)}>
                Contact Us
              </button>
            </div>
          )}
        </ul>
      </div>

      <div className="navbar-right">
        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
          <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        </button>
      </div>

      {/* Contact button */}
      <div className={`contact-btn-container`}>
        <button className="contact-btn">Contact Us</button>
      </div>
    </nav>
  );
};

export default Navbar;
