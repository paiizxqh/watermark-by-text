import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  //clean
  const cleanInput = (input) => {
    const cleanInput = input.replace(/[<>{}[\]|\\^%`"'`; ]/g, '');
    return cleanInput;
  };

  const hasUnsafeChars = (input) => {
    const unsafeChars = /[<>{}[\]|\\^%`"'`; ]/;
    return unsafeChars.test(input);
  };

  //validate
  const validateInput = () => {
    if (!username || !email || !password) {
      setError('All fields are required');
      return false;
    }
    if (username.length < 4 || username.length > 8) {
      setError('Username must be between 4-8 characters');
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
    if (hasUnsafeChars(username) || hasUnsafeChars(email) || hasUnsafeChars(password)) {
      setError('Please remove unsafe characters: <, >, {, }, [, ], |, \\, ^, %, `, ", \', ;');
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
      alert('User registered successfully');
      navigate('/login');
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow p-4" style={{ width: '22rem' }}>
        <h1 className="text-center mb-4">Register</h1>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <div className="mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
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
        <button className="btn btn-primary w-100" onClick={register}>
          Register
        </button>
        <p className="text-center mt-3">
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
