import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, isVenueManager } from '../../services/auth';
import UpcomingBookings from '../../components/dashboards/UpcomingBookings';
import './venue-manager-dashboard.css';

export default function VenueManagerDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  
  const loggedIn = isLoggedIn();
  const isManager = isVenueManager();

  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    } else if (!isManager) {
      navigate('/customerDashboard');
    }
  }, [navigate, loggedIn, isManager]);

  if (!loggedIn || !isManager) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Venue Manager Dashboard</h1>
        <p>Welcome back, {userName || 'Manager'}!</p>
      </header>

      <div className="dashboard-content">
        <UpcomingBookings isManager={true} />
      </div>
    </div>
  );
}