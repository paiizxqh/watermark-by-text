import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Register.css';
import logger from '../utils/logger'; // Import logger

function Register() {
  const [username, setUsername] = useState('');
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
    if (!username || !email || !password) {
      setError('All fields are required');
      logger.error('Validation failed: All fields are required');
      return false;
    }
    if (username.length < 4 || username.length > 8) {
      setError('Username must be between 4-8 characters');
      logger.error('Validation failed: Username must be between 4-8 characters');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      logger.error('Validation failed: Invalid email format');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      logger.error('Validation failed: Password too short');
      return false;
    }
    if (hasUnsafeChars(username) || hasUnsafeChars(email) || hasUnsafeChars(password)) {
      setError('Please remove unsafe characters: <, >, {, }, [, ], |, \\, ^, %, `, ", \', ;');
      logger.error('Validation failed: Unsafe characters detected');
      return false;
    }
    return true;
  };

  const register = async () => {
    if (!validateInput()) return;

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username: cleanInput(username),
        email: cleanInput(email),
        password: cleanInput(password),
      });
      setSuccess('User registered successfully! Redirecting to login...');
      setError('');
      logger.log('User registered successfully');
      setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
      setSuccess('');
      logger.error(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="bg-white p-4 rounded shadow-sm w-100" style={{ maxWidth: '400px' }}>
        <h1 className="text-center mb-4">Register</h1>
        {error && <p className="text-danger text-center">{error}</p>}
        {success && <p className="text-success text-center">{success}</p>}
        <div className="form-group">
          <input
            className="form-control mb-3"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
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
          onClick={register}
        >
          Register
        </button>
        <p className="text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
