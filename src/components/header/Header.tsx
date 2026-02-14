import "./header.css";
import Navbar from "./NavBar";
import ProfileHeader from "./ProfileHeader";

function Header() {
  return (
    <header className="header">
      <Navbar />
      <div className="header-title">
        <h1>Holidaze</h1>
      </div>
      <ProfileHeader />
    </header>
  );
}

export default Header;