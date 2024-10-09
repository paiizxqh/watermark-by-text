import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../css/Login.css'; // Custom styles (if needed)

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Clean input function
  const cleanInput = (input) => {
    const cleanInput = input.replace(/[<>{}[\]|\\^%`"'`; ]/g, '');
    return cleanInput;
  };

  const hasUnsafeChars = (input) => {
    const unsafeChars = /[<>{}[\]|\\^%`"'`; ]/;
    return unsafeChars.test(input);
  };

  // Validate input function
  const validateInput = () => {
    console.log('Validating input...');
    if (!email || !password) {
      setError('Please enter Email and Password!');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (hasUnsafeChars(email) || hasUnsafeChars(password)) {
      setError('Please remove unsafe characters: <, >, {, }, [, ], |, \\, ^, %, `, ", \', ;');
      return false;
    }
    return true;
  };

  const login = async () => {
    if (!validateInput()) return; // Check input before sending request
    console.log('Sending login request...');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: cleanInput(email),
        password: cleanInput(password),
      });
      
      console.log('Login Response:', response.data); // Debug response

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Token saved to localStorage:', response.data.token);
        setSuccess('Login successful! Redirecting to home...');
        setError('');
        setTimeout(() => navigate('/home'), 2000); // Redirect after 2 seconds
      } else {
        setError('Token not received');
      }
    } catch (err) {
      console.error('Login error:', err); // Log error details
      setError(err.response?.data?.msg || 'Email or Password wrong!');
      setSuccess('');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="bg-white p-4 rounded shadow-sm w-100" style={{ maxWidth: '400px' }}>
        <h1 className="text-center mb-4">Login</h1>
        {error && <p className="text-danger text-center">{error}</p>}
        {success && <p className="text-success text-center">{success}</p>}
        <div className="form-group">
          <input
            className="form-control mb-3"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            className="form-control mb-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary w-100 mb-2"
          onClick={login}
        >
          Login
        </button>
        <p className="text-center">
          Don't have an account?{' '}
          <Link to="/" className="text-primary">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;