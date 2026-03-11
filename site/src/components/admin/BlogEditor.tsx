import { useState, useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
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
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';
import { Youtube } from '@tiptap/extension-youtube';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Superscript } from '@tiptap/extension-superscript';
import { Subscript } from '@tiptap/extension-subscript';
import { Typography } from '@tiptap/extension-typography';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Extension, Node as TiptapNode, mergeAttributes } from '@tiptap/core';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { CharacterCount } from '@tiptap/extension-character-count';
import Suggestion from '@tiptap/suggestion';
import tippy, { type Instance as TippyInstance } from 'tippy.js';
import { PluginKey } from '@tiptap/pm/state';
import type { Editor as TiptapEditor } from '@tiptap/core';

const lowlight = createLowlight(common);

// ─── Callout Extension ───────────────────────────────────────────────────────

const Callout = TiptapNode.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      type: {
        default: 'info',
        parseHTML: (element) => element.getAttribute('data-callout-type') || 'info',
        renderHTML: (attributes) => ({ 'data-callout-type': attributes.type }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-callout]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-callout': '', class: `callout callout-${HTMLAttributes['data-callout-type'] || 'info'}` }), 0];
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { $anchor } = editor.state.selection;
        const isAtStart = $anchor.parentOffset === 0;
        const isInCallout = $anchor.node(-1)?.type.name === 'callout';
        if (isAtStart && isInCallout && $anchor.parent.textContent === '') {
          return editor.chain().lift('callout').run();
        }
        return false;
      },
    };
  },
});

// ─── Columns Extensions ──────────────────────────────────────────────────────

const Columns = TiptapNode.create({
  name: 'columns',
  group: 'block',
  content: 'column+',
  defining: true,

  addAttributes() {
    return {
      count: {
        default: 2,
        parseHTML: (element) => parseInt(element.getAttribute('data-columns') || '2', 10),
        renderHTML: (attributes) => ({ 'data-columns': attributes.count }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-columns]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: `columns columns-${HTMLAttributes['data-columns'] || 2}` }), 0];
  },
});

const Column = TiptapNode.create({
  name: 'column',
  group: '',
  content: 'block+',
  defining: true,

  parseHTML() {
    return [{ tag: 'div[data-column]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-column': '', class: 'column' }), 0];
  },
});

// ─── Slash Command Items ─────────────────────────────────────────────────────

interface SlashCommandItem {
  title: string;
  description: string;
  icon: string;
  command: (props: { editor: TiptapEditor; range: { from: number; to: number } }) => void;
}

const slashCommandItems: SlashCommandItem[] = [
  {
    title: 'Tekst',
    description: 'Standaard tekst',
    icon: 'T',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setParagraph().run();
    },
  },
  {
    title: 'Heading 1',
    description: 'Grote koptekst',
    icon: 'H1',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
    },
  },
  {
    title: 'Heading 2',
    description: 'Middelgrote koptekst',
    icon: 'H2',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
    },
  },
  {
    title: 'Heading 3',
    description: 'Kleine koptekst',
    icon: 'H3',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
    },
  },
  {
    title: 'Opsomming',
    description: 'Ongeordende lijst',
    icon: '•',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: 'Genummerde lijst',
    description: 'Geordende lijst',
    icon: '1.',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: 'Takenlijst',
    description: 'Lijst met checkboxen',
    icon: '☑',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: 'Citaat',
    description: 'Blockquote',
    icon: '❝',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setBlockquote().run();
    },
  },
  {
    title: 'Callout - Info',
    description: 'Informatie blok',
    icon: 'ℹ',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertContent({
        type: 'callout',
        attrs: { type: 'info' },
        content: [{ type: 'paragraph' }],
      }).run();
    },
  },
  {
    title: 'Callout - Waarschuwing',
    description: 'Waarschuwing blok',
    icon: '⚠',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertContent({
        type: 'callout',
        attrs: { type: 'warning' },
        content: [{ type: 'paragraph' }],
      }).run();
    },
  },
  {
    title: 'Callout - Tip',
    description: 'Tip blok',
    icon: '💡',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertContent({
        type: 'callout',
        attrs: { type: 'tip' },
        content: [{ type: 'paragraph' }],
      }).run();
    },
  },
  {
    title: 'Callout - Succes',
    description: 'Succes blok',
    icon: '✓',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertContent({
        type: 'callout',
        attrs: { type: 'success' },
        content: [{ type: 'paragraph' }],
      }).run();
    },
  },
  {
    title: 'Code blok',
    description: 'Code met syntax highlighting',
    icon: '</>',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setCodeBlock().run();
    },
  },
  {
    title: 'Afbeelding',
    description: 'Voeg een afbeelding in via URL',
    icon: '🖼',
    command: ({ editor, range }) => {
      const url = window.prompt('Afbeelding URL:');
      if (url) {
        editor.chain().focus().deleteRange(range).setImage({ src: url }).run();
      } else {
        editor.chain().focus().deleteRange(range).run();
      }
    },
  },
  {
    title: 'YouTube',
    description: 'Embed een YouTube video',
    icon: '▶',
    command: ({ editor, range }) => {
      const url = window.prompt('YouTube URL:');
      if (url) {
        editor.chain().focus().deleteRange(range).run();
        editor.commands.setYoutubeVideo({ src: url });
      } else {
        editor.chain().focus().deleteRange(range).run();
      }
    },
  },
  {
    title: 'Tabel',
    description: '3x3 tabel invoegen',
    icon: '▦',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    },
  },
  {
    title: 'Scheidingslijn',
    description: 'Horizontale lijn',
    icon: '—',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
  {
    title: '2 Kolommen',
    description: 'Layout met 2 kolommen',
    icon: '▥',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertContent({
        type: 'columns',
        attrs: { count: 2 },
        content: [
          { type: 'column', content: [{ type: 'paragraph' }] },
          { type: 'column', content: [{ type: 'paragraph' }] },
        ],
      }).run();
    },
  },
  {
    title: '3 Kolommen',
    description: 'Layout met 3 kolommen',
    icon: '▤',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertContent({
        type: 'columns',
        attrs: { count: 3 },
        content: [
          { type: 'column', content: [{ type: 'paragraph' }] },
          { type: 'column', content: [{ type: 'paragraph' }] },
          { type: 'column', content: [{ type: 'paragraph' }] },
        ],
      }).run();
    },
  },
];

// ─── Slash Commands Popup Component ──────────────────────────────────────────

function SlashCommandList({
  items,
  command,
}: {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % items.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items[selectedIndex]) {
          command(items[selectedIndex]);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, command]);

  useEffect(() => {
    const active = containerRef.current?.querySelector('.slash-item-active');
    active?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (items.length === 0) {
    return (
      <div className="slash-command-menu">
        <div className="slash-command-empty">Geen resultaten</div>
      </div>
    );
  }

  return (
    <div className="slash-command-menu" ref={containerRef}>
      {items.map((item, index) => (
        <button
          key={item.title}
          className={`slash-command-item ${index === selectedIndex ? 'slash-item-active' : ''}`}
          onClick={() => command(item)}
          onMouseEnter={() => setSelectedIndex(index)}
        >
          <span className="slash-command-icon">{item.icon}</span>
          <div className="slash-command-text">
            <span className="slash-command-title">{item.title}</span>
            <span className="slash-command-description">{item.description}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Slash Command Extension ─────────────────────────────────────────────────

const slashCommandPluginKey = new PluginKey('slashCommand');

const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        pluginKey: slashCommandPluginKey,
        command: ({ editor, range, props }: { editor: TiptapEditor; range: { from: number; to: number }; props: SlashCommandItem }) => {
          props.command({ editor, range });
        },
        items: ({ query }: { query: string }) => {
          return slashCommandItems.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
          );
        },
        render: () => {
          let component: ReactRenderer | null = null;
          let popup: TippyInstance[] | null = null;

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(SlashCommandList, {
                props,
                editor: props.editor,
              });

              if (!props.clientRect) return;

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
                theme: 'slash-command',
                offset: [0, 8],
                popperOptions: {
                  modifiers: [{ name: 'flip', options: { fallbackPlacements: ['top-start'] } }],
                },
              });
            },
            onUpdate: (props: any) => {
              component?.updateProps(props);
              if (props.clientRect && popup?.[0]) {
                popup[0].setProps({ getReferenceClientRect: props.clientRect });
              }
            },
            onKeyDown: (props: any) => {
              if (props.event.key === 'Escape') {
                popup?.[0]?.hide();
                return true;
              }
              if (['ArrowUp', 'ArrowDown', 'Enter'].includes(props.event.key)) {
                return true;
              }
              return false;
            },
            onExit: () => {
              popup?.[0]?.destroy();
              component?.destroy();
            },
          };
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

// ─── Block Handle / Drag Handle ──────────────────────────────────────────────

function BlockHandle({ editor }: { editor: TiptapEditor }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [resolvedPos, setResolvedPos] = useState<number | null>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const editorEl = editor.view.dom;
    const editorContainer = editorEl.closest('.notion-editor-content');

    const handleMouseMove = (evt: Event) => {
      const e = evt as MouseEvent;
      if (menuOpen) return;

      const editorRect = editorEl.getBoundingClientRect();
      const containerRect = editorContainer?.getBoundingClientRect();
      if (!containerRect) return;

      // Only show when mouse is in the editor zone
      if (e.clientX < containerRect.left - 60 || e.clientX > containerRect.right + 20 ||
          e.clientY < editorRect.top || e.clientY > editorRect.bottom) {
        setVisible(false);
        return;
      }

      const posAtCoords = editor.view.posAtCoords({ left: editorRect.left + 10, top: e.clientY });
      if (!posAtCoords) {
        setVisible(false);
        return;
      }

      try {
        const resolved = editor.state.doc.resolve(posAtCoords.pos);
        // Find the top-level block node
        const depth = resolved.depth;
        if (depth === 0) {
          setVisible(false);
          return;
        }

        const topPos = resolved.before(1);
        const dom = editor.view.nodeDOM(topPos);
        if (!dom || !(dom instanceof HTMLElement)) {
          setVisible(false);
          return;
        }

        const domRect = dom.getBoundingClientRect();
        setPos({
          top: domRect.top - containerRect.top,
          left: -36,
        });
        setResolvedPos(topPos);
        setVisible(true);
      } catch {
        setVisible(false);
      }
    };

    const handleMouseLeave = () => {
      if (!menuOpen) {
        setVisible(false);
      }
    };

    editorContainer?.addEventListener('mousemove', handleMouseMove);
    editorContainer?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      editorContainer?.removeEventListener('mousemove', handleMouseMove);
      editorContainer?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [editor, menuOpen]);

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) &&
          handleRef.current && !handleRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const deleteBlock = useCallback(() => {
    if (resolvedPos === null) return;
    try {
      const node = editor.state.doc.nodeAt(resolvedPos);
      if (node) {
        editor.chain().focus().deleteRange({ from: resolvedPos, to: resolvedPos + node.nodeSize }).run();
      }
    } catch { /* ignore */ }
    setMenuOpen(false);
  }, [editor, resolvedPos]);

  const duplicateBlock = useCallback(() => {
    if (resolvedPos === null) return;
    try {
      const node = editor.state.doc.nodeAt(resolvedPos);
      if (node) {
        const end = resolvedPos + node.nodeSize;
        const copy = node.toJSON();
        editor.chain().focus().insertContentAt(end, copy).run();
      }
    } catch { /* ignore */ }
    setMenuOpen(false);
  }, [editor, resolvedPos]);

  const turnInto = useCallback((type: string) => {
    if (resolvedPos === null) return;
    try {
      // Select the block first
      editor.chain().focus().setNodeSelection(resolvedPos).run();
      switch (type) {
        case 'paragraph':
          editor.chain().focus().setParagraph().run();
          break;
        case 'h1':
          editor.chain().focus().setHeading({ level: 1 }).run();
          break;
        case 'h2':
          editor.chain().focus().setHeading({ level: 2 }).run();
          break;
        case 'h3':
          editor.chain().focus().setHeading({ level: 3 }).run();
          break;
        case 'bulletList':
          editor.chain().focus().toggleBulletList().run();
          break;
        case 'orderedList':
          editor.chain().focus().toggleOrderedList().run();
          break;
        case 'blockquote':
          editor.chain().focus().setBlockquote().run();
          break;
        case 'codeBlock':
          editor.chain().focus().setCodeBlock().run();
          break;
      }
    } catch { /* ignore */ }
    setMenuOpen(false);
  }, [editor, resolvedPos]);

  if (!visible && !menuOpen) return null;

  return (
    <>
      <div
        ref={handleRef}
        className="block-handle"
        style={{ top: pos.top, left: pos.left }}
        onClick={() => setMenuOpen(!menuOpen)}
        onMouseDown={(e) => e.preventDefault()}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <circle cx="4" cy="3" r="1.2" />
          <circle cx="10" cy="3" r="1.2" />
          <circle cx="4" cy="7" r="1.2" />
          <circle cx="10" cy="7" r="1.2" />
          <circle cx="4" cy="11" r="1.2" />
          <circle cx="10" cy="11" r="1.2" />
        </svg>
      </div>
      {menuOpen && (
        <div ref={menuRef} className="block-handle-menu" style={{ top: pos.top + 28, left: pos.left }}>
          <button className="block-handle-menu-item" onClick={deleteBlock}>
            <span className="block-handle-menu-icon">✕</span> Verwijderen
          </button>
          <button className="block-handle-menu-item" onClick={duplicateBlock}>
            <span className="block-handle-menu-icon">⊕</span> Dupliceren
          </button>
          <div className="block-handle-menu-divider" />
          <div className="block-handle-menu-label">Omzetten naar</div>
          <button className="block-handle-menu-item" onClick={() => turnInto('paragraph')}>
            <span className="block-handle-menu-icon">T</span> Tekst
          </button>
          <button className="block-handle-menu-item" onClick={() => turnInto('h1')}>
            <span className="block-handle-menu-icon">H1</span> Heading 1
          </button>
          <button className="block-handle-menu-item" onClick={() => turnInto('h2')}>
            <span className="block-handle-menu-icon">H2</span> Heading 2
          </button>
          <button className="block-handle-menu-item" onClick={() => turnInto('h3')}>
            <span className="block-handle-menu-icon">H3</span> Heading 3
          </button>
          <button className="block-handle-menu-item" onClick={() => turnInto('bulletList')}>
            <span className="block-handle-menu-icon">•</span> Opsomming
          </button>
          <button className="block-handle-menu-item" onClick={() => turnInto('orderedList')}>
            <span className="block-handle-menu-icon">1.</span> Genummerd
          </button>
          <button className="block-handle-menu-item" onClick={() => turnInto('blockquote')}>
            <span className="block-handle-menu-icon">❝</span> Citaat
          </button>
          <button className="block-handle-menu-item" onClick={() => turnInto('codeBlock')}>
            <span className="block-handle-menu-icon">{'</>'}</span> Code
          </button>
        </div>
      )}
    </>
  );
}

// ─── Bubble Menu Turn Into ───────────────────────────────────────────────────

function TurnIntoDropdown({ editor }: { editor: TiptapEditor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const options = [
    { label: 'Tekst', action: () => editor.chain().focus().setParagraph().run() },
    { label: 'Heading 1', action: () => editor.chain().focus().setHeading({ level: 1 }).run() },
    { label: 'Heading 2', action: () => editor.chain().focus().setHeading({ level: 2 }).run() },
    { label: 'Heading 3', action: () => editor.chain().focus().setHeading({ level: 3 }).run() },
    { label: 'Opsomming', action: () => editor.chain().focus().toggleBulletList().run() },
    { label: 'Genummerd', action: () => editor.chain().focus().toggleOrderedList().run() },
    { label: 'Citaat', action: () => editor.chain().focus().setBlockquote().run() },
    { label: 'Code', action: () => editor.chain().focus().setCodeBlock().run() },
  ];

  const currentLabel = editor.isActive('heading', { level: 1 })
    ? 'H1'
    : editor.isActive('heading', { level: 2 })
      ? 'H2'
      : editor.isActive('heading', { level: 3 })
        ? 'H3'
        : editor.isActive('bulletList')
          ? 'Lijst'
          : editor.isActive('orderedList')
            ? '1. Lijst'
            : editor.isActive('blockquote')
              ? 'Citaat'
              : editor.isActive('codeBlock')
                ? 'Code'
                : 'Tekst';

  return (
    <div className="bubble-turn-into" ref={ref}>
      <button
        className="bubble-btn bubble-turn-into-trigger"
        onClick={() => setOpen(!open)}
      >
        {currentLabel}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
        </svg>
      </button>
      {open && (
        <div className="bubble-turn-into-menu">
          {options.map((opt) => (
            <button
              key={opt.label}
              className="bubble-turn-into-option"
              onClick={() => {
                opt.action();
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Color Picker for Bubble Menu ────────────────────────────────────────────

function TextColorPicker({ editor }: { editor: TiptapEditor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const colors = [
    { label: 'Standaard', value: '' },
    { label: 'Accent', value: '#00d4aa' },
    { label: 'Rood', value: '#ff6b6b' },
    { label: 'Oranje', value: '#ff9f43' },
    { label: 'Geel', value: '#feca57' },
    { label: 'Blauw', value: '#61aeee' },
    { label: 'Paars', value: '#c678dd' },
    { label: 'Grijs', value: '#787890' },
  ];

  return (
    <div className="bubble-color-picker" ref={ref}>
      <button
        className="bubble-btn"
        onClick={() => setOpen(!open)}
        title="Tekstkleur"
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M3.5 12h8M5 8.5L7.5 2L10 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="2" y="13" width="11" height="1.5" rx="0.5" fill={editor.getAttributes('textStyle').color || '#f4f4f6'} />
        </svg>
      </button>
      {open && (
        <div className="bubble-color-menu">
          {colors.map((c) => (
            <button
              key={c.label}
              className="bubble-color-swatch"
              title={c.label}
              onClick={() => {
                if (c.value) {
                  editor.chain().focus().setColor(c.value).run();
                } else {
                  editor.chain().focus().unsetColor().run();
                }
                setOpen(false);
              }}
            >
              <span
                className="bubble-color-dot"
                style={{ background: c.value || '#f4f4f6' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Props ───────────────────────────────────────────────────────────────────

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

// ─── Main Editor ─────────────────────────────────────────────────────────────

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
  const [previewMode, setPreviewMode] = useState(false);
  const [isPublished, setIsPublished] = useState(post?.published || false);
  const [metaPanelOpen, setMetaPanelOpen] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Sync title from contentEditable
  const handleTitleInput = useCallback(() => {
    const text = titleRef.current?.textContent || '';
    setTitle(text);
  }, []);

  // Set initial title in contentEditable
  useEffect(() => {
    if (titleRef.current && post?.title) {
      titleRef.current.textContent = post.title;
    }
  }, []);

  // Handle title Enter key - move focus to editor
  const handleTitleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editor?.commands.focus('start');
    }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
        dropcursor: false,
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Image.configure({ inline: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            const level = node.attrs.level;
            return `Heading ${level}`;
          }
          if (node.type.name === 'paragraph') {
            return 'Typ \'/\' voor commando\'s...';
          }
          return '';
        },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      Youtube.configure({ inline: false, nocookie: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Superscript,
      Subscript,
      Typography,
      TextStyle,
      Color,
      Dropcursor.configure({ color: '#00d4aa', width: 2 }),
      CharacterCount,
      Callout,
      Columns,
      Column,
      SlashCommand,
    ],
    content: post?.content ? JSON.parse(post.content) : undefined,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'notion-editor-body',
      },
    },
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
      setIsPublished(publish);

      if (!post) {
        window.location.href = `/admin/blog/${saved.id}/edit`;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [editor, title, slug, description, locale, tagsInput, author, post]);

  const unpublish = useCallback(async () => {
    if (!post) return;
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const res = await fetch(`/api/blog/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: false }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to unpublish');
      }

      setIsPublished(false);
      setSaved(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }, [post]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Link URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
  const wordCount = editor.storage.characterCount?.words() || 0;
  const charCount = editor.storage.characterCount?.characters() || 0;

  return (
    <div className="notion-editor-wrapper">
      {/* Top Bar */}
      <div className="notion-topbar">
        <div className="notion-topbar-left">
          <a href="/admin/blog" className="notion-topbar-back">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 12L6 8L10 4" />
            </svg>
            Blog
          </a>
          <span className="notion-topbar-divider">/</span>
          <span className="notion-topbar-title">{title || 'Nieuw artikel'}</span>
          {isPublished && <span className="notion-topbar-badge">Gepubliceerd</span>}
        </div>
        <div className="notion-topbar-right">
          <div className="notion-topbar-stats">
            {wordCount} woorden &middot; {charCount} tekens
          </div>
          <button
            className={`notion-topbar-btn ${metaPanelOpen ? 'active' : ''}`}
            onClick={() => setMetaPanelOpen(!metaPanelOpen)}
            title="Instellingen"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="2" />
              <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41" />
            </svg>
          </button>
          <div className="notion-topbar-actions">
            <button
              className={`notion-topbar-mode-btn ${!previewMode ? 'active' : ''}`}
              onClick={() => setPreviewMode(false)}
            >
              Bewerken
            </button>
            <button
              className={`notion-topbar-mode-btn ${previewMode ? 'active' : ''}`}
              onClick={() => setPreviewMode(true)}
            >
              Voorbeeld
            </button>
          </div>
          <button
            className="notion-save-btn draft"
            onClick={() => save(false)}
            disabled={saving}
          >
            {saving ? 'Opslaan...' : 'Concept'}
          </button>
          {post && isPublished && (
            <button
              className="notion-save-btn unpublish"
              onClick={unpublish}
              disabled={saving}
            >
              Depubliceren
            </button>
          )}
          <button
            className="notion-save-btn publish"
            onClick={() => save(true)}
            disabled={saving}
          >
            {saving ? 'Bezig...' : 'Publiceren'}
          </button>
        </div>
      </div>

      {/* Toast messages */}
      {error && <div className="notion-toast error">{error}</div>}
      {saved && <div className="notion-toast success">Opgeslagen!</div>}

      {/* Layout container */}
      <div className="notion-editor-layout">
        {/* Main editor area */}
        <div className="notion-editor-main">
          {previewMode ? (
            <div className="notion-preview-wrapper">
              <div className="blog-preview">
                <div className="blog-preview-header">
                  <div className="blog-preview-meta">
                    <span>{new Date().toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span>{author || 'Camille'}</span>
                  </div>
                  <h1 className="blog-preview-title">{title || 'Geen titel'}</h1>
                  <p className="blog-preview-description">{description || 'Geen beschrijving'}</p>
                  {tags.length > 0 && (
                    <div className="blog-preview-tags">
                      {tags.map(tag => <span key={tag} className="blog-preview-tag">{tag}</span>)}
                    </div>
                  )}
                </div>
                <div
                  className="blog-preview-content"
                  dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                />
              </div>
            </div>
          ) : (
            <div className="notion-editor-content">
              {/* Title */}
              <h1
                ref={titleRef}
                className="notion-title"
                contentEditable
                suppressContentEditableWarning
                onInput={handleTitleInput}
                onKeyDown={handleTitleKeyDown}
                data-placeholder="Untitled"
                spellCheck={false}
              />

              {/* Description */}
              <textarea
                className="notion-description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Voeg een beschrijving toe..."
                rows={1}
                onInput={e => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />

              {/* Block Handle */}
              <BlockHandle editor={editor} />

              {/* Bubble Menu */}
              <BubbleMenu
                editor={editor}
                options={{
                  placement: 'top',
                }}
                shouldShow={({ editor, from, to }) => {
                  if (from === to) return false;
                  if (editor.isActive('codeBlock')) return false;
                  return true;
                }}
              >
                <div className="notion-bubble-menu">
                  <TurnIntoDropdown editor={editor} />
                  <span className="bubble-divider" />
                  <button
                    className={`bubble-btn ${editor.isActive('bold') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Bold"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    className={`bubble-btn ${editor.isActive('italic') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic"
                  >
                    <em>I</em>
                  </button>
                  <button
                    className={`bubble-btn ${editor.isActive('underline') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    title="Underline"
                  >
                    <u>U</u>
                  </button>
                  <button
                    className={`bubble-btn ${editor.isActive('strike') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    title="Strikethrough"
                  >
                    <s>S</s>
                  </button>
                  <button
                    className={`bubble-btn ${editor.isActive('code') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    title="Code"
                  >
                    {'</>'}
                  </button>
                  <span className="bubble-divider" />
                  <button
                    className={`bubble-btn ${editor.isActive('link') ? 'active' : ''}`}
                    onClick={addLink}
                    title="Link"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </button>
                  <button
                    className={`bubble-btn ${editor.isActive('highlight') ? 'active' : ''}`}
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    title="Highlight"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                  </button>
                  <TextColorPicker editor={editor} />
                </div>
              </BubbleMenu>

              {/* Editor Content */}
              <EditorContent editor={editor} />
            </div>
          )}
        </div>

        {/* Meta Panel */}
        <div className={`notion-meta-panel ${metaPanelOpen ? 'open' : ''}`}>
          <div className="notion-meta-panel-header">
            <span>Instellingen</span>
            <button className="notion-meta-close" onClick={() => setMetaPanelOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 4L4 12M4 4l8 8" />
              </svg>
            </button>
          </div>
          <div className="notion-meta-panel-body">
            <div className="notion-meta-field">
              <label>Slug</label>
              <input
                value={slug}
                onChange={e => handleSlugChange(e.target.value)}
                placeholder="auto-generated"
              />
            </div>
            <div className="notion-meta-field">
              <label>Beschrijving</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Korte samenvatting..."
                rows={3}
              />
            </div>
            <div className="notion-meta-row">
              <div className="notion-meta-field">
                <label>Locale</label>
                <select value={locale} onChange={e => setLocale(e.target.value)}>
                  <option value="nl">NL</option>
                  <option value="en">EN</option>
                </select>
              </div>
              <div className="notion-meta-field">
                <label>Auteur</label>
                <input value={author} onChange={e => setAuthor(e.target.value)} />
              </div>
            </div>
            <div className="notion-meta-field">
              <label>Tags (komma-gescheiden)</label>
              <input
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="AI, Automatisering, Development"
              />
            </div>
            {tags.length > 0 && (
              <div className="notion-meta-tags">
                {tags.map(tag => (
                  <span key={tag} className="notion-meta-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
