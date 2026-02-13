import './App.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

function App() {
  const { pathname } = useLocation();

  // Scrolls to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app-wrapper">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<VenuesPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/venues/:id" element={<VenuesDetails />} />
          <Route path="/customerDashboard" element={<CustomerDashboard />} />
          <Route path="/venueManagerDashboard" element={<VenueManagerDashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        theme="light"
      />
    </div>
  );
}

export default App;