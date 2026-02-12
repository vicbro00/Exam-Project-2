import { toast } from "react-toastify";

export default function Logout() {
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("venueManager");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    toast.success("You have successfully logged out!");

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Sign out
    </button>
  );
}