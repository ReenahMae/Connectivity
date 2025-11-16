import React from 'react';
import { Link } from 'react-router-dom';
import '../../Landing.css';
import Logo from '../ui/Logo';

const Navbar = () => {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="logo">
          <Logo height={150} />
        </div>
        <div className="nav-actions">
          <Link className="nav-link" to="/login">Login</Link>
          <Link className="btn btn-primary" to="/register">Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
