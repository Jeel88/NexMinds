import { X, Keyboard } from 'lucide-react';
import './BadgesModal.css';

const SHORTCUTS = [
  { key: 'Space', desc: 'Quick Start / Resume active practice session' },
  { key: '1 - 4', desc: 'Select option A, B, C, or D in questions' },
  { key: 'Enter', desc: 'Submit answer and advance to next question' },
  { key: 'P', desc: 'Open / Close Profile & Account Drawer' },
  { key: 'Esc', desc: 'Close open dialogs, drawers, and practice setup' },
  { key: 'M', desc: 'Toggle sound effects on / off' },
];

export default function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} aria-hidden="true">
      <div 
        className="modal badges-modal card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-modal-title"
      >
        <div className="modal-header">
          <div className="badges-header-title">
            <Keyboard className="text-accent" size={24} />
            <div>
              <h2 id="shortcuts-modal-title" className="modal-title">Keyboard Navigation</h2>
              <p className="modal-subtitle">Speed up your brain training with hotkeys</p>
            </div>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose} 
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SHORTCUTS.map((s) => (
            <div 
              key={s.key} 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: '#1E182A',
                border: '1px solid #2B233A',
                borderRadius: 12,
              }}
            >
              <span style={{ fontSize: '0.875rem', color: '#FFFFFF', fontWeight: 500 }}>
                {s.desc}
              </span>
              <kbd 
                style={{
                  background: '#2A223B',
                  border: '1px solid #3F3356',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontFamily: 'monospace',
                  fontSize: '0.8125rem',
                  color: '#C6FF45',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                }}
              >
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
