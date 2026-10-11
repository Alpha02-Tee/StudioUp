import React from 'react';
import { ArrowRight } from 'lucide-react';
import './CtaSection.css';

const CtaSection = () => {
  return (
    <section className="cta-section" id="get-started">
      <div className="container">
        <div className="cta-box">
          <h2>
            Get your semester under control.
          </h2>
          <p>
            Free to start. No credit card. No clutter.
          </p>
          <div style={{ marginTop: '22px' }}>
            <a href="Register.html" className="btn btn-primary btn-large">
              Get Started <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;