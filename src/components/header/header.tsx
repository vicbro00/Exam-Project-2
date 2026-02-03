import './header.css';
import Navbar from './NavBar.tsx';
import Profile from '../auth/Profile.tsx';
import { isLoggedIn } from '../../services/auth.ts';

function Header() {
  return (
    <header className="header">
      <Navbar />
      <div className='spacer'></div>
      <div>
        <h1>
          Holidaze
        </h1>
      </div>
      <div className='spacer'></div>
      <div className='d-none d-md-block'>
        {isLoggedIn() && <Profile />}
      </div>
    </header>
  );
}

export default Header;