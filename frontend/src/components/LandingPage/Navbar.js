import React from 'react';
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
          <a className="nav-link" href="#">Login</a>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
