import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Hamburger from "./Hamburger";
import Logout from "../auth/Logout";
import { isVenueManager, isLoggedIn } from "../../services/auth";
import "./navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const venueManager = isVenueManager();
  const loggedIn = isLoggedIn();

  // Closes the navbar menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Chooses which dashboard link to show based on user
  const dashboardPath = venueManager ? "/venueManagerDashboard" : "/customerDashboard";

  return (
    <nav className="navbar" ref={navRef}>
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <Hamburger />
      </div>
      <ul className={`nav-links ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(false)}>
        <li><Link to="/">Venues</Link></li>
        {loggedIn ? (
          <>
            <li><Link to={dashboardPath}>Dashboard</Link></li>
            <li className="mobile-only"><Link to="/profile">Profile</Link></li>
            <li className="mobile-only"><Logout /></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}