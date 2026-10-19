import { useEffect, useState } from 'react';
import {
  X,
  LogOut,
  Zap,
  Flame,
  Award,
  Target,
  RefreshCw,
  Keyboard,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  BookOpen,
  Gift,
  GraduationCap,
  BookMarked,
  Pencil,
  Lock,
  Check,
  MapPin,
  User
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
  const { user, logout, updateUser, saveProfileDetails, resetStats } = useAuth();
  const [goal, setGoal] = useState(user?.dailyGoal ?? 100);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    degree: user?.degree || '',
    age: user?.age || '',
    target_exam: user?.target_exam || '',
    city: user?.city || '',
    bio: user?.bio || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        college: user.college || '',
        degree: user.degree || '',
        age: user.age || '',
        target_exam: user.target_exam || '',
        city: user.city || '',
        bio: user.bio || '',
      });
    }
  }, [user, isEditing]);

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    setIsSaving(true);
    try {
      await saveProfileDetails?.({
        name: formData.name.trim() || user?.name || 'Thinker',
        college: formData.college.trim(),
        degree: formData.degree.trim(),
        age: formData.age ? Number(formData.age) : '',
        target_exam: formData.target_exam.trim(),
        city: formData.city.trim(),
        bio: formData.bio.trim(),
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditing(false);
      }, 900);
    } finally {
      setIsSaving(false);
    }
  };

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
                {user?.avatar && user.avatar.startsWith('http') ? (
                  <img
                    src={user.avatar}
                    alt={user?.name || 'User'}
                    className="drawer-avatar-img"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                <span className="drawer-avatar-initial">{userInitial}</span>
              </div>
              <span className="drawer-avatar-badge" title="Active">
                <ShieldCheck size={12} />
              </span>
            </div>

            <div className="drawer-bio-details">
              <div className="drawer-bio-name-row">
                <h3 className="drawer-bio-name">{user?.name || 'Aptitude Explorer'}</h3>
              </div>
              <div className="drawer-bio-email-row">
                <p className="drawer-bio-email">
                  {user?.email || 'demo.session@nexminds.edu'}
                </p>
                <span className="locked-field-badge" title="Managed by Auth Provider (Read Only)">
                  <Lock size={10} />
                </span>
              </div>
              <div className="drawer-bio-tags">
                <span className="tier-tag">
                  <UserCheck size={12} /> Level {level} Thinker
                </span>
                <span className="tier-tag tier-tag--league">
                  Silver League
                </span>
              </div>
            </div>

            <button
              type="button"
              className={`drawer-edit-toggle-btn ${isEditing ? 'drawer-edit-toggle-btn--active' : ''}`}
              onClick={() => setIsEditing(!isEditing)}
              title={isEditing ? 'Cancel Editing' : 'Edit Profile Information'}
            >
              <Pencil size={13} />
              <span>{isEditing ? 'Close' : 'Edit'}</span>
            </button>
          </div>

          {/* EDIT PROFILE FORM */}
          {isEditing ? (
            <form className="drawer-edit-profile-form" onSubmit={handleSaveProfile}>
              <div className="drawer-edit-header">
                <div className="drawer-edit-title-group">
                  <Pencil size={15} className="text-lime" />
                  <span className="drawer-edit-title">EDIT PROFILE DETAILS</span>
                </div>
              </div>

              <div className="drawer-edit-notice">
                <Lock size={13} className="text-muted" />
                <span>Profile photo and email are managed by your Google account and cannot be edited.</span>
              </div>

              <div className="drawer-edit-field">
                <label className="drawer-edit-label">Full Name</label>
                <input
                  type="text"
                  className="drawer-edit-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Full Name"
                  required
                />
              </div>

              <div className="drawer-edit-field">
                <label className="drawer-edit-label">College / University</label>
                <div className="drawer-input-with-icon">
                  <GraduationCap size={16} className="drawer-field-icon" />
                  <input
                    type="text"
                    className="drawer-edit-input drawer-edit-input--icon"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="e.g. IIT Bombay / Stanford University"
                  />
                </div>
              </div>

              <div className="drawer-edit-field">
                <label className="drawer-edit-label">Degree & Branch</label>
                <div className="drawer-input-with-icon">
                  <BookMarked size={16} className="drawer-field-icon" />
                  <input
                    type="text"
                    className="drawer-edit-input drawer-edit-input--icon"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    placeholder="e.g. B.Tech Computer Science / Economics"
                  />
                </div>
              </div>

              <div className="drawer-edit-row-2">
                <div className="drawer-edit-field">
                  <label className="drawer-edit-label">Age</label>
                  <div className="drawer-input-with-icon">
                    <User size={16} className="drawer-field-icon" />
                    <input
                      type="number"
                      min="12"
                      max="99"
                      className="drawer-edit-input drawer-edit-input--icon"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="e.g. 21"
                    />
                  </div>
                </div>

                <div className="drawer-edit-field">
                  <label className="drawer-edit-label">City / Location</label>
                  <div className="drawer-input-with-icon">
                    <MapPin size={16} className="drawer-field-icon" />
                    <input
                      type="text"
                      className="drawer-edit-input drawer-edit-input--icon"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Mumbai, India"
                    />
                  </div>
                </div>
              </div>

              <div className="drawer-edit-field">
                <label className="drawer-edit-label">Target Exam / Career Goal</label>
                <div className="drawer-input-with-icon">
                  <Target size={16} className="drawer-field-icon" />
                  <input
                    type="text"
                    className="drawer-edit-input drawer-edit-input--icon"
                    value={formData.target_exam}
                    onChange={(e) => setFormData({ ...formData, target_exam: e.target.value })}
                    placeholder="e.g. Tech Placements & FAANG / CAT 2026 / GMAT"
                  />
                </div>
              </div>

              <div className="drawer-edit-field">
                <label className="drawer-edit-label">Bio / Motto</label>
                <textarea
                  className="drawer-edit-textarea"
                  rows="2"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="e.g. Mathematical thinker aiming for 99th percentile velocity..."
                />
              </div>

              <div className="drawer-edit-actions">
                <button
                  type="button"
                  className="drawer-edit-cancel-btn"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="drawer-edit-save-btn"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={14} className="drawer-spin-icon" />
                      <span>Saving...</span>
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check size={16} />
                      <span>Changes Saved!</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* ACADEMIC & DEMOGRAPHIC OVERVIEW CARD */
            <div className="drawer-academic-card">
              <div className="drawer-academic-header">
                <div className="drawer-academic-title-wrap">
                  <GraduationCap size={16} className="text-cyan" />
                  <span className="drawer-stat-lbl">ACADEMIC & ASPIRATIONS</span>
                </div>
                <button
                  type="button"
                  className="drawer-inline-edit-btn"
                  onClick={() => setIsEditing(true)}
                  title="Edit details"
                >
                  <Pencil size={12} />
                  <span>Edit</span>
                </button>
              </div>

              <div className="drawer-academic-list">
                <div className="drawer-academic-item">
                  <span className="academic-item-lbl">COLLEGE / UNIVERSITY</span>
                  <span className="academic-item-val">
                    {user?.college || <span className="text-muted-italics">Tap edit to set college</span>}
                  </span>
                </div>

                <div className="drawer-academic-item">
                  <span className="academic-item-lbl">STREAM / DEGREE</span>
                  <span className="academic-item-val">
                    {user?.degree || <span className="text-muted-italics">Tap edit to set degree</span>}
                  </span>
                </div>

                <div className="drawer-academic-item">
                  <span className="academic-item-lbl">TARGET EXAM / GOAL</span>
                  <span className="academic-item-val text-lime">
                    {user?.target_exam || 'General Aptitude Mastery'}
                  </span>
                </div>

                <div className="drawer-academic-pills-row">
                  <div className="drawer-info-pill">
                    <User size={12} className="text-cyan" />
                    <span>{user?.age ? `${user.age} Years Old` : 'Age not set'}</span>
                  </div>
                  <div className="drawer-info-pill">
                    <MapPin size={12} className="text-orange" />
                    <span>{user?.city || 'Location not set'}</span>
                  </div>
                </div>

                {user?.bio && (
                  <div className="drawer-bio-quote">
                    <p>"{user.bio}"</p>
                  </div>
                )}
              </div>
            </div>
          )}

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

            {/* Dynamic Ratings Snapshot */}
            <div className="drawer-ratings-box">
              <div className="drawer-goal-header">
                <span className="goal-label">
                  <Award size={14} className="text-accent" /> Dynamic Ratings
                </span>
                <span className="goal-value" style={{ color: '#C6FF45' }}>
                  AVG {Math.round(((user?.ratings?.math || 1200) + (user?.ratings?.puzzle || 1200) + (user?.ratings?.logic || 1200) + (user?.ratings?.memory || 1200)) / 4)}
                </span>
              </div>
              <div className="drawer-ratings-mini-grid">
                <div className="dr-mini-item">
                  <span className="dr-mini-val" style={{ color: '#FF9500' }}>{user?.ratings?.math ?? 1200}</span>
                  <span className="dr-mini-lbl">Math</span>
                </div>
                <div className="dr-mini-item">
                  <span className="dr-mini-val" style={{ color: '#A855F7' }}>{user?.ratings?.puzzle ?? 1200}</span>
                  <span className="dr-mini-lbl">Puzzle</span>
                </div>
                <div className="dr-mini-item">
                  <span className="dr-mini-val" style={{ color: '#C6FF45' }}>{user?.ratings?.logic ?? 1200}</span>
                  <span className="dr-mini-lbl">Logic</span>
                </div>
                <div className="dr-mini-item">
                  <span className="dr-mini-val" style={{ color: '#38BDF8' }}>{user?.ratings?.memory ?? 1200}</span>
                  <span className="dr-mini-lbl">Numerical</span>
                </div>
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
