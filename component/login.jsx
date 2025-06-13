import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import Navbar from './navbaar';

export default function Login() {
  const [form, setForm] = useState({ empId: '', password: '' });
  const [status, setStatus] = useState('');
  const navigate = useNavigate();



  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', form);

      // ✅ Save user data in localStorage
      localStorage.setItem('empId', res.data.empId);
      localStorage.setItem('empName', res.data.name);

      setStatus(`Welcome, ${res.data.name}`);
      navigate('/dashboard/attendance');
    } catch (err) {
      setStatus('Login failed: ' + (err.response?.data?.error || 'Server error'));
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <h2>Employee Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Employee ID:</label>
            <input type="text" name="empId" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" name="password" onChange={handleChange} required />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>

        {status && <p className="status-msg">{status}</p>}

        <div className="register-section">
          <p>New Employee?</p>
          <button onClick={() => navigate('/register')} className="register-btn">Register</button>
        </div>
      </div>
    </>
  );
}
