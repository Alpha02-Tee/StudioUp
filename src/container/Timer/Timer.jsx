import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Home as HomeIcon, CalendarDays, BookOpen, 
  ClipboardList, Calendar, Users, FileText, Clock3, 
  ChartNoAxesColumn, Settings, Search, Bell, Plus, 
  ChevronDown, Timer as TimerIcon, RotateCcw, Play, Pause, 
  SkipForward, Heart, Target, Sparkles, Brain, Coffee, 
  Armchair, AudioLines, CloudRain, History, SlidersHorizontal, Layers
} from 'lucide-react';
import './Timer.css';

const DURATIONS = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60
};

const CAPTIONS = {
  focus: "TIME TO FOCUS",
  short: "TAKE A BREATHER",
  long: "REST & RECHARGE"
};

const Timer = () => {
  const navigate = useNavigate();

  // State
  const [mode, setMode] = useState('focus');
  const [remaining, setRemaining] = useState(DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [task, setTask] = useState('General study');
  
  // Progress & History State (persisted to localStorage)
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('studioUp_timerStats');
    return saved ? JSON.parse(saved) : {
      goal: 120,
      focusSecondsToday: 0,
      completedSessions: 0,
      history: []
    };
  });

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Refs for Intervals and Audio
  const deadlineRef = useRef(null);
  const intervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const rainSourceRef = useRef(null);

  // Save stats to localStorage automatically
  useEffect(() => {
    localStorage.setItem('studioUp_timerStats', JSON.stringify(stats));
  }, [stats]);

  // Timer Tick Logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const nextRemaining = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
        setRemaining(nextRemaining);

        if (nextRemaining <= 0) {
          finishSession();
        }
      }, 200);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2800);
  };

  const playChime = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 660;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.stop(ctx.currentTime + 0.5);
  };

  const toggleRain = async () => {
    if (soundEnabled) {
      if (rainSourceRef.current) {
        rainSourceRef.current.stop();
        rainSourceRef.current.disconnect();
        rainSourceRef.current = null;
      }
      setSoundEnabled(false);
      return;
    }

    try {
      const ctx = audioCtxRef.current || new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      await ctx.resume();

      const sampleCount = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
      const channel = buffer.getChannelData(0);
      for (let i = 0; i < sampleCount; i++) {
        channel[i] = (Math.random() * 2 - 1) * 0.18;
      }

      const source = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      source.buffer = buffer;
      source.loop = true;
      filter.type = "lowpass";
      filter.frequency.value = 1100;
      gain.gain.value = 0.08;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      
      rainSourceRef.current = source;
      setSoundEnabled(true);
    } catch (e) {
      showToast("Audio could not start.");
    }
  };

  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      if (remaining <= 0) setRemaining(DURATIONS[mode]);
      deadlineRef.current = Date.now() + remaining * 1000;
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setRemaining(DURATIONS[mode]);
    showToast("Timer reset.");
  };

  const skipTimer = () => {
    const nextMode = mode === 'focus' ? 'short' : 'focus';
    switchMode(nextMode);
    showToast(`Switched to ${nextMode === 'focus' ? 'focus time.' : 'a fresh session.'}`);
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setRemaining(DURATIONS[newMode]);
  };

  const finishSession = () => {
    setIsRunning(false);
    playChime();

    if (mode === 'focus') {
      setStats(prev => {
        const newHistory = [{
          id: Date.now(),
          task: task,
          minutes: DURATIONS.focus / 60,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }, ...prev.history].slice(0, 5);

        return {
          ...prev,
          focusSecondsToday: prev.focusSecondsToday + DURATIONS.focus,
          completedSessions: prev.completedSessions + 1,
          history: newHistory
        };
      });
      showToast("Focus session complete! Time for a break.");
      switchMode('short');
    } else {
      showToast("Break complete! Ready to focus again?");
      switchMode('focus');
    }
  };

  // Math for rendering
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const mm = String(mins).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');
  
  const focusMinutesToday = Math.floor(stats.focusSecondsToday / 60);
  const progressPercent = Math.min(100, (focusMinutesToday / stats.goal) * 100);

  // Flip Digit Component for cleaner code
  const FlipDigit = ({ digit }) => (
    <div className="flip-card">
      <div className="digit-top">{digit}</div>
      <div className="digit-bottom">{digit}</div>
    </div>
  );

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
            <button className="nav-item active"><Clock3 /><span>Focus Timer</span></button>
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
          <button className="notification"><Bell /><span className="notification-dot"></span></button>
          <button className="new-task"><Plus /><span>New Task</span></button>
          <div className="user-area"><div className="avatar">AN</div><ChevronDown className="user-chevron" /></div>
        </div>
      </header>

      <main className="main">
        <div className="content">
          
          <div className="page-heading">
            <div>
              <div className="eyebrow">YOUR PRODUCTIVITY SPACE</div>
              <h1>Focus Timer</h1>
              <p>One thing at a time. Give your next study session your full attention.</p>
            </div>
            <div className="date-pill">
              <Calendar size={16} style={{color: 'var(--purple)'}} />
              <span>{new Intl.DateTimeFormat('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date())}</span>
            </div>
          </div>

          <section className="stats">
            <div className="stat-card">
              <div className="stat-icon purple"><Clock3 /></div>
              <div>
                <div className="stat-label">Focus time today</div>
                <div className="stat-value">{focusMinutesToday} <small>min</small></div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green"><Target /></div>
              <div>
                <div className="stat-label">Sessions completed</div>
                <div className="stat-value">{stats.completedSessions}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue"><Sparkles /></div>
              <div>
                <div className="stat-label">Daily focus goal</div>
                <div className="stat-value">{stats.goal} <small>min</small></div>
              </div>
            </div>
          </section>

          <div className="content-grid">
            <div className="left-column">
              
              {/* TIMER PANEL */}
              <section className="panel timer-panel">
                <div className="panel-header">
                  <div>
                    <div className="panel-title"><TimerIcon size={19} /> Study session</div>
                    <div className="panel-subtitle">Find your rhythm and get into the zone.</div>
                  </div>
                  <button className="icon-button"><SlidersHorizontal size={18} /></button>
                </div>
                
                <div className="timer-body">
                  <div className="mode-switch">
                    <button className={`mode-btn ${mode === 'focus' ? 'active' : ''}`} onClick={() => switchMode('focus')}>Focus</button>
                    <button className={`mode-btn ${mode === 'short' ? 'active' : ''}`} onClick={() => switchMode('short')}>Short break</button>
                    <button className={`mode-btn ${mode === 'long' ? 'active' : ''}`} onClick={() => switchMode('long')}>Long break</button>
                  </div>
                  
                  <div className="timer-caption">{isRunning ? "STAY IN THE ZONE" : CAPTIONS[mode]}</div>
                  
                  <div className="flip-clock">
                    <div className="flip-group">
                      <FlipDigit digit={mm[0]} />
                      <FlipDigit digit={mm[1]} />
                    </div>
                    <div className="clock-colon">:</div>
                    <div className="flip-group">
                      <FlipDigit digit={ss[0]} />
                      <FlipDigit digit={ss[1]} />
                    </div>
                  </div>
                  
                  <div className="clock-labels">
                    <span>MINUTES</span>
                    <span>SECONDS</span>
                  </div>

                  <div className="timer-task">
                    <label>WHAT ARE YOU WORKING ON?</label>
                    <select className="task-select" value={task} onChange={(e) => setTask(e.target.value)}>
                      <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                      <option value="Java OOP assignment">Java OOP assignment</option>
                      <option value="Statistics revision">Statistics revision</option>
                      <option value="Database Systems">Database Systems</option>
                      <option value="General study">General study</option>
                    </select>
                  </div>

                  <div className="timer-controls">
                    <button className="round-btn" onClick={resetTimer}><RotateCcw size={18}/></button>
                    <button className="start-btn" onClick={toggleTimer}>
                      {isRunning ? <Pause size={17} /> : <Play size={17} />}
                      <span>{isRunning ? "Pause session" : "Start focusing"}</span>
                    </button>
                    <button className="round-btn" onClick={skipTimer}><SkipForward size={18}/></button>
                  </div>
                  
                  <div className="timer-footnote">
                    <Heart size={14} style={{color: 'var(--green)'}}/>
                    <span>You don't need to do it all. Just start.</span>
                  </div>
                </div>
              </section>

              {/* PROGRESS PANEL */}
              <section className="panel progress-panel">
                <div className="panel-header">
                  <div>
                    <div className="panel-title"><Target size={19} /> Daily focus goal</div>
                    <div className="panel-subtitle">Every focused minute brings you closer.</div>
                  </div>
                </div>
                <div className="progress-content">
                  <div className="progress-row">
                    <span>Today's progress</span>
                    <strong>{focusMinutesToday} / {stats.goal} min</strong>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{width: `${progressPercent}%`}}></div>
                  </div>
                  <div className="progress-message">
                    <Sparkles size={18} />
                    <span>{progressPercent >= 100 ? "Daily goal reached! Great work." : "Your next great study session starts with one small step."}</span>
                  </div>
                </div>
              </section>

            </div>

            <div className="right-column">
              
              {/* PRESETS */}
              <section className="panel preset-panel">
                <div className="panel-header">
                  <div>
                    <div className="panel-title"><Layers size={19} /> Focus presets</div>
                    <div className="panel-subtitle">Choose the rhythm that works for you.</div>
                  </div>
                </div>
                <div className="preset-list">
                  <button className={`preset ${mode === 'focus' ? 'selected' : ''}`} onClick={() => switchMode('focus')}>
                    <div className="preset-icon pomodoro"><Brain size={19} /></div>
                    <div className="preset-info"><strong>Pomodoro</strong><span>Focus with regular breaks</span></div>
                    <div className="preset-time">25 / 5 min</div>
                  </button>
                  <button className={`preset ${mode === 'short' ? 'selected' : ''}`} onClick={() => switchMode('short')}>
                    <div className="preset-icon short"><Coffee size={19} /></div>
                    <div className="preset-info"><strong>Quick break</strong><span>Take a little breather</span></div>
                    <div className="preset-time">5 min</div>
                  </button>
                  <button className={`preset ${mode === 'long' ? 'selected' : ''}`} onClick={() => switchMode('long')}>
                    <div className="preset-icon long"><Armchair size={19} /></div>
                    <div className="preset-info"><strong>Long break</strong><span>Rest after deep work</span></div>
                    <div className="preset-time">15 min</div>
                  </button>
                </div>
              </section>

              {/* SOUND */}
              <section className="panel sound-panel">
                <div className="panel-header">
                  <div>
                    <div className="panel-title"><AudioLines size={19} /> Study atmosphere</div>
                    <div className="panel-subtitle">Set the mood for your next session.</div>
                  </div>
                </div>
                <div className="sound-content">
                  <div className="sound-feature">
                    <div className="sound-art"><CloudRain size={21} /></div>
                    <div className="sound-description">
                      <strong>Rain ambience</strong>
                      <span>{soundEnabled ? "Ambient noise is playing" : "Sound is off"}</span>
                    </div>
                    <button className={`toggle ${soundEnabled ? 'on' : ''}`} onClick={toggleRain}></button>
                  </div>
                  <p className="sound-note">A gentle background sound can help make your study space feel calmer. Use headphones if you prefer.</p>
                </div>
              </section>

              {/* HISTORY */}
              <section className="panel history-panel">
                <div className="panel-header">
                  <div>
                    <div className="panel-title"><History size={19} /> Recent sessions</div>
                    <div className="panel-subtitle">Your progress, one session at a time.</div>
                  </div>
                </div>
                <div className="history-list">
                  {stats.history.length === 0 ? (
                    <div className="empty-history">Your completed focus sessions will appear here.</div>
                  ) : (
                    stats.history.map(item => (
                      <div className="history-item" key={item.id}>
                        <div className="history-dot"></div>
                        <div className="history-details">
                          <strong>{item.task}</strong>
                          <span>Completed: {item.time}</span>
                        </div>
                        <div className="history-duration">{item.minutes} min</div>
                      </div>
                    ))
                  )}
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>

      {/* TOAST NOTIFICATION */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>{toast.message}</div>
    </div>
  );
};

export default Timer;