import React from 'react';
import { Sparkle, ArrowRight, Play } from 'lucide-react';
import dashboardImage from '../../assets/Home Tab.png';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-decoration decoration-one"></div>
      <div className="hero-decoration decoration-two"></div>
      <Sparkle className="hero-star" size={26} />
      
      <div className="container hero-content">
        {/* Hero Text */}
        <div className="hero-text">
          <h1>
            Stop juggling six apps<br />
            to survive one semester.
          </h1>
          <p>
            StudioUp brings your timetable, assignments, notes, to-do list,
            focus timer, and grades into one place so nothing slips through the cracks.
          </p>
          
          <div className="hero-buttons">
            <a href="Register.html" className="btn btn-primary btn-large">
              Get Started For Free <ArrowRight size={16} />
            </a>
          </div>
          
          <a href="#how-it-works" className="secondary-link" style={{ marginTop: '18px' }}>
            <Play size={13} fill="currentColor" />
            See how it works
          </a>
        </div>

        {/* Dashboard Mockup */}
        <div className="dashboard-wrapper">
          <img src={dashboardImage} alt="StudioUp Dashboard Preview" />
        </div>
      </div>
    </section>
  );
};

export default Hero;