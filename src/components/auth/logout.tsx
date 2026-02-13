import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); 

    toast.success("Logged out successfully!");

    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Sign out
    </button>
  );
}