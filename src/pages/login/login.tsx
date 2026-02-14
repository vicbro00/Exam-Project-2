import { LoginForm } from "../../components/auth/Login";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isLoggedIn } from "../../services/auth";
import "./login.css";

export default function LoginPage() {
  const navigate = useNavigate();

  // Redirects user to profile if already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/profile");
    }
  }, [navigate]);

  return (
    <div className="login-page-wrapper">
      <section className="login-container">
        <h1 className="login-title">Sign in</h1>
        <div className="login-form-content">
          <LoginForm />
        </div>
        <footer className="no-account">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="register-link">
              Sign up
            </Link>
          </p>
        </footer>
      </section>
    </div>
  );
}