import { useState, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Highlight } from '@tiptap/extension-highlight';

interface BlogEditorProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    locale: string;
    tags: string[];
    author: string;
    published: boolean;
    image: string | null;
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export default function BlogEditor({ post }: BlogEditorProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [description, setDescription] = useState(post?.description || '');
  const [locale, setLocale] = useState(post?.locale || 'nl');
  const [tagsInput, setTagsInput] = useState(post?.tags?.join(', ') || '');
  const [author, setAuthor] = useState(post?.author || 'Camille');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [autoSlug, setAutoSlug] = useState(!post);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Image.configure({ inline: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Placeholder.configure({ placeholder: 'Begin met schrijven...' }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
    ],
    content: post?.content ? JSON.parse(post.content) : undefined,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (autoSlug && title) {
      setSlug(slugify(title));
    }
  }, [title, autoSlug]);

  const handleSlugChange = (value: string) => {
    setAutoSlug(false);
    setSlug(value);
  };

  const save = useCallback(async (publish: boolean) => {
    if (!editor) return;
    if (!title.trim() || !description.trim()) {
      setError('Titel en beschrijving zijn verplicht');
      return;
    }

    setSaving(true);
    setError('');
    setSaved(false);

    const json = editor.getJSON();
    const html = editor.getHTML();
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    const body = {
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      description: description.trim(),
      content: JSON.stringify(json),
      contentHtml: html,
      locale,
      tags,
      author: author.trim() || 'Camille',
      published: publish,
    };

    try {
      const url = post ? `/api/blog/${post.id}` : '/api/blog';
      const method = post ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      const saved = await res.json();
      setSaved(true);

      if (!post) {
        window.location.href = `/admin/blog/${saved.id}/edit`;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [editor, title, slug, description, locale, tagsInput, author, post]);

  const addImage = useCallback(() => {
    const url = window.prompt('Afbeelding URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    const url = window.prompt('Link URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addTable = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div style={styles.wrapper}>
      {/* Meta fields */}
      <div style={styles.metaGrid}>
        <div style={styles.field}>
          <label style={styles.label}>Titel</label>
          <input
            style={styles.input}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Post titel"
          />
        </div>
        <div style={styles.fieldRow}>
          <div style={{ ...styles.field, flex: 1 }}>
            <label style={styles.label}>Slug</label>
            <input
              style={styles.input}
              value={slug}
              onChange={e => handleSlugChange(e.target.value)}
              placeholder="auto-generated"
            />
          </div>
          <div style={styles.fieldSmall}>
            <label style={styles.label}>Locale</label>
            <select style={styles.select} value={locale} onChange={e => setLocale(e.target.value)}>
              <option value="nl">NL</option>
              <option value="en">EN</option>
            </select>
          </div>
          <div style={styles.fieldSmall}>
            <label style={styles.label}>Auteur</label>
            <input style={styles.input} value={author} onChange={e => setAuthor(e.target.value)} />
          </div>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Beschrijving</label>
          <textarea
            style={styles.textarea}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Korte samenvatting..."
            rows={2}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Tags (komma-gescheiden)</label>
          <input
            style={styles.input}
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
            placeholder="AI, Automatisering, Development"
          />
        </div>
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolGroup}>
          <ToolBtn
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >B</ToolBtn>
          <ToolBtn
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          ><em>I</em></ToolBtn>
          <ToolBtn
            active={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline"
          ><u>U</u></ToolBtn>
          <ToolBtn
            active={editor.isActive('highlight')}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            title="Highlight"
          >H</ToolBtn>
          <ToolBtn
            active={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          ><s>S</s></ToolBtn>
        </div>

        <span style={styles.divider} />

        <div style={styles.toolGroup}>
          <ToolBtn
            active={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Heading 2"
          >H2</ToolBtn>
          <ToolBtn
            active={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            title="Heading 3"
          >H3</ToolBtn>
          <ToolBtn
            active={editor.isActive('heading', { level: 4 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            title="Heading 4"
          >H4</ToolBtn>
        </div>

        <span style={styles.divider} />

        <div style={styles.toolGroup}>
          <ToolBtn
            active={editor.isActive({ textAlign: 'left' })}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            title="Align left"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
          </ToolBtn>
          <ToolBtn
            active={editor.isActive({ textAlign: 'center' })}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            title="Align center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>
          </ToolBtn>
          <ToolBtn
            active={editor.isActive({ textAlign: 'right' })}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            title="Align right"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
          </ToolBtn>
        </div>

        <span style={styles.divider} />

        <div style={styles.toolGroup}>
          <ToolBtn
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet list"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </ToolBtn>
          <ToolBtn
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Ordered list"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
          </ToolBtn>
          <ToolBtn
            active={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Blockquote"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 .034 0 .036.003.036z"/></svg>
          </ToolBtn>
          <ToolBtn
            active={editor.isActive('codeBlock')}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="Code block"
          >{'</>'}</ToolBtn>
        </div>

        <span style={styles.divider} />

        <div style={styles.toolGroup}>
          <ToolBtn active={false} onClick={addLink} title="Link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </ToolBtn>
          <ToolBtn active={false} onClick={addImage} title="Image">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </ToolBtn>
          <ToolBtn active={false} onClick={addTable} title="Table">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
          </ToolBtn>
          <ToolBtn
            active={false}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal rule"
          >—</ToolBtn>
        </div>
      </div>

      {/* Editor */}
      <div style={styles.editorWrapper}>
        <EditorContent editor={editor} />
      </div>

      {/* Actions */}
      {error && <p style={styles.error}>{error}</p>}
      {saved && <p style={styles.success}>Opgeslagen!</p>}

      <div style={styles.actions}>
        <button
          style={styles.draftBtn}
          onClick={() => save(false)}
          disabled={saving}
        >
          {saving ? 'Opslaan...' : 'Opslaan als concept'}
        </button>
        <button
          style={styles.publishBtn}
          onClick={() => save(true)}
          disabled={saving}
        >
          {saving ? 'Publiceren...' : 'Publiceren'}
        </button>
      </div>
    </div>
  );
}

function ToolBtn({ active, onClick, title, children }: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        ...toolBtnStyle,
        background: active ? 'rgba(0, 212, 170, 0.15)' : 'transparent',
        color: active ? '#00d4aa' : '#b4b4c0',
      }}
    >
      {children}
    </button>
  );
}

const toolBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: '0.8rem',
  fontWeight: 600,
  transition: 'background 0.15s, color 0.15s',
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    maxWidth: 900,
  },
  metaGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 16,
    marginBottom: 24,
  },
  field: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 6,
  },
  fieldRow: {
    display: 'flex',
    gap: 12,
  },
  fieldSmall: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 6,
    width: 120,
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#787890',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
  },
  input: {
    padding: '10px 12px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 6,
    color: '#f4f4f6',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'inherit',
  },
  select: {
    padding: '10px 12px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 6,
    color: '#f4f4f6',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'inherit',
  },
  textarea: {
    padding: '10px 12px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 6,
    color: '#f4f4f6',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '8px 12px',
    background: 'rgba(14, 14, 22, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderBottom: 'none',
    borderRadius: '8px 8px 0 0',
    flexWrap: 'wrap' as const,
  },
  toolGroup: {
    display: 'flex',
    gap: 2,
  },
  divider: {
    width: 1,
    height: 24,
    background: 'rgba(255, 255, 255, 0.08)',
    margin: '0 4px',
  },
  editorWrapper: {
    minHeight: 400,
    padding: '20px 24px',
    background: 'rgba(14, 14, 22, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '0 0 8px 8px',
    color: '#f4f4f6',
    fontSize: '1rem',
    lineHeight: 1.7,
  },
  error: {
    color: '#ff6b6b',
    fontSize: '0.85rem',
    marginTop: 12,
  },
  success: {
    color: '#00d4aa',
    fontSize: '0.85rem',
    marginTop: 12,
  },
  actions: {
    display: 'flex',
    gap: 12,
    marginTop: 20,
  },
  draftBtn: {
    padding: '10px 24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'transparent',
    borderRadius: 6,
    color: '#b4b4c0',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  publishBtn: {
    padding: '10px 24px',
    border: 'none',
    background: '#00d4aa',
    borderRadius: 6,
    color: '#030306',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
};
