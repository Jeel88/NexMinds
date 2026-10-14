import { useState } from 'react';
import { 
  ArrowLeft, BookOpen, ChevronRight, ChevronLeft, Bookmark, 
  Lightbulb, CheckCircle2, AlertTriangle, Zap, Check, ArrowRight,
  HelpCircle, Compass, Sparkles, Share2
} from 'lucide-react';
import './StudyBook.css';

/* ─── Chapter / Topic Data with Deep Step-by-Step Derivations ── */
const CHAPTERS = [
  {
    id: 'math',
    title: 'Quantitative & Speed Math',
    emoji: '📐',
    color: '#FF9500',
    topics: [
      {
        id: 'tsd-1',
        topic: 'Time, Speed & Distance',
        title: 'Basic Uniform Velocity Derivation',
        q: 'A car travels a distance of 120 km in 2 hours. What is its average speed in km/h?',
        options: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'],
        answer: 1, // '60 km/h'
        formula: 'Speed (v) = Distance (d) ÷ Time (t)',
        steps: [
          {
            step: 'Step 1: Identify Given Variables',
            detail: 'Distance (d) = 120 km, Time taken (t) = 2 hours. Both units are standard (km and hours), so no unit conversion is needed.',
          },
          {
            step: 'Step 2: Apply the Uniform Speed Equation',
            detail: 'v = 120 km ÷ 2 hours = 60 km/h.',
          },
          {
            step: 'Step 3: Verification & Unit Consistency',
            detail: 'To verify: In 1 hour the car covers 60 km. In 2 hours, it covers 60 × 2 = 120 km. Result is confirmed.',
          },
        ],
        shortcut: 'Whenever distance and time are multiples of 10 or small integers, divide directly in your head: 12 ÷ 2 = 6, append zero → 60 km/h.',
        trap: 'Always check units! If distance were in meters and time in minutes, converting to km/h would require multiplying m/s by 18/5.',
      },
      {
        id: 'percent-1',
        topic: 'Percentage Applications',
        title: 'Fractional Percentage Calculation',
        q: 'What is 15% of 240?',
        options: ['32', '36', '40', '48'],
        answer: 1, // '36'
        formula: 'Percentage = (P ÷ 100) × Total Value',
        steps: [
          {
            step: 'Step 1: Decompose the Percentage',
            detail: 'Break 15% into friendly components: 15% = 10% + 5%.',
          },
          {
            step: 'Step 2: Calculate Each Component Mentally',
            detail: '10% of 240 = 24. Since 5% is exactly half of 10%, 5% of 240 = 24 ÷ 2 = 12.',
          },
          {
            step: 'Step 3: Sum the Components',
            detail: '15% = 10% + 5% = 24 + 12 = 36.',
          },
        ],
        shortcut: '10% rule: Shift decimal left by 1 digit (240 → 24). Half of that is 12. 24 + 12 = 36. Solved in 3 seconds without pen and paper!',
        trap: 'Do not multiply 15 × 240 and divide by 100 on paper unless necessary; mental decomposition is 5x faster and avoids arithmetic slips.',
      },
      {
        id: 'work-1',
        topic: 'Time & Work Kinetics',
        title: 'Worker Efficiency & Man-Day Inversion',
        q: '5 workers can finish a construction job in 8 days. How many days will 10 workers take to complete the exact same job?',
        options: ['6 days', '4 days', '3 days', '5 days'],
        answer: 1, // '4 days'
        formula: 'Total Work = Number of Workers × Days (W = M × D)',
        steps: [
          {
            step: 'Step 1: Compute Total Work Units (Man-Days)',
            detail: 'Total Work = 5 workers × 8 days = 40 man-days of required effort.',
          },
          {
            step: 'Step 2: Invert for the New Workforce Size',
            detail: 'With 10 workers available, Days = Total Work ÷ Workers = 40 ÷ 10 = 4 days.',
          },
          {
            step: 'Step 3: Ratio Sanity Check',
            detail: 'The number of workers doubled (5 → 10, factor of 2×). Because workforce and time are inversely proportional, time must halve (8 ÷ 2 = 4 days).',
          },
        ],
        shortcut: 'Inverse proportionality principle: Double the workers = half the time (8 ÷ 2 = 4 days). Direct mental deduction.',
        trap: 'Avoid setting up a direct proportion (5/8 = 10/x), which would falsely imply 16 days. More workers must always equal LESS time.',
      },
      {
        id: 'train-1',
        topic: 'Relative Velocity & Motion',
        title: 'Stationary Pole Crossing Time',
        q: 'A 200-meter-long express train is moving at 54 km/h. How many seconds will it take to completely pass a signal pole?',
        options: ['10 sec', '12 sec', '13.3 sec', '15 sec'],
        answer: 2, // '13.3 sec'
        formula: 'Time = Distance ÷ Speed; Convert km/h to m/s via factor (5 ÷ 18)',
        steps: [
          {
            step: 'Step 1: Convert Velocity to SI Units (m/s)',
            detail: '54 km/h = 54 × (5 ÷ 18) = 3 × 5 = 15 m/s.',
          },
          {
            step: 'Step 2: Determine Effective Distance',
            detail: 'A signal pole has negligible width. Thus, the train only needs to travel its own length: Distance = 200 meters.',
          },
          {
            step: 'Step 3: Solve for Elapsed Time',
            detail: 'Time = 200 m ÷ 15 m/s = 40 ÷ 3 = 13.33... seconds.',
          },
        ],
        shortcut: 'Memorize the 18 km/h table: 18 km/h = 5 m/s, 36 km/h = 10 m/s, 54 km/h = 15 m/s, 72 km/h = 20 m/s. 54 is 3×18 → 15 m/s immediately.',
        trap: 'Do not forget to convert km/h to m/s. Dividing 200 m directly by 54 yields 3.7, which is completely incorrect.',
      },
      {
        id: 'profit-1',
        topic: 'Profit, Loss & Markup',
        title: 'Effective Percentage with Trade Discount',
        q: 'A merchant marks goods 25% above cost price, but offers a 10% discount on the marked price. What is the net profit percentage?',
        options: ['10%', '12.5%', '15%', '20%'],
        answer: 1, // '12.5%'
        formula: 'Selling Price (SP) = CP × (1 + Markup%) × (1 - Discount%)',
        steps: [
          {
            step: 'Step 1: Normalize Cost Price to 100',
            detail: 'Assume Cost Price (CP) = $100 for effortless percentage tracking.',
          },
          {
            step: 'Step 2: Compute Marked Price (MP)',
            detail: '25% markup on $100 gives Marked Price = 100 + 25 = $125.',
          },
          {
            step: 'Step 3: Apply the 10% Customer Discount',
            detail: '10% of $125 = $12.50. Selling Price (SP) = 125 - 12.50 = $112.50.',
          },
          {
            step: 'Step 4: Determine Net Profit',
            detail: 'Profit = SP - CP = 112.50 - 100 = 12.50 on $100 basis → 12.5% net profit.',
          },
        ],
        shortcut: 'Successive percentage formula: Net % = a - b - (a × b)/100 = 25 - 10 - (250/100) = 15 - 2.5 = 12.5%. Solved in one line.',
        trap: 'Do not simply subtract 25% - 10% = 15%. The 10% discount applies to the LARGER marked base ($125), not the original $100.',
      },
    ],
  },
  {
    id: 'puzzle',
    title: 'Pattern & Sequence Logic',
    emoji: '🧩',
    color: '#A855F7',
    topics: [
      {
        id: 'seq-1',
        topic: 'Geometric Progression',
        title: 'Exponential Doubling Patterns',
        q: 'Find the next term in the sequence: 2, 4, 8, 16, __ ?',
        options: ['24', '28', '32', '36'],
        answer: 2, // '32'
        formula: 'T(n) = a × r^(n-1), where r = common ratio = 2',
        steps: [
          {
            step: 'Step 1: Examine Differences Between Adjacent Terms',
            detail: '4 - 2 = 2, 8 - 4 = 4, 16 - 8 = 8. The differences themselves are doubling.',
          },
          {
            step: 'Step 2: Check Ratio Multiplier',
            detail: '4 ÷ 2 = 2; 8 ÷ 4 = 2; 16 ÷ 8 = 2. This is a pure geometric series with ratio r = 2.',
          },
          {
            step: 'Step 3: Project the Next Term',
            detail: 'Next term = Previous term × 2 = 16 × 2 = 32.',
          },
        ],
        shortcut: 'Recognize powers of 2 immediately: 2¹=2, 2²=4, 2³=8, 2⁴=16 → 2⁵ = 32.',
        trap: 'Do not confuse geometric doubling with linear step increases like +2, +4, +6 (which would yield 22).',
      },
      {
        id: 'seq-2',
        topic: 'Quadratic Series',
        title: 'Consecutive Perfect Squares',
        q: 'Find the missing number: 1, 4, 9, 16, 25, __ ?',
        options: ['30', '35', '36', '40'],
        answer: 2, // '36'
        formula: 'T(n) = n²',
        steps: [
          {
            step: 'Step 1: Analyze Term Structures',
            detail: '1 = 1², 4 = 2², 9 = 3², 16 = 4², 25 = 5².',
          },
          {
            step: 'Step 2: Determine Missing Index',
            detail: 'The next index is n = 6. Calculating 6² = 6 × 6 = 36.',
          },
          {
            step: 'Step 3: Odd Differences Verification',
            detail: 'Notice consecutive odd differences: 4-1=3, 9-4=5, 16-9=7, 25-16=9. Next difference must be +11: 25 + 11 = 36.',
          },
        ],
        shortcut: 'Every square sequence increases by consecutive odd numbers (+3, +5, +7, +9, +11). Adding 11 to 25 immediately yields 36.',
        trap: 'Double check whether the sequence starts at 0² or 1². Here it starts at 1, so the 6th term is 6².',
      },
      {
        id: 'seq-3',
        topic: 'Second-Order Differences',
        title: 'Polynomial Series with Constant 2nd Difference',
        q: 'Which number fills the blank? 3, 6, 11, 18, 27, __ ?',
        options: ['36', '38', '40', '35'],
        answer: 1, // '38'
        formula: 'Δ₁ = consecutive odd integers (+3, +5, +7, +9, +11); Δ₂ = constant (+2)',
        steps: [
          {
            step: 'Step 1: Compute First Differences (Δ₁)',
            detail: '6 - 3 = +3; 11 - 6 = +5; 18 - 11 = +7; 27 - 18 = +9.',
          },
          {
            step: 'Step 2: Identify Difference Pattern',
            detail: 'The gaps (+3, +5, +7, +9) increment by +2 each time. The next gap must be +9 + 2 = +11.',
          },
          {
            step: 'Step 3: Add to Last Known Term',
            detail: 'Next term = 27 + 11 = 38.',
          },
        ],
        shortcut: 'Observe n² + 2 formula: 1²+2=3, 2²+2=6, 3²+2=11, 4²+2=18, 5²+2=27 → 6²+2 = 36 + 2 = 38.',
        trap: 'Be careful not to add +9 again (27 + 9 = 36), which is a common distractor trap.',
      },
    ],
  },
  {
    id: 'logic',
    title: 'Deductive & Syllogistic Logic',
    emoji: '👑',
    color: '#C6FF45',
    topics: [
      {
        id: 'syl-1',
        topic: 'Categorical Syllogisms',
        title: 'Evaluating Existential Subsets with Venn Logic',
        q: 'Premise 1: All cats are animals.\nPremise 2: Some animals are pets.\nConclusion: "Some cats are pets" is:',
        options: ['Definitely True', 'Definitely False', 'Cannot be determined', 'Always False'],
        answer: 2, // 'Cannot be determined'
        formula: 'Universal Affirmative (A) + Particular Affirmative (I) → Invalid middle term distribution',
        steps: [
          {
            step: 'Step 1: Diagram Premise 1 (Venn Sets)',
            detail: 'Circle "Cats" is fully enclosed inside the larger circle "Animals".',
          },
          {
            step: 'Step 2: Diagram Premise 2',
            detail: 'Circle "Pets" overlaps with "Animals". However, we do not know WHERE it overlaps.',
          },
          {
            step: 'Step 3: Analyze Boundary Cases',
            detail: 'Case A: The "Pets" circle overlaps "Animals" in the region containing "Cats" (True). Case B: "Pets" only overlaps "Animals" outside "Cats" (False).',
          },
          {
            step: 'Step 4: Formal Conclusion',
            detail: 'Because both outcomes are logically consistent with the premises, the statement is undetermined.',
          },
        ],
        shortcut: 'Rule of Distributed Middle: If the middle term ("Animals") is not distributed universally in at least one premise, no definite conclusion can be drawn.',
        trap: 'Do not rely on everyday real-world facts (like knowing cats are pets in real life). In formal syllogisms, evaluate ONLY the logical necessity of the text.',
      },
      {
        id: 'rel-1',
        topic: 'Relational Transitivity',
        title: 'Strict Order Inequalities',
        q: 'If A > B and B > C, what is the definite relationship between A and C?',
        options: ['A < C', 'A = C', 'A > C', 'Cannot say'],
        answer: 2, // 'A > C'
        formula: 'Transitive Axiom: (x > y ∧ y > z) ⟹ x > z',
        steps: [
          {
            step: 'Step 1: Align Inequalities in the Same Direction',
            detail: 'Both statements share the ">" relation: A > B and B > C.',
          },
          {
            step: 'Step 2: Chain the Chain of Order',
            detail: 'Combine them into a single linear spectrum: A > B > C.',
          },
          {
            step: 'Step 3: Derive Conclusion',
            detail: 'Since A is strictly greater than B, and B is strictly greater than C, A must be strictly greater than C.',
          },
        ],
        shortcut: 'Line diagram: Place A to the right of B, and B to the right of C. A is clearly farthest right → A > C.',
        trap: 'If the signs were opposing (e.g., A > B and B < C), no relationship between A and C could be determined.',
      },
    ],
  },
  {
    id: 'memory',
    title: 'Numerical Agility & Quick Tricks',
    emoji: '⚡',
    color: '#38BDF8',
    topics: [
      {
        id: 'prime-1',
        topic: 'Number Theory',
        title: 'Prime Number Identification',
        q: 'What is the smallest prime number strictly greater than 13?',
        options: ['15', '16', '17', '19'],
        answer: 2, // '17'
        formula: 'Prime Definition: An integer > 1 having exactly two distinct positive divisors: 1 and itself.',
        steps: [
          {
            step: 'Step 1: Test 14',
            detail: '14 is even (14 = 2 × 7). Not prime.',
          },
          {
            step: 'Step 2: Test 15',
            detail: '15 is divisible by 3 and 5 (3 × 5 = 15). Not prime.',
          },
          {
            step: 'Step 3: Test 16',
            detail: '16 is even (2⁴). Not prime.',
          },
          {
            step: 'Step 4: Test 17',
            detail: '17 is not divisible by 2 (odd), 3 (sum of digits 1+7=8), or 5. Since √17 < 5, no other prime tests are needed. 17 is prime.',
          },
        ],
        shortcut: 'Square root test: To test if N is prime, only test divisibility by primes ≤ √N. For 17, √17 ≈ 4.12, so only test 2 and 3. Neither divides 17 → Prime!',
        trap: 'Do not skip 17 and jump to 19. The question asks for the NEXT prime right after 13.',
      },
      {
        id: 'sqrt-1',
        topic: 'Mental Arithmetic Shortcuts',
        title: 'Ending-in-5 Square Root Extraction',
        q: 'What is the square root of 2025?',
        options: ['40', '42', '45', '50'],
        answer: 2, // '45'
        formula: 'Vedic Rule: (10a + 5)² = 100 × a(a + 1) + 25',
        steps: [
          {
            step: 'Step 1: Split the Number into Two Portions',
            detail: 'Split 2025 into Prefix (20) and Suffix (25).',
          },
          {
            step: 'Step 2: Evaluate the Suffix',
            detail: 'Since the number ends in 25, its square root must end in 5.',
          },
          {
            step: 'Step 3: Solve the Consecutive Product equation for Prefix',
            detail: 'Prefix 20 must equal a × (a + 1). We know 4 × 5 = 20, so a = 4.',
          },
          {
            step: 'Step 4: Combine the Digits',
            detail: 'The prefix digit is 4 and suffix is 5 → Answer is 45.',
          },
        ],
        shortcut: '40² = 1600, 50² = 2500. 2025 is between 1600 and 2500, ending in 5. The only possible whole number is 45. Instant solution!',
        trap: 'Remember that only numbers ending in 25 can have square roots ending in 5.',
      },
    ],
  },
];

export default function StudyBook({ onBack }) {
  const [selectedChapId, setSelectedChapId] = useState('math');
  const [conceptIdx, setConceptIdx] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  const currentChapter = CHAPTERS.find(c => c.id === selectedChapId) || CHAPTERS[0];
  const currentConcept = currentChapter.topics[conceptIdx] || currentChapter.topics[0];

  const resetSelection = () => {
    setSelectedOption(null);
    setShowSolution(false);
  };

  const handleNext = () => {
    resetSelection();
    if (conceptIdx < currentChapter.topics.length - 1) {
      setConceptIdx(i => i + 1);
    } else {
      // Loop to next chapter
      const nextChapIdx = (CHAPTERS.findIndex(c => c.id === selectedChapId) + 1) % CHAPTERS.length;
      setSelectedChapId(CHAPTERS[nextChapIdx].id);
      setConceptIdx(0);
    }
  };

  const handlePrev = () => {
    resetSelection();
    if (conceptIdx > 0) {
      setConceptIdx(i => i - 1);
    } else {
      const prevChapIdx = (CHAPTERS.findIndex(c => c.id === selectedChapId) - 1 + CHAPTERS.length) % CHAPTERS.length;
      setSelectedChapId(CHAPTERS[prevChapIdx].id);
      setConceptIdx(CHAPTERS[prevChapIdx].topics.length - 1);
    }
  };

  const handleSelectChapter = (id) => {
    resetSelection();
    setSelectedChapId(id);
    setConceptIdx(0);
  };

  const handleSelectDot = (idx) => {
    resetSelection();
    setConceptIdx(idx);
  };

  const handleShareSolution = async () => {
    const text = `📖 Aptitude Concept: ${currentConcept.topic}\n"${currentConcept.q}"\n\n💡 Solution: ${currentConcept.options[currentConcept.answer]}\nFormula: ${currentConcept.formula}\n\nStudy without pressure on MyAptitude!`;
    try {
      if (navigator.share) await navigator.share({ title: 'Aptitude Concept', text });
      else await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (_) {}
  };

  return (
    <div className="study-book-page" id="study-book-page">
      {/* ── Top Header ───────────────────────────────────────── */}
      <header className="sb-header">
        <div className="sb-header-inner matiks-web-container">
          <button type="button" className="sb-back-btn" onClick={onBack} aria-label="Back to Dashboard">
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>

          <div className="sb-header-meta">
            <div className="sb-book-icon">
              <BookOpen size={16} className="text-cyan" />
            </div>
            <div className="sb-title-box">
              <span className="sb-badge">STUDY WORKBOOK • PURE LEARNING</span>
              <span className="sb-title">Solution Handbook (Zero XP Pressure)</span>
            </div>
          </div>

          <button 
            type="button" 
            className={`sb-bookmark-btn ${bookmarked ? 'sb-bookmark-btn--saved' : ''}`}
            onClick={() => setBookmarked(b => !b)}
            title="Bookmark this derivation"
          >
            <Bookmark size={16} fill={bookmarked ? '#38BDF8' : 'none'} />
            <span>{bookmarked ? 'Bookmarked' : 'Save'}</span>
          </button>
        </div>
      </header>

      {/* ── Main Book Layout ─────────────────────────────────── */}
      <main className="sb-main matiks-web-container">
        {/* Chapter Selection Bar */}
        <nav className="sb-chapters-nav" aria-label="Chapters">
          {CHAPTERS.map((chap) => {
            const isActive = chap.id === selectedChapId;
            return (
              <button
                key={chap.id}
                type="button"
                className={`sb-chapter-pill ${isActive ? 'sb-chapter-pill--active' : ''}`}
                onClick={() => handleSelectChapter(chap.id)}
                style={{ '--chap-color': chap.color }}
              >
                <span className="sb-chap-emoji">{chap.emoji}</span>
                <span className="sb-chap-text">{chap.title}</span>
                <span className="sb-chap-count">{chap.topics.length}</span>
              </button>
            );
          })}
        </nav>

        {/* Current Concept Reader Card */}
        <article className="sb-reader-card" style={{ '--chap-color': currentChapter.color }}>
          {/* Reader Top Bar */}
          <div className="sb-reader-top">
            <div className="sb-topic-badge" style={{ color: currentChapter.color, borderColor: `${currentChapter.color}40` }}>
              <span>{currentConcept.topic}</span>
            </div>

            <div className="sb-progress-indicator">
              <span>Concept {conceptIdx + 1} of {currentChapter.topics.length}</span>
              <div className="sb-dots-row">
                {currentChapter.topics.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`sb-dot ${i === conceptIdx ? 'sb-dot--active' : ''}`}
                    onClick={() => handleSelectDot(i)}
                    aria-label={`Jump to concept ${i + 1}`}
                    style={i === conceptIdx ? { background: currentChapter.color } : {}}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Question Title & Prompt */}
          <header className="sb-question-header">
            <h1 className="sb-concept-title">{currentConcept.title}</h1>
            <div className="sb-prompt-box">
              <span className="sb-prompt-eyebrow">TRY THIS CONCEPT:</span>
              <p className="sb-prompt-text">{currentConcept.q}</p>
            </div>
          </header>

          {/* Options Display: Interactive first, reveals solution on selection */}
          <div className="sb-options-display">
            <div className="sb-options-header-row">
              <span className="sb-section-eyebrow">
                {showSolution ? 'VERIFIED ANSWER & EXPLANATION:' : 'SELECT YOUR ANSWER TO REVEAL HOW IT ARRIVED:'}
              </span>
              {!showSolution && (
                <span className="sb-select-hint">Pick an option below</span>
              )}
            </div>

            <div className="sb-options-grid">
              {currentConcept.options.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isCorrect = i === currentConcept.answer;

                let stateClass = '';
                if (showSolution) {
                  if (isCorrect) stateClass = 'sb-opt--correct';
                  else if (isSelected && !isCorrect) stateClass = 'sb-opt--wrong';
                  else stateClass = 'sb-opt--muted';
                }

                return (
                  <button
                    key={i}
                    type="button"
                    className={`sb-option-box sb-option-btn ${stateClass}`}
                    onClick={() => {
                      if (!showSolution) {
                        setSelectedOption(i);
                        setShowSolution(true);
                      }
                    }}
                  >
                    <span className="sb-opt-label">{String.fromCharCode(65 + i)}</span>
                    <span className="sb-opt-val">{opt}</span>
                    {showSolution && isCorrect && (
                      <span className="sb-correct-tag">
                        <Check size={13} /> Correct Answer
                      </span>
                    )}
                    {showSolution && isSelected && !isCorrect && (
                      <span className="sb-wrong-tag">
                        Your Choice (Incorrect)
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* If not yet revealed, offer direct reveal button */}
            {!showSolution && (
              <div className="sb-unrevealed-cta">
                <span className="sb-hint-text">💡 Tap any option to test yourself, or</span>
                <button 
                  type="button" 
                  className="sb-reveal-btn"
                  onClick={() => setShowSolution(true)}
                >
                  <Lightbulb size={14} className="text-lime" />
                  <span>Reveal Solution Directly</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>

          {/* How the Solution Arrived — ONLY SHOWN AFTER USER CHOOSES OR REVEALS */}
          {showSolution && (
            <section className="sb-solution-section">
              {/* Outcome Feedback Banner */}
              {selectedOption !== null && (
                <div className={`sb-feedback-banner ${selectedOption === currentConcept.answer ? 'sb-feedback--correct' : 'sb-feedback--wrong'}`}>
                  {selectedOption === currentConcept.answer ? (
                    <>
                      <CheckCircle2 size={20} className="text-lime" />
                      <div>
                        <strong>Spot on! You selected Option {String.fromCharCode(65 + selectedOption)} ({currentConcept.options[selectedOption]}).</strong>
                        <p>Here is the full breakdown of how this solution is derived:</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={20} className="text-orange" />
                      <div>
                        <strong>Option {String.fromCharCode(65 + selectedOption)} was incorrect.</strong>
                        <p>The correct answer is <strong>Option {String.fromCharCode(65 + currentConcept.answer)} ({currentConcept.options[currentConcept.answer]})</strong>. See the step-by-step derivation below:</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="sb-solution-header">
                <div className="sb-bulb-wrap">
                  <Lightbulb size={20} className="text-lime" />
                </div>
                <div>
                  <h2 className="sb-solution-title">How the Solution Arrived</h2>
                  <span className="sb-solution-sub">Full mathematical derivation, step-by-step proofs, and mental math shortcuts</span>
                </div>
              </div>

              {/* Formula Callout */}
              <div className="sb-formula-callout" style={{ borderColor: `${currentChapter.color}50` }}>
                <span className="sb-formula-eyebrow">GOVERNING PRINCIPLE / FORMULA</span>
                <code className="sb-formula-code">{currentConcept.formula}</code>
              </div>

              {/* Steps Walkthrough */}
              <div className="sb-steps-timeline">
                {currentConcept.steps.map((st, i) => (
                  <div key={i} className="sb-step-item">
                    <div className="sb-step-num">{i + 1}</div>
                    <div className="sb-step-content">
                      <h3 className="sb-step-heading">{st.step}</h3>
                      <p className="sb-step-detail">{st.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fast Mental Shortcut Box */}
              <div className="sb-shortcut-card">
                <div className="sb-shortcut-badge">
                  <Zap size={14} className="text-lime" />
                  <span>15-SECOND MENTAL SHORTCUT</span>
                </div>
                <p className="sb-shortcut-text">{currentConcept.shortcut}</p>
              </div>

              {/* Trap Warning Box */}
              <div className="sb-trap-card">
                <div className="sb-trap-badge">
                  <AlertTriangle size={14} className="text-orange" />
                  <span>COMMON EXAM TRAP TO AVOID</span>
                </div>
                <p className="sb-trap-text">{currentConcept.trap}</p>
              </div>
            </section>
          )}

          {/* Reader Footer Controls */}
          <footer className="sb-footer-controls">
            <button 
              type="button" 
              className="sb-nav-btn sb-prev-btn" 
              onClick={handlePrev}
            >
              <ChevronLeft size={18} />
              <span>Previous Concept</span>
            </button>

            <button 
              type="button" 
              className="sb-share-btn" 
              onClick={handleShareSolution}
            >
              <Share2 size={15} />
              <span>{copied ? 'Copied Link!' : 'Share Solution'}</span>
            </button>

            <button 
              type="button" 
              className="sb-nav-btn sb-next-btn" 
              onClick={handleNext}
              style={{ background: currentChapter.color }}
            >
              <span>Next Concept</span>
              <ChevronRight size={18} />
            </button>
          </footer>
        </article>
      </main>
    </div>
  );
}
