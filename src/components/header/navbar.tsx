import Hamburger from './hamburger';
import { Link } from 'react-router-dom';
import './navbar.css';
import { useState } from 'react';
import { isVenueManager, isLoggedIn } from '../../services/auth';
import Logout from '../auth/logout';

export default function Navbar() {

  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  }

  const venueManager = isVenueManager();
  const loggedIn = isLoggedIn();

  return (
    <div>
      <div className="navbar">
        <ul className={`nav-links ${hamburgerOpen ? "open" : ""}`}>
          <li>
            <Link to="/">Venues</Link>
          </li>
          {venueManager ? (
            <>
              <li><Link to="/venue-manager-dashboard">Dashboard</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </>
          ) : loggedIn ? (
            <>
              <li><Link to="/customer-dashboard">Dashboard</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </>
          ) : null}
          {loggedIn && (
            <li>
              <Logout />
            </li>
          )}
        </ul>
        <div className="hamburger" onClick={toggleHamburger}>
          <Hamburger />
        </div>
      </div>
    </div>
  );
};