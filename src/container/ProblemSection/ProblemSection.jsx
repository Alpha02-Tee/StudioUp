import React from 'react';
import { CalendarDays, FileText, Table, Mail, Timer } from 'lucide-react';
import './ProblemSection.css';

const ProblemSection = () => {
  return (
    <section className="section problem-section" id="how-it-works">
      <div className="container">
        <h2 className="section-title">
          Sound familiar?
        </h2>
        <div className="problem-grid">
          <div className="problem-card">
            <div className="problem-icon icon-blue">
              <CalendarDays size={20} />
            </div>
            <h3>
              Timetable in Google Calendar
            </h3>
            <p>
              Your class schedule lives in one app.
            </p>
          </div>

          <div className="problem-card">
            <div className="problem-icon icon-purple">
              <FileText size={20} />
            </div>
            <h3>
              Notes in Evernote
            </h3>
            <p>
              Your lecture notes live in another.
            </p>
          </div>

          <div className="problem-card">
            <div className="problem-icon icon-green">
              <Table size={20} />
            </div>
            <h3>
              Study plan in Excel
            </h3>
            <p>
              Your study timetable is a spreadsheet.
            </p>
          </div>

          <div className="problem-card">
            <div className="problem-icon icon-pink">
              <Mail size={20} />
            </div>
            <h3>
              Assignment reminders lost in email
            </h3>
            <p>
              Deadlines arrive and quietly disappear.
            </p>
          </div>

          <div className="problem-card">
            <div className="problem-icon icon-gray">
              <Timer size={20} />
            </div>
            <h3>
              Focus timer in FlipClock
            </h3>
            <p>
              Study sessions somewhere else entirely.
            </p>
          </div>
        </div>
        <p className="problem-bottom">
          Six apps. Zero connection. You become the clueless.
        </p>
      </div>
    </section>
  );
};

export default ProblemSection;