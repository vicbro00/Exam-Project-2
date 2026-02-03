import { LoginForm } from '../../components/auth/Login';
import { Link } from 'react-router-dom';
import './login.css';

function LoginPage() {
  return (
    <div className='loginParent'>
      <div>
        Sign in
      </div>
      <div className='loginForm'>
        <LoginForm />
      </div>
      <div className='noAccount'>
        <p>Dont have an account? <Link to="/register" className='registerLink'>Sign up</Link></p>
      </div>
    </div>
  );
}

export default LoginPage;