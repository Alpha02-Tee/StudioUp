import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">
            <GraduationCap size={19} />
          </span>
          <span>
            Studio<span className="logo-up">Up</span>
          </span>
        </Link>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </nav>
        <div className="nav-actions">
          <Link to="/login" className="login-link">Log in</Link>
          <a href="Register.html" className="btn btn-primary">
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;