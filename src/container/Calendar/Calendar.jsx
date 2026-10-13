import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Home as HomeIcon, CalendarDays, BookOpen, 
  ClipboardList, Calendar as CalendarIcon, Clock3, 
  Settings, Search, Bell, Plus, ChevronDown, ChevronRight, 
  ChevronLeft, X, CheckSquare, AlertTriangle, Book, Users, 
  CheckCircle2, Circle, Pencil, Trash2, MoreVertical
} from 'lucide-react';
import './Calendar.css';

const EVENT_COLORS = ['#3784ee', '#e9516a', '#7759ed', '#239b70', '#e5842d', '#77829e', '#0288d1', '#8e24aa'];

const CATEGORIES = {
  class: { label: 'Class', icon: <BookOpen size={12}/> },
  deadline: { label: 'Deadline', icon: <AlertTriangle size={12}/> },
  assessment: { label: 'Assessment', icon: <CheckSquare size={12}/> },
  study: { label: 'Study', icon: <Book size={12}/> },
  project: { label: 'Project', icon: <Users size={12}/> },
  personal: { label: 'Personal', icon: <CalendarIcon size={12}/> }
};

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Calendar = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('studioUp_calendar');
    return saved ? JSON.parse(saved) : [];
  });
  
  const today = new Date();
  today.setHours(0,0,0,0);

  const [selectedDate, setSelectedDate] = useState(today);
  const [cursorDate, setCursorDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [view, setView] = useState('month'); 
  const [activeChip, setActiveChip] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ class: true, deadline: true, assessment: true, study: true, project: true, personal: true });

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState(null); // The event shown in the detail popup
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', category: 'class', module: '', date: '', endDate: '', start: '09:00', end: '10:00', location: '', reminder: 'none', description: '', completed: false, color: EVENT_COLORS[0]
  });

  useEffect(() => {
    localStorage.setItem('studioUp_calendar', JSON.stringify(events));
  }, [events]);

  const formatDateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const getMondayIndex = (d) => (d.getDay() + 6) % 7;
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const getStartOfWeek = (d) => { const x = new Date(d); x.setDate(x.getDate() - getMondayIndex(x)); x.setHours(0,0,0,0); return x; };

  const getMonthDays = () => {
    const firstDay = new Date(cursorDate.getFullYear(), cursorDate.getMonth(), 1);
    const start = getStartOfWeek(firstDay);
    const days = [];
    for(let i = 0; i < 42; i++) days.push(addDays(start, i)); 
    return days;
  };

  const getWeekDays = () => {
    const start = getStartOfWeek(cursorDate);
    const days = [];
    for(let i = 0; i < 7; i++) days.push(addDays(start, i));
    return days;
  };

  const isVisible = (e) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = !term || (e.title + ' ' + (e.module || '') + ' ' + (e.location || '')).toLowerCase().includes(term);
    return filters[e.category] && matchesSearch;
  };

  const getEventsOn = (d) => {
    const dKey = formatDateKey(d);
    return events.filter(e => e.date === dKey && isVisible(e)).sort((a,b) => (a.start || '23:59').localeCompare(b.start || '23:59'));
  };

  const openForm = (eventToEdit = null, presetDate = null) => {
    if (eventToEdit) {
      setFormData(eventToEdit);
      setEditingId(eventToEdit.id);
    } else {
      setFormData({
        title: '', category: 'class', module: '', date: presetDate || formatDateKey(selectedDate), 
        endDate: '', start: '09:00', end: '10:00', location: '', reminder: 'none', description: '', completed: false, color: EVENT_COLORS[0]
      });
      setEditingId(null);
    }
    setDetailEvent(null);
    setIsModalOpen(true);
  };

  const saveEvent = (e) => {
    e.preventDefault();
    const payload = { id: editingId || `evt_${Date.now()}`, ...formData };
    if (editingId) {
      setEvents(events.map(x => x.id === editingId ? payload : x));
    } else {
      setEvents([...events, payload]);
    }
    setIsModalOpen(false);
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
    setIsModalOpen(false);
    setDetailEvent(null);
  };

  const toggleComplete = (id) => {
    setEvents(events.map(ev => ev.id === id ? { ...ev, completed: !ev.completed } : ev));
    if (detailEvent) {
      setDetailEvent(prev => ({ ...prev, completed: !prev.completed }));
    }
  };

  const onCellClick = (d) => {
    setSelectedDate(d);
    if (view === 'month') setCursorDate(new Date(d.getFullYear(), d.getMonth(), 1));
    openForm(null, formatDateKey(d));
  };

  const selectedEvents = getEventsOn(selectedDate);
  const upcomingEvents = events.filter(e => new Date(e.date) >= today && isVisible(e)).sort((a,b) => new Date(a.date) - new Date(b.date));
  const filteredUpcoming = activeChip === 'all' ? upcomingEvents : upcomingEvents.filter(e => e.category === activeChip);

  return (
    <div className="app">
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
            <button className="nav-item" onClick={() => navigate('/classes')}><CalendarDays /><span>Classes</span></button>
            <button className="nav-item" onClick={() => navigate('/grades')}><CheckSquare /><span>Grades</span></button>
            <button className="nav-item" onClick={() => navigate('/assignments')}><ClipboardList /><span>Assignments</span></button>
            <button className="nav-item" onClick={() => navigate('/timer')}><Clock3 /><span>Focus Timer</span></button>
            <button className="nav-item active"><CalendarIcon /><span>Calendar</span></button>
            <button className="nav-item"><BookOpen /><span>My Semester</span></button>
            <button className="nav-item"><Settings /><span>Settings</span></button>
          </div>
        </nav>
      </aside>

      <header className="topbar">
        <div className="search-container">
          <label className="search-box">
            <Search />
            <input type="text" placeholder="Search calendar events..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}/>
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
              <h1 style={{fontSize: '30px', margin: '0 0 5px', color: '#202957'}}>Calendar</h1>
              <div className="subtitle">Your academic life, organised in one place.</div>
            </div>
            <button type="button" className="btn primary" onClick={() => openForm()}><Plus size={16}/> Create Event</button>
          </section>

          <div className="layout">
            <div className="left-column">
              <section className="panel calendar-panel">
                <div className="toolbar">
                  <div className="toolbar-left">
                    <button type="button" className="btn small" onClick={() => { setSelectedDate(today); setCursorDate(new Date(today.getFullYear(), today.getMonth(), 1)); }}>Today</button>
                    <button type="button" className="icon-btn" onClick={() => setCursorDate(view==='week'?addDays(cursorDate,-7):new Date(cursorDate.getFullYear(), cursorDate.getMonth()-1, 1))}><ChevronLeft size={16}/></button>
                    <button type="button" className="icon-btn" onClick={() => setCursorDate(view==='week'?addDays(cursorDate,7):new Date(cursorDate.getFullYear(), cursorDate.getMonth()+1, 1))}><ChevronRight size={16}/></button>
                    <div className="month-label" style={{marginLeft: '10px', fontSize: '16px', fontWeight: 'bold', color: '#202957'}}>
                      {cursorDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="toolbar-right">
                    <div className="view-switch">
                      <button type="button" className={view==='month'?'active':''} onClick={()=>setView('month')}>Month</button>
                      <button type="button" className={view==='week'?'active':''} onClick={()=>setView('week')}>Week</button>
                    </div>
                  </div>
                </div>

                <div className="calendar-grid">
                  {DAY_NAMES.map(d => <div key={d} className="weekday">{d}</div>)}
                  
                  {(view === 'month' ? getMonthDays() : getWeekDays()).map((d, i) => {
                    const isSelected = formatDateKey(d) === formatDateKey(selectedDate);
                    const isToday = formatDateKey(d) === formatDateKey(today);
                    const isOtherMonth = view === 'month' && d.getMonth() !== cursorDate.getMonth();
                    const dayEvents = getEventsOn(d);

                    return (
                      <div 
                        key={i} 
                        className={`day-cell ${isOtherMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => onCellClick(d)}
                        title="Click to add event"
                      >
                        <div className={`day-number ${isToday ? 'today' : ''}`} onClick={(e) => { e.stopPropagation(); setSelectedDate(d); }}>{d.getDate()}</div>
                        {dayEvents.slice(0, view === 'week' ? 10 : 3).map(e => {
                          const eventColor = e.color || '#3784ee';
                          return (
                            <div 
                              key={e.id} 
                              className={`event-pill ${e.completed ? 'completed' : ''}`} 
                              style={{
                                background: e.completed ? `${eventColor}40` : eventColor,
                                color: e.completed ? '#66719b' : 'white',
                                borderColor: e.completed ? 'transparent' : 'rgba(0,0,0,0.05)'
                              }} 
                              onClick={(ev) => { ev.stopPropagation(); setSelectedDate(d); setDetailEvent(e); }}
                            >
                              {e.completed ? <CheckCircle2 size={11} style={{marginRight: '4px'}}/> : <Circle size={11} style={{marginRight: '4px'}}/>}
                              <span style={{textDecoration: e.completed ? 'line-through' : 'none'}}>{e.title}</span>
                            </div>
                          );
                        })}
                        {view === 'month' && dayEvents.length > 3 && <div className="more-events">+{dayEvents.length - 3} more</div>}
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="panel agenda-panel">
                <div className="section-head">
                  <div>
                    <h2>{selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h2>
                    <p>{formatDateKey(selectedDate) === formatDateKey(today) ? 'Here is what you have planned for today.' : 'Your plan for the selected day.'}</p>
                  </div>
                </div>
                
                <div className="agenda-list">
                  {selectedEvents.length === 0 ? (
                    <div className="empty-state">Nothing scheduled for this day. Click the calendar above to add an event.</div>
                  ) : (
                    selectedEvents.map(e => {
                      const cat = CATEGORIES[e.category] || CATEGORIES.personal;
                      return (
                        <div key={e.id} className="agenda-row" onClick={() => setDetailEvent(e)} style={{opacity: e.completed ? 0.6 : 1}}>
                          <div className="agenda-time">{e.start || 'All day'}</div>
                          <div className="agenda-icon" style={{background: `${e.color}20`, color: e.color}}>{cat.icon}</div>
                          <div style={{minWidth: 0}}>
                            <div className="agenda-title" style={{textDecoration: e.completed ? 'line-through' : 'none'}}>{e.title}</div>
                            <div className="agenda-meta">{e.module || e.location || cat.label}</div>
                          </div>
                          <button 
                            type="button"
                            className="done-toggle" 
                            onClick={(ev) => { ev.stopPropagation(); toggleComplete(e.id); }}
                            style={{background: 'none', border: 'none', cursor: 'pointer', color: e.completed ? '#20a775' : '#8790ad'}}
                          >
                            {e.completed ? <CheckCircle2 size={20}/> : <Circle size={20}/>}
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>
              </section>
            </div>

            <aside className="right-column">
              <section className="panel upcoming-panel">
                <div className="upcoming-title">
                  <h2 style={{fontSize: '15px', color: '#202957', margin: 0}}>Upcoming Events</h2>
                </div>
                <div className="filter-chips">
                  {['all', 'class', 'deadline', 'study'].map(chip => (
                    <button type="button" key={chip} className={`chip ${activeChip === chip ? 'active' : ''}`} onClick={() => setActiveChip(chip)}>
                      {chip.charAt(0).toUpperCase() + chip.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="upcoming-list">
                  {filteredUpcoming.slice(0, 5).length === 0 ? <div className="empty-state">No upcoming events.</div> :
                    filteredUpcoming.slice(0, 5).map(e => {
                      const cat = CATEGORIES[e.category] || CATEGORIES.personal;
                      const isOverdue = new Date(e.date) < today && !e.completed;
                      return (
                        <div key={e.id} className="upcoming-item" onClick={() => setDetailEvent(e)}>
                          <div className="upcoming-icon" style={{background: `${e.color}20`, color: e.color}}>{cat.icon}</div>
                          <div style={{opacity: e.completed ? 0.5 : 1, textDecoration: e.completed ? 'line-through' : 'none', minWidth: 0}}>
                            <h3 style={{fontSize: '13px', margin: '0 0 4px', color: isOverdue ? '#d84652' : 'inherit', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{e.title}</h3>
                            <p style={{fontSize: '11px', color: '#6f7ba4', margin: '0 0 3px'}}>{new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} {e.start ? `· ${e.start}` : ''}</p>
                            <div style={{fontSize: '10px', color: '#8b95b3'}}>{e.module || cat.label}</div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>

      {/* DETAIL EVENT GOOGLE-STYLE POPUP */}
      {detailEvent && (
        <div className="modal-backdrop show" style={{ display: 'flex', position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(28, 30, 55, .20)', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => { if(e.target === e.currentTarget) setDetailEvent(null) }}>
          <div className="detail-card">
            <div className="detail-card-actions">
              <button onClick={() => openForm(detailEvent)} title="Edit"><Pencil size={15} /></button>
              <button onClick={() => deleteEvent(detailEvent.id)} title="Delete"><Trash2 size={15} /></button>
              <button><MoreVertical size={15} /></button>
              <button onClick={() => setDetailEvent(null)} title="Close" style={{marginLeft: '8px'}}><X size={18} /></button>
            </div>
            <div className="detail-card-content">
              <div className="detail-color-marker" style={{backgroundColor: detailEvent.color}}></div>
              <div className="detail-info">
                <h2>{detailEvent.title}</h2>
                <p>{new Date(detailEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                {detailEvent.start && <p style={{marginTop: '2px', color: '#65709b'}}>{detailEvent.start} - {detailEvent.end}</p>}
                {(detailEvent.module || detailEvent.location) && (
                  <div style={{marginTop: '12px', fontSize: '13px', color: '#454663'}}>
                    {detailEvent.module && <div><BookOpen size={14} style={{display:'inline', marginRight:'8px', verticalAlign:'-2px', color:'#8790ad'}}/> {detailEvent.module}</div>}
                    {detailEvent.location && <div style={{marginTop: '6px'}}><CalendarIcon size={14} style={{display:'inline', marginRight:'8px', verticalAlign:'-2px', color:'#8790ad'}}/> {detailEvent.location}</div>}
                  </div>
                )}
              </div>
            </div>
            <div className="detail-card-footer">
              <button className="mark-completed-btn" onClick={() => toggleComplete(detailEvent.id)}>
                {detailEvent.completed ? 'Mark incomplete' : 'Mark completed'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE/EDIT EVENT MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop show" style={{ display: 'flex', position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(28, 30, 55, .40)', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => { if(e.target === e.currentTarget) setIsModalOpen(false) }}>
          <section className="modal" style={{ zIndex: 10000, position: 'relative', width: 'min(620px, 100%)', background: 'white', borderRadius: '17px', padding: '24px' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: '0 0 6px', fontSize: '21px', color: '#202957' }}>{editingId ? 'Edit Event' : 'Create New Event'}</h2>
                <p style={{ margin: 0, color: '#8790ad', fontSize: '13px' }}>Add an event to your personal calendar.</p>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ border: 0, background: '#f4f4fc', width: '34px', height: '34px', borderRadius: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} color="#66709b"/></button>
            </div>
            
            <form onSubmit={saveEvent}>
              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#485274' }}>Event title *</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ padding: '11px 12px', border: '1px solid #e1e5f2', borderRadius: '9px', outline: 'none' }} placeholder="e.g. Study for STAS test" />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#485274' }}>Date *</label>
                  <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={{ padding: '11px 12px', border: '1px solid #e1e5f2', borderRadius: '9px', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#485274' }}>Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ padding: '11px 12px', border: '1px solid #e1e5f2', borderRadius: '9px', outline: 'none', background: 'white' }}>
                    <option value="class">Class</option><option value="deadline">Assignment deadline</option>
                    <option value="assessment">Test or examination</option><option value="study">Study session</option>
                    <option value="project">Group project</option><option value="personal">Personal event</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#485274' }}>Start time</label>
                  <input type="time" value={formData.start} onChange={e => setFormData({...formData, start: e.target.value})} style={{ padding: '11px 12px', border: '1px solid #e1e5f2', borderRadius: '9px', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#485274' }}>End time</label>
                  <input type="time" value={formData.end} onChange={e => setFormData({...formData, end: e.target.value})} style={{ padding: '11px 12px', border: '1px solid #e1e5f2', borderRadius: '9px', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#485274' }}>Event Color</label>
                  <div style={{display: 'flex', gap: '10px'}}>
                    {EVENT_COLORS.map(c => (
                      <button 
                        key={c} type="button" 
                        onClick={() => setFormData({...formData, color: c})}
                        style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', backgroundColor: c, cursor: 'pointer', boxShadow: formData.color === c ? `0 0 0 3px white, 0 0 0 5px ${c}` : 'none' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px', gap: '10px' }}>
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn primary">Save Event</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default Calendar;