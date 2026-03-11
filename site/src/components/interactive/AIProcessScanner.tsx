import { useState, useCallback } from 'react';

interface Props {
  locale: 'nl' | 'en';
  translations: Record<string, string>;
}

const CATEGORIES = [1, 2, 3, 4, 5, 6, 7];

const CATEGORY_ICONS = [
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>',
  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
];

export default function AIProcessScanner({ locale, translations: t }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = useCallback((idx: number) => {
    setSelected(idx);
  }, []);

  const chipClassName = (idx: number) =>
    `scanner-chip${selected === idx ? ' scanner-chip-active' : ''}`;

  return (
    <div className="scanner-inner">
      <div className="scanner-chips">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={chipClassName(cat)}
            onClick={() => handleSelect(cat)}
          >
            <span dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[cat - 1] }} />
            {t[`scanner.cat.${cat}`]}
          </button>
        ))}
      </div>

      {/* Result card */}
      {selected !== null && (
        <div className="scanner-result glass">
          <div className="scanner-approach">
            <span className="scanner-approach-label">{t['scanner.result.approach']}</span>
            <p className="scanner-approach-text">{t[`scanner.res.${selected}.approach`]}</p>
          </div>
          <a href="#contact" className="scanner-cta">
            {t['scanner.cta']}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      )}

      <style>{`
        .scanner-chips {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 32px;
        }
        .scanner-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--text-muted);
          background: var(--bg-glass);
          border: 1px solid var(--border-glass);
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.3s ease;
        }
        .scanner-chip:hover {
          border-color: rgba(0, 212, 170, 0.2);
          color: var(--text-secondary);
        }
        .scanner-chip-active {
          color: var(--accent);
          background: rgba(0, 212, 170, 0.08);
          border-color: rgba(0, 212, 170, 0.3);
        }
        .scanner-chip-active:hover {
          color: var(--accent);
          border-color: rgba(0, 212, 170, 0.3);
        }
        .scanner-result {
          max-width: 600px;
          margin: 0 auto;
          padding: 32px;
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scanner-approach {
          margin-bottom: 24px;
        }
        .scanner-approach-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          display: block;
          margin-bottom: 8px;
        }
        .scanner-approach-text {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.65;
        }
        .scanner-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--bg-deep);
          background: var(--accent);
          border-radius: 8px;
          transition: transform 0.25s ease, box-shadow 0.35s ease;
        }
        .scanner-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0, 212, 170, 0.35);
        }
        .scanner-cta svg {
          transition: transform 0.2s ease;
        }
        .scanner-cta:hover svg {
          transform: translateX(3px);
        }
        @media (max-width: 600px) {
          .scanner-chips {
            flex-direction: column;
            align-items: stretch;
          }
          .scanner-result {
            padding: 24px 20px;
          }
        }
      `}</style>
    </div>
  );
}
