import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Home as HomeIcon, CalendarDays, BookOpen, 
  ClipboardList, Calendar, Users, FileText, Clock3, 
  ChartNoAxesColumn, Settings, Search, Bell, Plus, 
  ChevronDown, ChevronRight, Leaf, Triangle, Monitor, 
  FilePlus, X, ChevronUp, Lightbulb, ArrowRight, Flame, Clock, 
  CheckCircle, CheckSquare 
} from 'lucide-react';
import './Assignments.css';

const Assignments = () => {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('studioUp_assignments');
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGradingOpen, setIsGradingOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '', module: '', type: 'Assignment', 
    dueDate: '', dueTime: '23:59', priority: 'Medium', 
    status: 'Not Started', description: '', studyTime: '',
    totalMarks: '', gradeWeight: '', reminder: '1 day before'
  });

  useEffect(() => {
    localStorage.setItem('studioUp_assignments', JSON.stringify(assignments));
  }, [assignments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAssignment = (e) => {
    e.preventDefault();
    const newAssignment = { id: Date.now(), ...formData };
    setAssignments([newAssignment, ...assignments]);
    setIsModalOpen(false);
    setFormData({
      title: '', module: '', type: 'Assignment', dueDate: '', dueTime: '23:59', 
      priority: 'Medium', status: 'Not Started', description: '', studyTime: '',
      totalMarks: '', gradeWeight: '', reminder: '1 day before'
    });
    setIsGradingOpen(false);
  };

  const handleStatusCycle = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Not Started' ? 'In Progress' :
                       currentStatus === 'In Progress' ? 'Submitted' : 'Not Started';
    setAssignments(assignments.map(a => a.id === id ? { ...a, status: nextStatus } : a));
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysDifference = (dateString) => {
    if (!dateString) return 999; 
    const due = new Date(dateString);
    if (isNaN(due.getTime())) return 999;
    due.setHours(0, 0, 0, 0);
    return Math.round((due - today) / (1000 * 60 * 60 * 24));
  };

  const dueTodayCount = assignments.filter(a => a.status !== 'Submitted' && getDaysDifference(a.dueDate) === 0).length;
  const dueThisWeekCount = assignments.filter(a => a.status !== 'Submitted' && getDaysDifference(a.dueDate) >= 0 && getDaysDifference(a.dueDate) <= 7).length;
  const inProgressCount = assignments.filter(a => a.status === 'In Progress').length;
  const completedCount = assignments.filter(a => a.status === 'Submitted').length;
  const notStartedCount = assignments.filter(a => a.status === 'Not Started').length;
  const overdueCount = assignments.filter(a => a.status !== 'Submitted' && getDaysDifference(a.dueDate) < 0).length;

  const totalAssigned = assignments.length || 1; 
  const progressPct = Math.round((completedCount / totalAssigned) * 100) || 0;

  const filteredAssignments = assignments.filter(a => {
    if (filter === 'Due Soon') return getDaysDifference(a.dueDate) >= 0 && getDaysDifference(a.dueDate) <= 3 && a.status !== 'Submitted';
    if (filter === 'In Progress') return a.status === 'In Progress';
    if (filter === 'Completed') return a.status === 'Submitted';
    if (filter === 'Overdue') return getDaysDifference(a.dueDate) < 0 && a.status !== 'Submitted';
    return true;
  }).filter(a => (a.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (a.module || '').toLowerCase().includes(searchQuery.toLowerCase()));

  filteredAssignments.sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));

  const getIcon = (moduleName) => {
    const name = (moduleName || '').toLowerCase();
    if (name.includes('bio')) return { icon: <Leaf size={20} />, color: 'green' };
    if (name.includes('eng') || name.includes('hist')) return { icon: <BookOpen size={20} />, color: 'purple' };
    if (name.includes('math') || name.includes('calc')) return { icon: <Triangle size={20} />, color: 'teal' };
    return { icon: <Monitor size={20} />, color: 'blue' };
  };

  const getProgress = (status) => {
    if (status === 'Submitted') return 100;
    if (status === 'In Progress') return 50;
    return 0; 
  };

  const formatSafeDate = (dateString) => {
    if (!dateString) return 'No Date';
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? 'No Date' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

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
            <button className="nav-item active"><ClipboardList /><span>Assignments</span></button>
            <button className="nav-item" onClick={() => navigate('/timer')}><Clock3 /><span>Focus Timer</span></button>
            <button className="nav-item"><Calendar /><span>Calendar</span></button>
            <button className="nav-item"><BookOpen /><span>My Semester</span></button>
            <button className="nav-item"><Settings /><span>Settings</span></button>
          </div>
        </nav>
      </aside>

      <header className="topbar">
        <div className="search-container">
          <label className="search-box">
            <Search />
            <input type="text" placeholder="Search assignments, notes, classes..." />
          </label>
        </div>
        <div className="header-actions">
          <button className="notification"><Bell /><span className="notification-dot"></span></button>
          {/* Explicit type="button" added */}
          <button type="button" className="new-task" onClick={() => setIsModalOpen(true)}>
            <Plus /><span>New Task</span>
          </button>
          <div className="user-area"><div className="avatar">AN</div><ChevronDown className="user-chevron" /></div>
        </div>
      </header>

      <main className="main">
        <div className="content">
          
          <section className="page-heading-assignments">
            <div className="page-heading-title">
              <div className="heading-icon"><ClipboardList size={26} /></div>
              <div>
                <h1>Assignments</h1>
                <p>Keep track of everything you need to submit.</p>
              </div>
            </div>
            {/* Explicit type="button" added to guarantee it fires onClick */}
            <button type="button" className="primary-btn" onClick={() => setIsModalOpen(true)} style={{position: 'relative', zIndex: 10}}>
              <Plus size={16} /> New Assignment
            </button>
          </section>

          <div className="stat-cards-grid">
            <div className="stat-box red">
              <div className="stat-header"><Calendar size={16}/> Due Today</div>
              <div className="stat-bottom"><h2>{dueTodayCount}</h2> <ArrowRight size={18} /></div>
            </div>
            <div className="stat-box yellow">
              <div className="stat-header"><Calendar size={16}/> Due This Week</div>
              <div className="stat-bottom"><h2>{dueThisWeekCount}</h2> <ArrowRight size={18} /></div>
            </div>
            <div className="stat-box blue">
              <div className="stat-header"><Clock size={16}/> In Progress</div>
              <div className="stat-bottom"><h2>{inProgressCount}</h2> <ArrowRight size={18} /></div>
            </div>
            <div className="stat-box green">
              <div className="stat-header"><CheckCircle size={16}/> Completed</div>
              <div className="stat-bottom"><h2>{completedCount}</h2> <ArrowRight size={18} /></div>
            </div>
          </div>

          <div className="assignments-layout">
            <div className="assignments-left">
              <div className="filters-row">
                <div className="search-wrapper">
                  <Search size={16}/>
                  <input type="text" placeholder="Search assignments..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <div className="filter-pills">
                  {['All', 'Due Soon', 'In Progress', 'Completed', 'Overdue'].map(f => (
                    <button type="button" key={f} className={`filter-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
                  ))}
                </div>
                <div className="sort-dropdown">
                  Sort by: Due Date <ChevronDown size={14} />
                </div>
              </div>

              <div className="rich-assignment-list">
                {filteredAssignments.length === 0 ? (
                  <div className="empty-message" style={{padding: '30px', textAlign: 'center', color: '#8392ae'}}>
                    No assignments match your criteria. Click "New Assignment" to add one.
                  </div>
                ) : (
                  filteredAssignments.map(item => {
                    const modData = getIcon(item.module);
                    const diff = getDaysDifference(item.dueDate);
                    let dueText = formatSafeDate(item.dueDate);
                    if (diff === 0) dueText = 'Today';
                    if (diff === 1) dueText = 'Tomorrow';

                    const safePriority = item.priority || 'Medium';
                    const safeStatus = item.status || 'Not Started';

                    return (
                      <div className="rich-row" key={item.id}>
                        <div className="rich-mod">
                          <div className={`rich-icon bg-${modData.color}`}>{modData.icon}</div>
                          <div className="rich-title-area">
                            <span className="rich-module">{item.module}</span>
                            <h3 className="rich-title">{item.title}</h3>
                            <div className="rich-tags">
                              <span className="rich-tag standard"><FileText size={12}/> {item.type}</span>
                              {safePriority === 'High' && <span className="rich-tag high"><Flame size={12}/> High Priority</span>}
                              {safePriority === 'Medium' && <span className="rich-tag medium"><Flame size={12}/> Medium Priority</span>}
                              {safePriority === 'Low' && <span className="rich-tag low"><Flame size={12}/> Low Priority</span>}
                            </div>
                          </div>
                        </div>

                        <div className="rich-date">
                          <Calendar size={18} />
                          <div>
                            <span className="due-day">{diff < 0 ? 'Overdue' : `Due ${dueText}`}</span>
                            <span className="due-time">{diff < 0 ? dueText : item.dueTime}</span>
                          </div>
                        </div>

                        <div className="rich-progress">
                          <span className="pct-text">{getProgress(safeStatus)}%</span>
                          <div className="pct-bar"><div className="pct-fill" style={{width: `${getProgress(safeStatus)}%`, background: getProgress(safeStatus) === 100 ? '#35b793' : '#6c5ce7'}}></div></div>
                        </div>

                        <div className="rich-action">
                          <button 
                            type="button"
                            className={`status-pill clickable ${safeStatus.replace(' ', '-').toLowerCase()}`}
                            onClick={() => handleStatusCycle(item.id, safeStatus)}
                            title="Click to change status"
                          >
                            {safeStatus}
                          </button>
                          <ChevronRight size={18} className="chevron" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="assignments-right">
              <div className="widget-card upcoming-widget">
                <div className="widget-header">
                  <h3><Calendar size={18} /> Upcoming</h3>
                  <button type="button" className="view-all">View All</button>
                </div>
                <div className="upcoming-list">
                  {assignments.filter(a => a.status !== 'Submitted').sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0)).slice(0, 4).map(item => {
                    const diff = getDaysDifference(item.dueDate);
                    let label = formatSafeDate(item.dueDate);
                    if (diff === 0) label = 'Today';
                    if (diff === 1) label = 'Tomorrow';
                    const safePriority = item.priority || 'Medium';

                    return (
                      <div className="upcoming-item" key={item.id} style={{display: 'flex', alignItems: 'center', marginBottom: '16px'}}>
                        <div className="up-date-label" style={{width: '60px', flexShrink: 0}}>{label}</div>
                        <div className="up-content" style={{flex: 1, margin: 0}}>
                          <div className={`dot ${safePriority.toLowerCase()}`}></div>
                          <div className="up-details">
                            <h4>{item.title}</h4>
                            <span>{item.module} · {item.dueTime}</span>
                          </div>
                          <span className={`mini-pill ${safePriority.toLowerCase()}`}>{safePriority}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="widget-card progress-widget">
                <div className="widget-header">
                  <h3><ChartNoAxesColumn size={18} /> Assignment Progress</h3>
                  <button type="button" className="view-all">This Semester</button>
                </div>
                <div className="progress-breakdown">
                  <div className="pb-row"><div className="pb-label"><div className="dot green"></div> Completed</div><div className="pb-val"><span>{completedCount}</span> {progressPct}%</div></div>
                  <div className="pb-row"><div className="pb-label"><div className="dot blue"></div> In Progress</div><div className="pb-val"><span>{inProgressCount}</span> {Math.round((inProgressCount/totalAssigned)*100)||0}%</div></div>
                  <div className="pb-row"><div className="pb-label"><div className="dot gray"></div> Not Started</div><div className="pb-val"><span>{notStartedCount}</span> {Math.round((notStartedCount/totalAssigned)*100)||0}%</div></div>
                  <div className="pb-row"><div className="pb-label"><div className="dot red"></div> Overdue</div><div className="pb-val"><span>{overdueCount}</span> {Math.round((overdueCount/totalAssigned)*100)||0}%</div></div>
                </div>
                <div className="overall-progress">
                  <div className="op-track">
                    <div className="op-fill green" style={{width: `${progressPct}%`}}></div>
                    <div className="op-fill blue" style={{width: `${Math.round((inProgressCount/totalAssigned)*100)}%`}}></div>
                    <div className="op-fill gray" style={{width: `${Math.round((notStartedCount/totalAssigned)*100)}%`}}></div>
                  </div>
                  <div className="op-text"><span>Overall Progress</span> <strong>{progressPct}%</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL - Fixed to absolutely guarantee rendering over conflicting CSS */}
      {isModalOpen && (
        <div 
          className="modal-backdrop show" 
          style={{ display: 'flex', position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(28, 30, 55, .40)', alignItems: 'center', justifyContent: 'center' }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false) }}
        >
          <section className="modal" style={{ zIndex: 10000, position: 'relative' }}>
            <div className="modal-header">
              <div className="modal-title">
                <div className="modal-title-icon"><FilePlus size={22} /></div>
                <div><h2>Create New Assignment</h2><p>Add an assignment to your semester.</p></div>
              </div>
              <button type="button" className="close-btn" onClick={() => setIsModalOpen(false)}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleAddAssignment}>
              <div className="modal-body">
                <div className="section-label">Assignment information</div>
                <div className="form-group">
                  <label>Assignment Title <span className="required">*</span></label>
                  <input name="title" required value={formData.title} onChange={handleInputChange} placeholder="e.g. Binary Search Tree Implementation" />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Module / Class <span className="required">*</span></label>
                    <input name="module" required value={formData.module} onChange={handleInputChange} placeholder="e.g. Data Structures" />
                  </div>
                  <div className="form-group">
                    <label>Assignment Type</label>
                    <select name="type" value={formData.type} onChange={handleInputChange}>
                      <option>Assignment</option><option>Project</option><option>Essay</option><option>Lab Report</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Due Date <span className="required">*</span></label>
                    <input type="date" name="dueDate" required value={formData.dueDate} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Due Time <span className="required">*</span></label>
                    <input type="time" name="dueTime" required value={formData.dueTime} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Priority</label>
                    <select name="priority" value={formData.priority} onChange={handleInputChange}>
                      <option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange}>
                      <option value="Not Started">Not Started</option><option value="In Progress">In Progress</option><option value="Submitted">Submitted</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn"><Plus size={16}/> Create Assignment</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default Assignments;