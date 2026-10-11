import React from 'react';
import { GraduationCap } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-icon">
                <GraduationCap size={16} />
              </span>
              <span>
                Studio<span className="logo-up">Up</span>
              </span>
            </div>
            <span className="footer-tagline">
              One place for student life[cite: 9, 10].
            </span>
          </div>
          
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#">Privacy</a>
            <a href="#">Contact</a>
          </div>
        </div>
        
        <div className="footer-bottom">
          © 2026 StudioUp. Built for students[cite: 10].
        </div>
      </div>
    </footer>
  );
};

export default Footer;