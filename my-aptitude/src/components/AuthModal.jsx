import { useState, useEffect, useCallback } from 'react';
import {
  X, Eye, EyeOff, Zap, Brain, Mail, Lock,
  User, ChevronRight, ChevronLeft, Check,
  Target, TrendingUp, Flame, ArrowRight
} from 'lucide-react';
import './AuthModal.css';

/* ── Onboarding Slides ─────────────────────────────── */
const SLIDES = [
  {
    icon: <Brain size={48} />,
    title: 'Train Your Brain',
    desc: 'Access 750+ curated aptitude questions across 5 categories — built for serious exam prep.',
    color: '#C6FF45',
  },
  {
    icon: <Target size={48} />,
    title: 'Adaptive Challenges',
    desc: 'Questions adapt to your level. You\'re always learning at the perfect difficulty.',
    color: '#A78BFA',
  },
  {
    icon: <Zap size={48} />,
    title: 'Instant Explanations',
    desc: 'Every answer unlocks a step-by-step solution. Learn the \'why\' behind every question.',
    color: '#60A5FA',
  },
  {
    icon: <Flame size={48} />,
    title: 'Streaks & XP',
    desc: 'Build daily habits with streaks, earn XP, level up and dominate every leaderboard.',
    color: '#F59E0B',
  },
  {
    icon: <TrendingUp size={48} />,
    title: 'Track Progress',
    desc: 'Visual analytics show exactly where you\'re improving. Never practice blind again.',
    color: '#34D399',
  },
];

/* ── Form validation helpers ───────────────────────── */
const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const validatePassword = (v) => v.length >= 8;
const validateName = (v) => v.trim().length >= 2;

/* ── Password strength indicator ──────────────────── */
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: '', color: '' },
    { label: 'Weak', color: '#EF4444' },
    { label: 'Fair', color: '#F59E0B' },
    { label: 'Good', color: '#60A5FA' },
    { label: 'Strong', color: '#22C55E' },
    { label: 'Very Strong', color: '#C6FF45' },
  ];
  return { score, ...levels[Math.min(score, 5)] };
}

/* ── Onboarding Carousel ───────────────────────────── */
function OnboardingCarousel({ onDone, onSkip }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState('right');

  const goTo = useCallback((idx) => {
    setDirection(idx > current ? 'right' : 'left');
    setCurrent(idx);
  }, [current]);

  const next = () => {
    if (current < SLIDES.length - 1) goTo(current + 1);
    else onDone();
  };

  const prev = () => {
    if (current > 0) goTo(current - 1);
  };

  const slide = SLIDES[current];

  return (
    <div className="onboarding" role="dialog" aria-label="Feature onboarding" aria-modal="true">
      {/* Top bar: Skip (left) ── spacer for X close button (right) */}
      <div className="onboarding-topbar">
        <button className="onboarding-skip" onClick={onSkip} id="onboarding-skip-btn">
          Skip
        </button>
        {/* Spacer reserves the 36px where the panel's X close button sits */}
        <div className="onboarding-topbar-spacer" aria-hidden="true" />
      </div>

      <div className="onboarding-inner">
        {/* Slide */}
        <div className={`onboarding-slide slide-${direction}`} key={current}>
          <div className="onboarding-icon" style={{ '--slide-color': slide.color }}>
            {slide.icon}
          </div>
          <h2 className="onboarding-title">{slide.title}</h2>
          <p className="onboarding-desc">{slide.desc}</p>
        </div>

        {/* Dots */}
        <div className="onboarding-dots" role="tablist" aria-label="Slide indicator">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`onboarding-dot ${i === current ? 'active' : ''}`}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === current}
              aria-label={`Slide ${i + 1}`}
              id={`onboarding-dot-${i}`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="onboarding-nav">
          {current > 0 && (
            <button
              className="btn btn-ghost btn-md"
              onClick={prev}
              id="onboarding-prev-btn"
            >
              <ChevronLeft size={18} />
              Back
            </button>
          )}
          <button
            className="btn btn-primary btn-md onboarding-next"
            onClick={next}
            id="onboarding-next-btn"
          >
            {current === SLIDES.length - 1 ? (
              <>Let&apos;s Go! <Zap size={18} /></>
            ) : (
              <>Next <ChevronRight size={18} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Login Form ────────────────────────────────────── */
function LoginForm({ onSwitchToSignup, onSuccess, onGuest }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!validateEmail(email)) errs.email = 'Please enter a valid email address.';
    if (!password) errs.password = 'Password is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulate async — mock demo mode
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    onSuccess({ email, name: email.split('@')[0] });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate aria-label="Login form">
      <div className="auth-form-header">
        <div className="auth-form-logo">
          <Brain size={22} strokeWidth={2.5} />
        </div>
        <h2 className="auth-form-title">Welcome back</h2>
        <p className="auth-form-subtitle">Log in to continue your training</p>
      </div>

      {/* Email */}
      <div className="form-group">
        <label htmlFor="login-email" className="form-label">Email</label>
        <div className="input-wrapper">
          <span className="input-icon-left"><Mail size={16} /></span>
          <input
            id="login-email"
            type="email"
            className={`input-field input-with-left-icon ${errors.email ? 'error' : ''}`}
            placeholder="you@example.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
            autoComplete="email"
            aria-describedby={errors.email ? 'login-email-error' : undefined}
          />
        </div>
        {errors.email && (
          <span id="login-email-error" className="form-error" role="alert">{errors.email}</span>
        )}
      </div>

      {/* Password */}
      <div className="form-group">
        <div className="form-label-row">
          <label htmlFor="login-password" className="form-label">Password</label>
          <button type="button" className="form-link" id="forgot-password-btn">Forgot password?</button>
        </div>
        <div className="input-wrapper">
          <span className="input-icon-left"><Lock size={16} /></span>
          <input
            id="login-password"
            type={showPw ? 'text' : 'password'}
            className={`input-field input-with-left-icon ${errors.password ? 'error' : ''}`}
            placeholder="Your password"
            value={password}
            onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
            autoComplete="current-password"
            aria-describedby={errors.password ? 'login-pw-error' : undefined}
          />
          <button
            type="button"
            className="input-icon-right"
            onClick={() => setShowPw(v => !v)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
            id="login-toggle-pw"
          >
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <span id="login-pw-error" className="form-error" role="alert">{errors.password}</span>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        id="login-submit-btn"
        className="btn btn-primary btn-lg w-full"
        disabled={loading}
        aria-live="polite"
      >
        {loading ? <span className="spinner" aria-label="Logging in…" /> : <><Zap size={18} /> Log In</>}
      </button>

      {/* Divider */}
      <div className="divider-text">or continue with</div>

      {/* Guest */}
      <button
        type="button"
        id="login-guest-btn"
        className="btn btn-secondary btn-lg w-full"
        onClick={onGuest}
      >
        Continue as Guest
        <ArrowRight size={18} />
      </button>

      {/* Switch */}
      <p className="auth-switch">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          className="form-link"
          id="switch-to-signup-btn"
          onClick={onSwitchToSignup}
        >
          Sign up free
        </button>
      </p>
    </form>
  );
}

/* ── Signup Form ───────────────────────────────────── */
function SignupForm({ onSwitchToLogin, onSuccess, onGuest }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);

  const validate = () => {
    const errs = {};
    if (!validateName(name)) errs.name = 'Name must be at least 2 characters.';
    if (!validateEmail(email)) errs.email = 'Please enter a valid email address.';
    if (!validatePassword(password)) errs.password = 'Password must be at least 8 characters.';
    if (!agreed) errs.agreed = 'You must agree to continue.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    onSuccess({ email, name: name.trim() });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate aria-label="Sign up form">
      <div className="auth-form-header">
        <div className="auth-form-logo">
          <Brain size={22} strokeWidth={2.5} />
        </div>
        <h2 className="auth-form-title">Create your account</h2>
        <p className="auth-form-subtitle">Start training free — no credit card required</p>
      </div>

      {/* Name */}
      <div className="form-group">
        <label htmlFor="signup-name" className="form-label">Full Name</label>
        <div className="input-wrapper">
          <span className="input-icon-left"><User size={16} /></span>
          <input
            id="signup-name"
            type="text"
            className={`input-field input-with-left-icon ${errors.name ? 'error' : ''}`}
            placeholder="Your name"
            value={name}
            onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
            autoComplete="name"
            aria-describedby={errors.name ? 'signup-name-error' : undefined}
          />
        </div>
        {errors.name && (
          <span id="signup-name-error" className="form-error" role="alert">{errors.name}</span>
        )}
      </div>

      {/* Email */}
      <div className="form-group">
        <label htmlFor="signup-email" className="form-label">Email</label>
        <div className="input-wrapper">
          <span className="input-icon-left"><Mail size={16} /></span>
          <input
            id="signup-email"
            type="email"
            className={`input-field input-with-left-icon ${errors.email ? 'error' : ''}`}
            placeholder="you@example.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
            autoComplete="email"
            aria-describedby={errors.email ? 'signup-email-error' : undefined}
          />
        </div>
        {errors.email && (
          <span id="signup-email-error" className="form-error" role="alert">{errors.email}</span>
        )}
      </div>

      {/* Password + strength */}
      <div className="form-group">
        <label htmlFor="signup-password" className="form-label">Password</label>
        <div className="input-wrapper">
          <span className="input-icon-left"><Lock size={16} /></span>
          <input
            id="signup-password"
            type={showPw ? 'text' : 'password'}
            className={`input-field input-with-left-icon ${errors.password ? 'error' : ''}`}
            placeholder="At least 8 characters"
            value={password}
            onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
            autoComplete="new-password"
            aria-describedby="password-strength"
          />
          <button
            type="button"
            className="input-icon-right"
            onClick={() => setShowPw(v => !v)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
            id="signup-toggle-pw"
          >
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <span className="form-error" role="alert">{errors.password}</span>
        )}
        {/* Strength meter */}
        {password && (
          <div className="strength-meter" id="password-strength" aria-live="polite">
            <div className="strength-bars">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className="strength-bar"
                  style={{
                    background: i <= strength.score ? strength.color : '#2D2738',
                    transition: `background 0.2s ease ${i * 0.05}s`
                  }}
                />
              ))}
            </div>
            <span className="strength-label" style={{ color: strength.color }}>
              {strength.label}
            </span>
          </div>
        )}
      </div>

      {/* Terms */}
      <div className="form-group">
        <label className={`checkbox-label ${errors.agreed ? 'checkbox-error' : ''}`} htmlFor="signup-terms">
          <input
            type="checkbox"
            id="signup-terms"
            checked={agreed}
            onChange={e => { setAgreed(e.target.checked); setErrors(p => ({ ...p, agreed: '' })); }}
            className="checkbox-input"
          />
          <span className="checkbox-custom">
            {agreed && <Check size={12} strokeWidth={3} />}
          </span>
          <span className="checkbox-text">
            I agree to the{' '}
            <a href="#" className="form-link" onClick={e => e.stopPropagation()}>Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="form-link" onClick={e => e.stopPropagation()}>Privacy Policy</a>
          </span>
        </label>
        {errors.agreed && (
          <span className="form-error" role="alert">{errors.agreed}</span>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        id="signup-submit-btn"
        className="btn btn-primary btn-lg w-full"
        disabled={loading}
        aria-live="polite"
      >
        {loading ? <span className="spinner" aria-label="Creating account…" /> : <><Zap size={18} /> Create Account</>}
      </button>

      {/* Divider */}
      <div className="divider-text">or</div>

      {/* Guest */}
      <button
        type="button"
        id="signup-guest-btn"
        className="btn btn-secondary btn-lg w-full"
        onClick={onGuest}
      >
        Continue as Guest
        <ArrowRight size={18} />
      </button>

      {/* Switch */}
      <p className="auth-switch">
        Already have an account?{' '}
        <button
          type="button"
          className="form-link"
          id="switch-to-login-btn"
          onClick={onSwitchToLogin}
        >
          Log in
        </button>
      </p>
    </form>
  );
}

/* ── Auth Modal Shell ──────────────────────────────── */
export default function AuthModal({
  mode,           // 'login' | 'signup' | 'onboarding'
  onClose,
  onAuthSuccess,
  onGuest,
  onSwitchMode,
}) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdrop}
      role="presentation"
      id="auth-modal-backdrop"
    >
      <div
        className={`modal-panel animate-scaleIn ${mode === 'onboarding' ? 'modal-panel--onboarding' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={
          mode === 'login' ? 'Login dialog' :
          mode === 'signup' ? 'Sign up dialog' :
          'Feature overview'
        }
      >
        {/* Close button */}
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close dialog"
          id="modal-close-btn"
        >
          <X size={20} />
        </button>

        {/* Content */}
        {mode === 'onboarding' && (
          <OnboardingCarousel
            onDone={() => onSwitchMode('signup')}
            onSkip={() => onSwitchMode('signup')}
          />
        )}
        {mode === 'login' && (
          <LoginForm
            onSwitchToSignup={() => onSwitchMode('signup')}
            onSuccess={onAuthSuccess}
            onGuest={onGuest}
          />
        )}
        {mode === 'signup' && (
          <SignupForm
            onSwitchToLogin={() => onSwitchMode('login')}
            onSuccess={onAuthSuccess}
            onGuest={onGuest}
          />
        )}
      </div>
    </div>
  );
}
