import { useEffect, useState } from 'react';
import { 
  X, 
  LogOut, 
  Zap, 
  Flame, 
  Award, 
  Target, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RefreshCw, 
  Keyboard, 
  ChevronRight, 
  ShieldCheck, 
  UserCheck,
  BookOpen,
  Gift
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ProfileDrawer.css';

export default function ProfileDrawer({
  isOpen,
  onClose,
  onOpenBadges,
  onOpenShortcuts,
  onOpenStudyBook,
  onOpenRedeemStore,
}) {
  const { user, logout, updateUser, resetStats } = useAuth();
  const [soundOn, setSoundOn] = useState(user?.soundEnabled ?? true);
  const [motionOn, setMotionOn] = useState(user?.motionEnabled ?? true);
  const [goal, setGoal] = useState(user?.dailyGoal ?? 100);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    updateUser({ soundEnabled: next });
  };

  const handleToggleMotion = () => {
    const next = !motionOn;
    setMotionOn(next);
    updateUser({ motionEnabled: next });
  };

  const handleGoalChange = (newGoal) => {
    setGoal(newGoal);
    updateUser({ dailyGoal: newGoal });
  };

  const handleConfirmReset = () => {
    resetStats();
    setShowResetConfirm(false);
  };

  const handleLogout = () => {
    onClose();
    logout();
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const xp = user?.xp ?? 280;
  const level = user?.level ?? 2;
  const nextLevelXP = level * 250;
  const currentLevelBaseXP = (level - 1) * 250;
  const levelProgress = Math.min(
    100,
    Math.max(0, Math.round(((xp - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100))
  );

  const todayXP = user?.todayXP ?? 65;
  const goalProgress = Math.min(100, Math.round((todayXP / goal) * 100));

  return (
    <div className="profile-drawer-portal">
      {/* Backdrop */}
      <div 
        className="profile-drawer-backdrop" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <aside 
        className="profile-drawer" 
        id="profile-drawer"
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="profile-drawer-title"
      >
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-header-left">
            <span className="drawer-eyebrow">User Profile & Settings</span>
            <h2 id="profile-drawer-title" className="drawer-title">Account Center</h2>
          </div>
          <button 
            className="drawer-close-btn" 
            onClick={onClose}
            aria-label="Close drawer"
            id="close-profile-drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="drawer-content">
          {/* User Bio Card */}
          <div className="drawer-bio-card">
            <div className="drawer-avatar-wrap">
              <div className="drawer-avatar">
                {userInitial}
              </div>
              <span className="drawer-avatar-badge" title="Active">
                <ShieldCheck size={12} />
              </span>
            </div>

            <div className="drawer-bio-details">
              <div className="drawer-bio-name-row">
                <h3 className="drawer-bio-name">{user?.name || 'Aptitude Explorer'}</h3>
                {user?.isGuest ? (
                  <span className="badge badge-dark">Guest</span>
                ) : (
                  <span className="badge badge-lime">Pro</span>
                )}
              </div>
              <p className="drawer-bio-email">
                {user?.email || 'demo.session@nexminds.edu'}
              </p>
              <div className="drawer-bio-tags">
                <span className="tier-tag">
                  <UserCheck size={12} /> Level {level} Thinker
                </span>
                <span className="tier-tag tier-tag--league">
                  Silver League
                </span>
              </div>
            </div>
          </div>

          {/* Progress / Stats Snapshot */}
          <div className="drawer-stats-card">
            <div className="drawer-stat-row">
              <div className="drawer-stat-col">
                <div className="drawer-stat-icon-wrap icon-xp">
                  <Zap size={16} />
                </div>
                <div>
                  <span className="drawer-stat-num">{xp} XP</span>
                  <span className="drawer-stat-lbl">Total Experience</span>
                </div>
              </div>
              <div className="drawer-stat-col">
                <div className="drawer-stat-icon-wrap icon-streak">
                  <Flame size={16} />
                </div>
                <div>
                  <span className="drawer-stat-num">{user?.streak ?? 3} Days</span>
                  <span className="drawer-stat-lbl">Active Streak</span>
                </div>
              </div>
            </div>

            {/* Level Bar */}
            <div className="drawer-level-track">
              <div className="drawer-level-labels">
                <span>Level {level} Progress</span>
                <span className="text-accent">{levelProgress}% ({xp}/{nextLevelXP} XP)</span>
              </div>
              <div className="progress-bar progress-bar--slim">
                <div 
                  className="progress-fill" 
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>

            {/* Daily Goal Gauge */}
            <div className="drawer-goal-box">
              <div className="drawer-goal-header">
                <span className="goal-label">
                  <Target size={14} className="text-accent" /> Daily Target
                </span>
                <span className="goal-value">{todayXP} / {goal} XP</span>
              </div>
              <div className="progress-bar progress-bar--sm">
                <div 
                  className="progress-fill fill-lime" 
                  style={{ width: `${goalProgress}%` }}
                />
              </div>
              <div className="goal-pill-selector">
                {[50, 100, 150, 200].map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`goal-pill ${goal === val ? 'goal-pill--active' : ''}`}
                    onClick={() => handleGoalChange(val)}
                  >
                    {val} XP
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation & Actions Section */}
          <div className="drawer-section">
            <span className="drawer-section-title">Cognitive Performance & Learning</span>

            {/* Study Handbook (Pure Learning, Zero XP) */}
            <button 
              className="drawer-menu-item"
              onClick={() => {
                onClose();
                onOpenStudyBook?.();
              }}
              id="drawer-study-book-btn"
            >
              <div className="drawer-menu-left">
                <div className="menu-icon-box" style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38BDF8' }}>
                  <BookOpen size={18} />
                </div>
                <div className="menu-text">
                  <span className="menu-title">Study Handbook & Solutions</span>
                  <span className="menu-subtitle">Step-by-step derivations • Pure learning (No XP)</span>
                </div>
              </div>
              <ChevronRight size={18} className="menu-chevron" />
            </button>
            
            <button 
              className="drawer-menu-item"
              onClick={() => {
                onClose();
                onOpenBadges?.();
              }}
              id="drawer-badges-btn"
            >
              <div className="drawer-menu-left">
                <div className="menu-icon-box">
                  <Award size={18} className="text-accent" />
                </div>
                <div className="menu-text">
                  <span className="menu-title">Badges & Achievements</span>
                  <span className="menu-subtitle">3 Unlocked • 9 in progress</span>
                </div>
              </div>
              <ChevronRight size={18} className="menu-chevron" />
            </button>

            {/* XP Rewards Vault */}
            <button 
              className="drawer-menu-item"
              onClick={() => {
                onClose();
                onOpenRedeemStore?.();
              }}
              id="drawer-rewards-btn"
            >
              <div className="drawer-menu-left">
                <div className="menu-icon-box" style={{ background: 'rgba(198, 255, 69, 0.12)', color: '#C6FF45' }}>
                  <Gift size={18} />
                </div>
                <div className="menu-text">
                  <span className="menu-title">XP Rewards Vault</span>
                  <span className="menu-subtitle">Redeem tech, gear & FAANG mentorship</span>
                </div>
              </div>
              <ChevronRight size={18} className="menu-chevron" />
            </button>

            <button 
              className="drawer-menu-item"
              onClick={() => {
                onClose();
                onOpenShortcuts?.();
              }}
              id="drawer-shortcuts-btn"
            >
              <div className="drawer-menu-left">
                <div className="menu-icon-box">
                  <Keyboard size={18} />
                </div>
                <div className="menu-text">
                  <span className="menu-title">Keyboard Shortcuts</span>
                  <span className="menu-subtitle">Fast navigation cheat sheet</span>
                </div>
              </div>
              <ChevronRight size={18} className="menu-chevron" />
            </button>
          </div>

          {/* App Preferences */}
          <div className="drawer-section">
            <span className="drawer-section-title">Training Preferences</span>

            <div className="drawer-toggle-item">
              <div className="drawer-menu-left">
                <div className="menu-icon-box">
                  {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </div>
                <div className="menu-text">
                  <span className="menu-title">Sound Effects</span>
                  <span className="menu-subtitle">Audio feedback on answers</span>
                </div>
              </div>
              <button 
                type="button"
                className={`switch-toggle ${soundOn ? 'switch-toggle--on' : ''}`}
                onClick={handleToggleSound}
                aria-label="Toggle sound"
              >
                <span className="switch-thumb" />
              </button>
            </div>

            <div className="drawer-toggle-item">
              <div className="drawer-menu-left">
                <div className="menu-icon-box">
                  <Sparkles size={18} />
                </div>
                <div className="menu-text">
                  <span className="menu-title">Micro-Animations</span>
                  <span className="menu-subtitle">Glow and spring effects</span>
                </div>
              </div>
              <button 
                type="button"
                className={`switch-toggle ${motionOn ? 'switch-toggle--on' : ''}`}
                onClick={handleToggleMotion}
                aria-label="Toggle motion"
              >
                <span className="switch-thumb" />
              </button>
            </div>
          </div>

          {/* Danger / Reset Section */}
          <div className="drawer-section">
            <span className="drawer-section-title">Maintenance</span>

            {!showResetConfirm ? (
              <button 
                type="button"
                className="drawer-menu-item text-subtle"
                onClick={() => setShowResetConfirm(true)}
              >
                <div className="drawer-menu-left">
                  <div className="menu-icon-box">
                    <RefreshCw size={16} />
                  </div>
                  <div className="menu-text">
                    <span className="menu-title">Reset Demo Practice Data</span>
                    <span className="menu-subtitle">Clear XP and streak for fresh run</span>
                  </div>
                </div>
              </button>
            ) : (
              <div className="reset-confirm-box">
                <p className="reset-confirm-msg">Reset all demo stats to 0?</p>
                <div className="reset-confirm-actions">
                  <button 
                    type="button" 
                    className="btn btn-sm btn-danger"
                    onClick={handleConfirmReset}
                  >
                    Confirm Reset
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-ghost"
                    onClick={() => setShowResetConfirm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer with Logout Button */}
        <div className="drawer-footer">
          <button
            id="logout-btn"
            className="drawer-logout-btn"
            onClick={handleLogout}
            aria-label="Log out"
          >
            <LogOut size={18} />
            <span>Log out</span>
          </button>
          <span className="drawer-version-tag">MyAptitude v0.3 • Matiks Edition</span>
        </div>
      </aside>
    </div>
  );
}
