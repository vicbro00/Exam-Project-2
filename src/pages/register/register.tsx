import { RegisterForm } from '../../components/auth/Register.tsx';
import { Link } from 'react-router-dom';
import './register.css';

function RegisterPage() {
  return (
    <div className='registerParent'>
      <div>
        Sign up
      </div>
      <div className='registerForm'>
        <RegisterForm />
      </div>
      <div className='alreadyLoggedIn'>
        <p>Already have an account? <Link to="/login" className='loginLink'>Sign in</Link></p>
      </div>
    </div>
  );
}

export default RegisterPage;