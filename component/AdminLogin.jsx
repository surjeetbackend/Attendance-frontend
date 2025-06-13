import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import Navbar from './navbaar';

const AdminLogin = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (name === 'admin' && password === 'admin123') {
      localStorage.setItem('isAdminLoggedIn', 'true');
      navigate('/admin');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <>
    <Navbar/>
  
    <div className="admin-login-container">
      <form onSubmit={handleLogin} className="admin-login-form">
        <h2>Admin Login</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Admin Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
    </>
  );
};

export default AdminLogin;
