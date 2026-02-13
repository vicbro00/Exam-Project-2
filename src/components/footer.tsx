import { Link } from 'react-router-dom';
import './footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-copyright">
        © {currentYear} Holidaze
      </div>
      <div className="footer-nav">
        <ul>
          <li><Link to="/">Venues</Link></li>
          <li><Link to="/profile">Dashboard</Link></li>
          <li><Link to="/login">Log in</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </div>
      <div className="footer-socials">
        <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer">
          <i className="bi bi-instagram"></i>
        </a>
        <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer">
          <i className="bi bi-facebook"></i>
        </a>
        <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noreferrer">
          <i className="bi bi-twitter-x"></i>
        </a>
      </div>
    </footer>
  );
}