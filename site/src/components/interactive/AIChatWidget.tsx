import { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface Props {
  locale: 'nl' | 'en';
  apiEndpoint?: string;
}

const TRANSLATIONS = {
  nl: {
    greeting: 'Hoi! Welkom bij CoShift. Stel ons een vraag over AI-automatisering, custom tools of compliance.',
    placeholder: 'Stel een vraag...',
    chip1: 'Hoe beginnen we?',
    chip2: 'Hoelang duurt het?',
    chip3: 'Wat doen jullie precies?',
    cta: 'Wil je hier verder over praten?',
    ctaLink: 'Plan een gesprek',
    tooltip: 'Vraag ons iets over AI',
    powered: 'Powered by AI',
    close: 'Sluiten',
  },
  en: {
    greeting: 'Hi! Welcome to CoShift. Ask us anything about AI automation, custom tools or compliance.',
    placeholder: 'Ask a question...',
    chip1: 'How do we start?',
    chip2: 'How long does it take?',
    chip3: 'What exactly do you do?',
    cta: 'Want to discuss this further?',
    ctaLink: 'Schedule a call',
    tooltip: 'Ask us about AI',
    powered: 'Powered by AI',
    close: 'Close',
  },
};

// Smart demo responses for when no API endpoint is configured
const DEMO_RESPONSES: Record<string, Record<string, string>> = {
  nl: {
    'kost': 'Elk traject begint met een vrijblijvend kennismakingsgesprek. We bespreken jullie situatie en laten zien hoe AI concreet kan helpen. Geen verplichtingen — gewoon een open gesprek over de mogelijkheden.',
    'beginnen': 'Heel eenvoudig: we plannen een vrijblijvend kennismakingsgesprek in. We bespreken jullie processen en knelpunten, en laten zien hoe AI concreet kan helpen. Geen verplichtingen.',
    'hoelang': 'De meeste projecten leveren resultaat in 4-8 weken. We werken in korte sprints met wekelijkse demo\'s zodat je direct voortgang ziet.',
    'welke ai': 'We kiezen het beste model voor de taak: OpenAI GPT voor creatieve taken, Anthropic Claude voor complexe analyses, of open-source alternatieven. De keuze hangt af van jouw use case en privacy-eisen.',
    'iso': 'We begeleiden het volledige ISO-traject: van gap-analyse tot certificering. Zowel ISO 27001 (informatiebeveiliging) als ISO 42001 (AI-management). Gemiddeld 4 maanden van start tot certificaat.',
    'privacy': 'Jouw data blijft jouw data. Altijd. We werken privacy by design, zijn AVG-conform en bouwen met volledige transparantie. Geen vendor lock-in.',
    'klein': 'Absoluut! Juist kleinere bedrijven profiteren enorm van AI en automatisering. De impact is vaak het grootst waar processen nog handmatig zijn.',
    'mcp': 'MCP (Model Context Protocol) is de standaard waarmee AI-modellen direct met je tools communiceren — je IDE, database, CRM, interne docs. We bouwen custom MCP-servers zodat je team sneller en slimmer werkt. Doorlooptijd: 2-4 weken.',
    'development': 'We helpen development teams productiever worden met AI: MCP-servers voor je IDE, AI-geassisteerde code reviews, geautomatiseerde testing, en RAG-systemen voor interne kennisbanken. Zonder de controle te verliezen.',
    'eu ai act': 'De EU AI Act vereist dat organisaties hun AI-systemen classificeren en beheersen. Wij helpen met compliance: risicobeoordelingen, documentatie en de juiste governance-structuur. ISO 42001 is daarbij je fundament.',
    'automatiser': 'Elk proces dat je twee keer doet, kan slimmer. Van documentverwerking tot rapportages, van goedkeuringsflows tot data-pipelines. We automatiseren met AI zodat jij je kunt richten op wat écht toe doet.',
    'private': 'Wij bouwen volledig afgeschermde AI-omgevingen: on-premise of private cloud. Geen byte data verlaat jouw infrastructuur. AVG- en NIS2-compliant, geschikt voor de meest gevoelige data.',
    'workshop': 'Wij geven hands-on AI-workshops voor hele teams. Van halve dag tot meerdaags. ChatGPT, Claude, Copilot — we laten je team zien hoe ze AI écht productief inzetten.',
    'training': 'Wij geven hands-on AI-workshops voor hele teams. Van halve dag tot meerdaags. ChatGPT, Claude, Copilot — we laten je team zien hoe ze AI écht productief inzetten.',
    'mkb': 'Juist het MKB profiteert enorm van AI. Kleinere teams, directe impact. Wij werken met bedrijven van 5 tot 500+ medewerkers. Plan een vrijblijvend gesprek en ontdek wat AI voor jullie kan betekenen.',
    'strategie': 'Wij helpen bij het opstellen van een heldere AI-strategie: waar begin je, wat levert het meeste op, en hoe schaal je op. Van roadmap tot implementatie.',
    'default': 'Goede vraag! Daar gaan we graag dieper op in. Het beste is om even te sparren met Camille — dan bespreken we jouw specifieke situatie.',
  },
  en: {
    'cost': 'Every project starts with a free, no-obligation introductory call. We discuss your situation and show you how AI can concretely help. No commitments — just an open conversation about the possibilities.',
    'start': 'Simple: we schedule a free introductory call. We discuss your processes and bottlenecks, and show how AI can concretely help. No obligations.',
    'how long': 'Most projects deliver results in 4-8 weeks. We work in short sprints with weekly demos so you see progress immediately.',
    'which ai': 'We choose the best model for the task: OpenAI GPT for creative tasks, Anthropic Claude for complex analysis, or open-source alternatives. The choice depends on your use case and privacy requirements.',
    'iso': 'We guide the full ISO journey: from gap analysis to certification. Both ISO 27001 (information security) and ISO 42001 (AI management). Average 4 months from start to certificate.',
    'privacy': 'Your data stays your data. Always. We work privacy by design, are GDPR-compliant and build with full transparency. No vendor lock-in.',
    'small': 'Absolutely! Smaller companies often benefit enormously from AI and automation. The impact is often greatest where processes are still manual.',
    'mcp': 'MCP (Model Context Protocol) lets AI models communicate directly with your tools — your IDE, database, CRM, internal docs. We build custom MCP servers so your team works faster and smarter. Timeline: 2-4 weeks.',
    'development': 'We help development teams become more productive with AI: MCP servers for your IDE, AI-assisted code reviews, automated testing, and RAG systems for internal knowledge bases. Without losing control.',
    'eu ai act': 'The EU AI Act requires organizations to classify and manage their AI systems. We help with compliance: risk assessments, documentation and the right governance structure. ISO 42001 is your foundation.',
    'automat': 'Any process you do twice can be smarter. From document processing to reporting, from approval flows to data pipelines. We automate with AI so you can focus on what truly matters.',
    'private': 'We build fully isolated AI environments: on-premise or private cloud. Not a single byte of data leaves your infrastructure. GDPR and NIS2 compliant, suitable for the most sensitive data.',
    'workshop': 'We deliver hands-on AI workshops for entire teams. From half a day to multi-day programmes. ChatGPT, Claude, Copilot — we show your team how to use AI productively.',
    'training': 'We deliver hands-on AI workshops for entire teams. From half a day to multi-day programmes. ChatGPT, Claude, Copilot — we show your team how to use AI productively.',
    'sme': 'SMEs benefit enormously from AI. Smaller teams, direct impact. We work with companies from 5 to 500+ employees. Schedule a free call to discover what AI can do for you.',
    'strategy': 'We help define a clear AI strategy: where to start, what delivers most value, and how to scale. From roadmap to implementation.',
    'default': 'Great question! We\'d love to dive deeper into this. The best approach would be to chat with Camille — so we can discuss your specific situation.',
  },
};

function findDemoResponse(input: string, locale: 'nl' | 'en'): string {
  const lower = input.toLowerCase();
  const responses = DEMO_RESPONSES[locale];
  for (const [key, value] of Object.entries(responses)) {
    if (key !== 'default' && lower.includes(key)) return value;
  }
  return responses['default'];
}

export default function AIChatWidget({ locale, apiEndpoint }: Props) {
  const t = TRANSLATIONS[locale];
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t.greeting },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageCount = useRef(0);

  // Show tooltip after 8s idle
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowTooltip(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;
    if (messageCount.current >= 10) return; // Rate limit

    const userMsg: Message = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    messageCount.current++;

    // Simulate typing delay for demo mode
    const delay = 600 + Math.random() * 800;

    if (apiEndpoint) {
      // Real API mode
      try {
        const res = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text.trim(),
            locale,
            history: messages.slice(-4),
          }),
        });
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } catch {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: locale === 'nl'
            ? 'Sorry, er ging iets mis. Probeer het later nog eens of neem direct contact op.'
            : 'Sorry, something went wrong. Please try again later or contact us directly.',
        }]);
      }
    } else {
      // Demo mode with smart matching
      await new Promise(r => setTimeout(r, delay));
      const response = findDemoResponse(text, locale);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }

    setIsTyping(false);
  }, [isTyping, messages, locale, apiEndpoint]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleChip = (text: string) => {
    sendMessage(text);
  };

  const fabClassName = `chat-fab${isOpen ? '' : ' chat-fab-pulse'}`;
  const panelClassName = `chat-panel${isOpen ? ' chat-panel-open' : ''}`;

  return (
    <>
      <style>{`
        @keyframes pulse-chat {
          0%, 100% { box-shadow: 0 4px 24px rgba(0, 212, 170, 0.35); }
          50% { box-shadow: 0 4px 40px rgba(0, 212, 170, 0.55), 0 0 60px rgba(124, 107, 218, 0.2); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typing {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-3px); }
        }

        /* FAB */
        .chat-fab {
          position: fixed;
          bottom: 96px;
          right: 28px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent-violet));
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 91;
          border: none;
          box-shadow: 0 4px 24px rgba(0, 212, 170, 0.35);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .chat-fab:hover { transform: scale(1.1); }
        .chat-fab-pulse { animation: pulse-chat 3s ease-in-out infinite; }

        /* Tooltip */
        .chat-tooltip {
          position: fixed;
          bottom: 160px;
          right: 28px;
          background: var(--card-bg, rgba(10, 10, 18, 0.9));
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-glass);
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          white-space: nowrap;
          z-index: 91;
          animation: fadeInUp 0.4s ease forwards;
          pointer-events: none;
          box-shadow: var(--card-shadow);
        }

        /* Panel */
        .chat-panel {
          position: fixed;
          bottom: 164px;
          right: 28px;
          width: 380px;
          max-height: 520px;
          border-radius: 16px;
          background: var(--chat-panel-bg, rgba(10, 10, 18, 0.92));
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--border-glass);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          z-index: 91;
          overflow: hidden;
          transform: translateY(20px) scale(0.95);
          opacity: 0;
          pointer-events: none;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        }
        .chat-panel-open {
          transform: translateY(0) scale(1);
          opacity: 1;
          pointer-events: auto;
        }
        [data-theme="dark"] .chat-panel {
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
        }

        /* Header */
        .chat-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-glass);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .chat-header-icon {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(0,212,170,0.15), rgba(124,107,218,0.15));
          display: flex; align-items: center; justify-content: center;
        }
        .chat-header-title { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
        .chat-header-sub { font-size: 0.7rem; color: var(--text-muted); }

        /* Messages */
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb { background: var(--border-glass); border-radius: 2px; }
        .chat-msg { max-width: 85%; }
        .chat-msg-user { align-self: flex-end; }
        .chat-msg-assistant { align-self: flex-start; }
        .chat-bubble {
          padding: 10px 14px;
          font-size: 0.88rem;
          line-height: 1.55;
          border: 1px solid var(--border-glass);
        }
        .chat-bubble-user {
          border-radius: 12px 12px 4px 12px;
          background: linear-gradient(135deg, rgba(0,212,170,0.12), rgba(124,107,218,0.08));
          border-color: rgba(0,212,170,0.15);
          color: var(--text-primary);
        }
        .chat-bubble-assistant {
          border-radius: 12px 12px 12px 4px;
          background: var(--bg-glass);
          color: var(--text-secondary);
        }
        .chat-typing-bubble { display: flex; gap: 4px; }
        .chat-typing-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent);
          opacity: 0.4;
          animation: typing 1.4s ease-in-out infinite;
        }

        /* CTA */
        .chat-cta {
          font-size: 0.78rem;
          color: var(--text-muted);
          text-align: center;
          padding: 4px 0;
        }
        .chat-cta-link {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        /* Quick chips */
        .chat-chips {
          padding: 0 20px 12px;
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .chat-chip {
          padding: 6px 12px;
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--text-muted);
          background: var(--bg-glass);
          border: 1px solid var(--border-glass);
          border-radius: 6px;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.2s, color 0.2s;
        }
        .chat-chip:hover {
          border-color: rgba(0,212,170,0.3);
          color: var(--accent);
        }

        /* Input form */
        .chat-input-form {
          padding: 12px 20px 16px;
          border-top: 1px solid var(--border-glass);
          display: flex;
          gap: 8px;
        }
        .chat-input {
          flex: 1;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid var(--border-glass);
          background: var(--input-bg);
          color: var(--text-primary);
          font-size: 0.88rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.3s;
        }
        .chat-input:focus { border-color: rgba(0,212,170,0.3); }
        .chat-send {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: none;
          background: var(--bg-glass);
          color: var(--text-muted);
          cursor: default;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, color 0.2s;
          flex-shrink: 0;
        }
        .chat-send-active {
          background: var(--accent);
          color: var(--bg-deep);
          cursor: pointer;
        }

        @media (max-width: 480px) {
          .chat-panel { width: calc(100vw - 24px) !important; right: 12px !important; bottom: 140px !important; max-height: 70vh !important; }
          .chat-fab { bottom: 80px !important; right: 16px !important; }
        }
      `}</style>

      {/* Tooltip */}
      {showTooltip && !isOpen && (
        <div className="chat-tooltip">{t.tooltip}</div>
      )}

      {/* FAB */}
      <button
        className={fabClassName}
        onClick={() => { setIsOpen(!isOpen); setShowTooltip(false); }}
        aria-label={isOpen ? t.close : t.tooltip}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      <div className={panelClassName}>
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div>
            <div className="chat-header-title">CoShift AI</div>
            <div className="chat-header-sub">{t.powered}</div>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg chat-msg-${msg.role}`}>
              <div className={`chat-bubble chat-bubble-${msg.role}`}>
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-msg chat-msg-assistant">
              <div className="chat-bubble chat-bubble-assistant chat-typing-bubble">
                <span className="chat-typing-dot" style={{ animationDelay: '0s' }} />
                <span className="chat-typing-dot" style={{ animationDelay: '0.2s' }} />
                <span className="chat-typing-dot" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}

          {/* CTA after assistant messages */}
          {messages.length > 2 && !isTyping && messages[messages.length - 1].role === 'assistant' && (
            <div className="chat-cta">
              {t.cta}{' '}
              <a href="#contact" onClick={() => setIsOpen(false)} className="chat-cta-link">{t.ctaLink}</a>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick chips (only show initially) */}
        {messages.length <= 1 && (
          <div className="chat-chips">
            {[t.chip1, t.chip2, t.chip3].map((chip, i) => (
              <button key={i} onClick={() => handleChip(chip)} className="chat-chip">{chip}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={t.placeholder}
            disabled={isTyping || messageCount.current >= 10}
            className="chat-input"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`chat-send${input.trim() && !isTyping ? ' chat-send-active' : ''}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}
