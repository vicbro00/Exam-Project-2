import Hamburger from './hamburger';
import './navbar.css';
import { useState } from 'react';

export default function Navbar() {

  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  }

  return (
    <div>
      <div className="navbar">
        <ul className={`nav-links ${hamburgerOpen ? "open" : ""}`}>
          <li>Venues</li>
          <li>My bookings</li>
          <li>Dashboard</li>
          <li>Profile</li>
          <li>Log out</li>
        </ul>
        <div className="hamburger" onClick={toggleHamburger}>
          <Hamburger />
        </div>
      </div>
    </div>
  );
};