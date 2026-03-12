<template>
  <div>
    <p v-if="loading" style="color: var(--text-muted)">Laden...</p>
    <p v-else-if="error" style="color: #ff6b6b">{{ error }}</p>
    <template v-else>
      <div class="list-header">
        <span class="count">{{ posts.length }} post{{ posts.length !== 1 ? 's' : '' }}</span>
        <NuxtLink to="/admin/blog/new" class="new-btn">+ Nieuw artikel</NuxtLink>
      </div>

      <div v-if="posts.length === 0" class="empty">
        <p>Nog geen blogposts. Maak je eerste aan!</p>
      </div>

      <table v-else class="table">
        <thead>
          <tr>
            <th class="th">Titel</th>
            <th class="th">Locale</th>
            <th class="th">Status</th>
            <th class="th">Datum</th>
            <th class="th th-right">Acties</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id" class="tr">
            <td class="td">
              <span class="title-text">{{ post.title }}</span>
              <span class="slug">/{{ post.slug }}</span>
            </td>
            <td class="td">
              <span class="locale-badge">{{ post.locale.toUpperCase() }}</span>
            </td>
            <td class="td">
              <span :class="post.published ? 'status-published' : 'status-draft'">
                {{ post.published ? 'Gepubliceerd' : 'Concept' }}
              </span>
            </td>
            <td class="td">
              <span class="date">{{ formatDate(post.publishedAt || post.createdAt) }}</span>
            </td>
            <td class="td td-right">
              <div class="actions">
                <NuxtLink :to="`/admin/blog/${post.id}/edit`" class="action-btn">Bewerken</NuxtLink>
                <button class="action-btn" @click="togglePublish(post)">
                  {{ post.published ? 'Depubliceren' : 'Publiceren' }}
                </button>
                <button class="delete-btn" @click="deletePost(post)">Verwijderen</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script setup lang="ts">
interface Post {
  id: string;
  slug: string;
  locale: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const posts = ref<Post[]>([]);
const loading = ref(true);
const error = ref('');

onMounted(() => fetchPosts());

async function fetchPosts() {
  loading.value = true;
  error.value = '';
  try {
    posts.value = await $fetch<Post[]>('/api/blog');
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'Failed to fetch posts';
  } finally {
    loading.value = false;
  }
}

async function togglePublish(post: Post) {
  try {
    await $fetch(`/api/blog/${post.id}`, {
      method: 'PUT',
      body: { published: !post.published },
    });
    await fetchPosts();
  } catch (err: any) {
    alert(err.data?.message || err.message);
  }
}

async function deletePost(post: Post) {
  if (!confirm(`Weet je zeker dat je "${post.title}" wilt verwijderen?`)) return;
  try {
    await $fetch(`/api/blog/${post.id}`, { method: 'DELETE' });
    await fetchPosts();
  } catch (err: any) {
    alert(err.data?.message || err.message);
  }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '–';
  return new Date(dateStr).toLocaleDateString('nl-NL', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}
</script>

<style scoped>
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.count { font-size: 0.85rem; color: var(--text-muted); }

.new-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--accent);
  color: var(--bg-deep);
  font-weight: 600;
  font-size: 0.85rem;
  border-radius: 6px;
  text-decoration: none;
}

.empty {
  text-align: center;
  padding: 60px 0;
  color: var(--text-muted);
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.th {
  text-align: left;
  padding: 10px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-glass);
}

.th-right { text-align: right; }

.tr { border-bottom: 1px solid rgba(255, 255, 255, 0.04); }

.td {
  padding: 14px 12px;
  font-size: 0.9rem;
  vertical-align: middle;
}

.td-right { text-align: right; }

.title-text {
  display: block;
  font-weight: 500;
  color: var(--text-primary);
}

.slug {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.locale-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  color: var(--text-secondary);
}

.status-published {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--accent);
}

.status-draft {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-muted);
}

.date {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  padding: 5px 10px;
  font-size: 0.8rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  color: var(--text-secondary);
  cursor: pointer;
  text-decoration: none;
  transition: border-color 0.2s;
}

.action-btn:hover {
  border-color: rgba(255, 255, 255, 0.16);
}

.delete-btn {
  padding: 5px 10px;
  font-size: 0.8rem;
  background: rgba(255, 59, 48, 0.08);
  border: 1px solid rgba(255, 59, 48, 0.15);
  border-radius: 4px;
  color: #ff6b6b;
  cursor: pointer;
}
</style>
