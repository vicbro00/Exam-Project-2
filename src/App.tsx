import './App.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/Footer';
import RegisterPage from './pages/register/Register';
import LoginPage from './pages/login/Login';
import VenuesPage from './pages/venues/Venues';
import VenuesDetails from './pages/venues-details/VenuesDetails';
import CustomerDashboard from './pages/customer-dashboard/CustomerDashboard';
import VenueManagerDashboard from './pages/venue-manager-dashboard/VenueManagerDashboard';
import Profile from './pages/profile/Profile';
import Spinner from './components/Spinner';

function App() {
  const location = useLocation();
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setRouteLoading(true);

    const timer = setTimeout(() => {
      setRouteLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {routeLoading && <Spinner />}
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<VenuesPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/venues/:id" element={<VenuesDetails />} />
          <Route path="/customerDashboard" element={<CustomerDashboard />} />
          <Route path="/venueManagerDashboard" element={<VenueManagerDashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            theme="light"
          />
      </main>
      <Footer />
    </>
  );
}

export default App;