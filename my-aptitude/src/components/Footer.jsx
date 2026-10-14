import React from 'react';
import { 
  Trophy, 
  BookOpen, 
  Gift, 
  Award, 
  Command, 
  ShieldCheck, 
  ArrowUp,
  Sparkles,
  Zap
} from 'lucide-react';
import './Footer.css';

export default function Footer({
  onOpenRankInfo,
  onOpenStudyBook,
  onOpenRedeemStore,
  onOpenBadges,
  onOpenShortcuts
}) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="app-footer">
      <div className="matiks-web-container">
        {/* Main 4-Column Grid */}
        <div className="footer-grid">
          {/* Column 1: Brand & Database Sync */}
          <div className="footer-col footer-col--brand">
            <div className="footer-brand" onClick={scrollToTop}>
              <span className="brand-title">
                My<span className="brand-accent">Aptitude</span>
              </span>
            </div>
            <p className="footer-tagline">
              Adaptive Aptitude Arena designed for high-velocity exam prep, blitz reasoning, and mental calculation drills.
            </p>
            <div className="footer-db-badge">
              <span className="db-live-indicator" />
              <span className="db-badge-text">Supabase Database Connected</span>
            </div>
          </div>

          {/* Column 2: How Rank is Counted & Scoring */}
          <div className="footer-col">
            <h4 className="footer-heading">
              <Trophy size={14} className="text-lime" />
              <span>Rankings & Scoring</span>
            </h4>
            <ul className="footer-links">
              <li>
                <button type="button" className="footer-link-btn" onClick={() => onOpenRankInfo('rank')}>
                  How Rank is Counted
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => onOpenRankInfo('tiers')}>
                  League Tiers & Thresholds
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => onOpenRankInfo('multipliers')}>
                  XP Multipliers & Streaks
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={() => onOpenRankInfo('fairplay')}>
                  Fair Play & Anti-Cheat Rules
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Learning & Rewards */}
          <div className="footer-col">
            <h4 className="footer-heading">
              <Sparkles size={14} className="text-cyan" />
              <span>Arenas & Vault</span>
            </h4>
            <ul className="footer-links">
              <li>
                <button type="button" className="footer-link-btn" onClick={onOpenStudyBook}>
                  Study Handbook & Solutions
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={onOpenRedeemStore}>
                  XP Rewards Store (MacBook & Sony)
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={onOpenBadges}>
                  Honor Badges & Achievements
                </button>
              </li>
              <li>
                <button type="button" className="footer-link-btn" onClick={onOpenShortcuts}>
                  Keyboard Shortcuts (Press /)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform Integrity */}
          <div className="footer-col">
            <h4 className="footer-heading">
              <ShieldCheck size={14} className="text-orange" />
              <span>Platform & Privacy</span>
            </h4>
            <ul className="footer-links">
              <li>
                <span className="footer-text-link">Real-Time ELO Calibration</span>
              </li>
              <li>
                <span className="footer-text-link">Deterministic Problem Sets</span>
              </li>
              <li>
                <span className="footer-text-link">Zero Password Architecture</span>
              </li>
              <li>
                <span className="footer-text-link">Privacy & Google OAuth 2.0</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            <p className="copyright-text">
              © {new Date().getFullYear()} NexMinds Aptitude Arena. All rights reserved.
            </p>
            <span className="footer-status-pill">Production v2.4 • Dynamic Cloud Sync</span>
          </div>

          <button type="button" className="footer-back-to-top" onClick={scrollToTop} aria-label="Back to top">
            <span>Back to Top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
