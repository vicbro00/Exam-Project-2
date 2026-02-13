import { LoginForm } from "../../components/auth/Login";
import { Link } from "react-router-dom";
import "./login.css";

function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-title">
        Sign in
      </div>
      <div className="login-form">
        <LoginForm />
      </div>
      <div className="no-account">
        <p>Dont have an account? <Link to="/register" className="register-link">Sign up</Link></p>
      </div>
    </div>
  );
}

export default LoginPage;