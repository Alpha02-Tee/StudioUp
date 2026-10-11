import React from 'react';
import { 
  Home, 
  CalendarDays, 
  Users, 
  ClipboardList, 
  Calendar, 
  UsersRound, 
  FileText, 
  Timer, 
  BarChart3, 
  GraduationCap 
} from 'lucide-react';
import './FeaturesSection.css';

const FeaturesSection = () => {
  return (
    <section className="section features" id="features">
      <div className="container">
        <h2 className="section-title">
          One place for everything.
        </h2>
        
        <div className="feature-row">
          <div className="feature-item">
            <div className="feature-icon">
              <Home size={20} />
            </div>
            <h4>Home Dashboard</h4>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <CalendarDays size={20} />
            </div>
            <h4>My Semester</h4>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <Users size={20} />
            </div>
            <h4>Classes</h4>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <ClipboardList size={20} />
            </div>
            <h4>Assignments</h4>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <Calendar size={20} />
            </div>
            <h4>Calendar</h4>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <UsersRound size={20} />
            </div>
            <h4>Group Projects</h4>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <FileText size={20} />
            </div>
            <h4>Notes</h4>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <Timer size={20} />
            </div>
            <h4>Focus Timer</h4>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">
              <BarChart3 size={20} />
            </div>
            <h4>Grades</h4>
          </div>
        </div>

        <p className="features-description">
          StudioUp pulls your academic life into a single screen assignments, deadlines, notes, and study time, all in one place.
        </p>

        {/* Testimonial */}
        <div className="testimonial" id="about">
          <div className="testimonial-icon">
            <GraduationCap size={20} />
          </div>
          <div>
            <span className="testimonial-tag">
              Built by a student, for students.
            </span>
            <blockquote>
              "I built StudioUp because I was tired of missing deadlines across six different apps."
            </blockquote>
            <div className="testimonial-author">
              Thandolwethu, student and creator of StudioUp
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;