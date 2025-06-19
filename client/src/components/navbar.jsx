import { useEffect, useState } from 'react';
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
    if (target.startsWith('#') || target.startsWith('/#')) {
      const cleanTarget = target.replace('/', '');
      return location.hash === cleanTarget ? 'active-tab' : '';
    }
<<<<<<< HEAD

    // Exact match for Home
    if (target === '/' && location.pathname === '/') return 'active-tab';

    // Exact match for other internal routes
    if (target !== '/' && location.pathname === target) return 'active-tab';
=======
    if (target === '/' && location.pathname === '/') return 'active-tab';

    if (target === '/' && location.pathname !== '/') return '';

    if (target !== '/' && location.pathname.startsWith(target)) return 'active-tab';
>>>>>>> 7e0e46399cc044739232d3cc7b849bf93dd152e0

    return '';
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
          <li style={{ paddingTop: '5px' }}>
            <Link to="/" onClick={() => setIsOpen(false)} className={isActive('/')}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setIsOpen(false)} className={isActive('/about')}>
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/our-services"
              onClick={() => setIsOpen(false)}
              className={isActive('/our-services')}
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
            <Link
              to="https://www.nimitutor.com/"
              onClick={() => setIsOpen(false)}
              className={isActive('https://www.nimitutor.com/')}
            >
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
