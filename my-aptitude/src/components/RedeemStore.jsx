import { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Gift, Zap, Sparkles, Check, Copy, Lock, 
  ChevronRight, X, CheckCircle2, AlertCircle, ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './RedeemStore.css';

/* ─── Lightweight Confetti for Store Redemption ─────────────── */
function StoreConfettiCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const dpr = window.devicePixelRatio || 1;
    const width = (canvas.width = window.innerWidth * dpr);
    const height = (canvas.height = window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const colors = ['#C6FF45', '#FFD700', '#38BDF8', '#A855F7', '#FF6B6B', '#F59E0B', '#FFFFFF'];

    const particles = Array.from({ length: 100 }, () => ({
      x: (Math.random() * 0.9 + 0.05) * width,
      y: (Math.random() * -0.6 - 0.05) * height,
      size: (Math.random() * 8 + 6) * dpr,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 2.2 * dpr,
      vy: (Math.random() * 1.2 + 0.9) * dpr,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 3.5,
      oscillationSpeed: Math.random() * 0.03 + 0.015,
      oscillationAngle: Math.random() * Math.PI * 2,
      isCircle: Math.random() > 0.6,
      opacity: 1,
    }));

    const startTime = Date.now();
    const duration = 6500;

    const render = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, width, height);
        return;
      }
      const progress = elapsed / duration;
      const fade = progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1;

      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += Math.sin(p.oscillationAngle) * 1.6 * dpr + p.vx * 0.96;
        p.y += p.vy;
        p.vy = Math.min(2.4 * dpr, p.vy + 0.015 * dpr);
        p.rotation += p.rotationSpeed;
        p.oscillationAngle += p.oscillationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, fade * p.opacity);
        ctx.fillStyle = p.color;

        if (p.isCircle) {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const scaleY = Math.cos(p.oscillationAngle * 2);
          ctx.fillRect(-p.size / 2, (-p.size * scaleY) / 2, p.size, p.size * Math.abs(scaleY));
        }
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="store-confetti-canvas" />;
}

/* ─── High-XP Products Catalog ──────────────────────────────── */
const STORE_PRODUCTS = [
  {
    id: 'macbook-m3',
    title: 'M3 MacBook Air 13"',
    subtitle: '16GB Unified RAM • 512GB SSD • Space Gray',
    category: 'tech',
    categoryLabel: 'ULTIMATE TROPHY',
    costXP: 50000,
    emoji: '💻',
    color: '#C6FF45',
    stock: 1,
    desc: 'The crowning achievement of MyAptitude grandmasters. Blazing performance for high-stakes problem solvers.',
    specs: ['Apple M3 Chip (8-Core CPU / 10-Core GPU)', 'Liquid Retina 13.6" Display', 'MagSafe 3 & Dual Thunderbolt Ports', 'Official Apple 1-Year Warranty'],
    delivery: 'Ships worldwide via DHL Express with insurance',
  },
  {
    id: 'apple-watch-se',
    title: 'Apple Watch SE (GPS)',
    subtitle: 'Midnight Aluminum • Sport Band 44mm',
    category: 'tech',
    categoryLabel: 'BIO-READINESS',
    costXP: 18500,
    emoji: '⌚',
    color: '#38BDF8',
    stock: 2,
    desc: 'Continuous heart rate metrics, sleep stages, and haptic focus intervals calibrated for peak cognitive endurance.',
    specs: ['Retina OLED Display (1000 nits)', 'S8 SiP 64-bit dual-core processor', 'Crash & Fall Detection', 'Water resistant to 50 meters'],
    delivery: 'Direct door-to-door delivery within 4-7 business days',
  },
  {
    id: 'sony-wh1000xm5',
    title: 'Sony WH-1000XM5 Headphones',
    subtitle: 'Active Noise Canceling • 30h Flow-State Battery',
    category: 'tech',
    categoryLabel: 'DEEP FOCUS AUDIO',
    costXP: 16000,
    emoji: '🎧',
    color: '#A855F7',
    stock: 3,
    desc: 'Silence ambient distractions and lock into pure problem-solving flow. Two processors and 8 microphones.',
    specs: ['Integrated Processor V1 & QN1', 'Multipoint Bluetooth 5.2 Connection', 'Ultra-comfortable Soft Fit Leather', 'Hi-Res Wireless Audio (LDAC)'],
    delivery: 'Ships worldwide via FedEx Express',
  },
  {
    id: 'keychron-q1',
    title: 'Keychron Q1 Pro Custom Keyboard',
    subtitle: 'Full CNC Aluminum • Wireless Mechanical',
    category: 'tech',
    categoryLabel: 'DESK ARSENAL',
    costXP: 9500,
    emoji: '⌨️',
    color: '#FF9500',
    stock: 5,
    desc: 'Heavyweight acoustic gasket design, hot-swappable switches, and tactile response for lightning-fast keystrokes.',
    specs: ['6063 CNC Machined Aluminum Body', 'K Pro Brown Tactile Switches', 'Double-shot KSA PBT Keycaps', 'South-Facing RGB LEDs & VIA Support'],
    delivery: 'Tracked international air freight included',
  },
  {
    id: 'ember-mug-2',
    title: 'Ember Temperature Control Mug 2',
    subtitle: '14 oz Smart Ceramic • Precision Heat Control',
    category: 'swag',
    categoryLabel: 'DESK COMPANION',
    costXP: 5500,
    emoji: '☕',
    color: '#F59E0B',
    stock: 4,
    desc: 'Maintains your brew at your precise preferred drinking temperature (120°F–145°F) for up to 80 uninterrupted minutes.',
    specs: ['Precision Sensor Array ±1°F', 'Scratch-resistant Ceramic Coating', 'Auto Sleep / Wake on Motion', 'Companion iOS / Android App'],
    delivery: 'Ships in custom protective packaging',
  },
  {
    id: 'myapt-cyber-hoodie',
    title: 'MyAptitude Cyber Glyph Hoodie',
    subtitle: '450 GSM Ultra-Heavyweight Organic Cotton',
    category: 'swag',
    categoryLabel: 'LIMITED MERCH DROP',
    costXP: 4500,
    emoji: '🧥',
    color: '#C6FF45',
    stock: 12,
    desc: 'Dense brushed fleece with subtle 3D tonal embroidery on chest and hood. Tailored oversize drop-shoulder fit.',
    specs: ['100% Ring-Spun Organic Cotton 450 GSM', 'Pre-shrunk with Double-Needle Stitching', 'Hidden Kangaroo Device Pocket', 'Exclusive Back Cyber-Coordinate Print'],
    delivery: 'Sizes XS through XXL selected upon redemption',
  },
  {
    id: 'faang-mentorship',
    title: '1-on-1 FAANG Staff Engineer Mock & Audit',
    subtitle: '60 Min Live Video • DSA / System Design & Resume',
    category: 'career',
    categoryLabel: 'CAREER CATALYST',
    costXP: 4000,
    emoji: '🎓',
    color: '#EC4899',
    stock: 8,
    desc: 'Intensive 1-on-1 interview simulation and architectural deep dive with a Senior/Staff Engineer from Google, Meta, or Stripe.',
    specs: ['60-Minute Private Video Call', 'Line-by-line Resume & Portfolio Overhaul', 'Written Feedback Rubric & Action Plan', 'Direct Career Q&A and Referral Advice'],
    delivery: 'Scheduled via private Calendly link within 48 hours',
  },
  {
    id: 'oreilly-6mo',
    title: "O'Reilly Learning Platform (6 Months)",
    subtitle: 'Unlimited Access to 60,000+ Technical Titles',
    category: 'career',
    categoryLabel: 'TECHNICAL MASTERY',
    costXP: 3800,
    emoji: '📚',
    color: '#38BDF8',
    stock: 6,
    desc: 'Access the definitive library of programming, architecture, machine learning, and math books with interactive labs.',
    specs: ['Full O’Reilly Learning Library Access', 'Live Virtual Courses with Authors', 'Cloud Sandboxes & Certification Paths', 'Mobile App with Offline Reading'],
    delivery: 'Instant digital voucher code generated immediately',
  },
  {
    id: 'amazon-gift-50',
    title: '$50 Global Digital Gift Card',
    subtitle: 'Amazon / Steam / Apple Gift Code',
    category: 'swag',
    categoryLabel: 'INSTANT REWARD',
    costXP: 3500,
    emoji: '💳',
    color: '#22C55E',
    stock: 15,
    desc: 'Instant liquid capital to spend on books, games, cloud compute, or whatever drives your personal journey.',
    specs: ['Valid on Amazon, Steam, or Apple App Store', 'No expiration date or maintenance fees', 'Can be combined with other credits', 'Instant code revealed on claim'],
    delivery: 'Delivered digitally immediately on redemption',
  },
  {
    id: 'myapt-pro-plus',
    title: '1-Year MyAptitude Pro Plus Membership',
    subtitle: 'Verified Thinker Badge • Detailed Diagnostics',
    category: 'career',
    categoryLabel: 'PLATFORM ELITE',
    costXP: 2500,
    emoji: '🚀',
    color: '#C6FF45',
    stock: 99,
    desc: 'Unlock all adaptive drill modules, deep speed diagnostics, verified profile crown, and priority leaderboard duels.',
    specs: ['Unlimited Daily Ranked Duels', 'Deep Sub-skill Breakdown Reports', 'Exclusive Gold/Lime Profile Badge', 'Priority Access to New Categories'],
    delivery: 'Instant automatic account upgrade',
  },
];

export default function RedeemStore({ onBack, onStartDrill }) {
  const { user, deductXP } = useAuth();
  const currentXP = user?.xp ?? 280;

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [redeemedCode, setRedeemedCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Local claims history
  const [claimsHistory, setClaimsHistory] = useState(() => {
    try {
      const saved = sessionStorage.getItem('myapt_claimed_rewards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const categories = [
    { id: 'all', label: 'All Rewards', count: STORE_PRODUCTS.length },
    { id: 'tech', label: 'Tech & Hardware', count: STORE_PRODUCTS.filter(p => p.category === 'tech').length },
    { id: 'career', label: 'Career & Mentorship', count: STORE_PRODUCTS.filter(p => p.category === 'career').length },
    { id: 'swag', label: 'Merch & Swag', count: STORE_PRODUCTS.filter(p => p.category === 'swag').length },
  ];

  const filteredProducts = activeCategory === 'all' 
    ? STORE_PRODUCTS 
    : STORE_PRODUCTS.filter(p => p.category === activeCategory);

  const handleOpenProduct = (product) => {
    setSelectedProduct(product);
    setRedeemedCode(null);
    setCopied(false);
  };

  const handleConfirmRedeem = () => {
    if (!selectedProduct || currentXP < selectedProduct.costXP) return;
    
    // Deduct XP
    deductXP(selectedProduct.costXP);

    // Generate unique claim voucher
    const code = `MYAPT-${selectedProduct.id.slice(0, 4).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    setRedeemedCode(code);
    setShowConfetti(true);

    const newClaim = {
      id: Date.now(),
      productTitle: selectedProduct.title,
      costXP: selectedProduct.costXP,
      code,
      claimedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    const updated = [newClaim, ...claimsHistory];
    setClaimsHistory(updated);
    try {
      sessionStorage.setItem('myapt_claimed_rewards', JSON.stringify(updated));
    } catch (_) {}
  };

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (_) {}
  };

  return (
    <div className="redeem-store-page" id="redeem-store-page">
      {showConfetti && <StoreConfettiCanvas />}

      {/* ── Top Navigation Bar ───────────────────────────────── */}
      <header className="rs-header">
        <div className="rs-header-inner matiks-web-container">
          <button type="button" className="rs-back-btn" onClick={onBack} aria-label="Back to Dashboard">
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>

          <div className="rs-header-title">
            <div className="rs-badge-pulse" />
            <span>XP REWARDS VAULT</span>
          </div>

          <div className="rs-user-balance">
            <Zap size={15} className="text-lime" />
            <span className="rs-balance-num">{currentXP}</span>
            <span className="rs-balance-lbl">XP Available</span>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ──────────────────────────── */}
      <main className="rs-main-content matiks-web-container">
        {/* ── Hero Banner ── */}
        <section className="rs-hero-card">
          <div className="rs-hero-glow" />
          <div className="rs-hero-text">
            <div className="rs-hero-tag">
              <Gift size={13} className="text-lime" />
              <span>OFFICIAL PRODUCT STORE</span>
            </div>
            <h1 className="rs-hero-title">
              Redeem High-Value <span className="text-lime">Tech & Career</span> Gear
            </h1>
            <p className="rs-hero-sub">
              Your aptitude solves earn real tangible hardware, industry mentorship, and verified developer swag. 
              Drill daily, scale your accuracy, and unlock high-tier trophies.
            </p>

            <div className="rs-hero-meta-row">
              <div className="rs-hero-stat">
                <span className="rs-stat-val text-lime">10</span>
                <span className="rs-stat-lbl">Premium Trophies</span>
              </div>
              <div className="rs-hero-sep" />
              <div className="rs-hero-stat">
                <span className="rs-stat-val">2.5K – 50K</span>
                <span className="rs-stat-lbl">XP Thresholds</span>
              </div>
              <div className="rs-hero-sep" />
              <div className="rs-hero-stat">
                <span className="rs-stat-val text-lime">{claimsHistory.length}</span>
                <span className="rs-stat-lbl">Claimed by You</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Categories Filter Row ── */}
        <div className="rs-filters-row">
          <div className="rs-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`rs-tab ${activeCategory === cat.id ? 'rs-tab--active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.label}</span>
                <span className="rs-tab-badge">{cat.count}</span>
              </button>
            ))}
          </div>

          <button 
            type="button" 
            className="rs-earn-more-btn"
            onClick={onStartDrill}
          >
            <Zap size={14} />
            <span>Earn More XP (+35-50)</span>
          </button>
        </div>

        {/* ── Product Grid ── */}
        <section className="rs-grid" aria-label="Rewards Catalog">
          {filteredProducts.map((prod) => {
            const hasEnough = currentXP >= prod.costXP;
            const progress = Math.min(100, Math.round((currentXP / prod.costXP) * 100));
            const xpNeeded = Math.max(0, prod.costXP - currentXP);

            return (
              <div 
                key={prod.id} 
                className={`rs-card ${hasEnough ? 'rs-card--ready' : ''}`}
                onClick={() => handleOpenProduct(prod)}
                role="button"
                tabIndex={0}
              >
                <div className="rs-card-top">
                  <span className="rs-category-tag" style={{ color: prod.color, borderColor: `${prod.color}40` }}>
                    {prod.categoryLabel}
                  </span>
                  <span className="rs-stock-pill">
                    {prod.stock === 1 ? '🔥 ONLY 1 LEFT' : `${prod.stock} in stock`}
                  </span>
                </div>

                <div className="rs-card-visual" style={{ '--prod-color': prod.color }}>
                  <div className="rs-visual-ring" />
                  <span className="rs-visual-emoji">{prod.emoji}</span>
                </div>

                <div className="rs-card-info">
                  <h3 className="rs-card-title">{prod.title}</h3>
                  <p className="rs-card-subtitle">{prod.subtitle}</p>
                  <p className="rs-card-desc">{prod.desc}</p>
                </div>

                {/* Live Progress Bar */}
                <div className="rs-card-progress-wrap">
                  <div className="rs-card-progress-labels">
                    <span className="rs-progress-cost">
                      <Zap size={12} className="text-lime" />
                      <strong>{prod.costXP.toLocaleString()} XP</strong>
                    </span>
                    <span className={`rs-progress-pct ${hasEnough ? 'text-lime' : ''}`}>
                      {hasEnough ? '✓ Ready to Claim!' : `${progress}% (${currentXP}/${prod.costXP})`}
                    </span>
                  </div>

                  <div className="rs-progress-track">
                    <div 
                      className={`rs-progress-fill ${hasEnough ? 'rs-progress-fill--ready' : ''}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {!hasEnough && (
                    <span className="rs-progress-hint">
                      Need {xpNeeded.toLocaleString()} more XP
                    </span>
                  )}
                </div>

                {/* Card Action */}
                <button
                  type="button"
                  className={`rs-card-action-btn ${hasEnough ? 'rs-btn--ready' : 'rs-btn--locked'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenProduct(prod);
                  }}
                >
                  {hasEnough ? (
                    <>
                      <Sparkles size={15} />
                      <span>Redeem Product</span>
                      <ChevronRight size={15} />
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      <span>Unlock with {prod.costXP.toLocaleString()} XP</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </section>

        {/* ── My Redemptions History Section (if any claimed) ── */}
        {claimsHistory.length > 0 && (
          <section className="rs-claims-section">
            <div className="section-title-wrap">
              <span className="matiks-section-eyebrow">YOUR REDEEMED VOUCHERS</span>
            </div>

            <div className="rs-claims-list">
              {claimsHistory.map((claim) => (
                <div key={claim.id} className="rs-claim-row">
                  <div className="rs-claim-left">
                    <CheckCircle2 size={18} className="text-lime" />
                    <div>
                      <h4 className="rs-claim-title">{claim.productTitle}</h4>
                      <span className="rs-claim-date">Claimed on {claim.claimedAt} • {claim.costXP.toLocaleString()} XP</span>
                    </div>
                  </div>

                  <div className="rs-claim-right">
                    <code className="rs-claim-code">{claim.code}</code>
                    <button 
                      type="button" 
                      className="rs-copy-sm-btn"
                      onClick={() => handleCopyCode(claim.code)}
                    >
                      <Copy size={13} />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── Product Redemption Modal ────────────────────────── */}
      {selectedProduct && (
        <div className="rs-modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="rs-modal-card" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="rs-modal-close" 
              onClick={() => setSelectedProduct(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* If successfully redeemed */}
            {redeemedCode ? (
              <div className="rs-modal-success">
                <div className="rs-success-icon-wrap">
                  <CheckCircle2 size={42} className="text-lime" />
                </div>
                <span className="rs-success-tag">REWARD CLAIMED!</span>
                <h3 className="rs-success-title">{selectedProduct.title}</h3>
                <p className="rs-success-desc">
                  Congratulations! <strong>{selectedProduct.costXP.toLocaleString()} XP</strong> was redeemed. 
                  Keep this official verification voucher code safe:
                </p>

                <div className="rs-voucher-box">
                  <code className="rs-voucher-code">{redeemedCode}</code>
                  <button 
                    type="button" 
                    className="rs-voucher-copy-btn"
                    onClick={() => handleCopyCode(redeemedCode)}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                <div className="rs-delivery-note">
                  <AlertCircle size={14} className="text-lime" />
                  <span>{selectedProduct.delivery}</span>
                </div>

                <button 
                  type="button" 
                  className="rs-modal-primary-btn"
                  onClick={() => setSelectedProduct(null)}
                >
                  Done
                </button>
              </div>
            ) : (
              /* Product Details & Confirm View */
              <div className="rs-modal-detail">
                <div className="rs-modal-top-row">
                  <span className="rs-category-tag" style={{ color: selectedProduct.color, borderColor: `${selectedProduct.color}40` }}>
                    {selectedProduct.categoryLabel}
                  </span>
                  <span className="rs-modal-cost">
                    <Zap size={14} className="text-lime" />
                    <strong>{selectedProduct.costXP.toLocaleString()} XP</strong>
                  </span>
                </div>

                <div className="rs-modal-hero-prod">
                  <span className="rs-modal-emoji">{selectedProduct.emoji}</span>
                  <div>
                    <h3 className="rs-modal-title">{selectedProduct.title}</h3>
                    <p className="rs-modal-subtitle">{selectedProduct.subtitle}</p>
                  </div>
                </div>

                <p className="rs-modal-desc-body">{selectedProduct.desc}</p>

                <div className="rs-specs-box">
                  <span className="rs-specs-title">TROPHY SPECIFICATIONS</span>
                  <ul className="rs-specs-list">
                    {selectedProduct.specs.map((spec, i) => (
                      <li key={i}>
                        <Check size={13} className="text-lime" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rs-delivery-box">
                  <ShoppingBag size={14} className="text-cyan" />
                  <span>{selectedProduct.delivery}</span>
                </div>

                {/* Progress / Status */}
                <div className="rs-modal-balance-check">
                  <div className="rs-balance-check-row">
                    <span>Your Current XP</span>
                    <strong className="text-lime">{currentXP.toLocaleString()} XP</strong>
                  </div>
                  <div className="rs-balance-check-row">
                    <span>XP Required</span>
                    <strong>{selectedProduct.costXP.toLocaleString()} XP</strong>
                  </div>
                  <div className="rs-balance-check-divider" />
                  <div className="rs-balance-check-row">
                    <span>Status</span>
                    {currentXP >= selectedProduct.costXP ? (
                      <span className="text-lime font-bold">✓ Sufficient XP to claim</span>
                    ) : (
                      <span className="text-orange font-bold">
                        Need {(selectedProduct.costXP - currentXP).toLocaleString()} more XP
                      </span>
                    )}
                  </div>
                </div>

                {/* Action CTA */}
                {currentXP >= selectedProduct.costXP ? (
                  <button 
                    type="button" 
                    className="rs-modal-primary-btn"
                    onClick={handleConfirmRedeem}
                  >
                    <Sparkles size={16} />
                    <span>Confirm Claim & Deduct {selectedProduct.costXP.toLocaleString()} XP</span>
                  </button>
                ) : (
                  <div className="rs-modal-actions-duo">
                    <button 
                      type="button" 
                      className="rs-modal-drill-btn"
                      onClick={() => {
                        setSelectedProduct(null);
                        onStartDrill();
                      }}
                    >
                      <Zap size={16} />
                      <span>Start Drill to Earn XP</span>
                    </button>
                    <button 
                      type="button" 
                      className="rs-modal-secondary-btn"
                      onClick={() => setSelectedProduct(null)}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
