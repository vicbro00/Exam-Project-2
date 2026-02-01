import './App.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer';
import RegisterPage from './pages/register/register';
import LoginPage from './pages/login/login';
import VenuesPage from './pages/venues/venues';
import VenuesDetails from './pages/venues-details/venues-details'; 

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
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;