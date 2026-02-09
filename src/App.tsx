import './App.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/Footer';
import RegisterPage from './pages/register/Register';
import LoginPage from './pages/login/Login';
import VenuesPage from './pages/venues/venues';
import VenuesDetails from './pages/venues-details/VenuesDetails';
import CustomerDashboard from './pages/customer-dashboard/CustomerDashboard';
import VenueManagerDashboard from './pages/venue-manager-dashboard/VenueManagerDashboard';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<VenuesPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/venues/:id" element={<VenuesDetails />} />
          <Route path="/customerDashboard" element={<CustomerDashboard />} />
          <Route path="/venueManagerDashboard" element={<VenueManagerDashboard />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;