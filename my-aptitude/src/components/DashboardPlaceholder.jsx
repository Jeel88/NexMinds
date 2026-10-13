import { Brain, Zap, Flame, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './DashboardPlaceholder.css';

/**
 * Temporary Dashboard placeholder — shown after login/signup.
 * Will be fully built in Phase 3.
 */
export default function DashboardPlaceholder() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-placeholder">
      {/* Header */}
      <header className="dash-header">
        <div className="container">
          <div className="dash-header-inner">
            <div className="navbar-logo">
              <div className="logo-icon">
                <Brain size={18} strokeWidth={2.5} />
              </div>
              <span className="logo-text">
                My<span className="logo-accent">Aptitude</span>
              </span>
            </div>
            <div className="dash-header-right">
              <div className="dash-user">
                <div className="dash-user-avatar">
                  {user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <div className="dash-user-info">
                  <span className="dash-user-name">{user?.name ?? 'User'}</span>
                  {user?.isGuest && <span className="badge badge-dark text-xs">Guest</span>}
                </div>
              </div>
              <button
                id="logout-btn"
                className="btn btn-ghost btn-sm"
                onClick={logout}
                aria-label="Log out"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome body */}
      <main className="dash-body container">
        <div className="dash-welcome">
          {/* Badge */}
          <div className="dash-phase-badge">
            <Zap size={14} />
            Phase 3 coming soon — Dashboard
          </div>

          <h1 className="dash-greeting">
            Welcome,{' '}
            <span className="text-accent">{user?.name?.split(' ')[0] ?? 'Learner'}!</span>&nbsp;🧠
          </h1>

          <p className="dash-subtext">
            You&apos;re all set. The full interactive dashboard is being built in{' '}
            <strong className="text-accent">Phase 3</strong>. Stay tuned!
          </p>

          {/* Mini stat cards */}
          <div className="dash-stats">
            <div className="dash-stat-card card card-glow">
              <Zap size={22} className="text-accent" />
              <div>
                <p className="dash-stat-val">{user?.xp ?? 0} XP</p>
                <p className="dash-stat-label">Total XP Earned</p>
              </div>
            </div>
            <div className="dash-stat-card card card-glow">
              <Flame size={22} style={{ color: '#F59E0B' }} />
              <div>
                <p className="dash-stat-val">{user?.streak ?? 0} Days</p>
                <p className="dash-stat-label">Current Streak</p>
              </div>
            </div>
            <div className="dash-stat-card card card-glow">
              <User size={22} style={{ color: '#A78BFA' }} />
              <div>
                <p className="dash-stat-val">Level {user?.level ?? 1}</p>
                <p className="dash-stat-label">Your Level</p>
              </div>
            </div>
          </div>

          {/* XP progress */}
          <div className="dash-xp-bar">
            <div className="hcf-progress" style={{ marginBottom: 8 }}>
              <span className="text-sm text-muted">Level {user?.level} Progress</span>
              <span className="text-sm text-accent fw-600">{user?.xp ?? 0} / 500 XP</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((user?.xp ?? 0) / 500) * 100}%` }} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
