<script setup lang="ts">
const { t } = useI18n();

const pageLoadTime = Date.now();

const name = ref('');
const email = ref('');
const message = ref('');
const activeOption = ref<string | null>(null);
const isSubmitting = ref(false);
const isSuccess = ref(false);
const submitError = ref(false);

const scanOptions = [
  {
    key: '1',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/></svg>',
  },
  {
    key: '2',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  },
  {
    key: '3',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  },
  {
    key: '4',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  },
  {
    key: '5',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  },
  {
    key: '6',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  },
];

function selectScan(key: string) {
  const msgText = t(`contact.scan.${key}`);
  message.value = msgText;
  activeOption.value = key;
}

async function handleSubmit() {
  // Rate limiting: block submissions within 3 seconds of page load
  if (Date.now() - pageLoadTime < 3000) return;

  isSubmitting.value = true;
  submitError.value = false;

  try {
    const data = new FormData();
    data.append('name', name.value);
    data.append('email', email.value);
    data.append('message', message.value);
    data.append('_subject', 'Nieuw contactbericht via coshift.nl');

    const response = await fetch('https://formspree.io/f/mpqjejde', {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      isSuccess.value = true;
    } else {
      submitError.value = true;
      isSubmitting.value = false;
    }
  } catch {
    submitError.value = true;
    isSubmitting.value = false;
  }
}
</script>

<template>
  <section id="contact" class="section section-contact">
    <div class="cta-card glass reveal">
      <div class="cta-orb cta-orb-1"></div>
      <div class="cta-orb cta-orb-2"></div>
      <div class="cta-orb cta-orb-3"></div>
      <div class="sparkle lg" style="top: 8%; left: 10%; animation-delay: 0.5s"></div>
      <div class="sparkle violet" style="bottom: 12%; right: 8%; animation-delay: 2s"></div>
      <div class="cta-content">
        <h2 class="cta-title">{{ t('contact.title.1') }} <span class="gradient-text">{{ t('contact.title.2') }}</span>?</h2>
        <p class="cta-desc">{{ t('contact.desc') }}</p>

        <!-- Quick Scan -->
        <div class="quick-scan">
          <p class="quick-scan-title">{{ t('contact.scan.title') }}</p>
          <div class="quick-scan-options">
            <button
              v-for="opt in scanOptions"
              :key="opt.key"
              :class="['scan-option', { 'scan-active': activeOption === opt.key }]"
              @click="selectScan(opt.key)"
            >
              <span v-html="opt.icon"></span>
              {{ t(`contact.scan.${opt.key}`) }}
            </button>
          </div>
        </div>

        <!-- Success message -->
        <p v-if="isSuccess" class="form-success">{{ t('contact.thanks') }}</p>

        <!-- Contact form -->
        <form v-else class="contact-form" @submit.prevent="handleSubmit">
          <input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off" />
          <div class="form-row-inline">
            <div class="form-field">
              <input
                type="text"
                name="name"
                :placeholder="t('contact.name')"
                v-model="name"
                required
              />
            </div>
            <div class="form-field">
              <input
                type="email"
                name="email"
                :placeholder="t('contact.email')"
                v-model="email"
                required
              />
            </div>
          </div>
          <div class="form-field">
            <textarea
              name="message"
              :placeholder="t('contact.message')"
              rows="4"
              v-model="message"
              required
            ></textarea>
          </div>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            {{ isSubmitting ? '...' : t('contact.submit') }}
          </button>
        </form>

        <p class="contact-personal">{{ t('contact.personal') }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .section-contact { padding-bottom: 120px; }
  .cta-card { max-width: 760px; margin: 0 auto; padding: 64px; position: relative; overflow: hidden; }
  .cta-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
  .cta-orb-1 { width: 240px; height: 240px; background: var(--accent); opacity: 0.08; top: -80px; right: -60px; animation: breathe 8s ease-in-out infinite; }
  .cta-orb-2 { width: 200px; height: 200px; background: var(--accent-violet); opacity: 0.06; bottom: -60px; left: -60px; animation: breathe 10s ease-in-out infinite; animation-delay: -3s; }
  .cta-orb-3 { width: 160px; height: 160px; background: var(--accent-gold); opacity: 0.04; top: 50%; left: 50%; transform: translate(-50%, -50%); animation: breathe 12s ease-in-out infinite; animation-delay: -6s; }
  .cta-content { position: relative; }
  .cta-title { font-size: clamp(1.75rem, 3vw, 2.5rem); line-height: 1.2; margin-bottom: 12px; letter-spacing: -0.025em; text-align: center; }
  .cta-desc { color: var(--text-muted); text-align: center; font-size: 1.05rem; margin-bottom: 32px; }

  /* Quick Scan */
  .quick-scan { margin-bottom: 32px; }
  .quick-scan-title { font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); text-align: center; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.06em; }
  .quick-scan-options { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .scan-option { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; font-size: 0.85rem; font-weight: 500; color: var(--text-muted); background: var(--bg-glass); border: 1px solid var(--border-glass); border-radius: 8px; cursor: pointer; font-family: var(--font-body); transition: all 0.3s ease; }
  .scan-option:hover { border-color: rgba(0, 212, 170, 0.3); color: var(--accent); background: rgba(0, 212, 170, 0.05); }
  .scan-option.scan-active { border-color: var(--accent); color: var(--accent); background: rgba(0, 212, 170, 0.08); }

  /* Form */
  .contact-form { display: flex; flex-direction: column; gap: 16px; }
  .form-row-inline { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-field input, .form-field textarea { width: 100%; padding: 14px 18px; border-radius: 8px; border: 1px solid var(--input-border); background: var(--input-bg); color: var(--text-primary); font-family: var(--font-body); font-size: 0.95rem; transition: border-color 0.3s ease, box-shadow 0.3s ease; }
  .form-field input::placeholder, .form-field textarea::placeholder { color: var(--text-muted); opacity: 0.7; }
  .form-field input:focus, .form-field textarea:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent), 0 0 32px rgba(0, 212, 170, 0.12); }
  .form-field textarea { resize: vertical; min-height: 100px; }
  .btn-submit { display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 14px 28px; background: var(--accent); color: var(--bg-deep); font-family: var(--font-body); font-weight: 600; font-size: 0.95rem; letter-spacing: 0.02em; border-radius: 8px; border: none; cursor: pointer; transition: transform 0.25s ease, box-shadow 0.35s ease; align-self: center; position: relative; overflow: hidden; }
  .btn-submit::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent); transform: translateX(-100%); transition: transform 0.6s ease; }
  .btn-submit:hover::before { transform: translateX(100%); }
  .btn-submit:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0, 212, 170, 0.4); }
  .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

  .contact-personal { text-align: center; margin-top: 20px; font-size: 0.9rem; color: var(--text-muted); font-style: italic; }

  .form-success { text-align: center; font-size: 1.1rem; color: var(--accent); padding: 40px 0; }

  @media (max-width: 900px) {
    .form-row-inline { grid-template-columns: 1fr; }
    .cta-card { padding: 40px 24px; }
    .quick-scan-options { flex-direction: column; }
  }
</style>
