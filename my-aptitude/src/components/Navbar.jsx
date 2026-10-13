import { useState, useEffect } from 'react';
import { Brain, Zap, Flame } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onLogin, onSignup, currentView }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} id="main-navbar">
      <div className="container">
        <nav className="navbar-inner">
          {/* Logo */}
          <a href="#" className="navbar-logo" aria-label="MyAptitude Home">
            <div className="logo-icon">
              <Brain size={20} strokeWidth={2.5} />
            </div>
            <span className="logo-text">
              My<span className="logo-accent">Aptitude</span>
            </span>
          </a>

          {/* Center: stat badges (hidden on landing without auth) */}
          <div className="navbar-stats" aria-hidden="true">
            <div className="stat-badge">
              <Zap size={14} className="stat-icon stat-icon--xp" />
              <span className="stat-label">0 XP</span>
            </div>
            <div className="stat-badge">
              <Flame size={14} className="stat-icon stat-icon--streak" />
              <span className="stat-label">0 Day Streak</span>
            </div>
          </div>

          {/* Auth buttons */}
          <div className="navbar-actions">
            <button
              id="nav-login-btn"
              className="btn btn-ghost btn-sm"
              onClick={onLogin}
            >
              Log in
            </button>
            <button
              id="nav-signup-btn"
              className="btn btn-primary btn-sm"
              onClick={onSignup}
            >
              Get Started
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
