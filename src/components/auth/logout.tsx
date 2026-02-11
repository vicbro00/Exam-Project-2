import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Logout() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("venueManager");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    toast.success("You have successfully logged out!");
    navigate("/");
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Sign out
    </button>
  );
}