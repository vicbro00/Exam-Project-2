import './header.css';
import Navbar from './navbar.tsx';
import Profile from './auth/profile.tsx';

function Header() {
  return (
    <header className="header">
      <div>
        <Navbar />
        <div>
          Holidaze
        </div>
        <Profile />
      </div>
    </header>
  );
}

export default Header;