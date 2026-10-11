import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Home as HomeIcon, CalendarDays, BookOpen, 
  ClipboardList, Calendar, Users, FileText, Clock3, 
  ChartNoAxesColumn, Settings, Search, Bell, Plus, 
  ChevronDown, BarChart3, Download,
  X, TrendingUp, Tag, Hash, Percent, Lightbulb, Check, NotebookPen,
  Leaf, Triangle, Monitor, ChevronRight, Calculator, ArrowRight
} from 'lucide-react';
import './Grades.css';

const Grades = () => {
  const navigate = useNavigate();
  
  // Grade Form State (Now connected to localStorage)
  const [grades, setGrades] = useState(() => {
    const savedGrades = localStorage.getItem('studioUp_grades');
    return savedGrades ? JSON.parse(savedGrades) : [];
  });

  // Save to localStorage automatically whenever grades change
  useEffect(() => {
    localStorage.setItem('studioUp_grades', JSON.stringify(grades));
  }, [grades]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    module: '', assessmentName: '', assessmentType: '',
    markObtained: '', totalMarks: '', weight: '',
    date: '', semester: '', notes: ''
  });

  // Calculator State
  const [calcCurrent, setCalcCurrent] = useState('76');
  const [calcWeight, setCalcWeight] = useState('40');
  const [calcTarget, setCalcTarget] = useState('80');
  const [calcResult, setCalcResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddGrade = (e) => {
    e.preventDefault();
    const newGrade = {
      id: Date.now(),
      ...formData,
      markObtained: parseFloat(formData.markObtained),
      totalMarks: parseFloat(formData.totalMarks),
      weight: parseFloat(formData.weight)
    };
    setGrades([newGrade, ...grades]);
    setIsModalOpen(false);
    setFormData({
      module: '', assessmentName: '', assessmentType: '',
      markObtained: '', totalMarks: '', weight: '',
      date: '', semester: '', notes: ''
    });
  };

  // Calculator Logic
  const handleCalculateGrade = () => {
    const current = parseFloat(calcCurrent);
    const weight = parseFloat(calcWeight);
    const target = parseFloat(calcTarget);

    if (isNaN(current) || isNaN(weight) || isNaN(target)) {
      setCalcResult(<>Please enter valid numbers.</>);
      return;
    }

    const currentWeight = 1 - (weight / 100);
    const required = (target - (current * currentWeight)) / (weight / 100);

    if (required > 100) {
      setCalcResult(<>You would need <strong>{required.toFixed(1)}%</strong> on the exam.<br/>This target requires more than 100%.</>);
    } else if (required <= 0) {
      setCalcResult(<>You have already reached your target.<br/>Any score will keep you at or above <strong>{target}%</strong>.</>);
    } else {
      setCalcResult(<>You need approx. <strong>{required.toFixed(1)}%</strong> on your exam to finish with <strong>{target}%</strong>.</>);
    }
  };

  // Data Aggregation for Table
  const getClassData = () => {
    const grouped = {};
    grades.forEach(g => {
      if (!grouped[g.module]) {
        grouped[g.module] = { name: g.module, assignments: [], tests: [], exams: [], totalWeightedScore: 0, totalWeight: 0 };
      }
      const percentage = (g.markObtained / g.totalMarks) * 100;
      const weighted = percentage * (g.weight / 100);

      grouped[g.module].totalWeightedScore += weighted;
      grouped[g.module].totalWeight += g.weight;

      if (['Assignment', 'Project', 'Practical'].includes(g.assessmentType)) {
        grouped[g.module].assignments.push(percentage);
      } else if (['Test', 'Quiz'].includes(g.assessmentType)) {
        grouped[g.module].tests.push(percentage);
      } else if (g.assessmentType === 'Exam') {
        grouped[g.module].exams.push(percentage);
      }
    });

    return Object.values(grouped).map(mod => {
      const getAvg = (arr) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
      const finalScore = mod.totalWeight > 0 ? Math.round((mod.totalWeightedScore / mod.totalWeight) * 100) : 0;

      let gradeLetter = 'N/A';
      let badgeClass = 'grade-calculus';
      if (finalScore >= 90) { gradeLetter = 'A'; badgeClass = 'grade-a'; }
      else if (finalScore >= 85) { gradeLetter = 'A-'; badgeClass = 'grade-a-minus'; }
      else if (finalScore >= 80) { gradeLetter = 'B+'; badgeClass = 'grade-b'; }
      else if (finalScore >= 70) { gradeLetter = 'B'; badgeClass = 'grade-calculus'; }
      else if (finalScore > 0) { gradeLetter = 'C'; badgeClass = 'grade-calculus'; }

      let icon = <GraduationCap size={15} />;
      let iconClass = 'purple';
      if (mod.name.includes('Bio')) { icon = <Leaf size={15} />; iconClass = 'green'; }
      else if (mod.name.includes('English')) { icon = <BookOpen size={15} />; iconClass = 'blue'; }
      else if (mod.name.includes('Math') || mod.name.includes('Calc')) { icon = <Triangle size={15} />; iconClass = 'yellow'; }
      else if (mod.name.includes('Computer')) { icon = <Monitor size={15} />; iconClass = 'purple'; }

      return {
        id: mod.name, name: mod.name, code: mod.name.substring(0, 3).toUpperCase() + '101',
        avgAssignments: getAvg(mod.assignments), avgTests: getAvg(mod.tests), avgExams: getAvg(mod.exams),
        final: finalScore, gradeLetter, badgeClass, icon, iconClass
      };
    });
  };

  const classData = getClassData();

  return (
    <div className="app">
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
            <button className="nav-item"><CalendarDays /><span>My Semester</span></button>
            <button className="nav-item" onClick={() => navigate('/classes')}><BookOpen /><span>Classes</span></button>
            <button className="nav-item" onClick={() => navigate('/assignments')}><ClipboardList/><span>Assignments</span></button>
            <button className="nav-item"><Calendar /><span>Calendar</span></button>
            <button className="nav-item"><Users /><span>Group Projects</span></button>
            <button className="nav-item"><FileText /><span>Notes</span></button>
            <button className="nav-item" onClick={() => navigate('/timer')}><Clock3/><span>Focus Timer</span></button>
            <button className="nav-item active"><ChartNoAxesColumn /><span>Grades</span></button>
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

      {/* MAIN CONTENT */}
      <main className="main">
        <div className="content">
          
          <section className="page-header">
            <div className="page-title">
              <div className="page-icon"><BarChart3 /></div>
              <div>
                <h1>Grades</h1>
                <p>Track your academic performance across all your classes.</p>
              </div>
            </div>
            
            <div className="page-actions">
              <button className="export-button"><Download size={17} /> Export</button>
              <button className="add-grade" onClick={() => setIsModalOpen(true)}>
                <Plus size={17} /> Add Grade
              </button>
            </div>
          </section>

          <section className="card classes-card">
            <div className="card-header">
              <div className="card-title">
                <div className="card-title-icon"><GraduationCap size={19} /></div>
                <h2>My Classes</h2>
              </div>
              <div className="class-filters">
                <button className="filter">All Classes <ChevronDown size={13} /></button>
                <button className="filter">This Semester <ChevronDown size={13} /></button>
              </div>
            </div>

            {classData.length === 0 ? (
              <div className="empty-classes">
                <p>No classes recorded yet. Add a grade to generate your dashboard.</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Class</th><th>Assignments</th><th>Tests</th><th>Exam</th><th>Final</th><th>Grade</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {classData.map((cls) => (
                    <tr key={cls.id}>
                      <td>
                        <div className="class-name">
                          <div className={`class-icon ${cls.iconClass}`}>{cls.icon}</div>
                          <div>
                            <div className="class-title">{cls.name}</div>
                            <div className="class-code">{cls.code}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="mark">
                          <span className="mark-value">{cls.avgAssignments}%</span>
                          <div className="mark-bar"><span style={{ width: `${cls.avgAssignments}%` }}></span></div>
                        </div>
                      </td>
                      <td>
                        <div className="mark">
                          <span className="mark-value">{cls.avgTests}%</span>
                          <div className="mark-bar blue"><span style={{ width: `${cls.avgTests}%` }}></span></div>
                        </div>
                      </td>
                      <td>
                        <div className="mark">
                          <span className="mark-value">{cls.avgExams}%</span>
                          <div className="mark-bar purple"><span style={{ width: `${cls.avgExams}%` }}></span></div>
                        </div>
                      </td>
                      <td>
                        <div className="mark">
                          <span className="mark-value">{cls.final}%</span>
                          <div className={`mark-bar ${cls.iconClass}`}><span style={{ width: `${cls.final}%` }}></span></div>
                        </div>
                      </td>
                      <td><span className={`grade-badge ${cls.badgeClass}`}>{cls.gradeLetter}</span></td>
                      <td className="row-arrow"><ChevronRight size={15} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* =========================================================
              BOTTOM WIDGETS
          ========================================================= */}
          <section className="bottom-grid">
            
            {/* Grade Calculator */}
            <div className="card calculator-card">
              <div className="card-header">
                <div className="card-title">
                  <div className="card-title-icon"><Calculator size={19} /></div>
                  <h2>Grade Calculator</h2>
                </div>
              </div>
              <div className="calculator-subtitle">What do I need on my exam?</div>
              
              <div className="calculator-inputs">
                <div className="calc-group">
                  <label>Current grade</label>
                  <div className="calc-input">
                    <input type="number" value={calcCurrent} onChange={(e) => setCalcCurrent(e.target.value)} />
                    <span>%</span>
                  </div>
                </div>
                <div className="calc-group">
                  <label>Exam weight</label>
                  <div className="calc-input">
                    <input type="number" value={calcWeight} onChange={(e) => setCalcWeight(e.target.value)} />
                    <span>%</span>
                  </div>
                </div>
                <div className="calc-group">
                  <label>Target grade</label>
                  <div className="calc-input">
                    <input type="number" value={calcTarget} onChange={(e) => setCalcTarget(e.target.value)} />
                    <span>%</span>
                  </div>
                </div>
              </div>
              
              <button className="calculate-button" onClick={handleCalculateGrade}>
                Calculate <ArrowRight size={15} />
              </button>

              {calcResult && (
                <div className="calculator-result">
                  {calcResult}
                </div>
              )}
            </div>

            {/* Academic Overview */}
            <div className="card calculator-card">
              <div className="card-header">
                <div className="card-title">
                  <div className="card-title-icon"><Lightbulb size={19} /></div>
                  <h2>Academic Overview</h2>
                </div>
              </div>
              <div className="overview-content">
                Keep your grades, assessments and academic goals together in one place.
                <br /><br />
                <strong>StudentUp</strong> helps you see where you are and where you're going.
              </div>
            </div>

          </section>

        </div>
      </main>

      {/* ADD GRADE MODAL */}
      {isModalOpen && (
        <div className="modal-overlay active">
          <div className="grade-modal">
            <div className="modal-header">
              <div className="modal-title-area">
                <div className="modal-icon"><TrendingUp size={23} /></div>
                <div>
                  <h2>Add Grade</h2>
                  <p>Enter your grade details below. We'll calculate the percentage and update your progress automatically.</p>
                </div>
              </div>
              <button className="close-modal" onClick={() => setIsModalOpen(false)}><X size={19} /></button>
            </div>
            <form onSubmit={handleAddGrade}>
              <div className="form-group full">
                <label>Module / Course <span>*</span></label>
                <div className="input-wrapper">
                  <GraduationCap size={17} />
                  <select name="module" value={formData.module} onChange={handleInputChange} required>
                    <option value="">Select a module</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology 101">Biology 101</option>
                    <option value="English Comp">English Comp</option>
                    <option value="Statistics">Statistics</option>
                  </select>
                  <ChevronDown className="select-arrow" size={15} />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Assessment Name <span>*</span></label>
                  <div className="input-wrapper">
                    <FileText size={17} />
                    <input type="text" name="assessmentName" placeholder="e.g. Test 1, Assignment 1" value={formData.assessmentName} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Assessment Type <span>*</span></label>
                  <div className="input-wrapper">
                    <Tag size={17} />
                    <select name="assessmentType" value={formData.assessmentType} onChange={handleInputChange} required>
                      <option value="">Select type</option>
                      <option value="Test">Test</option>
                      <option value="Assignment">Assignment</option>
                      <option value="Practical">Practical</option>
                      <option value="Exam">Exam</option>
                      <option value="Project">Project</option>
                      <option value="Quiz">Quiz</option>
                    </select>
                    <ChevronDown className="select-arrow" size={15} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Mark Obtained <span>*</span></label>
                  <div className="input-wrapper">
                    <Hash size={17} />
                    <input type="number" name="markObtained" placeholder="e.g. 78" min="0" step="0.1" value={formData.markObtained} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Total Marks <span>*</span></label>
                  <div className="input-wrapper">
                    <Hash size={17} />
                    <input type="number" name="totalMarks" placeholder="e.g. 100" min="1" step="0.1" value={formData.totalMarks} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Weight (%) <span>*</span></label>
                  <div className="input-wrapper">
                    <Percent size={17} />
                    <input type="number" name="weight" placeholder="e.g. 20" min="0" max="100" step="0.1" value={formData.weight} onChange={handleInputChange} required />
                    <span className="input-suffix">%</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Date <span>*</span></label>
                  <div className="input-wrapper">
                    <Calendar size={17} />
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                  </div>
                </div>
              </div>
              <div className="form-group full">
                <label>Semester <span>*</span></label>
                <div className="input-wrapper">
                  <CalendarDays size={17} />
                  <select name="semester" value={formData.semester} onChange={handleInputChange} required>
                    <option value="">Select semester</option>
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                  </select>
                  <ChevronDown className="select-arrow" size={15} />
                </div>
              </div>
              <div className="form-group full">
                <label>Notes <small>(Optional)</small></label>
                <div className="textarea-wrapper">
                  <NotebookPen size={17} />
                  <textarea name="notes" placeholder="Add any additional notes..." value={formData.notes} onChange={handleInputChange}></textarea>
                </div>
              </div>
              <div className="calculation-info">
                <div className="info-icon"><Lightbulb size={15} /></div>
                <div>
                  <strong>Automatic calculation</strong>
                  <p>Your percentage and weighted contribution will be calculated automatically based on the marks and weight you provide.</p>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="save-grade-btn"><Check size={16} /> Save Grade</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grades;