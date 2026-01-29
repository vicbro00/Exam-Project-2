export default function Logout() {
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("venueManager");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    window.location.href = "/";
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Sign out
    </button>
  );
}