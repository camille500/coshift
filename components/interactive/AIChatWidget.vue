<template>
  <div>
    <!-- Tooltip -->
    <div v-if="showTooltip && !isOpen" class="chat-tooltip">{{ t.tooltip }}</div>

    <!-- FAB -->
    <button
      :class="['chat-fab', { 'chat-fab-pulse': !isOpen }]"
      @click="toggleOpen"
      :aria-label="isOpen ? t.close : t.tooltip"
    >
      <svg v-if="isOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
      <svg v-else width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    </button>

    <!-- Chat Panel -->
    <div :class="['chat-panel', { 'chat-panel-open': isOpen }]">
      <!-- Header -->
      <div class="chat-header">
        <div class="chat-header-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <div>
          <div class="chat-header-title">CoShift AI</div>
          <div class="chat-header-sub">{{ t.powered }}</div>
        </div>
      </div>

      <!-- Messages -->
      <div class="chat-messages" ref="messagesEndRef">
        <div v-for="(msg, i) in messages" :key="i" :class="['chat-msg', `chat-msg-${msg.role}`]">
          <div :class="['chat-bubble', `chat-bubble-${msg.role}`]">{{ msg.content }}</div>
        </div>

        <div v-if="isTyping" class="chat-msg chat-msg-assistant">
          <div class="chat-bubble chat-bubble-assistant chat-typing-bubble">
            <span class="chat-typing-dot" style="animation-delay: 0s"/>
            <span class="chat-typing-dot" style="animation-delay: 0.2s"/>
            <span class="chat-typing-dot" style="animation-delay: 0.4s"/>
          </div>
        </div>

        <div v-if="messages.length > 2 && !isTyping && messages[messages.length - 1].role === 'assistant'" class="chat-cta">
          {{ t.cta }}&nbsp;
          <a href="#contact" @click="isOpen = false" class="chat-cta-link">{{ t.ctaLink }}</a>
        </div>
      </div>

      <!-- Quick chips -->
      <div v-if="messages.length <= 1" class="chat-chips">
        <button v-for="(chip, i) in [t.chip1, t.chip2, t.chip3]" :key="i" @click="sendMessage(chip)" class="chat-chip">
          {{ chip }}
        </button>
      </div>

      <!-- Input -->
      <form @submit.prevent="handleSubmit" class="chat-input-form">
        <input
          ref="inputRef"
          type="text"
          v-model="input"
          :placeholder="t.placeholder"
          :disabled="isTyping || messageCount >= 10"
          class="chat-input"
        />
        <button
          type="submit"
          :disabled="!input.trim() || isTyping"
          :class="['chat-send', { 'chat-send-active': input.trim() && !isTyping }]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Message { role: 'assistant' | 'user'; content: string; }

const props = defineProps<{ locale: 'nl' | 'en'; apiEndpoint?: string }>();

const TRANSLATIONS = {
  nl: {
    greeting: 'Hoi! Welkom bij CoShift. Stel ons een vraag over AI-automatisering, custom tools of compliance.',
    placeholder: 'Stel een vraag...',
    chip1: 'Hoe beginnen we?', chip2: 'Hoelang duurt het?', chip3: 'Wat doen jullie precies?',
    cta: 'Wil je hier verder over praten?', ctaLink: 'Plan een gesprek',
    tooltip: 'Vraag ons iets over AI', powered: 'Powered by AI', close: 'Sluiten',
  },
  en: {
    greeting: 'Hi! Welcome to CoShift. Ask us anything about AI automation, custom tools or compliance.',
    placeholder: 'Ask a question...',
    chip1: 'How do we start?', chip2: 'How long does it take?', chip3: 'What exactly do you do?',
    cta: 'Want to discuss this further?', ctaLink: 'Schedule a call',
    tooltip: 'Ask us about AI', powered: 'Powered by AI', close: 'Close',
  },
};

const DEMO_RESPONSES: Record<string, Record<string, string>> = {
  nl: {
    'kost': 'Elk traject begint met een vrijblijvend kennismakingsgesprek. We bespreken jullie situatie en laten zien hoe AI concreet kan helpen. Geen verplichtingen — gewoon een open gesprek over de mogelijkheden.',
    'beginnen': 'Heel eenvoudig: we plannen een vrijblijvend kennismakingsgesprek in. We bespreken jullie processen en knelpunten, en laten zien hoe AI concreet kan helpen. Geen verplichtingen.',
    'hoelang': 'De meeste projecten leveren resultaat in 4-8 weken. We werken in korte sprints met wekelijkse demo\'s zodat je direct voortgang ziet.',
    'mcp': 'MCP (Model Context Protocol) is de standaard waarmee AI-modellen direct met je tools communiceren — je IDE, database, CRM, interne docs. We bouwen custom MCP-servers zodat je team sneller en slimmer werkt. Doorlooptijd: 2-4 weken.',
    'iso': 'We begeleiden je naar ISO-compliance: van gap-analyse tot implementatie. Zowel ISO 27001 (informatiebeveiliging) als ISO 42001 (AI-management). Praktisch en op maat.',
    'privacy': 'Jouw data blijft jouw data. Altijd. We werken privacy by design, zijn AVG-conform en bouwen met volledige transparantie. Geen vendor lock-in.',
    'private': 'Wij bouwen volledig afgeschermde AI-omgevingen: private cloud of hybrid. Geen byte data verlaat jouw infrastructuur. AVG-compliant, geschikt voor de meest gevoelige data.',
    'workshop': 'Wij geven hands-on AI-workshops voor hele teams. Van halve dag tot meerdaags. ChatGPT, Claude, Copilot — we laten je team zien hoe ze AI écht productief inzetten.',
    'training': 'Wij geven hands-on AI-workshops voor hele teams. Van halve dag tot meerdaags.',
    'automatiser': 'Elk proces dat je twee keer doet, kan slimmer. Van documentverwerking tot rapportages, van goedkeuringsflows tot data-pipelines. We automatiseren met AI zodat jij je kunt richten op wat écht toe doet.',
    'default': 'Goede vraag! Daar gaan we graag dieper op in. Het beste is om even te sparren met Camille — dan bespreken we jouw specifieke situatie.',
  },
  en: {
    'start': 'Simple: we schedule a free introductory call. We discuss your processes and bottlenecks, and show how AI can concretely help. No obligations.',
    'how long': 'Most projects deliver results in 4-8 weeks. We work in short sprints with weekly demos so you see progress immediately.',
    'mcp': 'MCP (Model Context Protocol) lets AI models communicate directly with your tools — your IDE, database, CRM, internal docs. We build custom MCP servers so your team works faster and smarter. Timeline: 2-4 weeks.',
    'iso': 'We guide you towards ISO compliance: from gap analysis to implementation. Both ISO 27001 (information security) and ISO 42001 (AI management). Practical and tailored.',
    'privacy': 'Your data stays your data. Always. We work privacy by design, are GDPR-compliant and build with full transparency. No vendor lock-in.',
    'private': 'We build fully isolated AI environments: private cloud or hybrid. Not a single byte of data leaves your infrastructure. GDPR compliant, suitable for the most sensitive data.',
    'workshop': 'We deliver hands-on AI workshops for entire teams. From half a day to multi-day programmes.',
    'training': 'We deliver hands-on AI workshops for entire teams. From half a day to multi-day programmes.',
    'automat': 'Any process you do twice can be smarter. From document processing to reporting, from approval flows to data pipelines. We automate with AI so you can focus on what truly matters.',
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

const t = computed(() => TRANSLATIONS[props.locale]);
const isOpen = ref(false);
const messages = ref<Message[]>([{ role: 'assistant', content: TRANSLATIONS[props.locale].greeting }]);
const input = ref('');
const isTyping = ref(false);
const showTooltip = ref(false);
const messageCount = ref(0);
const messagesEndRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  setTimeout(() => {
    if (!isOpen.value) showTooltip.value = true;
  }, 8000);
});

watch(messages, () => {
  nextTick(() => {
    if (messagesEndRef.value) {
      messagesEndRef.value.scrollTop = messagesEndRef.value.scrollHeight;
    }
  });
});

watch(isOpen, (val) => {
  if (val) nextTick(() => inputRef.value?.focus());
});

function toggleOpen() {
  isOpen.value = !isOpen.value;
  showTooltip.value = false;
}

async function sendMessage(text: string) {
  if (!text.trim() || isTyping.value || messageCount.value >= 10) return;

  messages.value.push({ role: 'user', content: text.trim() });
  input.value = '';
  isTyping.value = true;
  messageCount.value++;

  if (props.apiEndpoint) {
    try {
      const res = await fetch(props.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), locale: props.locale, history: messages.value.slice(-4) }),
      });
      const data = await res.json();
      messages.value.push({ role: 'assistant', content: data.response });
    } catch {
      messages.value.push({
        role: 'assistant',
        content: props.locale === 'nl'
          ? 'Sorry, er ging iets mis. Probeer het later nog eens of neem direct contact op.'
          : 'Sorry, something went wrong. Please try again later or contact us directly.',
      });
    }
  } else {
    const delay = 600 + Math.random() * 800;
    await new Promise(r => setTimeout(r, delay));
    messages.value.push({ role: 'assistant', content: findDemoResponse(text, props.locale) });
  }

  isTyping.value = false;
}

function handleSubmit() {
  sendMessage(input.value);
}
</script>

<style>
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
.chat-fab {
  position: fixed; bottom: 96px; right: 28px; width: 56px; height: 56px;
  border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent-violet));
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; z-index: 91; border: none;
  box-shadow: 0 4px 24px rgba(0, 212, 170, 0.35);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.chat-fab:hover { transform: scale(1.1); }
.chat-fab-pulse { animation: pulse-chat 3s ease-in-out infinite; }
.chat-tooltip {
  position: fixed; bottom: 160px; right: 28px;
  background: var(--card-bg, rgba(10, 10, 18, 0.9)); backdrop-filter: blur(12px);
  border: 1px solid var(--border-glass); border-radius: 8px; padding: 8px 14px;
  font-size: 0.8rem; color: var(--text-secondary); white-space: nowrap; z-index: 91;
  animation: fadeInUp 0.4s ease forwards; pointer-events: none; box-shadow: var(--card-shadow);
}
.chat-panel {
  position: fixed; bottom: 164px; right: 28px; width: 380px; max-height: 520px;
  border-radius: 16px; background: var(--chat-panel-bg, rgba(10, 10, 18, 0.92));
  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--border-glass); box-shadow: 0 24px 80px rgba(0,0,0,0.15);
  display: flex; flex-direction: column; z-index: 91; overflow: hidden;
  transform: translateY(20px) scale(0.95); opacity: 0; pointer-events: none;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}
.chat-panel-open { transform: translateY(0) scale(1); opacity: 1; pointer-events: auto; }
[data-theme="dark"] .chat-panel { box-shadow: 0 24px 80px rgba(0,0,0,0.5); }
.chat-header {
  padding: 16px 20px; border-bottom: 1px solid var(--border-glass);
  display: flex; align-items: center; gap: 10px;
}
.chat-header-icon {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, rgba(0,212,170,0.15), rgba(124,107,218,0.15));
  display: flex; align-items: center; justify-content: center;
}
.chat-header-title { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
.chat-header-sub { font-size: 0.7rem; color: var(--text-muted); }
.chat-messages {
  flex: 1; overflow-y: auto; padding: 16px 20px;
  display: flex; flex-direction: column; gap: 12px;
}
.chat-messages::-webkit-scrollbar { width: 4px; }
.chat-messages::-webkit-scrollbar-thumb { background: var(--border-glass); border-radius: 2px; }
.chat-msg { max-width: 85%; }
.chat-msg-user { align-self: flex-end; }
.chat-msg-assistant { align-self: flex-start; }
.chat-bubble { padding: 10px 14px; font-size: 0.88rem; line-height: 1.55; border: 1px solid var(--border-glass); }
.chat-bubble-user {
  border-radius: 12px 12px 4px 12px;
  background: linear-gradient(135deg, rgba(0,212,170,0.12), rgba(124,107,218,0.08));
  border-color: rgba(0,212,170,0.15); color: var(--text-primary);
}
.chat-bubble-assistant { border-radius: 12px 12px 12px 4px; background: var(--bg-glass); color: var(--text-secondary); }
.chat-typing-bubble { display: flex; gap: 4px; }
.chat-typing-dot {
  width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
  opacity: 0.4; animation: typing 1.4s ease-in-out infinite;
}
.chat-cta { font-size: 0.78rem; color: var(--text-muted); text-align: center; padding: 4px 0; }
.chat-cta-link { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
.chat-chips { padding: 0 20px 12px; display: flex; gap: 6px; flex-wrap: wrap; }
.chat-chip {
  padding: 6px 12px; font-size: 0.78rem; font-weight: 500; color: var(--text-muted);
  background: var(--bg-glass); border: 1px solid var(--border-glass); border-radius: 6px;
  cursor: pointer; font-family: inherit; transition: border-color 0.2s, color 0.2s;
}
.chat-chip:hover { border-color: rgba(0,212,170,0.3); color: var(--accent); }
.chat-input-form { padding: 12px 20px 16px; border-top: 1px solid var(--border-glass); display: flex; gap: 8px; }
.chat-input {
  flex: 1; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-glass);
  background: var(--input-bg); color: var(--text-primary); font-size: 0.88rem;
  font-family: inherit; outline: none; transition: border-color 0.3s;
}
.chat-input:focus { border-color: rgba(0,212,170,0.3); }
.chat-send {
  width: 40px; height: 40px; border-radius: 8px; border: none;
  background: var(--bg-glass); color: var(--text-muted); cursor: default;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s, color 0.2s; flex-shrink: 0;
}
.chat-send-active { background: var(--accent); color: var(--bg-deep); cursor: pointer; }
@media (max-width: 480px) {
  .chat-panel { width: calc(100vw - 24px) !important; right: 12px !important; bottom: 140px !important; max-height: 70vh !important; }
  .chat-fab { bottom: 80px !important; right: 16px !important; }
}
</style>
