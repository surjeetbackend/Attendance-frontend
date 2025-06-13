import { useState } from "react";
import { Link } from "react-router-dom";
import './navbaar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <span className="navbar-title">Dashboard</span>

      {/* Hamburger Icon */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        &#9776;
      </div>

      {/* Navbar Links */}
      <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <Link to="/login">Login</Link>
        {/* <Link to="/dashboard/leave-requests">Leave Requests</Link> */}
        <Link to="/admin">Admin</Link>
        
      </div>
    </nav>
  );
};

export default Navbar;
