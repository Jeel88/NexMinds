import React, { useEffect } from 'react';
import { 
  X, 
  Zap, 
  Flame, 
  Shield, 
  Trophy, 
  Award, 
  Target, 
  Sparkles,
  Swords,
  CheckCircle2
} from 'lucide-react';
import './PeerProfileModal.css';

export default function PeerProfileModal({ peer, isOpen, onClose, onChallenge, rank }) {
  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
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

  if (!isOpen || !peer) return null;

  const xp = peer.xp ?? 0;
  const level = peer.level ?? Math.max(1, Math.floor(xp / 250) + 1);
  const nextLevelXP = level * 250;
  const currentLevelBaseXP = (level - 1) * 250;
  const levelProgress = Math.min(
    100,
    Math.max(0, Math.round(((xp - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100))
  );

  const getTier = (points) => {
    if (points >= 2800) return { tier: 'Diamond Master', color: '#38BDF8', badge: 'DIAMOND' };
    if (points >= 2600) return { tier: 'Platinum Tier', color: '#A855F7', badge: 'PLATINUM' };
    if (points >= 2400) return { tier: 'Gold Tier', color: '#F59E0B', badge: 'GOLD' };
    if (points >= 1000) return { tier: 'Silver Tier', color: '#94A3B8', badge: 'SILVER' };
    return { tier: 'Bronze Tier', color: '#CD7F32', badge: 'BRONZE' };
  };

  const tierInfo = getTier(xp);
  const peerInitial = (peer.name || 'P').charAt(0).toUpperCase();

  const peerRatings = peer.ratings || {
    math: 1200,
    puzzle: 1200,
    logic: 1200,
    memory: 1200,
  };

  const avgRating = Math.round(
    ((peerRatings.math || 1200) +
     (peerRatings.puzzle || 1200) +
     (peerRatings.logic || 1200) +
     (peerRatings.memory || 1200)) / 4
  );

  return (
    <div className="peer-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="peer-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Glow backdrop behind modal */}
        <div className="peer-modal-glow" />

        {/* Modal Top Header */}
        <div className="peer-modal-header">
          <div className="peer-header-tag">
            <Sparkles size={13} className="text-lime" />
            <span>GLOBAL ARENA CONTENDER</span>
          </div>
          <button 
            type="button" 
            className="peer-modal-close" 
            onClick={onClose} 
            aria-label="Close contender profile"
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile Card Hero */}
        <div className="peer-hero-card">
          <div className="peer-avatar-wrapper">
            <div className="peer-avatar-ring">
              {peer.avatar && peer.avatar.startsWith('http') ? (
                <img
                  src={peer.avatar}
                  alt={peer.name || 'Contender'}
                  className="peer-avatar-photo"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
              <span className="peer-avatar-initial">{peerInitial}</span>
              <span className="peer-online-pulse" title="Online Contender" />
            </div>
            {rank && (
              <span className="peer-rank-badge">
                #{rank}
              </span>
            )}
          </div>

          <div className="peer-hero-info">
            <div className="peer-name-row">
              <h3 className="peer-name">{peer.name || 'Anonymous Thinker'}</h3>
              <span className="peer-verified-badge" title="Active Verified Player">
                <CheckCircle2 size={15} />
              </span>
            </div>
            <div className="peer-tier-pill" style={{ borderColor: `${tierInfo.color}40`, color: tierInfo.color }}>
              <Trophy size={13} />
              <span>{tierInfo.tier}</span>
            </div>
          </div>
        </div>

        {/* PROMINENT TOTAL XP HERO BANNER */}
        <div className="peer-xp-banner">
          <div className="peer-xp-banner-top">
            <div className="peer-xp-label-group">
              <div className="peer-xp-icon-box">
                <Zap size={22} className="text-lime" />
              </div>
              <div>
                <span className="peer-xp-caption">TOTAL EARNED XP</span>
                <div className="peer-xp-display">
                  <span className="peer-xp-number">{xp.toLocaleString()}</span>
                  <span className="peer-xp-suffix">XP</span>
                </div>
              </div>
            </div>
            <span className="peer-lvl-tag">Level {level}</span>
          </div>

          {/* Level Progress Gauge */}
          <div className="peer-xp-track-wrap">
            <div className="peer-xp-progress-bar">
              <div 
                className="peer-xp-progress-fill" 
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <div className="peer-xp-progress-labels">
              <span>Progress to Level {level + 1}</span>
              <span className="text-lime">{levelProgress}%</span>
            </div>
          </div>
        </div>

        {/* 3-Column Key Stats */}
        <div className="peer-stats-grid">
          <div className="peer-stat-box">
            <div className="peer-stat-icon-wrap stat-streak">
              <Flame size={16} />
            </div>
            <span className="peer-stat-val">{peer.streak || 0}</span>
            <span className="peer-stat-lbl">DAY STREAK</span>
          </div>

          <div className="peer-stat-box">
            <div className="peer-stat-icon-wrap stat-rating">
              <Award size={16} />
            </div>
            <span className="peer-stat-val text-lime">{avgRating}</span>
            <span className="peer-stat-lbl">AVG RATING</span>
          </div>

          <div className="peer-stat-box">
            <div className="peer-stat-icon-wrap stat-level">
              <Shield size={16} />
            </div>
            <span className="peer-stat-val">LVL {level}</span>
            <span className="peer-stat-lbl">TIER RANK</span>
          </div>
        </div>

        {/* Aptitude Category Ratings */}
        <div className="peer-ratings-section">
          <span className="peer-section-title">SKILL RATINGS (ELO)</span>
          <div className="peer-ratings-grid">
            <div className="peer-cat-rating-card">
              <span className="peer-cat-val" style={{ color: '#FF9500' }}>{peerRatings.math || 1200}</span>
              <span className="peer-cat-lbl">Math Sprint</span>
            </div>
            <div className="peer-cat-rating-card">
              <span className="peer-cat-val" style={{ color: '#A855F7' }}>{peerRatings.puzzle || 1200}</span>
              <span className="peer-cat-lbl">Patterns</span>
            </div>
            <div className="peer-cat-rating-card">
              <span className="peer-cat-val" style={{ color: '#C6FF45' }}>{peerRatings.logic || 1200}</span>
              <span className="peer-cat-lbl">Logic Blitz</span>
            </div>
            <div className="peer-cat-rating-card">
              <span className="peer-cat-val" style={{ color: '#38BDF8' }}>{peerRatings.memory || 1200}</span>
              <span className="peer-cat-lbl">Numerical</span>
            </div>
          </div>
        </div>

        {/* Challenge Action Button */}
        <div className="peer-modal-actions">
          <button
            type="button"
            className="peer-challenge-btn"
            onClick={() => onChallenge?.('math')}
          >
            <Swords size={18} />
            <span>Challenge in Aptitude Duel</span>
          </button>
        </div>
      </div>
    </div>
  );
}
