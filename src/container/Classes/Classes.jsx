import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Home as HomeIcon, CalendarDays, BookOpen, 
  ClipboardList, Calendar, Users, FileText, Clock3, 
  ChartNoAxesColumn, Settings, Search, Bell, Plus, 
  ChevronDown, ChevronRight, ChevronLeft, X, ArrowRight, Sparkles, CheckSquare
} from 'lucide-react';
import './Classes.css';

const PALETTE = [
  ['blue', '#dfedff', '#3685ee'], ['green', '#e0f6dc', '#269d69'], 
  ['purple', '#eae3ff','#7759ed'], ['pink', '#ffe0e8', '#e9516a'], 
  ['orange', '#ffead6', '#e7852d'], ['gray', '#ebedf4', '#78819c'], 
  ['teal', '#d9f5ee', '#219d80'], ['red', '#ffe0e0', '#d84652']
];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIMES = ['07:45', '09:00', '10:25', '11:45', '13:00', '14:20', '15:45', '19:00', '20:00', '21:00', '22:00'];

const Classes = () => {
  const navigate = useNavigate();

  // State: Starts completely empty now
  const [modules, setModules] = useState(() => {
    const saved = localStorage.getItem('studioUp_modules');
    return saved ? JSON.parse(saved) : [];
  });
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('studioUp_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [kind, setKind] = useState('university'); 
  const [view, setView] = useState('week'); 
  const [offset, setOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [activeModal, setActiveModal] = useState(null); 
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [activeModuleId, setActiveModuleId] = useState(null);

  // Form States
  const [moduleForm, setModuleForm] = useState({ code: '', name: '', semester: 'Semester 2', credits: '', color: 'blue' });
  const [sessionForm, setSessionForm] = useState({ moduleId: '', type: 'Lecture', day: 'Monday', kind: 'university', start: '09:00', end: '10:00', location: '', repeat: 'weekly', notes: '' });

  useEffect(() => {
    localStorage.setItem('studioUp_modules', JSON.stringify(modules));
    localStorage.setItem('studioUp_sessions', JSON.stringify(sessions));
  }, [modules, sessions]);

  // Helpers
  const getColor = (name) => PALETTE.find(p => p[0] === name) || PALETTE[0];
  const getModule = (id) => modules.find(m => m.id === id) || { code: 'Unknown', name: 'Unknown', color: 'gray' };
  
  const formatTime = (t) => {
    const [h, m] = t.split(':').map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'pm' : 'am'}`;
  };

  const getWeekDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + offset * 7);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Stats
  const studySessions = sessions.filter(s => s.kind === 'study');
  const studyMins = studySessions.reduce((sum, s) => {
    const [h1, m1] = s.start.split(':').map(Number);
    const [h2, m2] = s.end.split(':').map(Number);
    return sum + Math.max(0, (h2 * 60 + m2) - (h1 * 60 + m1));
  }, 0);
  
  const universitySessions = sessions.filter(s => s.kind === 'university');
  const nextClass = universitySessions.length > 0 ? universitySessions[0] : null;

  // Filtering
  const filteredModules = modules.filter(m => (m.code + ' ' + m.name).toLowerCase().includes(searchQuery.toLowerCase()));
  const currentSessions = sessions.filter(s => s.kind === kind);
  
  const shownDays = view === 'day' ? [DAYS[(new Date().getDay() + 6) % 7]] : DAYS;
  const shownTimes = kind === 'study' ? TIMES.filter(t => t >= '19:00') : TIMES.slice(0, 7);

  // Handlers
  const handleSaveModule = (e) => {
    e.preventDefault();
    if (modules.some(m => m.code.toLowerCase() === moduleForm.code.toLowerCase())) {
      alert("Module code already exists.");
      return;
    }
    setModules([...modules, { id: Date.now().toString(), ...moduleForm, code: moduleForm.code.toUpperCase() }]);
    setActiveModal(null);
    setModuleForm({ code: '', name: '', semester: 'Semester 2', credits: '', color: 'blue' });
  };

  const handleSaveSession = (e) => {
    e.preventDefault();
    setSessions([...sessions, { id: Date.now().toString(), ...sessionForm }]);
    setActiveModal(null);
  };

  const deleteSession = (id) => {
    if (window.confirm("Delete this session?")) {
      setSessions(sessions.filter(s => s.id !== id));
      setActiveModal(null);
    }
  };

  const openSessionSlot = (day, time) => {
    if (modules.length === 0) {
      alert("Please add a class module first before scheduling it on the timetable.");
      setActiveModal('module');
      return;
    }
    setSessionForm(prev => ({ ...prev, day, start: time, kind, moduleId: modules[0]?.id || '' }));
    setActiveModal('session');
  };

  const handleAddTimetableClick = () => {
    if (modules.length === 0) {
      alert("Please add a class module first before scheduling a session.");
      setActiveModal('module');
      return;
    }
    setSessionForm(prev => ({...prev, moduleId: modules[0]?.id || ''})); 
    setActiveModal('session');
  };

  return (
    <div className="app classes-app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <a href="#" className="logo">
            <span className="logo-icon"><GraduationCap /></span>
            <span>Studio<span className="logo-up">Up</span></span>
          </a>
        </div>
        <nav className="navigation">
          <div className="nav-section">
            <button className="nav-item" onClick={() => navigate('/home')}><HomeIcon /><span>Home</span></button>
            <button className="nav-item active"><CalendarDays /><span>Classes</span></button>
            <button className="nav-item" onClick={() => navigate('/grades')}><CheckSquare /><span>Grades</span></button>
            <button className="nav-item" onClick={() => navigate('/assignments')}><ClipboardList /><span>Assignments</span></button>
            <button className="nav-item" onClick={() => navigate('/timer')}><Clock3 /><span>Focus Timer</span></button>
            <button className="nav-item"><Calendar /><span>Calendar</span></button>
            <button className="nav-item"><BookOpen /><span>My Semester</span></button>
            <button className="nav-item"><Settings /><span>Settings</span></button>
          </div>
        </nav>
        <div className="sidebar-note">
          <Sparkles size={16}/><br/>Small steps<br/>every day lead to<br/>big results.
        </div>
      </aside>

      {/* TOPBAR */}
      <header className="topbar">
        <div className="search-container">
          <label className="search-box">
            <Search />
            <input type="text" placeholder="Search classes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </label>
        </div>
        <div className="header-actions">
          <button className="notification"><Bell /><span className="notification-dot"></span></button>
          <div className="user-area"><div className="avatar">AN</div><ChevronDown className="user-chevron" /></div>
        </div>
      </header>

      <main className="main">
        <div className="content">
          <section className="page-heading">
            <div>
              <h1>My Classes</h1>
              <div className="subtitle">Manage your modules, lectures, practicals and weekly schedule.</div>
            </div>
            <div className="actions">
              <button className="btn" onClick={() => setActiveModal('module')}><Plus size={14}/> Add Class</button>
              <button className="btn primary" onClick={handleAddTimetableClick}><Calendar size={14}/> Add to Timetable</button>
            </div>
          </section>

          {/* STATS */}
          <section className="stats">
            <div className="stat">
              <div className="stat-icon purple"><BookOpen size={20}/></div>
              <div>
                <div className="stat-label">Total Modules</div>
                <div className="stat-number">{modules.length}</div>
                <div className="stat-sub">Active this semester</div>
              </div>
            </div>
            <div className="stat">
              <div className="stat-icon blue"><CalendarDays size={20}/></div>
              <div>
                <div className="stat-label">Classes This Week</div>
                <div className="stat-number">{universitySessions.length}</div>
                <div className="stat-sub">Scheduled sessions</div>
              </div>
            </div>
            <div className="stat">
              <div className="stat-icon green"><Clock3 size={20}/></div>
              <div>
                <div className="stat-label">Next Class</div>
                <div className="stat-number" style={{fontSize: '18px'}}>{nextClass ? `${getModule(nextClass.moduleId).code}` : 'None'}</div>
                <div className="stat-sub">{nextClass ? `${nextClass.day} ${formatTime(nextClass.start)}` : 'Add a session'}</div>
              </div>
            </div>
            <div className="stat">
              <div className="stat-icon purple"><GraduationCap size={20}/></div>
              <div>
                <div className="stat-label">Study Hours</div>
                <div className="stat-number">{(studyMins / 60).toFixed(1)} hrs</div>
                <div className="stat-sub">Planned this week</div>
              </div>
            </div>
          </section>

          {/* TIMETABLE */}
          <section className="panel timetable-panel">
            <div className="table-toolbar">
              <div className="view-tabs">
                <button className={`tab-btn ${kind === 'university' ? 'active' : ''}`} onClick={() => setKind('university')}>University Schedule</button>
                <button className={`tab-btn ${kind === 'study' ? 'active' : ''}`} onClick={() => setKind('study')}>Study Plan</button>
              </div>
              <div className="date-tools">
                <button className="btn small" onClick={() => setOffset(0)}>Today</button>
                <button className="icon-btn" onClick={() => setOffset(o => o - 1)}><ChevronLeft size={14}/></button>
                <div className="date-label">Week of {getWeekDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                <button className="icon-btn" onClick={() => setOffset(o => o + 1)}><ChevronRight size={14}/></button>
                <div className="view-switch">
                  <button className={view === 'week' ? 'active' : ''} onClick={() => setView('week')}>Week</button>
                  <button className={view === 'day' ? 'active' : ''} onClick={() => setView('day')}>Day</button>
                  <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>List</button>
                </div>
              </div>
            </div>

            {view === 'list' ? (
              <div className="list-view">
                {currentSessions.length === 0 ? <div className="empty-state" style={{padding: '40px', textAlign: 'center', color: '#8392ae'}}>No sessions here yet. Click "Add to Timetable" to get started.</div> : 
                  currentSessions.sort((a,b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day)).map(s => {
                    const m = getModule(s.moduleId);
                    const c = getColor(m.color);
                    return (
                      <div className="list-item" key={s.id} onClick={() => { setActiveSessionId(s.id); setActiveModal('detail'); }}>
                        <div className="list-time">{s.day}<br/>{formatTime(s.start)} - {formatTime(s.end)}</div>
                        <span className="module-dot" style={{background: c[2]}}></span>
                        <div className="list-main">
                          <strong>{m.code} {s.type}</strong>
                          <span>{m.name}</span>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            ) : (
              <div className="table-wrap">
                <table className="schedule">
                  <thead>
                    <tr>
                      <th>Time</th>
                      {shownDays.map(d => <th key={d}>{d}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {shownTimes.map(t => (
                      <tr key={t}>
                        <td className="time-cell">{formatTime(t)}</td>
                        {shownDays.map(day => {
                          const s = currentSessions.find(x => x.day === day && x.start === t);
                          if (s) {
                            const m = getModule(s.moduleId);
                            const c = getColor(m.color);
                            return (
                              <td key={day}>
                                <div className="slot" style={{background: c[1], color: c[2]}} onClick={() => { setActiveSessionId(s.id); setActiveModal('detail'); }}>
                                  <div className="slot-title"><span className="bullet"></span>{m.code}</div>
                                  <div className="slot-type">{s.type}</div>
                                </div>
                              </td>
                            );
                          }
                          return <td key={day}><div className="empty-slot" onClick={() => openSessionSlot(day, t)}></div></td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* MODULES */}
          <section className="panel modules-panel">
            <div className="section-head">
              <div><h2>My Modules</h2><p>Your current modules and their weekly activity.</p></div>
              <button className="btn small" onClick={() => setSearchQuery('')}>View All <ArrowRight size={12} style={{marginLeft: '4px'}}/></button>
            </div>
            
            {filteredModules.length === 0 ? (
               <div className="empty-state" style={{padding: '30px', textAlign: 'center', color: '#8392ae', border: '1px dashed #dfe7f7', borderRadius: '12px'}}>
                 No modules added yet. Click "Add Class" to start building your semester.
               </div>
            ) : (
              <div className="module-grid">
                {filteredModules.map(m => {
                  const c = getColor(m.color);
                  const n = sessions.filter(s => s.moduleId === m.id).length;
                  return (
                    <article className="module-card" key={m.id} style={{background: `linear-gradient(145deg, ${c[1]}88, #fff 75%)`, borderColor: `${c[2]}55`}}>
                      <div className="module-card-head">
                        <span className="module-dot" style={{background: `linear-gradient(135deg, ${c[2]}, #fff)`}}></span>
                        <span className="module-code">{m.code}</span>
                      </div>
                      <div className="module-name">{m.name}</div>
                      <div className="semester">{m.semester}</div>
                      <div className="module-sessions"><Calendar size={12}/> {n} scheduled sessions</div>
                      <button className="btn" onClick={() => { setActiveModuleId(m.id); setActiveModal('detailModule'); }} style={{width: '100%', fontSize: '11px', padding: '7px'}}>View Details</button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </main>

      {/* MODALS */}
      {activeModal === 'module' && (
        <div className="modal-backdrop open" onClick={(e) => e.target.className.includes('backdrop') && setActiveModal(null)}>
          <form className="modal" onSubmit={handleSaveModule}>
            <div className="modal-head">
              <div><h2>Add a Class</h2><p>Create a module to use in your timetable.</p></div>
              <button type="button" className="close-btn" onClick={() => setActiveModal(null)}><X size={18}/></button>
            </div>
            <div className="form-grid">
              <div className="field"><label>Module code *</label><input required placeholder="e.g. STAS201" value={moduleForm.code} onChange={e=>setModuleForm({...moduleForm, code: e.target.value})}/></div>
              <div className="field"><label>Module name *</label><input required placeholder="e.g. Statistical Theory" value={moduleForm.name} onChange={e=>setModuleForm({...moduleForm, name: e.target.value})}/></div>
              <div className="field"><label>Semester</label><select value={moduleForm.semester} onChange={e=>setModuleForm({...moduleForm, semester: e.target.value})}><option>Semester 1</option><option>Semester 2</option><option>Full Year</option></select></div>
              <div className="field"><label>Credits</label><input type="number" value={moduleForm.credits} onChange={e=>setModuleForm({...moduleForm, credits: e.target.value})}/></div>
              <div className="field full">
                <label>Module colour</label>
                <div className="color-options">
                  {PALETTE.map(p => <button key={p[0]} type="button" className={`color-choice ${moduleForm.color === p[0] ? 'selected' : ''}`} style={{background: p[2]}} onClick={() => setModuleForm({...moduleForm, color: p[0]})}></button>)}
                </div>
              </div>
            </div>
            <div className="modal-actions"><button type="button" className="btn" onClick={() => setActiveModal(null)}>Cancel</button><button className="btn primary">Save Class</button></div>
          </form>
        </div>
      )}

      {activeModal === 'session' && (
        <div className="modal-backdrop open" onClick={(e) => e.target.className.includes('backdrop') && setActiveModal(null)}>
          <form className="modal" onSubmit={handleSaveSession}>
            <div className="modal-head">
              <div><h2>Add to Timetable</h2><p>Schedule a lecture, practical or personal study session.</p></div>
              <button type="button" className="close-btn" onClick={() => setActiveModal(null)}><X size={18}/></button>
            </div>
            <div className="form-grid">
              <div className="field"><label>Module *</label>
                <select required value={sessionForm.moduleId} onChange={e=>setSessionForm({...sessionForm, moduleId: e.target.value})}>
                  {modules.map(m => <option key={m.id} value={m.id}>{m.code} - {m.name}</option>)}
                </select>
              </div>
              <div className="field"><label>Activity type</label><select value={sessionForm.type} onChange={e=>setSessionForm({...sessionForm, type: e.target.value})}><option>Lecture</option><option>Practical</option><option>Tutorial</option><option>Independent study</option></select></div>
              <div className="field"><label>Day *</label><select value={sessionForm.day} onChange={e=>setSessionForm({...sessionForm, day: e.target.value})}>{DAYS.map(d=><option key={d}>{d}</option>)}</select></div>
              <div className="field"><label>Schedule</label><select value={sessionForm.kind} onChange={e=>setSessionForm({...sessionForm, kind: e.target.value})}><option value="university">University Schedule</option><option value="study">Study Plan</option></select></div>
              <div className="field"><label>Start time *</label><input type="time" required value={sessionForm.start} onChange={e=>setSessionForm({...sessionForm, start: e.target.value})}/></div>
              <div className="field"><label>End time *</label><input type="time" required value={sessionForm.end} onChange={e=>setSessionForm({...sessionForm, end: e.target.value})}/></div>
              <div className="field"><label>Location</label><input value={sessionForm.location} onChange={e=>setSessionForm({...sessionForm, location: e.target.value})} placeholder="e.g. Hall 2"/></div>
              <div className="field"><label>Repeat</label><select value={sessionForm.repeat} onChange={e=>setSessionForm({...sessionForm, repeat: e.target.value})}><option value="weekly">Every week</option><option value="once">This week only</option></select></div>
            </div>
            <div className="modal-actions"><button type="button" className="btn" onClick={() => setActiveModal(null)}>Cancel</button><button className="btn primary">Save Session</button></div>
          </form>
        </div>
      )}

      {activeModal === 'detail' && activeSessionId && (() => {
        const s = sessions.find(x => x.id === activeSessionId);
        if (!s) return null;
        const m = getModule(s.moduleId);
        return (
          <div className="modal-backdrop open" onClick={(e) => e.target.className.includes('backdrop') && setActiveModal(null)}>
            <div className="modal">
              <div className="modal-head">
                <div><h2>{m.code} {s.type}</h2><p>{m.name}</p></div>
                <button type="button" className="close-btn" onClick={() => setActiveModal(null)}><X size={18}/></button>
              </div>
              <div className="detail-content" style={{lineHeight: 1.8, fontSize: '13px', color: '#485274'}}>
                <p><b>Day:</b> {s.day}</p>
                <p><b>Time:</b> {formatTime(s.start)} - {formatTime(s.end)}</p>
                <p><b>Schedule:</b> {s.kind === 'study' ? 'Study Plan' : 'University Schedule'}</p>
                <p><b>Location:</b> {s.location || 'Not specified'}</p>
                <p><b>Repeat:</b> {s.repeat === 'once' ? 'This week only' : 'Every week'}</p>
              </div>
              <div className="modal-actions" style={{marginTop: '24px'}}>
                <button className="btn" style={{color: '#d84652', borderColor: '#ffe0e0', background: '#fffafa'}} onClick={() => deleteSession(s.id)}>Delete Session</button> 
                <button className="btn primary" onClick={() => setActiveModal(null)}>Done</button>
              </div>
            </div>
          </div>
        );
      })()}
      
      {activeModal === 'detailModule' && activeModuleId && (() => {
        const m = getModule(activeModuleId);
        const rel = sessions.filter(s => s.moduleId === m.id);
        return (
          <div className="modal-backdrop open" onClick={(e) => e.target.className.includes('backdrop') && setActiveModal(null)}>
            <div className="modal">
              <div className="modal-head">
                <div><h2>{m.code}</h2><p>{m.name}</p></div>
                <button type="button" className="close-btn" onClick={() => setActiveModal(null)}><X size={18}/></button>
              </div>
              <div className="detail-content" style={{lineHeight: 1.8, fontSize: '13px', color: '#485274'}}>
                <p><b>Semester:</b> {m.semester}</p>
                <p><b>Credits:</b> {m.credits || 'Not specified'}</p>
                <p><b>Sessions scheduled:</b> {rel.length}</p>
                {rel.map(s => <p key={s.id} style={{color: '#78819c', fontSize: '12px'}}>- {s.day} {formatTime(s.start)}: {s.type}</p>)}
              </div>
              <div className="modal-actions" style={{marginTop: '24px'}}>
                <button className="btn primary" onClick={() => setActiveModal(null)}>Done</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default Classes;