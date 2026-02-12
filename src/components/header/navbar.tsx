import Hamburger from './Hamburger';
import { Link } from 'react-router-dom';
import './navbar.css';
import { useEffect, useState } from 'react';
import { isVenueManager, isLoggedIn } from '../../services/auth';
import Logout from '../auth/Logout';

export default function Navbar() {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  
  const venueManager = isVenueManager();
  const loggedIn = isLoggedIn();

  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    if (navLinks && hamburger && !navLinks.contains(event.target as Node) && !hamburger.contains(event.target as Node)) {
      setHamburgerOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="hamburger" onClick={toggleHamburger}>
        <Hamburger />
      </div>

      <ul className={`nav-links ${hamburgerOpen ? "open" : ""}`}>
        <li>
          <Link to="/">Venues</Link>
        </li>

        {loggedIn ? (
          venueManager ? (
            <>
              <li><Link to="/venueManagerDashboard">Dashboard</Link></li>
              <li className='mobile-only'><Link to="/profile">Profile</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/customerDashboard">Dashboard</Link></li>
              <li className='mobile-only'><Link to="/profile">Profile</Link></li>
            </>
          )
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}

        {loggedIn && (
          <li className='mobile-only'>
            <Logout />
          </li>
        )}
      </ul>
    </nav>
  );
}