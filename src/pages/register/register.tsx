import { useEffect } from "react";
import { RegisterForm } from "../../components/auth/Register.tsx";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../services/auth";
import "./register.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirects user to profile if already logged in
    if (isLoggedIn()) {
      navigate("/profile", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="auth-page-wrapper">
      <section className="register-container">
        <h2 className="register-title">Sign up</h2>
        <div className="register-form-wrapper">
          <RegisterForm />
        </div>
        <footer className="already-logged-in">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Sign in
            </Link>
          </p>
        </footer>
      </section>
    </div>
  );
}