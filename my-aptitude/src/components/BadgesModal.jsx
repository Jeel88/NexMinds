import { useState, useMemo } from 'react';
import { X, Share2, Lock, CheckCircle2, Trophy, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './BadgesModal.css';

// Helper to format unlock date
function formatUnlockDate(isoString) {
  if (!isoString) return 'Unlocked';
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24 && now.getDate() === date.getDate()) {
      return 'Unlocked Today';
    }
    if (diffHours < 48) {
      return 'Unlocked Yesterday';
    }
    return `Unlocked ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  } catch {
    return 'Unlocked';
  }
}

export default function BadgesModal({ isOpen, onClose, user: propUser }) {
  const { user: authUser } = useAuth();
  const [copiedId, setCopiedId] = useState(null);

  const currentUser = propUser || authUser || {};
  const userId = currentUser.id || 'guest';

  // Retrieve user quiz stats from localStorage
  const badgeStats = useMemo(() => {
    try {
      const raw = localStorage.getItem(`myaptitude_stats_${userId}`);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, [userId, isOpen]);

  // Retrieve or record unlock dates
  const unlockDates = useMemo(() => {
    try {
      const raw = localStorage.getItem(`myaptitude_badge_unlocks_${userId}`);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, [userId, isOpen]);

  // Compute dynamic badges from genuine user stats
  const badges = useMemo(() => {
    const sessions = Math.max(Number(currentUser.sessionsCount) || 0, Number(badgeStats.sessionsCount) || 0);
    const streak = Number(currentUser.streak) || 0;
    const xp = Number(currentUser.xp) || 0;
    const ratings = currentUser.ratings || { math: 1200, puzzle: 1200, logic: 1200, memory: 1200 };
    const mathRating = Number(ratings.math) || 1200;
    const maxRating = Math.max(
      1200,
      Number(ratings.math) || 1200,
      Number(ratings.puzzle) || 1200,
      Number(ratings.logic) || 1200,
      Number(ratings.memory) || 1200
    );
    const perfectCount = Number(badgeStats.perfectSessions) || 0;
    const hasMath100 = Boolean(badgeStats.mathScore100 || mathRating >= 1260);

    const list = [
      {
        id: 'first-spark',
        emoji: '⚡',
        name: 'First Spark',
        desc: 'Complete your first practice session in the arena',
        unlocked: sessions >= 1,
        progress: Math.min(sessions, 1),
        total: 1,
        progressLabel: `${Math.min(sessions, 1)}/1 drill completed`,
        rarity: 'Common',
        rarityColor: '#22C55E',
        xp: 25,
      },
      {
        id: 'streak-pioneer',
        emoji: '🔥',
        name: 'Streak Pioneer',
        desc: 'Reach an active 3-day consecutive practice streak',
        unlocked: streak >= 3,
        progress: Math.min(streak, 3),
        total: 3,
        progressLabel: `${Math.min(streak, 3)}/3 days streak`,
        rarity: 'Uncommon',
        rarityColor: '#38BDF8',
        xp: 50,
      },
      {
        id: 'math-ace',
        emoji: '🎯',
        name: 'Mental Math Ace',
        desc: 'Score 100% on a Math Sprint drill (or reach 1250+ Math Elo)',
        unlocked: hasMath100,
        progress: Math.min(mathRating, 1250),
        total: 1250,
        progressLabel: `${mathRating}/1250 Math Elo`,
        rarity: 'Rare',
        rarityColor: '#A855F7',
        xp: 60,
      },
      {
        id: 'consistency-titan',
        emoji: '🛡️',
        name: 'Consistency Titan',
        desc: 'Maintain a 7-day consecutive practice streak',
        unlocked: streak >= 7,
        progress: Math.min(streak, 7),
        total: 7,
        progressLabel: `${Math.min(streak, 7)}/7 days streak`,
        rarity: 'Epic',
        rarityColor: '#F59E0B',
        xp: 100,
      },
      {
        id: 'aptitude-veteran',
        emoji: '🎓',
        name: 'Aptitude Veteran',
        desc: 'Complete 10 total practice drills in the arena',
        unlocked: sessions >= 10,
        progress: Math.min(sessions, 10),
        total: 10,
        progressLabel: `${Math.min(sessions, 10)}/10 drills completed`,
        rarity: 'Rare',
        rarityColor: '#A855F7',
        xp: 100,
      },
      {
        id: 'grand-strategist',
        emoji: '🧠',
        name: 'Grand Strategist',
        desc: 'Advance any skill rating to 1300+ Elo',
        unlocked: maxRating >= 1300,
        progress: Math.min(maxRating, 1300),
        total: 1300,
        progressLabel: `${maxRating}/1300 Elo (Peak: ${maxRating})`,
        rarity: 'Epic',
        rarityColor: '#F59E0B',
        xp: 150,
      },
      {
        id: 'perfect-run',
        emoji: '🏆',
        name: 'Flawless Mastery',
        desc: 'Achieve 3 perfect 100% (5/5) quiz scores',
        unlocked: perfectCount >= 3,
        progress: Math.min(perfectCount, 3),
        total: 3,
        progressLabel: `${Math.min(perfectCount, 3)}/3 perfect drills`,
        rarity: 'Legendary',
        rarityColor: '#C6FF45',
        xp: 250,
      },
      {
        id: 'xp-centurion',
        emoji: '👑',
        name: 'XP Centurion',
        desc: 'Accumulate 500+ total arena XP points',
        unlocked: xp >= 500,
        progress: Math.min(xp, 500),
        total: 500,
        progressLabel: `${Math.min(xp, 500)}/500 XP earned`,
        rarity: 'Legendary',
        rarityColor: '#C6FF45',
        xp: 250,
      },
    ];

    // Persist new unlock timestamps
    const nowIso = new Date().toISOString();
    let hasNewUnlocks = false;
    const updatedUnlocks = { ...unlockDates };

    list.forEach((b) => {
      if (b.unlocked) {
        if (!updatedUnlocks[b.id]) {
          updatedUnlocks[b.id] = nowIso;
          hasNewUnlocks = true;
        }
        b.date = formatUnlockDate(updatedUnlocks[b.id]);
      }
    });

    if (hasNewUnlocks) {
      try {
        localStorage.setItem(`myaptitude_badge_unlocks_${userId}`, JSON.stringify(updatedUnlocks));
      } catch {}
    }

    return list;
  }, [currentUser, badgeStats, unlockDates, userId]);

  if (!isOpen) return null;

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const handleShare = async (badge) => {
    const text = `🏆 Just unlocked "${badge.name}" on MyAptitude!\n${badge.desc}\n+${badge.xp} XP earned! 🔥`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'MyAptitude Achievement', text });
      } else {
        await navigator.clipboard.writeText(text);
      }
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
              <p className="bm-subtitle">{unlockedCount} of {badges.length} unlocked</p>
            </div>
          </div>
          <button type="button" className="bm-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Overall Progress bar */}
        <div className="bm-overall-progress">
          <div
            className="bm-overall-fill"
            style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
          />
        </div>

        {/* Badges Grid */}
        <div className="bm-grid">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`bm-card ${b.unlocked ? 'bm-card--unlocked' : 'bm-card--locked'}`}
              style={b.unlocked ? { '--rarity': b.rarityColor } : {}}
            >
              {/* Emoji icon */}
              <div className="bm-card-icon">
                <span className="bm-emoji">{b.emoji}</span>
                {b.unlocked ? (
                  <span className="bm-status-dot bm-status-dot--ok" title="Badge Unlocked">
                    <CheckCircle2 size={11} />
                  </span>
                ) : (
                  <span className="bm-status-dot bm-status-dot--lock" title="Badge Locked">
                    <Lock size={11} />
                  </span>
                )}
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
                {!b.unlocked && b.progress != null && b.total != null && (
                  <div className="bm-prog-wrap">
                    <div className="bm-prog-track">
                      <div
                        className="bm-prog-fill"
                        style={{
                          width: `${Math.min(100, Math.max(0, (b.progress / b.total) * 100))}%`,
                          background: b.rarityColor,
                        }}
                      />
                    </div>
                    <span className="bm-prog-label">{b.progressLabel || `${b.progress}/${b.total}`}</span>
                  </div>
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
