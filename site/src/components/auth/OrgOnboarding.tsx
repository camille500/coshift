import { useState } from 'react';

interface OrgOnboardingProps {
  locale?: string;
}

export default function OrgOnboarding({ locale = 'nl' }: OrgOnboardingProps) {
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
  const [orgName, setOrgName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = {
    title: locale === 'nl' ? 'Welkom bij CoShift' : 'Welcome to CoShift',
    subtitle: locale === 'nl'
      ? 'Je hebt nog geen organisatie. Maak er een aan of join een bestaande.'
      : "You don't have an organization yet. Create one or join an existing one.",
    createBtn: locale === 'nl' ? 'Organisatie aanmaken' : 'Create organization',
    joinBtn: locale === 'nl' ? 'Bestaande organisatie joinen' : 'Join existing organization',
    orgNameLabel: locale === 'nl' ? 'Naam organisatie' : 'Organization name',
    orgNamePlaceholder: locale === 'nl' ? 'Bijv. Mijn Bedrijf B.V.' : 'E.g. My Company Ltd.',
    codeLabel: locale === 'nl' ? 'Uitnodigingscode' : 'Invite code',
    codePlaceholder: locale === 'nl' ? 'Voer je code in' : 'Enter your code',
    submit: locale === 'nl' ? 'Bevestigen' : 'Confirm',
    back: locale === 'nl' ? 'Terug' : 'Back',
    creating: locale === 'nl' ? 'Aanmaken...' : 'Creating...',
    joining: locale === 'nl' ? 'Joinen...' : 'Joining...',
  };

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!orgName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: orgName.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create organization');
      }
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/organizations/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inviteCode.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Invalid invite code');
      }
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>{t.title}</h1>
        <p style={styles.subtitle}>{t.subtitle}</p>

        {error && <p style={styles.error}>{error}</p>}

        {mode === 'choose' && (
          <div style={styles.choices}>
            <button style={styles.choiceBtn} onClick={() => setMode('create')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              <span>{t.createBtn}</span>
            </button>
            <button style={styles.choiceBtn} onClick={() => setMode('join')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              <span>{t.joinBtn}</span>
            </button>
          </div>
        )}

        {mode === 'create' && (
          <form onSubmit={handleCreate} style={styles.form}>
            <label style={styles.label}>{t.orgNameLabel}</label>
            <input
              style={styles.input}
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder={t.orgNamePlaceholder}
              required
              autoFocus
            />
            <div style={styles.actions}>
              <button type="button" style={styles.backBtn} onClick={() => setMode('choose')}>{t.back}</button>
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? t.creating : t.submit}
              </button>
            </div>
          </form>
        )}

        {mode === 'join' && (
          <form onSubmit={handleJoin} style={styles.form}>
            <label style={styles.label}>{t.codeLabel}</label>
            <input
              style={styles.input}
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder={t.codePlaceholder}
              required
              autoFocus
            />
            <div style={styles.actions}>
              <button type="button" style={styles.backBtn} onClick={() => setMode('choose')}>{t.back}</button>
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? t.joining : t.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '120px 24px 80px',
  },
  card: {
    maxWidth: 480,
    width: '100%',
    background: 'rgba(14, 14, 22, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: '40px 32px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#f4f4f6',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#787890',
    marginBottom: 32,
    lineHeight: 1.6,
  },
  error: {
    background: 'rgba(255, 59, 48, 0.1)',
    border: '1px solid rgba(255, 59, 48, 0.2)',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#ff6b6b',
    fontSize: '0.85rem',
    marginBottom: 16,
  },
  choices: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  },
  choiceBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 20px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: 10,
    color: '#f4f4f6',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'border-color 0.2s, background 0.2s',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 16,
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#b4b4c0',
  },
  input: {
    padding: '12px 14px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#f4f4f6',
    fontSize: '0.95rem',
    outline: 'none',
  },
  actions: {
    display: 'flex',
    gap: 12,
    marginTop: 8,
  },
  backBtn: {
    padding: '10px 20px',
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    color: '#b4b4c0',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  submitBtn: {
    flex: 1,
    padding: '10px 20px',
    background: '#00d4aa',
    border: 'none',
    borderRadius: 8,
    color: '#030306',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
