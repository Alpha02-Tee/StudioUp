import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Add this import
import { 
  GraduationCap, 
  Sparkles, 
  CalendarDays, 
  BookOpen, 
  Users, 
  ChartNoAxesColumn, 
  Mail, 
  LockKeyhole, 
  Eye, 
  EyeOff, 
  ArrowRight 
} from 'lucide-react';
import './Login.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // <-- Initialize navigate

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }
    // Implement your backend authentication logic here
    console.log("Logging in with:", email, password);
    navigate('/home');
  };

  return (
    <div className="login-page">
      <div className="background-circle circle-top"></div>
      <div className="background-circle circle-bottom"></div>
      <div className="background-shape"></div>
      
      <div className="container">
        {/* BRAND */}
        <a href="#" className="top-logo">
          <div className="logo-icon">
            <GraduationCap />
          </div>
          <div className="logo-text">
            Studio<span>Up</span>
          </div>
        </a>

        {/* CONTENT */}
        <div className="content">
          {/* LEFT INTRODUCTION */}
          <section className="intro">
            <div className="welcome-pill">
              <Sparkles />
              Welcome back
            </div>
            <h1>
              Your academic life,<br />
              in <span className="highlight">one place.</span>
            </h1>
            <p className="intro-description">
              Log in to access your classes, assignments, notes, calendar, and more all in one place.
            </p>

            {/* Features */}
            <div className="features">
              <div className="feature">
                <div className="feature-icon feature-blue">
                  <CalendarDays />
                </div>
                <div className="feature-text">
                  <h3>Track your assignments</h3>
                  <p>Never miss a deadline again.</p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon feature-purple">
                  <BookOpen />
                </div>
                <div className="feature-text">
                  <h3>Organize your classes</h3>
                  <p>Keep everything in one place.</p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon feature-green">
                  <Users />
                </div>
                <div className="feature-text">
                  <h3>Work on group projects</h3>
                  <p>Collaborate with your classmates.</p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon feature-pink">
                  <ChartNoAxesColumn />
                </div>
                <div className="feature-text">
                  <h3>Improve your grades</h3>
                  <p>Stay focused and achieve more.</p>
                </div>
              </div>
            </div>
          </section>

          {/* LOGIN CARD */}
          <section className="login-card">
            <div className="sparkles">
              <Sparkles />
            </div>

            <div className="card-logo">
              <div className="card-logo-icon">
                <GraduationCap />
              </div>
              <div className="card-logo-text">
                Studio<span>Up</span>
              </div>
            </div>

            <h2 className="login-heading">Welcome back</h2>
            <p className="login-subheading">Sign in to your account</p>

            <form id="loginForm" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email address</label>
                <div className="input-wrapper">
                  <Mail />
                  <input
                    type="email"
                    id="email"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <LockKeyhole />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember">
                  <input type="checkbox" defaultChecked />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot">Forgot password?[cite: 41]</a>
              </div>

              <button type="submit" className="login-button">
                <span>Log in</span>
                <ArrowRight />
              </button>
            </form>

            <div className="divider">
              <div className="divider-line"></div>
              <span>or</span>
              <div className="divider-line"></div>
            </div>

            <button type="button" className="google-button">
              <span className="google-icon">G</span>
              Continue with Google
            </button>

            <p className="signup">
              Don't have an account? <a href="/register">Get started</a>[cite: 42]
            </p>
          </section>
        </div>

        <div className="handwritten">
          Better<br />
          Students.<br />
          Build Brighter<br />
          Futures[cite: 43].
        </div>
      </div>
    </div>
  );
};

export default Login;