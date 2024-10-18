import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const cleanInput = (input) => {
    const cleanInput = input.replace(/[<>{}[\]|\\^%`"'`; ]/g, '');
    return cleanInput;
  };

  const hasUnsafeChars = (input) => {
    const unsafeChars = /[<>{}[\]|\\^%`"'`; ]/;
    return unsafeChars.test(input);
  };

  const validateInput = () => {
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
    if (!validateInput()) return;
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: cleanInput(email),
        password: cleanInput(password),
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        alert('Login successful');
        navigate('/home');
        setError('');
      } else {
        setError('Token not received');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Email or Password wrong!');
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow p-4" style={{ width: '22rem' }}>
        <h1 className="text-center mb-4">Login</h1>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <div className="mb-3">
          <input
            className="form-control"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-100" onClick={login}>
          Login
        </button>
        <p className="text-center mt-3">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;