import { useState, useEffect, useCallback } from 'react';
import {
  X, Zap, Brain, ChevronRight, ChevronLeft,
  Target, TrendingUp, Flame, ArrowRight, ShieldCheck, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
      <div className="onboarding-topbar">
        <button className="onboarding-skip" onClick={onSkip} id="onboarding-skip-btn">
          Skip
        </button>
        <div className="onboarding-topbar-spacer" aria-hidden="true" />
      </div>

      <div className="onboarding-inner">
        <div className="onboarding-slide slide-${direction}" key={current}>
          <div className="onboarding-icon" style={{ '--slide-color': slide.color }}>
            {slide.icon}
          </div>
          <h2 className="onboarding-title">{slide.title}</h2>
          <p className="onboarding-desc">{slide.desc}</p>
        </div>

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
              <>Start Fast Login <Zap size={18} /></>
            ) : (
              <>Next <ChevronRight size={18} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── 100% Fast Login Component (No Email / No Password) ── */
function FastLoginForm({ onSuccess }) {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleFastLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await loginWithGoogle();
      if (res && res.user) {
        onSuccess(res.user);
      }
    } catch (err) {
      console.error('Google login error:', err);
      setErrorMsg(err.message || 'Unable to connect with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fast-auth-container" aria-label="Sign In">
      <div className="auth-form-header">
        <div className="auth-form-logo fast-logo-glow">
          <Brain size={26} strokeWidth={2.5} />
        </div>
        <h2 className="auth-form-title">Welcome to MyAptitude</h2>
        <p className="auth-form-subtitle">Instant, passwordless sign-in with your Google account</p>
      </div>

      {/* Benefits checklist */}
      <div className="fast-perks-box">
        <div className="fast-perk-item">
          <div className="fast-perk-icon-wrap text-lime">
            <Zap size={16} />
          </div>
          <div className="fast-perk-text">
            <strong>Instant Access</strong>
            <span>No passwords to remember or type</span>
          </div>
        </div>

        <div className="fast-perk-item">
          <div className="fast-perk-icon-wrap text-orange">
            <Flame size={16} />
          </div>
          <div className="fast-perk-text">
            <strong>Sync Streaks & XP</strong>
            <span>Progress automatically saved in the cloud</span>
          </div>
        </div>

        <div className="fast-perk-item">
          <div className="fast-perk-icon-wrap text-cyan">
            <ShieldCheck size={16} />
          </div>
          <div className="fast-perk-text">
            <strong>Official Google OAuth</strong>
            <span>Safe, secure & verified authentication</span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="fast-auth-error" role="alert">
          {errorMsg}
        </div>
      )}

      {/* Single Google Sign In Action */}
      <button
        type="button"
        id="google-fast-login-btn"
        className="btn btn-google-fast w-full"
        onClick={handleGoogleFastLogin}
        disabled={loading}
      >
        <svg className="google-icon" width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>{loading ? 'Connecting with Google...' : 'Continue with Google'}</span>
      </button>

      <p className="fast-auth-footnote">
        Protected by Supabase & Google Cloud. Zero passwords required.
      </p>
    </div>
  );
}

/* ── Auth Modal Shell ──────────────────────────────── */
export default function AuthModal({
  mode,           // 'login' | 'signup' | 'onboarding'
  onClose,
  onAuthSuccess,
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
        aria-label="Fast Login Dialog"
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
        {mode === 'onboarding' ? (
          <OnboardingCarousel
            onDone={() => onSwitchMode('login')}
            onSkip={() => onSwitchMode('login')}
          />
        ) : (
          <FastLoginForm
            onSuccess={onAuthSuccess}
          />
        )}
      </div>
    </div>
  );
}
