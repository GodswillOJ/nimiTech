import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/NimiTechLogo1.png';
import logo2 from '../assets/NimiTechLogo2.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (target) => {
    // Handle hash links
    if (target.startsWith('#') || target.startsWith('/#')) {
      const cleanTarget = target.replace('/', '');
      return location.hash === cleanTarget ? 'active-tab' : '';
    }

    // Exact match for home
    if (target === '/' && location.pathname === '/') return 'active-tab';

    // Match nested paths
    return location.pathname.startsWith(target) ? 'active-tab' : '';
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-left">
        <div className="logo_wrapper">
          <Link to="/" className="logo-link">
            <img src={logo} alt="NimiTechIT Logo" className="logo" />
            <img src={logo2} alt="NimiTechIT Logo2" className="logo_2" />
          </Link>
        </div>

        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          <li>
            <Link to="/#about" onClick={() => setIsOpen(false)} className={isActive('/#about')}>
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/#services"
              onClick={() => setIsOpen(false)}
              className={isActive('/#services')}
            >
              Services
            </Link>
          </li>
          <li>
            <Link to="/blogs" onClick={() => setIsOpen(false)} className={isActive('/blogs')}>
              Blogs
            </Link>
          </li>
          <li>
            <Link to="/#care" onClick={() => setIsOpen(false)} className={isActive('/#care')}>
              Online Training
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

      <div className="contact-btn-container">
        <button className="contact-btn">Contact Us</button>
      </div>
    </nav>
  );
};

export default Navbar;
