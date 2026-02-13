import { Link } from "react-router-dom";
import Logout from "../auth/Logout";
import { getUser, isLoggedIn } from "../../services/auth";
import "./header.css";

export default function ProfileHeader() {
  const user = getUser();
  const loggedIn = isLoggedIn();

  return (
    <div>
      {loggedIn && (
        <div className="desktop-profile">
          <Link to="/profile" className="avatar-link">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="avatar-img" />
            ) : (
              // Bootstrap icon as fallback incase user doesn't have an avatar
              <i className="bi bi-person-circle avatar-icon"></i>
            )}
          </Link>
          <Logout />
        </div>
      )}
    </div>
  )
}