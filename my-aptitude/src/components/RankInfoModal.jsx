import React, { useState } from 'react';
import { 
  X, 
  Trophy, 
  Zap, 
  Flame, 
  ShieldCheck, 
  Scale, 
  TrendingUp, 
  Award,
  CheckCircle2
} from 'lucide-react';
import './RankInfoModal.css';

export default function RankInfoModal({ isOpen, onClose, initialTab = 'rank' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div className="rank-info-overlay" onClick={onClose}>
      <div className="rank-info-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="rank-info-header">
          <div className="rank-info-title-wrap">
            <div className="rank-info-icon-badge">
              <Trophy size={20} className="text-lime" />
            </div>
            <div>
              <h2 className="rank-info-title">Ranking & Scoring Engine</h2>
              <p className="rank-info-sub">Transparent mathematical rules behind your ELO, XP, and Tier placement</p>
            </div>
          </div>
          <button className="rank-info-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="rank-info-tabs">
          <button 
            type="button" 
            className={`rank-info-tab ${activeTab === 'rank' ? 'rank-info-tab--active' : ''}`}
            onClick={() => setActiveTab('rank')}
          >
            <TrendingUp size={14} />
            <span>How Rank is Counted</span>
          </button>
          <button 
            type="button" 
            className={`rank-info-tab ${activeTab === 'tiers' ? 'rank-info-tab--active' : ''}`}
            onClick={() => setActiveTab('tiers')}
          >
            <Award size={14} />
            <span>League Tiers</span>
          </button>
          <button 
            type="button" 
            className={`rank-info-tab ${activeTab === 'multipliers' ? 'rank-info-tab--active' : ''}`}
            onClick={() => setActiveTab('multipliers')}
          >
            <Zap size={14} />
            <span>Multipliers & XP</span>
          </button>
          <button 
            type="button" 
            className={`rank-info-tab ${activeTab === 'fairplay' ? 'rank-info-tab--active' : ''}`}
            onClick={() => setActiveTab('fairplay')}
          >
            <Scale size={14} />
            <span>Fair Play Rules</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="rank-info-body">
          {/* TAB 1: How Rank is Counted */}
          {activeTab === 'rank' && (
            <div className="rank-info-section">
              <div className="rank-formula-card">
                <span className="formula-eyebrow">CORE RATING FORMULA</span>
                <code className="formula-equation">
                  Final Drill ELO = Base ELO + (Accuracy × 60) + (Speed Velocity × 25) + (Streak Multiplier × 15)
                </code>
              </div>

              <div className="rank-grid-cards">
                <div className="rank-detail-card">
                  <div className="detail-card-header">
                    <span className="card-num">01</span>
                    <h4 className="card-title">Accuracy Weight (60%)</h4>
                  </div>
                  <p className="card-desc">
                    Getting answers right is paramount. A 5/5 score awards maximum accuracy credits ($+50$ to $+100$ XP), while errors reduce points proportionally.
                  </p>
                </div>

                <div className="rank-detail-card">
                  <div className="detail-card-header">
                    <span className="card-num">02</span>
                    <h4 className="card-title">Speed Velocity (25%)</h4>
                  </div>
                  <p className="card-desc">
                    Each question has an optimal 15-second benchmark. Solving accurately under 10 seconds activates the <strong>Velocity Bonus</strong> for $+15$ bonus XP.
                  </p>
                </div>

                <div className="rank-detail-card">
                  <div className="detail-card-header">
                    <span className="card-num">03</span>
                    <h4 className="card-title">Streak Multiplier (15%)</h4>
                  </div>
                  <p className="card-desc">
                    Consistency is rewarded exponentially. A 3-day streak unlocks $1.2\times$ XP bonus; a 7+ day streak awards a permanent $1.5\times$ multiplier on all drills.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: League Tiers */}
          {activeTab === 'tiers' && (
            <div className="rank-info-section">
              <p className="section-lead-text">
                All thinkers start in Bronze and climb the ranks dynamically by winning blitz duels and earning XP.
              </p>

              <div className="tiers-table-wrap">
                <table className="tiers-table">
                  <thead>
                    <tr>
                      <th>Tier</th>
                      <th>XP Range</th>
                      <th>Perks & Privileges</th>
                      <th>Rank Badge</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="tier-name text-orange">🥉 Bronze Tier</td>
                      <td>0 – 499 XP</td>
                      <td>Basic sprint duels, Standard analytics</td>
                      <td><span className="tier-pill">Level 1</span></td>
                    </tr>
                    <tr className="tier-row--highlight">
                      <td className="tier-name text-cyan">🥈 Silver Tier (Current)</td>
                      <td>500 – 1,249 XP</td>
                      <td>Unlocks Study Workbook & 1 Streak Freeze</td>
                      <td><span className="tier-pill tier-pill--active">Level 2</span></td>
                    </tr>
                    <tr>
                      <td className="tier-name text-lime">🥇 Gold Tier</td>
                      <td>1,250 – 2,499 XP</td>
                      <td>Rewards Store discounts + 1.25x Multiplier</td>
                      <td><span className="tier-pill">Level 3</span></td>
                    </tr>
                    <tr>
                      <td className="tier-name text-purple">💎 Platinum Tier</td>
                      <td>2,500 – 4,999 XP</td>
                      <td>Exclusive FAANG mock interview slots</td>
                      <td><span className="tier-pill">Level 4</span></td>
                    </tr>
                    <tr>
                      <td className="tier-name text-gold">👑 Diamond Master</td>
                      <td>5,000+ XP</td>
                      <td>Top 1% Global Leaderboard & Hall of Fame</td>
                      <td><span className="tier-pill">Level 5+</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Multipliers & XP */}
          {activeTab === 'multipliers' && (
            <div className="rank-info-section">
              <div className="multipliers-list">
                <div className="mult-box">
                  <div className="mult-left">
                    <Flame size={20} className="text-orange" />
                    <div>
                      <strong>Streak Multipliers</strong>
                      <p>Day 1–2: 1.0x • Day 3–6: 1.2x • Day 7+: 1.5x on all XP</p>
                    </div>
                  </div>
                  <span className="mult-val text-orange">+50% Max</span>
                </div>

                <div className="mult-box">
                  <div className="mult-left">
                    <Zap size={20} className="text-lime" />
                    <div>
                      <strong>Flawless 5/5 Bonus</strong>
                      <p>Get all 5 questions right without hints or skips</p>
                    </div>
                  </div>
                  <span className="mult-val text-lime">+40 XP</span>
                </div>

                <div className="mult-box">
                  <div className="mult-left">
                    <ShieldCheck size={20} className="text-cyan" />
                    <div>
                      <strong>Daily Challenge Clear</strong>
                      <p>Complete the featured daily 25s sprint</p>
                    </div>
                  </div>
                  <span className="mult-val text-cyan">+100 XP</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Fair Play Rules */}
          {activeTab === 'fairplay' && (
            <div className="rank-info-section">
              <div className="rules-list">
                <div className="rule-item">
                  <CheckCircle2 size={18} className="text-lime flex-shrink-0" />
                  <div>
                    <strong>Anti-Cheating & Clock Integrity</strong>
                    <p>Tab switches and external automation immediately forfeit the active duel to preserve fair leaderboard standing.</p>
                  </div>
                </div>

                <div className="rule-item">
                  <CheckCircle2 size={18} className="text-lime flex-shrink-0" />
                  <div>
                    <strong>Deterministic Rating Convergence</strong>
                    <p>Ratings adjust after every completed drill based on peer benchmarks, ensuring no inflated ratings.</p>
                  </div>
                </div>

                <div className="rule-item">
                  <CheckCircle2 size={18} className="text-lime flex-shrink-0" />
                  <div>
                    <strong>Database Sync Protection</strong>
                    <p>All completed questions and XP credits are cryptographically synced to your Supabase cloud profile.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="rank-info-footer">
          <p className="rank-footer-note">All rankings update dynamically after every completed practice drill.</p>
          <button className="btn btn-primary btn-md" onClick={onClose}>
            Got it, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
}
