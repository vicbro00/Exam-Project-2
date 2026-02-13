import { RegisterForm } from "../../components/auth/Register.tsx";
import { Link } from "react-router-dom";
import "./register.css";

function RegisterPage() {
  return (
    <div className="register-container">
      <div className="register-title">
        Sign up
      </div>
      <div className="register-form">
        <RegisterForm />
      </div>
      <div className="already-logged-in">
        <p>Already have an account? <Link to="/login" className="login-link">Sign in</Link></p>
      </div>
    </div>
  );
}

export default RegisterPage;