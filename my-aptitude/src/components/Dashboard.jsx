import { useState, useEffect } from 'react';
import {
  Zap,
  Flame,
  Shield,
  Crown,
  Puzzle,
  FastForward,
  Hash,
  ChevronRight,
  Gamepad2,
  Sparkles,
  ArrowUpRight,
  Play,
  Award,
  ChevronDown,
  Gift,
  BookOpen,
  Trophy,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import ProfileDrawer from './ProfileDrawer';
import PracticeModal from './PracticeModal';
import BadgesModal from './BadgesModal';
import ShortcutsModal from './ShortcutsModal';
import QuizScreen from './QuizScreen';
import RedeemStore from './RedeemStore';
import StudyBook from './StudyBook';
import Footer from './Footer';
import RankInfoModal from './RankInfoModal';
import './Dashboard.css';

// 5 Aptitude categories definitions
const CATEGORIES = [
  {
    id: 'math',
    name: 'MATH',
    fullName: 'Quantitative Aptitude',
    icon: FastForward,
    color: '#FF9500',
    rating: 1200,
    trend: '+0 —',
    tag: 'MATH SPRINT',
    title: 'SPRINT DUELS',
    subtitle: 'RACE TO SOLVE 5 QUESTIONS IN 2 MINS',
    badge: '1.5x XP MULTIPLIER',
    desc: 'Percentages, Speed & Distance, Arithmetic Velocity',
    mastery: 72,
    questions: 140,
  },
  {
    id: 'puzzle',
    name: 'PUZZLE',
    fullName: 'Pattern Recognition',
    icon: Puzzle,
    color: '#A855F7',
    rating: 1200,
    trend: '+0 —',
    tag: 'SPATIAL PUZZLE',
    title: 'MATRIX ROTATION',
    subtitle: 'IDENTIFY NEXT SHAPE IN THE SEQUENCE',
    badge: '+40 BONUS XP',
    desc: 'Matrix Completion, Spatial Rotation, Sequence Folding',
    mastery: 58,
    questions: 95,
  },
  {
    id: 'logic',
    name: 'LOGIC',
    fullName: 'Logical Reasoning',
    icon: Crown,
    color: '#C6FF45',
    rating: 1200,
    trend: '+0 —',
    tag: 'LOGIC BLITZ',
    title: 'SYLLOGISM ARENA',
    subtitle: 'TEST RAPID CONDITIONAL DEDUCTIONS',
    badge: 'RANKED MATCH',
    desc: 'Syllogisms, Blood Relations, Seating Arrangements',
    mastery: 78,
    questions: 160,
  },
  {
    id: 'memory',
    name: 'NUMERICAL',
    fullName: 'Numerical Memory & Agility',
    icon: Hash,
    color: '#38BDF8',
    rating: 1200,
    trend: '+0 —',
    tag: 'NUMBER FLASH',
    title: 'SERIES VELOCITY',
    subtitle: 'COMPLETE FAST NUMBER SERIES RUNS',
    badge: 'ACCURACY BOOST',
    desc: 'Missing Digits, Mental Math, Approximation',
    mastery: 84,
    questions: 125,
  },
];

export default function Dashboard() {
  const { user, theme, toggleTheme } = useAuth();

  // Modals & Drawers
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [badgesModalOpen, setBadgesModalOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [rankInfoModalOpen, setRankInfoModalOpen] = useState(false);
  const [rankInfoInitialTab, setRankInfoInitialTab] = useState('rank');
  const [quizConfig, setQuizConfig] = useState(null); // active quiz session
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'redeem' | 'study'
  const [activeRatingCatId, setActiveRatingCatId] = useState(null); // No rating card pre-selected on page load

  const openRankInfo = (tab = 'rank') => {
    setRankInfoInitialTab(tab);
    setRankInfoModalOpen(true);
  };

  // Selected Aptitude category tab (defaults to MATH)
  const [selectedCatId, setSelectedCatId] = useState('math');
  const [isDailyChallengeMode, setIsDailyChallengeMode] = useState(false);

  // Live countdown timer for daily event
  const [timeLeft, setTimeLeft] = useState({ hours: 6, minutes: 14, seconds: 32 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic Leaderboard from Supabase DB (Hook called unconditionally)
  const [dbProfiles, setDbProfiles] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function loadLeaderboard() {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, xp, streak, level, avatar')
          .order('xp', { ascending: false })
          .limit(50);

        if (!error && data && isMounted) {
          setDbProfiles(data);
        }
      } catch (err) {
        console.warn('Leaderboard fetch warning:', err);
      }
    }

    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 12000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user?.id, user?.xp]);

  const openPractice = (catId = 'math', isDaily = false) => {
    setSelectedCatId(catId);
    setIsDailyChallengeMode(isDaily);
    setPracticeModalOpen(true);
  };

  // Launch the actual quiz session
  const handleLaunchPractice = (config) => {
    setPracticeModalOpen(false);
    setQuizConfig(config);
  };

  // If quiz is active, render full-screen quiz
  if (quizConfig) {
    return <QuizScreen config={quizConfig} onComplete={() => setQuizConfig(null)} />;
  }

  // If viewing the Rewards Vault, render the dedicated store page
  if (activeView === 'redeem') {
    return (
      <RedeemStore
        onBack={() => setActiveView('dashboard')}
        onStartDrill={() => {
          setActiveView('dashboard');
          openPractice('math', false);
        }}
      />
    );
  }

  // If viewing the Study Handbook (No XP, step-by-step derivations)
  if (activeView === 'study') {
    return (
      <StudyBook
        onBack={() => setActiveView('dashboard')}
      />
    );
  }

  const selectedCategory = CATEGORIES.find((c) => c.id === selectedCatId) || CATEGORIES[0];
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const userName = user?.name || 'Explorer';
  const xp = user?.xp ?? 0;
  const streak = user?.streak ?? 0;
  const level = user?.level ?? 1;
  const nextLevelXP = level * 250;
  const currentLevelBaseXP = (level - 1) * 250;
  const levelProgress = Math.min(
    100,
    Math.max(0, Math.round(((xp - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100))
  );

  // Helper to ensure colors are readable in Light Mode
  const getCatColor = (cat) => {
    if (theme === 'light' && (cat?.color === '#C6FF45' || cat?.id === 'logic')) {
      return '#15803D';
    }
    return cat?.color || '#FF9500';
  };

  // Construct live sorted ranking list
  const rankingList = [...dbProfiles];

  if (user) {
    const existingIndex = rankingList.findIndex((p) => p.id === user.id);
    if (existingIndex !== -1) {
      rankingList[existingIndex] = {
        ...rankingList[existingIndex],
        name: user.name || 'You',
        xp: user.xp ?? 0,
        level: user.level ?? 1,
        streak: user.streak ?? 0,
        avatar: user.avatar,
        isYou: true,
      };
    } else {
      rankingList.push({
        id: user.id || 'current-user',
        name: user.name || 'You',
        xp: user.xp ?? 0,
        level: user.level ?? 1,
        streak: user.streak ?? 0,
        avatar: user.avatar,
        isYou: true,
      });
    }
  }

  // Sort strictly by XP descending (real database contenders only)
  rankingList.sort((a, b) => {
    const xpDiff = (b.xp || 0) - (a.xp || 0);
    if (xpDiff !== 0) return xpDiff;
    return (b.streak || 0) - (a.streak || 0);
  });

  // Dynamic exact integer rank (1-indexed, no static strings)
  const myRankIndex = rankingList.findIndex((p) => p.id === user?.id || p.isYou);
  const userRankNumber = myRankIndex !== -1 ? myRankIndex + 1 : 1;

  const getTierInfo = (points) => {
    if (points >= 2800) return { tier: 'Diamond Master', division: 'Diamond Division' };
    if (points >= 2600) return { tier: 'Platinum Tier', division: 'Platinum Division' };
    if (points >= 2400) return { tier: 'Gold Tier', division: 'Gold Division' };
    if (points >= 1000) return { tier: 'Silver Tier', division: 'Silver Division' };
    return { tier: 'Bronze Tier', division: 'Bronze Division' };
  };

  const standing = {
    rank: `#${userRankNumber}`,
    ...getTierInfo(xp),
  };

  return (
    <div className="matiks-dashboard-app" id="matiks-dashboard-app">
      {/* ============================================================
          1. DESKTOP & MOBILE TOP NAVIGATION BAR
          ============================================================ */}
      <header className="matiks-top-bar" id="matiks-top-bar">
        <div className="matiks-web-container">
          <div className="top-bar-inner">
            {/* Left: Brand Logo */}
            <div className="top-bar-left">
              <div
                className="matiks-brand"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <span className="brand-title">
                  My<span className="brand-accent">Aptitude</span>
                </span>
              </div>
            </div>

            {/* Right: Stats + Profile Trigger */}
            <div className="top-bar-pills">
              {/* Flame Streak Pill */}
              <button
                type="button"
                className="status-pill status-pill--streak"
                onClick={() => setProfileDrawerOpen(true)}
                title="Active Daily Streak"
              >
                <Flame size={14} className="text-orange" />
                <span className="pill-val">{streak} Day Streak</span>
              </button>

              {/* XP Coin Pill (Opens Redeem Store) */}
              <button
                type="button"
                className="status-pill status-pill--xp"
                onClick={() => setActiveView('redeem')}
                title="Total XP — Click to Redeem Rewards"
              >
                <Zap size={14} className="text-lime" />
                <span className="pill-val">{xp} XP</span>
              </button>

              {/* Dynamic Theme Toggle in Corner — Circle Button at Same Position */}
              <button
                type="button"
                className="status-pill status-pill--circle status-pill--theme"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                id="theme-toggle-btn"
                aria-label="Toggle theme mode"
              >
                {theme === 'dark' ? (
                  <Sun size={17} className="theme-toggle-icon text-orange" />
                ) : (
                  <Moon size={17} className="theme-toggle-icon text-indigo" />
                )}
              </button>

              {/* User Profile Pill Trigger (Opens Profile Drawer with Logout) */}
              <button
                id="profile-drawer-trigger-btn"
                className="matiks-avatar-btn"
                onClick={() => setProfileDrawerOpen(true)}
                aria-label="Open Profile Drawer"
              >
                <div className="avatar-circle">
                  {user?.avatar && user.avatar.startsWith('http') ? (
                    <img 
                      src={user.avatar} 
                      alt={userName} 
                      className="header-avatar-img"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null}
                  <span className="avatar-initial-fallback">{userInitial}</span>
                  <span className="online-beacon" />
                </div>
                <div className="desktop-user-meta desktop-only">
                  <span className="desktop-user-name">{userName.split(' ')[0]}</span>
                  <span className="desktop-user-lvl">Lv. {level}</span>
                </div>
                <ChevronDown size={14} className="desktop-chevron desktop-only" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================
          2. EXPANDED WEB MAIN DASHBOARD (Full Desktop Grid)
          ============================================================ */}
      <main className="matiks-main-content matiks-web-container">
        {/* TOP ROW: Live Event Story Circles */}
        <section className="matiks-stories-section" aria-label="Contenders and Daily Event">
          <div className="matiks-stories-row">
            {/* Daily Event Glowing Circle */}
            <div
              className="story-circle-item event-story"
              onClick={() => openPractice('puzzle', true)}
              role="button"
              tabIndex={0}
            >
              <div className="event-ring-outer">
                <div className="event-ring-inner">
                  <span className="event-bold-text">5 IN 02</span>
                  <span className="event-sub-tag">STARTS IN</span>
                </div>
              </div>
              <span className="story-label text-lime">
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')} HRS
              </span>
            </div>

            {/* User Profile Circle */}
            <div
              className="story-circle-item you-story"
              onClick={() => setProfileDrawerOpen(true)}
              role="button"
              tabIndex={0}
            >
              <div className="user-ring-circle">
                {user?.avatar && user.avatar.startsWith('http') ? (
                  <img
                    src={user.avatar}
                    alt={userName}
                    className="user-ring-avatar-img"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                <span className="user-avatar-initial-fallback">{userInitial}</span>
                <span className="user-active-dot" />
              </div>
              <span className="story-label">YOU (LVL {level})</span>
            </div>

            {/* Live Real Peers from Supabase Database */}
            {dbProfiles.filter((p) => p.id !== user?.id).map((peer) => (
              <div
                key={peer.id}
                className="story-circle-item friend-story"
                onClick={() => openPractice('math', false)}
                role="button"
                tabIndex={0}
                title={`${peer.name || 'Contender'} • ${peer.xp || 0} XP`}
              >
                <div className="friend-ring-circle">
                  {peer.avatar && peer.avatar.startsWith('http') ? (
                    <img 
                      src={peer.avatar} 
                      alt={peer.name} 
                      className="friend-avatar-img"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span>{(peer.name || 'P').substring(0, 2).toUpperCase()}</span>
                  )}
                  <span className="friend-online-dot" />
                </div>
                <span className="story-label">{peer.name?.split(' ')[0]?.toUpperCase() || 'PLAYER'}</span>
              </div>
            ))}
          </div>
        </section>

        {/* TWO-COLUMN EXPANDED WEB GRID */}
        <div className="matiks-web-dashboard-grid">
          {/* ========================================================
              LEFT COLUMN: Training Arena & Duels (~62% on Desktop)
              ======================================================== */}
          <div className="web-grid-left">
            {/* TODAY'S CHALLENGE SNAP CARDS */}
            <section className="matiks-section" aria-label="Today's Challenge">
              <div className="section-title-wrap">
                <span className="matiks-section-eyebrow">TODAY'S CHALLENGE</span>
              </div>

              <div className="challenge-cards-row">
                {/* Card 1: PUZZLE */}
                <div
                  className="challenge-snap-card card-purple"
                  onClick={() => handleLaunchPractice({ category: 'puzzle', count: 5, timed: true, isDailyChallenge: true })}
                  role="button"
                  tabIndex={0}
                >
                  <div className="challenge-snap-info">
                    <span className="challenge-mini-tag text-neon-purple">ABSTRACT LOGIC</span>
                    <h3 className="challenge-snap-text text-neon-purple">PUZZLE</h3>
                    <span className="challenge-snap-sub">5 Questions • Sequence & Spatial</span>
                  </div>
                  <div className="challenge-snap-arrow">
                    <ChevronRight size={22} className="text-neon-purple" />
                  </div>
                </div>

                {/* Card 2: MATH */}
                <div
                  className="challenge-snap-card card-orange"
                  onClick={() => handleLaunchPractice({ category: 'math', count: 5, timed: true, isDailyChallenge: true })}
                  role="button"
                  tabIndex={0}
                >
                  <div className="challenge-snap-info">
                    <span className="challenge-mini-tag text-neon-orange">SPEED CALCULATION</span>
                    <h3 className="challenge-snap-text text-neon-orange">MATH</h3>
                    <span className="challenge-snap-sub">5 Questions • 25s Blitz Sprint</span>
                  </div>
                  <div className="challenge-snap-arrow">
                    <ChevronRight size={22} className="text-neon-orange" />
                  </div>
                </div>
              </div>
            </section>

            {/* DUELS & APTITUDE CATEGORY SELECTOR */}
            <section className="matiks-section" aria-label="Aptitude Duels">
              <div className="section-title-wrap">
                <span className="matiks-section-eyebrow">APTITUDE DUELS & DRILLS</span>
              </div>

              {/* Horizontal Icon Tabs */}
              <div className="duels-tabs-row">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCatId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`duel-tab-item ${isActive ? 'duel-tab-item--active' : ''}`}
                      onClick={() => setSelectedCatId(cat.id)}
                      style={{ '--tab-color': cat.color }}
                    >
                      <div className="duel-tab-box">
                        <Icon size={20} />
                      </div>
                      <span className="duel-tab-label">{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Featured Duel Card (SPRINT DUELS) */}
              <div className="selected-duel-card">
                <div className="duel-card-header">
                  <span
                    className="duel-badge-pill"
                    style={{ color: getCatColor(selectedCategory), borderColor: `${getCatColor(selectedCategory)}50` }}
                  >
                    {selectedCategory.tag}
                  </span>
                  <span className="duel-reward-pill">
                    <Zap size={13} /> {selectedCategory.badge}
                  </span>
                </div>

                <div className="duel-card-body">
                  <h2 className="duel-main-title">{selectedCategory.title}</h2>
                  <p className="duel-main-subtitle">{selectedCategory.subtitle}</p>
                </div>

                <button
                  id="start-duel-btn"
                  className="matiks-play-btn"
                  onClick={() => handleLaunchPractice({ category: selectedCategory.id, count: 5, timed: true, isDailyChallenge: false })}
                  style={{ '--btn-accent': getCatColor(selectedCategory) }}
                >
                  <Play size={18} fill="#0A0A0A" />
                  <span>START DRILL (5 QS)</span>
                </button>
              </div>
            </section>

            {/* INDEPENDENT LEADERBOARD CARD (Directly above Study Handbook) */}
            <section className="matiks-section leaderboard-section" aria-label="Arena Leaderboard">
              <div className="section-title-wrap flex-between">
                <div className="leaderboard-heading-row">
                  <Trophy size={16} className="text-lime" />
                  <span className="matiks-section-eyebrow">GLOBAL ARENA LEADERBOARD</span>
                  <span className="leaderboard-count-pill">{rankingList.length} Ranked</span>
                </div>
                <button
                  type="button"
                  className="leaderboard-rules-btn"
                  onClick={() => openRankInfo('rank')}
                  title="How rankings are calculated"
                >
                  <span>How Rank is Counted</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>

              <div className="leaderboard-card-shell">
                {/* Dynamic Podium: adapts cleanly whether 1, 2, or 3+ players */}
                {rankingList.length >= 3 ? (
                  <div className="leaderboard-podium-row podium-grid-3">
                    {/* #2 Rank */}
                    <div className={`podium-card podium-2 ${rankingList[1].isYou ? 'podium-card--you' : ''}`}>
                      <span className="podium-medal">🥈</span>
                      <div className="podium-avatar">
                        {rankingList[1].avatar && rankingList[1].avatar.startsWith('http') ? (
                          <img src={rankingList[1].avatar} alt={rankingList[1].name} className="podium-avatar-img" />
                        ) : (
                          rankingList[1].isYou ? userInitial : (rankingList[1].name?.substring(0, 2).toUpperCase() || 'P2')
                        )}
                      </div>
                      <span className="podium-name">{rankingList[1].isYou ? 'YOU' : rankingList[1].name}</span>
                      <span className="podium-xp text-lime">{rankingList[1].xp?.toLocaleString()} XP</span>
                      <span className="podium-tier">{getTierInfo(rankingList[1].xp).tier}</span>
                    </div>

                    {/* #1 Rank (Center) */}
                    <div className={`podium-card podium-1 ${rankingList[0].isYou ? 'podium-card--you' : ''}`}>
                      <span className="podium-medal">👑</span>
                      <div className="podium-avatar podium-avatar--gold">
                        {rankingList[0].avatar && rankingList[0].avatar.startsWith('http') ? (
                          <img src={rankingList[0].avatar} alt={rankingList[0].name} className="podium-avatar-img" />
                        ) : (
                          rankingList[0].isYou ? userInitial : (rankingList[0].name?.substring(0, 2).toUpperCase() || 'P1')
                        )}
                      </div>
                      <span className="podium-name">{rankingList[0].isYou ? 'YOU' : rankingList[0].name}</span>
                      <span className="podium-xp text-lime">{rankingList[0].xp?.toLocaleString()} XP</span>
                      <span className="podium-tier podium-tier--gold">{getTierInfo(rankingList[0].xp).tier}</span>
                    </div>

                    {/* #3 Rank */}
                    <div className={`podium-card podium-3 ${rankingList[2].isYou ? 'podium-card--you' : ''}`}>
                      <span className="podium-medal">🥉</span>
                      <div className="podium-avatar">
                        {rankingList[2].avatar && rankingList[2].avatar.startsWith('http') ? (
                          <img src={rankingList[2].avatar} alt={rankingList[2].name} className="podium-avatar-img" />
                        ) : (
                          rankingList[2].isYou ? userInitial : (rankingList[2].name?.substring(0, 2).toUpperCase() || 'P3')
                        )}
                      </div>
                      <span className="podium-name">{rankingList[2].isYou ? 'YOU' : rankingList[2].name}</span>
                      <span className="podium-xp text-lime">{rankingList[2].xp?.toLocaleString()} XP</span>
                      <span className="podium-tier">{getTierInfo(rankingList[2].xp).tier}</span>
                    </div>
                  </div>
                ) : rankingList.length === 2 ? (
                  <div className="leaderboard-podium-row podium-grid-2">
                    {/* #1 Rank */}
                    <div className={`podium-card podium-1 ${rankingList[0].isYou ? 'podium-card--you' : ''}`}>
                      <span className="podium-medal">👑</span>
                      <div className="podium-avatar podium-avatar--gold">
                        {rankingList[0].avatar && rankingList[0].avatar.startsWith('http') ? (
                          <img src={rankingList[0].avatar} alt={rankingList[0].name} className="podium-avatar-img" />
                        ) : (
                          rankingList[0].isYou ? userInitial : (rankingList[0].name?.substring(0, 2).toUpperCase() || 'P1')
                        )}
                      </div>
                      <span className="podium-name">{rankingList[0].isYou ? 'YOU' : rankingList[0].name}</span>
                      <span className="podium-xp text-lime">{rankingList[0].xp?.toLocaleString()} XP</span>
                      <span className="podium-tier podium-tier--gold">{getTierInfo(rankingList[0].xp).tier}</span>
                    </div>

                    {/* #2 Rank */}
                    <div className={`podium-card podium-2 ${rankingList[1].isYou ? 'podium-card--you' : ''}`}>
                      <span className="podium-medal">🥈</span>
                      <div className="podium-avatar">
                        {rankingList[1].avatar && rankingList[1].avatar.startsWith('http') ? (
                          <img src={rankingList[1].avatar} alt={rankingList[1].name} className="podium-avatar-img" />
                        ) : (
                          rankingList[1].isYou ? userInitial : (rankingList[1].name?.substring(0, 2).toUpperCase() || 'P2')
                        )}
                      </div>
                      <span className="podium-name">{rankingList[1].isYou ? 'YOU' : rankingList[1].name}</span>
                      <span className="podium-xp text-lime">{rankingList[1].xp?.toLocaleString()} XP</span>
                      <span className="podium-tier">{getTierInfo(rankingList[1].xp).tier}</span>
                    </div>
                  </div>
                ) : rankingList.length === 1 ? (
                  <div className="leaderboard-podium-row podium-grid-1">
                    <div className={`podium-card podium-1 podium-solo ${rankingList[0].isYou ? 'podium-card--you' : ''}`}>
                      <span className="podium-medal">👑</span>
                      <div className="podium-avatar podium-avatar--gold">
                        {rankingList[0].avatar && rankingList[0].avatar.startsWith('http') ? (
                          <img src={rankingList[0].avatar} alt={rankingList[0].name} className="podium-avatar-img" />
                        ) : (
                          rankingList[0].isYou ? userInitial : (rankingList[0].name?.substring(0, 2).toUpperCase() || 'P1')
                        )}
                      </div>
                      <span className="podium-name">{rankingList[0].isYou ? 'YOU' : rankingList[0].name}</span>
                      <span className="podium-xp text-lime">{rankingList[0].xp?.toLocaleString()} XP</span>
                      <span className="podium-tier podium-tier--gold">{getTierInfo(rankingList[0].xp).tier}</span>
                    </div>
                  </div>
                ) : (
                  <div className="leaderboard-empty-state">
                    <Trophy size={32} className="text-lime" />
                    <p>No contenders yet. Complete drills to claim #1 on the leaderboard!</p>
                  </div>
                )}

                {/* Divided Contenders List / Table */}
                {rankingList.length > 0 && (
                  <div className="leaderboard-table-wrap">
                    <div className="leaderboard-table-header">
                      <span className="th-col th-rank">RANK</span>
                      <span className="th-col th-player">THINKER</span>
                      <span className="th-col th-tier">TIER</span>
                      <span className="th-col th-streak">STREAK</span>
                      <span className="th-col th-xp">XP</span>
                    </div>

                    <div className="leaderboard-table-body">
                      {rankingList.map((player, idx) => {
                        const rankNum = idx + 1;
                        const isYou = player.isYou;
                        const tierInfo = getTierInfo(player.xp || 0);
                        const initial = (player.name || 'U').substring(0, 2).toUpperCase();

                        return (
                          <div
                            key={player.id || idx}
                            className={`leaderboard-row ${isYou ? 'leaderboard-row--you' : ''}`}
                          >
                            <div className="td-col td-rank">
                              {rankNum === 1 ? (
                                <span className="rank-num-badge rank-gold">👑 #1</span>
                              ) : rankNum === 2 ? (
                                <span className="rank-num-badge rank-silver">🥈 #2</span>
                              ) : rankNum === 3 ? (
                                <span className="rank-num-badge rank-bronze">🥉 #3</span>
                              ) : (
                                <span className="rank-num-badge rank-default">#{rankNum}</span>
                              )}
                            </div>

                            <div className="td-col td-player">
                              <div className="td-player-avatar">
                                {player.avatar && player.avatar.startsWith('http') ? (
                                  <img src={player.avatar} alt={player.name} className="td-avatar-img" />
                                ) : (
                                  <span>{isYou ? userInitial : initial}</span>
                                )}
                              </div>
                              <div className="td-player-meta">
                                <div className="td-player-name-row">
                                  <span className="td-player-name">{player.name || 'Explorer'}</span>
                                  {isYou && <span className="td-you-pill">YOU</span>}
                                </div>
                                <span className="td-player-sub">Level {player.level || 1} Thinker</span>
                              </div>
                            </div>

                            <div className="td-col td-tier">
                              <span className="td-tier-pill">{tierInfo.tier}</span>
                            </div>

                            <div className="td-col td-streak">
                              <span className="td-streak-pill">
                                <Flame size={12} className="text-orange" />
                                <span>{player.streak || 0}d</span>
                              </span>
                            </div>

                            <div className="td-col td-xp">
                              <span className="td-xp-val text-lime">
                                <Zap size={13} />
                                {(player.xp || 0).toLocaleString()} XP
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Dynamic User Standing Row */}
                <div className="leaderboard-user-strip">
                  <div className="strip-rank-badge">
                    <span>{standing.rank}</span>
                  </div>
                  <div className="strip-user-info">
                    <div className="strip-avatar">
                      {user?.avatar && user.avatar.startsWith('http') ? (
                        <img src={user.avatar} alt="You" className="strip-avatar-img" />
                      ) : (
                        userInitial
                      )}
                    </div>
                    <div>
                      <div className="strip-name-row">
                        <strong>YOU ({userName.split(' ')[0]})</strong>
                        <span className="strip-you-tag">ACTIVE</span>
                      </div>
                      <span className="strip-meta">Level {level} • {streak} Day Streak</span>
                    </div>
                  </div>
                  <div className="strip-stats">
                    <span className="strip-xp-val text-lime">{xp.toLocaleString()} XP</span>
                    <span className="strip-tier-label">{standing.tier}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* STUDY WORKBOOK LEARNING BANNER (Shifted from Training Modules, Zero XP) */}
            <div
              className="modules-redeem-banner study-guide-banner"
              onClick={() => setActiveView('study')}
              role="button"
              tabIndex={0}
            >
              <div className="modules-redeem-left">
                <div className="modules-redeem-icon" style={{ background: 'rgba(56, 189, 248, 0.1)', borderColor: 'rgba(56, 189, 248, 0.25)', color: '#38BDF8' }}>
                  <BookOpen size={22} />
                </div>
                <div>
                  <div className="modules-redeem-tag" style={{ color: '#38BDF8' }}>
                    <Sparkles size={11} className="text-cyan" />
                    <span>STUDY WORKBOOK & SOLUTIONS</span>
                  </div>
                  <h4 className="modules-redeem-title">Learn Concepts with Full Derivations</h4>
                  <p className="modules-redeem-sub">
                    Master step-by-step math derivations, formulas, & mental shortcuts with zero XP pressure.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="modules-redeem-btn"
                style={{ color: '#38BDF8', borderColor: 'rgba(56, 189, 248, 0.3)', background: 'rgba(56, 189, 248, 0.12)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveView('study');
                }}
              >
                <span>Read Book</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* REDEEM XP VAULT BANNER (Under Training Modules & Numerical Velocity) */}
            <div
              className="modules-redeem-banner"
              onClick={() => setActiveView('redeem')}
              role="button"
              tabIndex={0}
            >
              <div className="modules-redeem-left">
                <div className="modules-redeem-icon">
                  <Gift size={22} className="text-lime" />
                </div>
                <div>
                  <div className="modules-redeem-tag">
                    <Sparkles size={11} className="text-lime" />
                    <span>XP REWARDS STORE</span>
                  </div>
                  <h4 className="modules-redeem-title">Redeem Tech, Hardware & Mentorship</h4>
                  <p className="modules-redeem-sub">
                    You have <strong className="text-lime">{xp} XP</strong> available. Claim M3 MacBooks, Sony Headphones, and 1-on-1 FAANG sessions.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="modules-redeem-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveView('redeem');
                }}
              >
                <span>View Store</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Player Intel, Ratings & Graphs (~38% on Desktop)
              ======================================================== */}
          <div className="web-grid-right">
            {/* Level & League Banner Widget */}
            <div className="desktop-rank-widget">
              <div className="rank-widget-top">
                <div className="rank-badge-wrap">
                  <div className="rank-badge-icon">
                    <Shield size={20} className="text-lime" />
                  </div>
                  <div>
                    <span className="rank-level-label">Level {level} Thinker</span>
                    <h3 className="rank-title">{standing.division}</h3>
                  </div>
                </div>
                <span className="rank-xp-text">
                  <strong className="text-lime">{xp}</strong> / {nextLevelXP} XP
                </span>
              </div>

              <div className="progress-bar progress-bar--slim">
                <div
                  className="progress-fill fill-lime"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>

              <div className="rank-widget-footer">
                <span>Earn {Math.max(0, nextLevelXP - xp)} XP to level up</span>
                <button
                  type="button"
                  className="rank-badges-btn"
                  onClick={() => setBadgesModalOpen(true)}
                >
                  <Award size={13} /> Badges
                </button>
              </div>
            </div>

            {/* RATINGS 4-CARD GRID (From Reference 2 & 3) */}
            <section className="matiks-section" aria-label="Ratings">
              <div className="section-title-wrap flex-between">
                <span className="matiks-section-eyebrow">RATINGS</span>
                <button
                  type="button"
                  className="view-ratings-link"
                  onClick={() => setProfileDrawerOpen(true)}
                >
                  <span>My Profile</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>

              <div className="ratings-grid-4">
                {CATEGORIES.slice(0, 4).map((cat) => {
                  const Icon = cat.icon;
                  const dynamicRating = user?.ratings?.[cat.id] ?? cat.rating ?? 1200;
                  const dynamicTrend = user?.ratingTrends?.[cat.id] ?? cat.trend ?? '+0 —';
                  return (
                    <div
                      key={cat.id}
                      className={`rating-card ${activeRatingCatId === cat.id ? 'rating-card--active' : ''}`}
                      onClick={() => {
                        setActiveRatingCatId(cat.id);
                        setSelectedCatId(cat.id);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="rating-card-top">
                        <span className="rating-val">{dynamicRating}</span>
                        <Icon size={16} className="rating-icon" style={{ color: cat.color }} />
                      </div>
                      <span className="rating-cat-name">{cat.name}</span>
                      <span className={`rating-trend-tag ${dynamicTrend.includes('↓') ? 'rating-trend-tag--down' : ''}`}>
                        {dynamicTrend}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* STATS OVERVIEW 2x2 GRID (From Reference 2 & 3) */}
            <section className="matiks-section" aria-label="Stats Overview">
              <div className="section-title-wrap">
                <span className="matiks-section-eyebrow">STATS OVERVIEW</span>
              </div>

              <div className="stats-overview-grid">
                {/* Stat 1: Max Streak */}
                <div className="stat-overview-box">
                  <div className="stat-overview-left">
                    <span className="stat-big-num">{streak}</span>
                    <span className="stat-sub-label">ACTIVE STREAK</span>
                  </div>
                  <div className="stat-icon-badge badge-orange">
                    <Flame size={18} />
                  </div>
                </div>

                {/* Stat 2: Total XP */}
                <div className="stat-overview-box">
                  <div className="stat-overview-left">
                    <span className="stat-big-num">{xp}</span>
                    <span className="stat-sub-label">TOTAL XP</span>
                  </div>
                  <div className="stat-icon-badge badge-cyan">
                    <Sparkles size={18} />
                  </div>
                </div>

                {/* Stat 3: League */}
                <div className="stat-overview-box">
                  <div className="stat-overview-left">
                    <span className="stat-big-num text-lime">LVL {level}</span>
                    <span className="stat-sub-label">{standing.tier.toUpperCase()}</span>
                  </div>
                  <div className="stat-icon-badge badge-lime">
                    <Shield size={18} />
                  </div>
                </div>

                {/* Stat 4: Total Sessions */}
                <div className="stat-overview-box">
                  <div className="stat-overview-left">
                    <span className="stat-big-num">{user?.sessionsCount ?? 0}</span>
                    <span className="stat-sub-label">DRILLS PLAYED</span>
                  </div>
                  <div className="stat-icon-badge badge-purple">
                    <Gamepad2 size={18} />
                  </div>
                </div>
              </div>
            </section>

            {/* PERFORMANCE SPARKLINE CHART (From Reference 3) */}
            <section className="matiks-section" aria-label="Performance Chart">
              <div className="performance-chart-card">
                <div className="chart-header">
                  <div className="chart-legend">
                    <span className="chart-dot-lime" />
                    <span className="chart-legend-text">
                      SPEED & ACCURACY VELOCITY
                    </span>
                  </div>
                  <span className="static-chart-tag">STATIC BENCHMARK</span>
                </div>

                {/* SVG Sparkline Graph */}
                <div className="chart-graph-wrapper">
                  <svg
                    viewBox="0 0 400 120"
                    className="chart-svg"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="limeFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C6FF45" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#C6FF45" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <line x1="0" y1="20" x2="400" y2="20" stroke="#251E33" strokeDasharray="3 3" />
                    <line x1="0" y1="60" x2="400" y2="60" stroke="#251E33" strokeDasharray="3 3" />
                    <line x1="0" y1="100" x2="400" y2="100" stroke="#251E33" strokeDasharray="3 3" />

                    <path
                      d="M 0,110 Q 70,105 120,65 T 220,50 T 320,30 T 400,22 L 400,120 L 0,120 Z"
                      fill="url(#limeFill)"
                    />

                    <path
                      d="M 0,110 Q 70,105 120,65 T 220,50 T 320,30 T 400,22"
                      fill="none"
                      stroke="#C6FF45"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    <circle cx="400" cy="22" r="5" fill="#C6FF45" />
                    <circle cx="400" cy="22" r="9" fill="none" stroke="#C6FF45" strokeOpacity="0.4" />
                  </svg>
                </div>

                <div className="chart-footer-meta">
                  <span className="chart-score-tag">Peak Rating: 2,916 (+18% this week)</span>
                  <span className="chart-status-tag">Calibrated Adaptive</span>
                </div>
              </div>
            </section>

            {/* REDEEM XP REWARDS STORE SHOWCASE CARD (Below Velocity Chart) */}
            <section className="matiks-section" aria-label="Redeem XP Store">
              <div
                className="redeem-xp-card"
                onClick={() => setActiveView('redeem')}
                role="button"
                tabIndex={0}
              >
                <div className="redeem-card-glow" />
                <div className="redeem-card-header">
                  <div className="redeem-badge">
                    <Gift size={13} className="text-lime" />
                    <span>REWARDS VAULT</span>
                  </div>
                  <span className="redeem-count-pill">10 High-XP Trophies</span>
                </div>

                <div className="redeem-card-body">
                  <h3 className="redeem-main-title">
                    Redeem Real Tech & Career Gear
                  </h3>
                  <p className="redeem-main-sub">
                    Exchange your earned XP for M3 MacBooks, Sony WH-1000XM5s, 1-on-1 FAANG Mentorship, and exclusive merchandise.
                  </p>

                  {/* High XP Items Preview Badges */}
                  <div className="redeem-preview-chips">
                    <div className="redeem-chip">
                      <span className="redeem-chip-emoji">💻</span>
                      <span>M3 MacBook (50K XP)</span>
                    </div>
                    <div className="redeem-chip">
                      <span className="redeem-chip-emoji">🎧</span>
                      <span>Sony XM5 (16K XP)</span>
                    </div>
                    <div className="redeem-chip">
                      <span className="redeem-chip-emoji">🎓</span>
                      <span>FAANG 1-on-1 (4K XP)</span>
                    </div>
                    <div className="redeem-chip">
                      <span className="redeem-chip-emoji">🧥</span>
                      <span>Cyber Hoodie (4.5K XP)</span>
                    </div>
                  </div>
                </div>

                <div className="redeem-card-footer">
                  <div className="redeem-user-progress">
                    <span className="redeem-progress-lbl">YOUR XP BALANCE</span>
                    <span className="redeem-progress-val text-lime">
                      <Zap size={14} /> {xp} XP
                    </span>
                  </div>
                  <button
                    type="button"
                    className="redeem-open-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveView('redeem');
                    }}
                  >
                    <span>Open Rewards Store</span>
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* ============================================================
          FOOTER (Rank Calculation Guide & Platform Links)
          ============================================================ */}
      <Footer
        onOpenRankInfo={openRankInfo}
        onOpenStudyBook={() => setActiveView('study')}
        onOpenRedeemStore={() => setActiveView('redeem')}
        onOpenBadges={() => setBadgesModalOpen(true)}
        onOpenShortcuts={() => setShortcutsModalOpen(true)}
      />

      {/* ============================================================
          4. PROFILE DRAWER (Contains Logout button and settings)
          ============================================================ */}
      <ProfileDrawer
        isOpen={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        onOpenBadges={() => setBadgesModalOpen(true)}
        onOpenShortcuts={() => setShortcutsModalOpen(true)}
        onOpenStudyBook={() => {
          setProfileDrawerOpen(false);
          setActiveView('study');
        }}
        onOpenRedeemStore={() => {
          setProfileDrawerOpen(false);
          setActiveView('redeem');
        }}
      />

      {/* ============================================================
          5. PRACTICE SETUP MODAL (5 Fixed Qs & Adaptive Tier)
          ============================================================ */}
      <PracticeModal
        isOpen={practiceModalOpen}
        onClose={() => setPracticeModalOpen(false)}
        initialCategory={selectedCatId}
        isDailyChallenge={isDailyChallengeMode}
        onLaunchPractice={handleLaunchPractice}
      />

      {/* ============================================================
          6. BADGES MODAL
          ============================================================ */}
      <BadgesModal
        isOpen={badgesModalOpen}
        onClose={() => setBadgesModalOpen(false)}
      />

      {/* ============================================================
          7. KEYBOARD SHORTCUTS MODAL
          ============================================================ */}
      <ShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />

      {/* ============================================================
          8. RANK & SCORING INFO MODAL
          ============================================================ */}
      <RankInfoModal
        isOpen={rankInfoModalOpen}
        onClose={() => setRankInfoModalOpen(false)}
        initialTab={rankInfoInitialTab}
      />
    </div>
  );
}
