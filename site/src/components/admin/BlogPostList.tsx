import { useState, useEffect } from 'react';

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

export default function BlogPostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch('/api/blog');
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      setPosts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function togglePublish(post: Post) {
    try {
      const res = await fetch(`/api/blog/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      });
      if (!res.ok) throw new Error('Failed to update post');
      await fetchPosts();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function deletePost(post: Post) {
    if (!confirm(`Weet je zeker dat je "${post.title}" wilt verwijderen?`)) return;
    try {
      const res = await fetch(`/api/blog/${post.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');
      await fetchPosts();
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) return <p style={{ color: '#787890' }}>Laden...</p>;
  if (error) return <p style={{ color: '#ff6b6b' }}>{error}</p>;

  return (
    <div>
      <div style={styles.header}>
        <span style={styles.count}>{posts.length} post{posts.length !== 1 ? 's' : ''}</span>
        <a href="/admin/blog/new" style={styles.newBtn}>
          + Nieuw artikel
        </a>
      </div>

      {posts.length === 0 ? (
        <div style={styles.empty}>
          <p>Nog geen blogposts. Maak je eerste aan!</p>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Titel</th>
              <th style={styles.th}>Locale</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Datum</th>
              <th style={styles.thRight}>Acties</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} style={styles.tr}>
                <td style={styles.td}>
                  <span style={styles.titleText}>{post.title}</span>
                  <span style={styles.slug}>/{post.slug}</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.locale}>{post.locale.toUpperCase()}</span>
                </td>
                <td style={styles.td}>
                  <span style={post.published ? styles.published : styles.draft}>
                    {post.published ? 'Gepubliceerd' : 'Concept'}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={styles.date}>
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString('nl-NL', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </span>
                </td>
                <td style={{ ...styles.td, textAlign: 'right' as const }}>
                  <div style={styles.actions}>
                    <a href={`/admin/blog/${post.id}/edit`} style={styles.actionBtn}>Bewerken</a>
                    <button onClick={() => togglePublish(post)} style={styles.actionBtn}>
                      {post.published ? 'Depubliceren' : 'Publiceren'}
                    </button>
                    <button onClick={() => deletePost(post)} style={styles.deleteBtn}>Verwijderen</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  count: {
    fontSize: '0.85rem',
    color: '#787890',
  },
  newBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    background: '#00d4aa',
    color: '#030306',
    fontWeight: 600,
    fontSize: '0.85rem',
    borderRadius: 6,
    textDecoration: 'none',
  },
  empty: {
    textAlign: 'center' as const,
    padding: '60px 0',
    color: '#787890',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  th: {
    textAlign: 'left' as const,
    padding: '10px 12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#787890',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  },
  thRight: {
    textAlign: 'right' as const,
    padding: '10px 12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#787890',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  },
  tr: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  },
  td: {
    padding: '14px 12px',
    fontSize: '0.9rem',
    verticalAlign: 'middle' as const,
  },
  titleText: {
    display: 'block',
    fontWeight: 500,
    color: '#f4f4f6',
  },
  slug: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#787890',
    marginTop: 2,
  },
  locale: {
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '2px 6px',
    background: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 4,
    color: '#b4b4c0',
  },
  published: {
    fontSize: '0.8rem',
    fontWeight: 500,
    color: '#00d4aa',
  },
  draft: {
    fontSize: '0.8rem',
    fontWeight: 500,
    color: '#787890',
  },
  date: {
    fontSize: '0.85rem',
    color: '#b4b4c0',
  },
  actions: {
    display: 'flex',
    gap: 8,
    justifyContent: 'flex-end',
  },
  actionBtn: {
    padding: '5px 10px',
    fontSize: '0.8rem',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    color: '#b4b4c0',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  deleteBtn: {
    padding: '5px 10px',
    fontSize: '0.8rem',
    background: 'rgba(255, 59, 48, 0.08)',
    border: '1px solid rgba(255, 59, 48, 0.15)',
    borderRadius: 4,
    color: '#ff6b6b',
    cursor: 'pointer',
  },
};
