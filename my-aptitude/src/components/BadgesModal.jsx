import { useState } from 'react';
import { X, Share2, Lock, CheckCircle2, Trophy, Zap, Flame, Shield, Brain, Target, Star } from 'lucide-react';
import './BadgesModal.css';

const BADGES = [
  {
    id: 'first-spark',
    emoji: '⚡',
    name: 'First Spark',
    desc: 'Complete your first practice session with >80% accuracy',
    unlocked: true,
    date: '2 days ago',
    rarity: 'Common',
    rarityColor: '#22C55E',
    xp: 25,
  },
  {
    id: 'streak-pioneer',
    emoji: '🔥',
    name: 'Streak Pioneer',
    desc: 'Maintain a 3-day consecutive practice streak',
    unlocked: true,
    date: 'Yesterday',
    rarity: 'Uncommon',
    rarityColor: '#38BDF8',
    xp: 40,
  },
  {
    id: 'math-ace',
    emoji: '🎯',
    name: 'Mental Math Ace',
    desc: 'Score 100% on any Math Sprint session',
    unlocked: true,
    date: 'Today',
    rarity: 'Rare',
    rarityColor: '#A855F7',
    xp: 60,
  },
  {
    id: 'consistency-titan',
    emoji: '🛡️',
    name: 'Consistency Titan',
    desc: 'Hit a 7-day practice streak without using a freeze',
    unlocked: false,
    progress: 3,
    total: 7,
    rarity: 'Epic',
    rarityColor: '#F59E0B',
    xp: 100,
  },
  {
    id: 'rapid-synapse',
    emoji: '🚀',
    name: 'Rapid Synapse',
    desc: 'Score 100% on a timed session in under 20 minutes',
    unlocked: false,
    progress: null,
    progressLabel: 'Best: 90%',
    rarity: 'Rare',
    rarityColor: '#A855F7',
    xp: 75,
  },
  {
    id: 'logic-master',
    emoji: '🧠',
    name: 'Syllogism Grandmaster',
    desc: 'Solve 50 Logical Reasoning questions with zero mistakes',
    unlocked: false,
    progress: 28,
    total: 50,
    rarity: 'Epic',
    rarityColor: '#F59E0B',
    xp: 150,
  },
  {
    id: 'perfect-run',
    emoji: '🏆',
    name: 'Flawless Run',
    desc: 'Get a perfect score (5/5) three sessions in a row',
    unlocked: false,
    progress: 1,
    total: 3,
    rarity: 'Legendary',
    rarityColor: '#C6FF45',
    xp: 250,
  },
  {
    id: 'speed-demon',
    emoji: '⚡',
    name: 'Speed Demon',
    desc: 'Complete all 5 questions in under 60 seconds total',
    unlocked: false,
    progress: null,
    progressLabel: 'Best: 78s',
    rarity: 'Legendary',
    rarityColor: '#C6FF45',
    xp: 250,
  },
];

const unlockedCount = BADGES.filter(b => b.unlocked).length;

export default function BadgesModal({ isOpen, onClose }) {
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen) return null;

  const handleShare = async (badge) => {
    const text = `🏆 Just unlocked "${badge.name}" on MyAptitude!\n${badge.desc}\n+${badge.xp} XP earned! 🔥`;
    try {
      if (navigator.share) await navigator.share({ title: 'MyAptitude Achievement', text });
      else await navigator.clipboard.writeText(text);
    } catch (_) {}
    setCopiedId(badge.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} aria-hidden="true">
      <div
        className="bm-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="badges-title"
      >
        {/* Header */}
        <div className="bm-header">
          <div className="bm-header-left">
            <div className="bm-trophy-icon">
              <Trophy size={20} />
            </div>
            <div>
              <h2 id="badges-title" className="bm-title">Badges & Achievements</h2>
              <p className="bm-subtitle">{unlockedCount} of {BADGES.length} unlocked</p>
            </div>
          </div>
          <button type="button" className="bm-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="bm-overall-progress">
          <div
            className="bm-overall-fill"
            style={{ width: `${(unlockedCount / BADGES.length) * 100}%` }}
          />
        </div>

        {/* Badges Grid */}
        <div className="bm-grid">
          {BADGES.map((b) => (
            <div
              key={b.id}
              className={`bm-card ${b.unlocked ? 'bm-card--unlocked' : 'bm-card--locked'}`}
              style={b.unlocked ? { '--rarity': b.rarityColor } : {}}
            >
              {/* Emoji icon */}
              <div className="bm-card-icon">
                <span className="bm-emoji">{b.emoji}</span>
                {b.unlocked
                  ? <span className="bm-status-dot bm-status-dot--ok"><CheckCircle2 size={11} /></span>
                  : <span className="bm-status-dot bm-status-dot--lock"><Lock size={11} /></span>
                }
              </div>

              {/* Info */}
              <div className="bm-card-body">
                <div className="bm-card-top-row">
                  <h3 className="bm-badge-name">{b.name}</h3>
                  <span className="bm-rarity" style={{ color: b.rarityColor }}>
                    {b.rarity}
                  </span>
                </div>

                <p className="bm-badge-desc">{b.desc}</p>

                {/* Progress bar for locked */}
                {!b.unlocked && b.progress != null && (
                  <div className="bm-prog-wrap">
                    <div className="bm-prog-track">
                      <div
                        className="bm-prog-fill"
                        style={{ width: `${(b.progress / b.total) * 100}%`, background: b.rarityColor }}
                      />
                    </div>
                    <span className="bm-prog-label">{b.progress}/{b.total}</span>
                  </div>
                )}
                {!b.unlocked && b.progressLabel && (
                  <span className="bm-prog-text">{b.progressLabel}</span>
                )}

                {/* Footer row */}
                <div className="bm-card-footer">
                  <span className="bm-xp-badge">
                    <Zap size={11} /> +{b.xp} XP
                  </span>
                  {b.unlocked && (
                    <>
                      <span className="bm-date">{b.date}</span>
                      <button
                        type="button"
                        className={`bm-share-btn ${copiedId === b.id ? 'bm-share-btn--copied' : ''}`}
                        onClick={() => handleShare(b)}
                        aria-label={`Share ${b.name}`}
                      >
                        <Share2 size={12} />
                        <span>{copiedId === b.id ? 'Copied!' : 'Share'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
