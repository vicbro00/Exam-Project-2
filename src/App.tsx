import './App.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer';
import RegisterPage from './pages/register/register';
import LoginPage from './pages/login/login';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;