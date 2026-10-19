import { useState, useEffect, useRef } from 'react';
import {
  X, CheckCircle2, XCircle, ChevronRight, Home, Clock, Share2, Sparkles,
  FastForward, Puzzle, Crown, Hash
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './QuizScreen.css';

/* ─── Confetti Particle Canvas ──────────────────────────────── */
function ConfettiCanvas({ color = '#C6FF45' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const dpr = window.devicePixelRatio || 1;
    const width = (canvas.width = window.innerWidth * dpr);
    const height = (canvas.height = window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const colors = [color, '#FFD700', '#C6FF45', '#38BDF8', '#A855F7', '#FF6B6B', '#F59E0B', '#34D399', '#FFFFFF'];

    // Spawn 110 slow, gracefully floating celebration particles
    const particles = Array.from({ length: 110 }, () => {
      const x = (Math.random() * 0.92 + 0.04) * width;
      // Stagger vertical entry over a wide height so particles drift in continuously
      const y = (Math.random() * -0.7 - 0.05) * height;
      const size = (Math.random() * 8 + 6) * dpr;
      return {
        x,
        y,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 2.2 * dpr, // gentle horizontal drift
        vy: (Math.random() * 1.2 + 0.9) * dpr, // slow, floaty fall speed
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 3.5, // gentle spin
        oscillationSpeed: Math.random() * 0.03 + 0.015,
        oscillationAngle: Math.random() * Math.PI * 2,
        isCircle: Math.random() > 0.65,
        opacity: 1,
      };
    });

    const startTime = Date.now();
    const duration = 6500; // 6.5s lush, graceful celebration

    const render = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      const progress = elapsed / duration;
      // Smooth fade out in the final 30% of time
      const fadeProgress = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Slow air-floating motion with side-to-side sway
        p.x += Math.sin(p.oscillationAngle) * 1.6 * dpr + p.vx * 0.96;
        p.y += p.vy;
        // Low terminal velocity so it never drops fast
        p.vy = Math.min(2.4 * dpr, p.vy + 0.015 * dpr);
        p.rotation += p.rotationSpeed;
        p.oscillationAngle += p.oscillationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, fadeProgress * p.opacity);
        ctx.fillStyle = p.color;

        if (p.isCircle) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Flatten as it rotates for 3D flip effect
          const scaleY = Math.cos(p.oscillationAngle * 2);
          ctx.fillRect(-p.size / 2, (-p.size * scaleY) / 2, p.size, p.size * Math.abs(scaleY));
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [color]);

  return <canvas ref={canvasRef} className="qr-confetti-canvas" />;
}

/* ─── Static Question Bank ─────────────────────────────────── */
const QUESTIONS = {
  math: [
    { q: 'A car travels 120 km in 2 hours. What is its speed?', options: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'], answer: 1, explanation: '120 km ÷ 2 h = 60 km/h' },
    { q: 'What is 15% of 240?', options: ['32', '36', '40', '48'], answer: 1, explanation: '15/100 × 240 = 36' },
    { q: '5 workers finish a job in 8 days. How long will 10 workers take?', options: ['6 days', '4 days', '3 days', '5 days'], answer: 1, explanation: 'Total work = 5×8 = 40 man-days. 10 workers: 40÷10 = 4 days' },
    { q: 'A 200 m train moves at 54 km/h. Time to cross a pole?', options: ['10 sec', '12 sec', '13.3 sec', '15 sec'], answer: 2, explanation: '54 km/h = 15 m/s. Time = 200÷15 ≈ 13.3 sec' },
    { q: 'Goods marked 25% above cost, sold at 10% discount. Profit %?', options: ['10%', '12.5%', '15%', '20%'], answer: 1, explanation: 'SP = 1.25 × 0.9 × CP = 1.125 CP → 12.5% profit' },
  ],
  puzzle: [
    { q: 'What comes next: 2, 4, 8, 16, __ ?', options: ['24', '28', '32', '36'], answer: 2, explanation: 'Each term doubles: 16 × 2 = 32' },
    { q: 'Find the missing: 1, 4, 9, 16, 25, __ ?', options: ['30', '35', '36', '40'], answer: 2, explanation: 'Perfect squares: 6² = 36' },
    { q: 'Which fills the blank? 3, 6, 11, 18, 27, __ ?', options: ['36', '38', '40', '35'], answer: 1, explanation: 'Differences +3,+5,+7,+9,+11 → 27+11 = 38' },
    { q: 'Letter series: A, C, F, J, O, __ ?', options: ['T', 'U', 'V', 'W'], answer: 1, explanation: 'Gaps +2,+3,+4,+5,+6 → O(15)+6 = U(21)' },
    { q: 'Odd one out: 4, 8, 12, 15, 16', options: ['4', '8', '12', '15'], answer: 3, explanation: '15 is not a multiple of 4; all others (4,8,12,16) are' },
  ],
  logic: [
    { q: 'All cats are animals. Some animals are pets.\n"Some cats are pets" is:', options: ['Definitely True', 'Definitely False', 'Cannot be determined', 'Always False'], answer: 2, explanation: 'We can\'t know if pets include cats — cannot conclude' },
    { q: 'If A > B and B > C, then A __ C?', options: ['A < C', 'A = C', 'A > C', 'Cannot say'], answer: 2, explanation: 'Transitive property: A > B > C → A > C' },
    { q: 'Ram > Shyam in height. Mohan < Shyam. Who is tallest?', options: ['Shyam', 'Mohan', 'Ram', 'Cannot say'], answer: 2, explanation: 'Ram > Shyam > Mohan → Ram is tallest' },
    { q: 'All roses are flowers. Some flowers are red.\n"Some roses are red" is:', options: ['True', 'Maybe True', 'False', 'Cannot say'], answer: 3, explanation: 'Red flowers may not include roses — cannot conclude' },
    { q: 'P is father of Q. Q is sister of R. P is R\'s __?', options: ['Uncle', 'Brother', 'Father', 'Grandfather'], answer: 2, explanation: 'P → Q (sister of R) → P is also R\'s father' },
  ],
  memory: [
    { q: 'Next prime number after 13?', options: ['15', '16', '17', '19'], answer: 2, explanation: '14=2×7, 15=3×5, 16=2⁴ — 17 is prime' },
    { q: 'Square root of 2025?', options: ['40', '42', '45', '50'], answer: 2, explanation: '45 × 45 = 2025' },
    { q: 'If 3x + 7 = 22, what is x?', options: ['4', '5', '6', '3'], answer: 1, explanation: '3x = 15 → x = 5' },
    { q: 'LCM of 4, 6 and 8?', options: ['16', '24', '48', '12'], answer: 1, explanation: 'LCM(4,6,8) = 24' },
    { q: '256 × 0.25 = ?', options: ['54', '60', '64', '68'], answer: 2, explanation: '256 ÷ 4 = 64' },
  ],
};
// Aliases
QUESTIONS.quantitative = QUESTIONS.math;
QUESTIONS.pattern      = QUESTIONS.puzzle;
QUESTIONS.logical      = QUESTIONS.logic;
QUESTIONS.numerical    = QUESTIONS.memory;

const CAT_META = {
  math:        { label: 'Math Sprint',       color: '#FF9500', Icon: FastForward },
  quantitative:{ label: 'Math Sprint',       color: '#FF9500', Icon: FastForward },
  puzzle:      { label: 'Pattern Puzzle',    color: '#A855F7', Icon: Puzzle },
  pattern:     { label: 'Pattern Puzzle',    color: '#A855F7', Icon: Puzzle },
  logic:       { label: 'Logical Reasoning', color: '#C6FF45', Icon: Crown },
  logical:     { label: 'Logical Reasoning', color: '#C6FF45', Icon: Crown },
  memory:      { label: 'Numerical Agility', color: '#38BDF8', Icon: Hash },
  numerical:   { label: 'Numerical Agility', color: '#38BDF8', Icon: Hash },
};

const LABELS = ['A', 'B', 'C', 'D'];
const TIMED_SECS = 30;

/* ─── Main Quiz Screen ──────────────────────────────────────── */
export default function QuizScreen({ config = {}, onComplete }) {
  const { addXP, recordQuizResult, theme } = useAuth();
  const category = (config?.category || 'math').toLowerCase();
  const timed = config?.timed ?? true;
  const isDailyChallenge = config?.isDailyChallenge ?? false;

  const rawMeta = CAT_META[category] || CAT_META.math || { label: 'Math Sprint', color: '#FF9500', Icon: FastForward };
  const activeColor = (theme === 'light' && (rawMeta.color === '#C6FF45' || category === 'logic')) ? '#15803D' : rawMeta.color;
  const meta = { ...rawMeta, color: activeColor };
  const Icon = meta.Icon || meta.icon || FastForward;

  const questions = (QUESTIONS[category] && QUESTIONS[category].length > 0)
    ? QUESTIONS[category]
    : (QUESTIONS.math || []);
  const xpAwardedRef = useRef(false);

  const [qIndex,    setQIndex]    = useState(0);
  const [selected,  setSelected]  = useState(null);
  const [answers,   setAnswers]   = useState([]);
  const [timer,     setTimer]     = useState(TIMED_SECS);
  const [phase,     setPhase]     = useState('quiz'); // 'quiz' | 'results'
  const [animKey,   setAnimKey]   = useState(0); // re-triggers slide-in

  const fallbackQ = {
    q: 'A car travels 120 km in 2 hours. What is its speed?',
    options: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'],
    answer: 1,
    explanation: '120 km ÷ 2 h = 60 km/h'
  };
  const currentQ = questions[qIndex] || questions[0] || fallbackQ;
  const isAnswered = selected !== null;
  const isLastQ = qIndex >= (questions.length || 1) - 1;

  const handleAnswer = (idx) => {
    if (isAnswered) return;
    setSelected(idx);
    const isCorrect = idx === currentQ.answer;
    setAnswers(prev => [...prev, { selected: idx, correct: currentQ.answer, isCorrect }]);
  };

  /* Timer countdown */
  useEffect(() => {
    if (!timed || isAnswered || phase !== 'quiz') return;
    if (timer <= 0) {
      handleAnswer(-1);
      return;
    }
    const t = setTimeout(() => setTimer(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, timed, isAnswered, phase]);

  /* Reset per question */
  useEffect(() => {
    setTimer(TIMED_SECS);
    setSelected(null);
    setAnimKey(k => k + 1);
  }, [qIndex]);

  const handleNext = () => {
    if (isLastQ) {
      if (!xpAwardedRef.current) {
        xpAwardedRef.current = true;
        // Award XP dynamically based on correct questions
        const correctCount = answers.filter(a => a.isCorrect).length;
        const totalQs = Math.max(1, questions.length || 5);
        const baseXP = isDailyChallenge ? 50 : 35;
        const xpEarned = Math.round((correctCount / totalQs) * baseXP);
        if (xpEarned > 0) {
          addXP(xpEarned);
        }
        // Dynamically update category rating in profile and Supabase DB
        recordQuizResult?.({
          category,
          score: correctCount,
          total: totalQs,
          xpEarned,
        });
      }
      setPhase('results');
    } else {
      setQIndex(i => i + 1);
    }
  };

  /* Keyboard navigation inside Quiz */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is in an input or modifier keys are pressed
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea') return;

      // Escape: quit quiz
      if (e.key === 'Escape') {
        e.preventDefault();
        onComplete?.();
        return;
      }

      // If in results phase: Enter, Space, or Escape returns to dashboard
      if (phase === 'results') {
        if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
          e.preventDefault();
          onComplete?.();
        }
        return;
      }

      // If in active quiz phase:
      if (!isAnswered) {
        // Select options via 1-4 or A-D
        let optIdx = -1;
        if (e.key === '1' || e.key === 'a' || e.key === 'A') optIdx = 0;
        else if (e.key === '2' || e.key === 'b' || e.key === 'B') optIdx = 1;
        else if (e.key === '3' || e.key === 'c' || e.key === 'C') optIdx = 2;
        else if (e.key === '4' || e.key === 'd' || e.key === 'D') optIdx = 3;

        if (optIdx >= 0 && optIdx < (currentQ.options?.length || 0)) {
          e.preventDefault();
          handleAnswer(optIdx);
        }
      } else {
        // If question already answered, Enter or Space advances to next question / results
        if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, isAnswered, currentQ, onComplete, handleNext, handleAnswer]);

  const timerPct   = (timer / TIMED_SECS) * 100;
  const timerColor = timer > 15 ? meta.color : timer > 7 ? '#F59E0B' : '#EF4444';

  if (phase === 'results') {
    const score    = answers.filter(a => a.isCorrect).length;
    const accuracy = Math.round((score / questions.length) * 100);
    const baseXP   = isDailyChallenge ? 50 : 35;
    const xpEarned = Math.round((score / questions.length) * baseXP);
    return (
      <ResultsScreen
        score={score} total={questions.length} accuracy={accuracy}
        xpEarned={xpEarned}
        baseXP={baseXP}
        meta={meta} answers={answers} questions={questions}
        isDailyChallenge={isDailyChallenge}
        onBack={onComplete}
      />
    );
  }

  return (
    <div className="quiz-screen" style={{ '--cat': meta.color }}>
      {/* ── Header ── */}
      <header className="qs-header">
        <button className="qs-exit-btn" onClick={onComplete} aria-label="Exit">
          <X size={18} />
        </button>

        <div className="qs-cat-pill" style={{ color: meta.color, borderColor: `${meta.color}40`, background: `${meta.color}12` }}>
          <Icon size={13} />
          <span>{meta.label}</span>
        </div>

        <div className="qs-right-header">
          {timed && (
            <span className="qs-timer" style={{ color: timerColor }}>
              <Clock size={13} /> {timer}s
            </span>
          )}
          <span className="qs-count">{qIndex + 1}<span className="qs-count-total">/{questions.length}</span></span>
        </div>
      </header>

      {/* ── Timer bar ── */}
      {timed && (
        <div className="qs-timer-track">
          <div className="qs-timer-fill" style={{ width: `${timerPct}%`, background: timerColor }} />
        </div>
      )}

      {/* ── Progress dots ── */}
      <div className="qs-dots">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`qs-dot ${i < qIndex ? 'qs-dot--done' : i === qIndex ? 'qs-dot--active' : ''}`}
            style={i === qIndex ? { background: meta.color, boxShadow: `0 0 8px ${meta.color}` } : {}}
          />
        ))}
      </div>

      {/* ── Question ── */}
      <main className="qs-main" key={animKey}>
        <p className="qs-question">{currentQ.q}</p>

        <div className="qs-options">
          {currentQ.options.map((opt, i) => {
            const isCorrectOpt = i === currentQ.answer;
            const isSelectedOpt = i === selected;
            let variant = '';
            if (isAnswered) {
              if (isCorrectOpt)                         variant = 'correct';
              else if (isSelectedOpt && !isCorrectOpt) variant = 'wrong';
              else                                      variant = 'muted';
            }
            return (
              <button
                key={i}
                type="button"
                className={`qs-option ${isSelectedOpt ? 'qs-option--clicked' : ''} ${variant ? `qs-option--${variant}` : ''}`}
                onClick={() => handleAnswer(i)}
                disabled={isAnswered}
              >
                <span className="qs-opt-label">{LABELS[i]}</span>
                <span className="qs-opt-text">{opt}</span>
                {isAnswered && isCorrectOpt  && <CheckCircle2 size={17} className="qs-opt-icon" />}
                {isAnswered && isSelectedOpt && !isCorrectOpt && <XCircle size={17} className="qs-opt-icon" />}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {isAnswered && (
          <div className={`qs-explanation ${selected === currentQ.answer ? 'qs-exp--correct' : 'qs-exp--wrong'}`}>
            <span className="qs-exp-badge">{selected === currentQ.answer ? '✓ Correct' : '✗ Incorrect'}</span>
            <p className="qs-exp-text">{currentQ.explanation}</p>
          </div>
        )}
      </main>

      {/* ── Next button ── */}
      {isAnswered && (
        <footer className="qs-footer">
          <button className="qs-next-btn" onClick={handleNext} style={{ background: meta.color }}>
            <span>{isLastQ ? 'See Results' : 'Next'}</span>
            <ChevronRight size={18} />
          </button>
        </footer>
      )}
    </div>
  );
}

/* ─── Results Screen ────────────────────────────────────────── */
function ResultsScreen({ score, total, accuracy, xpEarned, baseXP, meta, answers, questions, isDailyChallenge, onBack }) {
  const [copied, setCopied] = useState(false);

  const getRating = () => {
    if (accuracy === 100) return { label: 'Flawless Victory! 🏆', grade: 'S' };
    if (accuracy >= 80)   return { label: 'Outstanding! ⭐', grade: 'A' };
    if (accuracy >= 60)   return { label: 'Well Done! 👍', grade: 'B' };
    return                       { label: 'Keep Pushing! 💪', grade: 'C' };
  };

  const { label, grade } = getRating();

  const handleShare = async () => {
    const text = `🎯 I scored ${score}/${total} (${accuracy}% accuracy) in ${meta.label} on MyAptitude!\n+${xpEarned} XP earned 🔥\nChallenge me at MyAptitude!`;
    try {
      if (navigator.share) await navigator.share({ title: 'MyAptitude Score', text });
      else await navigator.clipboard.writeText(text);
    } catch (_) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="quiz-screen quiz-results" style={{ '--cat': meta.color }}>
      {/* ── Confetti celebration on results ── */}
      <ConfettiCanvas color={meta.color} />

      <div className="qr-wrap">
        {/* Grade ring */}
        <div className="qr-grade-ring" style={{ borderColor: meta.color, boxShadow: `0 0 45px ${meta.color}55` }}>
          <span className="qr-grade">{grade}</span>
        </div>

        <h2 className="qr-rating">{label}</h2>

        {/* Stats row with proportional XP percentage */}
        <div className="qr-stats">
          <div className="qr-stat">
            <span className="qr-stat-val" style={{ color: meta.color }}>{score}/{total}</span>
            <span className="qr-stat-lbl">Score</span>
          </div>
          <div className="qr-stat-sep" />
          <div className="qr-stat">
            <span className="qr-stat-val" style={{ color: meta.color }}>{accuracy}%</span>
            <span className="qr-stat-lbl">Accuracy</span>
          </div>
          <div className="qr-stat-sep" />
          <div className="qr-stat">
            <span className="qr-stat-val qr-xp">+{xpEarned}</span>
            <span className="qr-stat-lbl">XP Earned</span>
            <span className="qr-stat-sub">({accuracy}% of {baseXP})</span>
          </div>
        </div>

        {/* Question breakdown */}
        <div className="qr-breakdown">
          <span className="qr-breakdown-title">Question Breakdown</span>
          <div className="qr-breakdown-row">
            {answers.map((a, i) => (
              <div key={i} className={`qr-q-chip ${a.isCorrect ? 'qr-q-chip--ok' : 'qr-q-chip--fail'}`}>
                <span>Q{i + 1}</span>
                {a.isCorrect ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
              </div>
            ))}
          </div>
        </div>

        {/* Actions - No Retry button, focused & balanced */}
        <div className="qr-actions">
          <button className="qr-share-btn" onClick={handleShare}>
            <Share2 size={16} />
            <span>{copied ? 'Copied to Clipboard!' : 'Share Score'}</span>
          </button>

          <button className="qr-home-btn" style={{ background: meta.color }} onClick={onBack}>
            <Home size={16} />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
