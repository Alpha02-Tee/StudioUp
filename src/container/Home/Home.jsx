import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Home as HomeIcon, 
  CalendarDays, 
  BookOpen, 
  ClipboardList, 
  Calendar, 
  Users, 
  FileText, 
  Clock3, 
  ChartNoAxesColumn, 
  Settings, 
  Search, 
  Bell, 
  Plus, 
  ChevronDown, 
  Sun, 
  ArrowRight, 
  Check, 
  SquareCheckBig, 
  CircleCheck, 
  Sparkles, 
  Bot,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([
    { id: 1, name: 'Finish cell membrane lab report', tag: 'Biology 101', tagClass: 'tag-biology', time: 'Due 10:00 AM', completed: false },
    { id: 2, name: 'Read Chapter 4 and write summary', tag: 'English Comp', tagClass: 'tag-english', time: 'Due 12:00 PM', completed: false },
    { id: 3, name: 'Complete problem set 3', tag: 'Calculus', tagClass: 'tag-calculus', time: 'Due 3:00 PM', completed: false },
    { id: 4, name: 'Group project meeting (Phase 2)', tag: 'Group Project', tagClass: 'tag-group', time: 'Due 5:00 PM', completed: false },
    { id: 5, name: 'Study for Biology quiz', tag: 'Biology 101', tagClass: 'tag-biology', time: 'Due 7:00 PM', completed: false }
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <a href="#" className="logo">
            <span className="logo-icon">
              <GraduationCap />
            </span>
            <span>
              Studio<span className="logo-up">Up</span>
            </span>
          </a>
        </div>
        <nav className="navigation">
          <div className="nav-section">
            <button className="nav-item active" onClick={() => navigate('/home')}><HomeIcon /><span>Home</span></button>
            <button className="nav-item"><CalendarDays /><span>My Semester</span></button>
            <button className="nav-item" onClick={() => navigate('/classes')}><BookOpen /><span>Classes</span></button>
            <button className="nav-item" onClick={() => navigate('/assignments')}><ClipboardList/><span>Assignments</span></button>
            <button className="nav-item"><Calendar /><span>Calendar</span></button>
            <button className="nav-item"><Users /><span>Group Projects</span></button>
            <button className="nav-item"><FileText /><span>Notes</span></button>
            <button className="nav-item" onClick={() => navigate('/timer')}><Clock3/><span>Focus Timer</span></button>
            <button className="nav-item" onClick={() => navigate('/grades')}><ChartNoAxesColumn /><span>Grades</span></button>
            <button className="nav-item"><Settings /><span>Settings</span></button>
          </div>
        </nav>
      </aside>

      {/* TOP BAR */}
      <header className="topbar">
        <div className="search-container">
          <label className="search-box">
            <Search />
            <input type="text" placeholder="Search assignments, notes, classes..." />
          </label>
        </div>
        <div className="header-actions">
          <button className="notification">
            <Bell />
            <span className="notification-dot"></span>
          </button>
          <button className="new-task">
            <Plus />
            <span>New Task</span>
          </button>
          <div className="user-area">
            <div className="avatar">AN</div>
            <ChevronDown className="user-chevron" />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="main">
        <div className="dashboard-grid">
          
          {/* LEFT COLUMN */}
          <section className="left-column">
            
            {/* Greeting */}
            <div className="greeting">
              <div className="sun-icon">
                <Sun />
              </div>
              <div className="greeting-content">
                <h1>Good morning, Alex</h1>
                <p>You have 3 assignments due this week.</p>
              </div>
              <div className="quote">
                "Small steps every day lead to big results."
              </div>
            </div>

            {/* STATISTICS */}
            <div className="stats">
              <div className="stat-card red">
                <div className="stat-icon"><CalendarDays /></div>
                <div className="stat-label">Due Today</div>
                <div className="stat-number">2</div>
                <div className="stat-arrow"><ArrowRight /></div>
              </div>
              <div className="stat-card blue">
                <div className="stat-icon"><Clock3 /></div>
                <div className="stat-label">In Progress</div>
                <div className="stat-number">5</div>
                <div className="stat-arrow"><ArrowRight /></div>
              </div>
              <div className="stat-card green">
                <div className="stat-icon"><CircleCheck /></div>
                <div className="stat-label">Completed</div>
                <div className="stat-number">12</div>
                <div className="stat-arrow"><ArrowRight /></div>
              </div>
              <div className="stat-card purple" onClick={() => navigate('/grades')} style={{ cursor: 'pointer' }}>
                <div className="stat-icon"><GraduationCap /></div>
                <div className="stat-label">GPA Tracker</div>
                <div className="stat-number">3.7</div>
                <div className="stat-arrow"><ArrowRight /></div>
              </div>
            </div>

            {/* TODAY'S TASKS */}
            <div className="panel tasks-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <div className="panel-title-icon"><SquareCheckBig /></div>
                  Today's Tasks
                </div>
                <button className="view-all">View all <ArrowRight /></button>
              </div>

              {tasks.map((task) => (
                <div className="task-row" key={task.id}>
                  <button 
                    className={`checkbox ${task.completed ? 'checked' : ''}`} 
                    onClick={() => toggleTask(task.id)}
                  >
                    {task.completed && <Check size={13} />}
                  </button>
                  <span className="task-name" style={{ textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.6 : 1 }}>
                    {task.name}
                  </span>
                  <span className={`task-tag ${task.tagClass}`}>{task.tag}</span>
                  <span className="due-time"><Clock3 size={16} /> {task.time}</span>
                </div>
              ))}
            </div>

            {/* GROUP PROJECT */}
            <div className="panel group-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <div className="panel-title-icon"><Users /></div>
                  Group Project
                </div>
                <button className="view-all">View all <ArrowRight /></button>
              </div>
              <div className="group-subtitle">Web Development Project — Phase 2</div>

              <div className="project-row">
                <button className="checkbox"></button>
                <span className="project-name">Design login page UI</span>
                <span className="project-tag design">Design</span>
                <div className="avatars">
                  <span className="mini-avatar avatar-one">AN</span>
                  <span className="mini-avatar avatar-two">JS</span>
                  <span className="mini-avatar avatar-three">MK</span>
                </div>
                <span className="project-due">Due Apr 23</span>
              </div>
              <div className="project-row">
                <button className="checkbox"></button>
                <span className="project-name">Implement authentication</span>
                <span className="project-tag development">Development</span>
                <div className="avatars">
                  <span className="mini-avatar avatar-one">AN</span>
                  <span className="mini-avatar avatar-two">JS</span>
                  <span className="mini-avatar avatar-three">DM</span>
                </div>
                <span className="project-due">Due Apr 25</span>
              </div>
            </div>

          </section>

          {/* RIGHT COLUMN */}
          <aside className="right-column">
            
            {/* CALENDAR */}
            <div className="panel calendar-panel">
              <div className="calendar-header">
                <div className="calendar-title"><CalendarDays /> This Week</div>
                <div className="calendar-chevron"><ChevronRight /></div>
              </div>
              
              <div className="date-navigation">
                <button><ChevronLeft /></button>
                <span className="date-range">Apr 21 - Apr 27, 2025</span>
                <button><ChevronRight /></button>
              </div>

              <div className="week">
                <div className="day"><div className="day-name">Mon</div><div className="day-number">21</div></div>
                <div className="day active"><div className="day-name">Tue</div><div className="day-number">22</div></div>
                <div className="day"><div className="day-name">Wed</div><div className="day-number">23</div></div>
                <div className="day"><div className="day-name">Thu</div><div className="day-number">24</div></div>
                <div className="day"><div className="day-name">Fri</div><div className="day-number">25</div></div>
                <div className="day"><div className="day-name">Sat</div><div className="day-number">26</div></div>
                <div className="day"><div className="day-name">Sun</div><div className="day-number">27</div></div>
              </div>

              <div className="calendar-divider"></div>

              <div className="calendar-task">
                <span className="calendar-dot dot-blue"></span>
                <span className="calendar-task-name">Biology 101 - Lab Report</span>
                <span className="calendar-task-time">10:00 AM</span>
              </div>
              <div className="calendar-task">
                <span className="calendar-dot dot-purple"></span>
                <span className="calendar-task-name">English Comp Essay Draft</span>
                <span className="calendar-task-time">12:00 PM</span>
              </div>
              <div className="calendar-task">
                <span className="calendar-dot dot-green"></span>
                <span className="calendar-task-name">Calculus Problem Set 3</span>
                <span className="calendar-task-time">3:00 PM</span>
              </div>
            </div>

            {/* ASK BRAIN */}
            <div className="brain-panel">
              <div className="brain-header">
                <div className="brain-icon"><Sparkles /></div>
                <div>
                  <div className="brain-title-row">
                    <span className="brain-title">Ask Brain</span>
                    <span className="beta">Beta</span>
                  </div>
                  <div className="brain-subtitle">Your AI study assistant</div>
                </div>
              </div>

              <div className="question-box">
                <input type="text" defaultValue="When is my history essay due?" />
                <button className="send-button"><ArrowRight /></button>
              </div>

              <div className="brain-response">
                <div className="robot"><Bot /></div>
                <div className="response-bubble">
                  Your history essay is due on Friday, April 25, 2025 at 12:00 PM. It's for your History 102 class.
                </div>
              </div>

              <div className="suggestions">
                <button className="suggestion">Summarise my notes</button>
                <button className="suggestion">Help me plan my week</button>
                <button className="suggestion">Quiz me on this topic</button>
              </div>
            </div>

          </aside>

        </div>
      </main>
    </div>
  );
};

export default Home;