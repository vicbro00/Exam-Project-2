import './footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div>
        © 2026 Holidaze
      </div>
      <div>
        <ul>
          <li>Venues</li>
          <li>Dashboard</li>
          <li>Log in</li>
          <li>Register</li>
        </ul>
      </div>
      <div>
        <i className="bi bi-instagram"></i>
        <i className="bi bi-facebook"></i>
        <i className="bi bi-twitter-x"></i>
      </div>
    </footer>
  );
}

export default Footer;