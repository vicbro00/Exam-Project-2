import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, isVenueManager } from "../../services/auth";
import UpcomingBookings from "../../components/dashboards/UpcomingBookings";
import "./dashboard.css";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    } else if (isVenueManager()) {
      navigate("/venueManagerDashboard");
    }
  }, [navigate]);
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>My Dashboard</h1>
        <p>Welcome back, {userName || "Customer"}!</p>
      </header>
      
      <div className="dashboard-content">
        <UpcomingBookings isManager={false} />
      </div>
    </div>
  );
}