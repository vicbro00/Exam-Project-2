import Hamburger from './Hamburger';
import { Link } from 'react-router-dom';
import './navbar.css';
import { useState } from 'react';
import { isVenueManager, isLoggedIn } from '../../services/auth';
import Logout from '../auth/Logout';

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

          {loggedIn ? (
            // If logged in, show dashboards and profile
            venueManager ? (
              <>
                <li><Link to="/venueManagerDashboard">Dashboard</Link></li>
                <li><Link to="/profile">Profile</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/customerDashboard">Dashboard</Link></li>
                <li><Link to="/profile">Profile</Link></li>
              </>
            )
          ) : (
            // If not logged in, show login and register
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}

          {/* Logout button only shows if logged in */}
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