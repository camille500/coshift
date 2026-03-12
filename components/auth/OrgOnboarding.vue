<template>
  <div class="container">
    <div class="card">
      <h1 class="title">{{ mode === 'choose' ? titleText : mode === 'create' ? t.createBtn : t.joinBtn }}</h1>
      <p class="subtitle">{{ t.subtitle }}</p>

      <p v-if="error" class="error">{{ error }}</p>

      <div v-if="mode === 'choose'" class="choices">
        <button class="choice-btn" @click="mode = 'create'">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          <span>{{ t.createBtn }}</span>
        </button>
        <button class="choice-btn" @click="mode = 'join'">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          <span>{{ t.joinBtn }}</span>
        </button>
      </div>

      <form v-if="mode === 'create'" class="form" @submit.prevent="handleCreate">
        <label class="label">{{ t.orgNameLabel }}</label>
        <input
          v-model="orgName"
          class="input"
          type="text"
          :placeholder="t.orgNamePlaceholder"
          required
          autofocus
        />
        <div class="actions">
          <button type="button" class="back-btn" @click="mode = 'choose'">{{ t.back }}</button>
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? t.creating : t.submit }}
          </button>
        </div>
      </form>

      <form v-if="mode === 'join'" class="form" @submit.prevent="handleJoin">
        <label class="label">{{ t.codeLabel }}</label>
        <input
          v-model="inviteCode"
          class="input"
          type="text"
          :placeholder="t.codePlaceholder"
          required
          autofocus
        />
        <div class="actions">
          <button type="button" class="back-btn" @click="mode = 'choose'">{{ t.back }}</button>
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? t.joining : t.submit }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n();

const mode = ref<'choose' | 'create' | 'join'>('choose');
const orgName = ref('');
const inviteCode = ref('');
const loading = ref(false);
const error = ref('');

const t = computed(() => ({
  title: locale.value === 'nl' ? 'Welkom bij CoShift' : 'Welcome to CoShift',
  subtitle: locale.value === 'nl'
    ? 'Je hebt nog geen organisatie. Maak er een aan of join een bestaande.'
    : "You don't have an organization yet. Create one or join an existing one.",
  createBtn: locale.value === 'nl' ? 'Organisatie aanmaken' : 'Create organization',
  joinBtn: locale.value === 'nl' ? 'Bestaande organisatie joinen' : 'Join existing organization',
  orgNameLabel: locale.value === 'nl' ? 'Naam organisatie' : 'Organization name',
  orgNamePlaceholder: locale.value === 'nl' ? 'Bijv. Mijn Bedrijf B.V.' : 'E.g. My Company Ltd.',
  codeLabel: locale.value === 'nl' ? 'Uitnodigingscode' : 'Invite code',
  codePlaceholder: locale.value === 'nl' ? 'Voer je code in' : 'Enter your code',
  submit: locale.value === 'nl' ? 'Bevestigen' : 'Confirm',
  back: locale.value === 'nl' ? 'Terug' : 'Back',
  creating: locale.value === 'nl' ? 'Aanmaken...' : 'Creating...',
  joining: locale.value === 'nl' ? 'Joinen...' : 'Joining...',
}));

const titleText = computed(() => t.value.title);

async function handleCreate() {
  if (!orgName.value.trim()) return;
  loading.value = true;
  error.value = '';
  try {
    await $fetch('/api/organizations', {
      method: 'POST',
      body: { name: orgName.value.trim() },
    });
    window.location.href = '/';
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'Failed to create organization';
    loading.value = false;
  }
}

async function handleJoin() {
  if (!inviteCode.value.trim()) return;
  loading.value = true;
  error.value = '';
  try {
    await $fetch('/api/organizations/join', {
      method: 'POST',
      body: { code: inviteCode.value.trim() },
    });
    window.location.href = '/';
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'Invalid invite code';
    loading.value = false;
  }
}
</script>

<style scoped>
.container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 24px 80px;
}

.card {
  max-width: 480px;
  width: 100%;
  background: rgba(14, 14, 22, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 40px 32px;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.subtitle {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 32px;
  line-height: 1.6;
}

.error {
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.2);
  border-radius: 8px;
  padding: 10px 14px;
  color: #ff6b6b;
  font-size: 0.85rem;
  margin-bottom: 16px;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.choice-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  width: 100%;
  text-align: left;
}

.choice-btn:hover {
  border-color: rgba(0, 212, 170, 0.3);
  background: rgba(0, 212, 170, 0.04);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.input {
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.input:focus {
  border-color: rgba(0, 212, 170, 0.4);
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.back-btn {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.back-btn:hover {
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
}

.submit-btn {
  flex: 1;
  padding: 10px 20px;
  background: var(--accent);
  border: none;
  border-radius: 8px;
  color: var(--bg-deep);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
