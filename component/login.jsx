import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import Navbar from './navbaar';

export default function Login() {
  const [form, setForm] = useState({ empId: '', password: '' });
  const [status, setStatus] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('login');

  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('empId', res.data.empId);
      localStorage.setItem('empName', res.data.name);
      setStatus(`Welcome, ${res.data.name}`);
      navigate('/dashboard/attendance');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Login failed';
      setStatus('Login failed: ' + msg);
      console.error('Login error:', err);
    }
  };

 const sendOtp = async () => {
  try {
    const cleanedPhone = phone.replace('+91', '').replace(/\D/g, '').slice(-10); 
    const res = await axios.post('http://localhost:5000/api/auth/send-otp', { phone: cleanedPhone });
    setStatus(res.data.msg);
    setStep('verify');
  } catch (err) {
    const msg = err.response?.data?.msg || err.message || 'Failed to send OTP';
    setStatus(msg);
    console.error('sendOtp error:', err);
  }
};

 


  const verifyOtp = async () => {
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { phone: formattedPhone, otp });
      setStatus(res.data.msg);
      setStep('reset');
    } catch (err) {
      const msg = err.response?.data?.msg || err.message || 'Invalid OTP';
      setStatus(msg);
      console.error('verifyOtp error:', err);
    }
  };

  const resetPassword = async () => {
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
        phone: formattedPhone,
        newPassword
      });
      setStatus(res.data.msg);
      setStep('login');
    } catch (err) {
      const msg = err.response?.data?.msg || err.message || 'Failed to reset password';
      setStatus(msg);
      console.error('resetPassword error:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <h2>Employee Login</h2>

        {step === 'login' && (
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
            <p className="forgot-password" onClick={() => setStep('send')}>Forgot Password?</p>
          </form>
        )}

        {step === 'send' && (
          <div className="forgot-password-section">
            <h3>Send OTP</h3>
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <button onClick={sendOtp} className="otp-btn">Send OTP</button>
          </div>
        )}

        {step === 'verify' && (
          <div className="forgot-password-section">
            <h3>Verify OTP</h3>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
            <button onClick={verifyOtp} className="otp-btn">Verify OTP</button>
          </div>
        )}

        {step === 'reset' && (
          <div className="forgot-password-section">
            <h3>Reset Password</h3>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <button onClick={resetPassword} className="otp-btn">Reset Password</button>
          </div>
        )}

        {status && <p className="status-msg">{status}</p>}

        <div className="register-section">
          <p>New Employee?</p>
          <button onClick={() => navigate('/register')} className="register-btn">Register</button>
        </div>
      </div>
    </>
  );
}
