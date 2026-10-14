import { useEffect, useRef } from 'react';
import {
  Brain, Zap, Target, TrendingUp, ChevronRight,
  Star, Users, Clock, Award, ArrowRight,
  BarChart2, Shield, Flame
} from 'lucide-react';
import './LandingPage.css';

const FEATURES = [
  {
    icon: <Target size={24} />,
    title: 'Adaptive Challenges',
    desc: 'Questions dynamically adjust to your skill level so you\'re always in the zone of growth.',
  },
  {
    icon: <Zap size={24} />,
    title: 'Instant Feedback',
    desc: 'Get step-by-step explanations the moment you answer. Learn why, not just what.',
  },
  {
    icon: <TrendingUp size={24} />,
    title: 'Progress Tracking',
    desc: 'Visual analytics break down your accuracy per category so you always know where to focus.',
  },
  {
    icon: <Flame size={24} />,
    title: 'Daily Streaks',
    desc: 'Build momentum with daily practice streaks and freeze cards to protect your progress.',
  },
  {
    icon: <Award size={24} />,
    title: 'XP & Levels',
    desc: 'Every correct answer earns XP. Level up, unlock achievements and climb the ranks.',
  },
  {
    icon: <BarChart2 size={24} />,
    title: '5 Core Categories',
    desc: 'Quantitative, Logical, Verbal, Numerical & Pattern Recognition — all in one place.',
  },
];

const CATEGORIES = [
  { label: 'Quantitative', emoji: '🔢', color: '#C6FF45', count: '200+' },
  { label: 'Logical',      emoji: '🧠', color: '#A78BFA', count: '150+' },
  { label: 'Verbal',       emoji: '📝', color: '#34D399', count: '180+' },
  { label: 'Numerical',    emoji: '📊', color: '#60A5FA', count: '120+' },
  { label: 'Pattern',      emoji: '🔷', color: '#F472B6', count: '100+' },
];

const STATS = [
  { value: '750+', label: 'Questions', icon: <Brain size={20} /> },
  { value: '10k+', label: 'Learners',  icon: <Users size={20} /> },
  { value: '4.9★', label: 'Rated',     icon: <Star size={20} /> },
  { value: '5min', label: 'Avg. Session', icon: <Clock size={20} /> },
];

export default function LandingPage({ onLogin, onSignup }) {
  const heroRef = useRef(null);

  // Parallax-lite: move glow orb on mousemove
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const handleMove = (e) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = hero.getBoundingClientRect();
      const x = ((clientX - left) / width - 0.5) * 30;
      const y = ((clientY - top) / height - 0.5) * 20;
      hero.style.setProperty('--mouse-x', `${x}px`);
      hero.style.setProperty('--mouse-y', `${y}px`);
    };
    hero.addEventListener('mousemove', handleMove, { passive: true });
    return () => hero.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <main className="landing" aria-label="MyAptitude landing page">
      {/* Background grain */}
      <div className="landing-grain" aria-hidden="true" />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="hero-section" ref={heroRef} id="hero">
        {/* Glow orbs */}
        <div className="hero-orb hero-orb--lime"   aria-hidden="true" />
        <div className="hero-orb hero-orb--purple" aria-hidden="true" />

        {/* Grid lines */}
        <div className="hero-grid" aria-hidden="true" />

        <div className="container hero-content">
          {/* Floating badge */}
          <div className="hero-badge animate-fadeInUp" aria-label="Platform launch">
            <div className="hero-badge-dot" />
            <span>Now Live — Train Smarter, Score Higher</span>
            <ChevronRight size={14} />
          </div>

          <h1 className="hero-title animate-fadeInUp delay-100">
            Master Aptitude.<br />
            <span className="hero-title-accent">Level Up Your Brain.</span>
          </h1>

          <p className="hero-subtitle animate-fadeInUp delay-200">
            A gamified, high-intensity aptitude training platform built for
            serious learners. Practice, track progress, earn XP and dominate
            every exam that stands between you and your goals.
          </p>

          {/* CTA buttons */}
          <div className="hero-cta animate-fadeInUp delay-300">
            <button
              id="hero-start-btn"
              className="btn btn-primary btn-xl"
              onClick={onSignup}
              aria-label="Create a free account"
            >
              <Zap size={20} />
              Start Fast Login
            </button>
            <button
              id="hero-fast-login-btn"
              className="btn btn-secondary btn-lg"
              onClick={onLogin}
              aria-label="Fast Login with Google"
            >
              1-Tap Google Login
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Social proof */}
          <p className="hero-social-proof animate-fadeInUp delay-400">
            <Shield size={14} className="hero-shield" />
            <span className="proof-item">No credit card required</span>
            <span className="proof-dot">·</span>
            <span className="proof-item">Free forever plan</span>
            <span className="proof-dot">·</span>
            <span className="proof-item">10,000+ learners</span>
          </p>

          {/* Hero visual card */}
          <div className="hero-visual animate-fadeInUp delay-500">
            <div className="hero-card">
              <div className="hero-card-header">
                <div className="hero-card-dots">
                  <span /><span /><span />
                </div>
                <span className="hero-card-title">Daily Challenge</span>
                <span className="badge badge-lime">Live</span>
              </div>

              <div className="hero-card-question">
                <p className="question-label">Quantitative Reasoning · Medium</p>
                <p className="question-text">
                  If <em>x</em> + <em>y</em> = 10 and <em>xy</em> = 24,
                  what is <em>x²</em> + <em>y²</em>?
                </p>
                <div className="question-options">
                  {['48', '52', '58', '64'].map((opt, i) => (
                    <button
                      key={opt}
                      className={`question-option ${i === 1 ? 'option-correct' : ''}`}
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                      {opt}
                    </button>
                  ))}
                </div>
                {/* Explanation snippet */}
                <div className="question-explanation">
                  <Zap size={14} className="text-accent" />
                  <span>x² + y² = (x+y)² − 2xy = 100 − 48 = <strong>52</strong></span>
                </div>
              </div>

              {/* Progress bar row */}
              <div className="hero-card-footer">
                <div className="hcf-progress">
                  <span className="text-xs text-muted">XP Progress</span>
                  <span className="text-xs text-accent fw-600">240 / 500 XP</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '48%' }} />
                </div>
              </div>
            </div>

            {/* Floating mini stats */}
            <div className="floating-stat floating-stat--streak animate-float">
              <Flame size={16} className="stat-icon--streak" />
              <span>7-Day Streak 🔥</span>
            </div>
            <div className="floating-stat floating-stat--xp animate-float delay-300">
              <Zap size={16} className="stat-icon--xp" />
              <span>+25 XP Earned!</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────── */}
      <section className="stats-strip" id="stats-strip" aria-label="Platform statistics">
        <div className="container">
          <div className="stats-grid">
            {STATS.map(({ value, label, icon }) => (
              <div key={label} className="stat-item">
                <div className="stat-icon-wrap">{icon}</div>
                <div>
                  <p className="stat-value">{value}</p>
                  <p className="stat-desc">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────── */}
      <section className="categories-section" id="categories" aria-label="Practice categories">
        <div className="container">
          <div className="section-header text-center">
            <span className="badge badge-lime">Categories</span>
            <h2 className="section-title">
              5 Categories.<br />
              <span className="text-accent">Endless Growth.</span>
            </h2>
            <p className="section-desc">
              Every major aptitude domain covered — rigorously structured,
              progressively challenging.
            </p>
          </div>

          <div className="categories-row" role="list">
            {CATEGORIES.map(({ label, emoji, color, count }) => (
              <button
                key={label}
                className="category-pill"
                style={{ '--cat-color': color }}
                aria-label={`${label} — ${count} questions`}
                role="listitem"
                onClick={onSignup}
              >
                <span className="cat-emoji" aria-hidden="true">{emoji}</span>
                <span className="cat-label">{label}</span>
                <span className="cat-count">{count} Q</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="features-section" id="features" aria-label="Platform features">
        <div className="container">
          <div className="section-header text-center">
            <span className="badge badge-lime">Why MyAptitude</span>
            <h2 className="section-title">
              Built to make you<br />
              <span className="text-accent">unstoppable.</span>
            </h2>
          </div>

          <div className="features-grid" role="list">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="feature-card card card-glow" role="listitem">
                <div className="feature-icon">{icon}</div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────── */}
      <section className="cta-section" id="cta" aria-label="Call to action">
        <div className="container">
          <div className="cta-card">
            <div className="cta-orb" aria-hidden="true" />
            <span className="badge badge-lime">Limited Free Spots</span>
            <h2 className="cta-title">
              Your next exam<br />starts here.
            </h2>
            <p className="cta-desc">
              Join thousands of students who are already training smarter.
              It&apos;s free to start.
            </p>
            <div className="cta-buttons">
              <button
                id="cta-signup-btn"
                className="btn btn-primary btn-xl"
                onClick={onSignup}
              >
                <Zap size={20} />
                Create Free Account
              </button>
              <button
                id="cta-login-btn"
                className="btn btn-ghost btn-lg"
                onClick={onLogin}
              >
                Already have an account? Log in
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-logo">
              <div className="logo-icon" style={{ width: 28, height: 28 }}>
                <Brain size={16} strokeWidth={2.5} />
              </div>
              <span className="logo-text" style={{ fontSize: '1rem' }}>
                My<span className="logo-accent">Aptitude</span>
              </span>
            </div>
            <p className="footer-copy">
              © 2026 MyAptitude. Built for learners, by learners.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
