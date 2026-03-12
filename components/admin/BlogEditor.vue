<template>
  <div class="notion-editor-wrapper">
    <!-- Top Bar -->
    <div class="notion-topbar">
      <div class="notion-topbar-left">
        <NuxtLink to="/admin/blog" class="notion-topbar-back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M10 12L6 8L10 4" />
          </svg>
          Blog
        </NuxtLink>
        <span class="notion-topbar-divider">/</span>
        <span class="notion-topbar-title">{{ title || 'Nieuw artikel' }}</span>
        <span v-if="isPublished" class="notion-topbar-badge">Gepubliceerd</span>
      </div>
      <div class="notion-topbar-right">
        <div class="notion-topbar-stats">
          {{ wordCount }} woorden &middot; {{ charCount }} tekens
        </div>
        <button
          :class="`notion-topbar-btn ${metaPanelOpen ? 'active' : ''}`"
          title="Instellingen"
          @click="metaPanelOpen = !metaPanelOpen"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="8" cy="8" r="2" />
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41" />
          </svg>
        </button>
        <div class="notion-topbar-actions">
          <button :class="`notion-topbar-mode-btn ${!previewMode ? 'active' : ''}`" @click="previewMode = false">
            Bewerken
          </button>
          <button :class="`notion-topbar-mode-btn ${previewMode ? 'active' : ''}`" @click="previewMode = true">
            Voorbeeld
          </button>
        </div>
        <button class="notion-save-btn draft" :disabled="saving" @click="save(false)">
          {{ saving ? 'Opslaan...' : 'Concept' }}
        </button>
        <button v-if="post && isPublished" class="notion-save-btn unpublish" :disabled="saving" @click="unpublish">
          Depubliceren
        </button>
        <button class="notion-save-btn publish" :disabled="saving" @click="save(true)">
          {{ saving ? 'Bezig...' : 'Publiceren' }}
        </button>
      </div>
    </div>

    <!-- Toast messages -->
    <div v-if="error" class="notion-toast error">{{ error }}</div>
    <div v-if="savedMsg" class="notion-toast success">Opgeslagen!</div>

    <!-- Layout container -->
    <div class="notion-editor-layout">
      <!-- Main editor area -->
      <div class="notion-editor-main">
        <!-- Preview mode -->
        <div v-if="previewMode" class="notion-preview-wrapper">
          <div class="blog-preview">
            <div class="blog-preview-header">
              <div class="blog-preview-meta">
                <span>{{ new Date().toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
                <span style="opacity: 0.4">·</span>
                <span>{{ author || 'Camille' }}</span>
              </div>
              <h1 class="blog-preview-title">{{ title || 'Geen titel' }}</h1>
              <p class="blog-preview-description">{{ description || 'Geen beschrijving' }}</p>
              <div v-if="parsedTags.length > 0" class="blog-preview-tags">
                <span v-for="tag in parsedTags" :key="tag" class="blog-preview-tag">{{ tag }}</span>
              </div>
            </div>
            <div class="blog-preview-content" v-html="editor?.getHTML()" />
          </div>
        </div>

        <!-- Edit mode -->
        <div v-else class="notion-editor-content">
          <!-- Title -->
          <h1
            ref="titleRef"
            class="notion-title"
            contenteditable="true"
            data-placeholder="Untitled"
            spellcheck="false"
            @input="handleTitleInput"
            @keydown="handleTitleKeyDown"
          />

          <!-- Description -->
          <textarea
            v-model="description"
            class="notion-description"
            placeholder="Voeg een beschrijving toe..."
            rows="1"
            @input="autoResizeTextarea"
          />

          <!-- Block Handle -->
          <div
            v-if="blockHandleVisible || blockMenuOpen"
            ref="handleRef"
            class="block-handle"
            :style="{ top: blockHandlePos.top + 'px', left: blockHandlePos.left + 'px' }"
            @click="blockMenuOpen = !blockMenuOpen"
            @mousedown.prevent
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

          <div
            v-if="blockMenuOpen"
            ref="menuRef"
            class="block-handle-menu"
            :style="{ top: (blockHandlePos.top + 28) + 'px', left: blockHandlePos.left + 'px' }"
          >
            <button class="block-handle-menu-item" @click="deleteBlock">
              <span class="block-handle-menu-icon">✕</span> Verwijderen
            </button>
            <button class="block-handle-menu-item" @click="duplicateBlock">
              <span class="block-handle-menu-icon">⊕</span> Dupliceren
            </button>
            <div class="block-handle-menu-divider" />
            <div class="block-handle-menu-label">Omzetten naar</div>
            <button class="block-handle-menu-item" @click="turnInto('paragraph')"><span class="block-handle-menu-icon">T</span> Tekst</button>
            <button class="block-handle-menu-item" @click="turnInto('h1')"><span class="block-handle-menu-icon">H1</span> Heading 1</button>
            <button class="block-handle-menu-item" @click="turnInto('h2')"><span class="block-handle-menu-icon">H2</span> Heading 2</button>
            <button class="block-handle-menu-item" @click="turnInto('h3')"><span class="block-handle-menu-icon">H3</span> Heading 3</button>
            <button class="block-handle-menu-item" @click="turnInto('bulletList')"><span class="block-handle-menu-icon">•</span> Opsomming</button>
            <button class="block-handle-menu-item" @click="turnInto('orderedList')"><span class="block-handle-menu-icon">1.</span> Genummerd</button>
            <button class="block-handle-menu-item" @click="turnInto('blockquote')"><span class="block-handle-menu-icon">❝</span> Citaat</button>
            <button class="block-handle-menu-item" @click="turnInto('codeBlock')"><span class="block-handle-menu-icon">&lt;/&gt;</span> Code</button>
          </div>

          <!-- Bubble Menu -->
          <BubbleMenu
            v-if="editor"
            :editor="editor"
            :should-show="({ editor: e, from, to }) => from !== to && !e.isActive('codeBlock')"
            :tippy-options="{ placement: 'top' }"
          >
            <div class="notion-bubble-menu">
              <!-- Turn Into Dropdown -->
              <div ref="turnIntoRef" class="bubble-turn-into">
                <button class="bubble-btn bubble-turn-into-trigger" @click="turnIntoOpen = !turnIntoOpen">
                  {{ currentBlockLabel }}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.2" fill="none" />
                  </svg>
                </button>
                <div v-if="turnIntoOpen" class="bubble-turn-into-menu">
                  <button class="bubble-turn-into-option" @click="bubbleTurnInto('paragraph')">Tekst</button>
                  <button class="bubble-turn-into-option" @click="bubbleTurnInto('h1')">Heading 1</button>
                  <button class="bubble-turn-into-option" @click="bubbleTurnInto('h2')">Heading 2</button>
                  <button class="bubble-turn-into-option" @click="bubbleTurnInto('h3')">Heading 3</button>
                  <button class="bubble-turn-into-option" @click="bubbleTurnInto('bulletList')">Opsomming</button>
                  <button class="bubble-turn-into-option" @click="bubbleTurnInto('orderedList')">Genummerd</button>
                  <button class="bubble-turn-into-option" @click="bubbleTurnInto('blockquote')">Citaat</button>
                  <button class="bubble-turn-into-option" @click="bubbleTurnInto('codeBlock')">Code</button>
                </div>
              </div>
              <span class="bubble-divider" />
              <button :class="`bubble-btn ${editor.isActive('bold') ? 'active' : ''}`" title="Bold" @click="editor.chain().focus().toggleBold().run()"><strong>B</strong></button>
              <button :class="`bubble-btn ${editor.isActive('italic') ? 'active' : ''}`" title="Italic" @click="editor.chain().focus().toggleItalic().run()"><em>I</em></button>
              <button :class="`bubble-btn ${editor.isActive('underline') ? 'active' : ''}`" title="Underline" @click="editor.chain().focus().toggleUnderline().run()"><u>U</u></button>
              <button :class="`bubble-btn ${editor.isActive('strike') ? 'active' : ''}`" title="Strikethrough" @click="editor.chain().focus().toggleStrike().run()"><s>S</s></button>
              <button :class="`bubble-btn ${editor.isActive('code') ? 'active' : ''}`" title="Code" @click="editor.chain().focus().toggleCode().run()">&lt;/&gt;</button>
              <span class="bubble-divider" />
              <button :class="`bubble-btn ${editor.isActive('link') ? 'active' : ''}`" title="Link" @click="addLink">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </button>
              <button :class="`bubble-btn ${editor.isActive('highlight') ? 'active' : ''}`" title="Highlight" @click="editor.chain().focus().toggleHighlight().run()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </button>
              <!-- Color Picker -->
              <div ref="colorPickerRef" class="bubble-color-picker">
                <button class="bubble-btn" title="Tekstkleur" @click="colorPickerOpen = !colorPickerOpen">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M3.5 12h8M5 8.5L7.5 2L10 8.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                    <rect x="2" y="13" width="11" height="1.5" rx="0.5" :fill="editor.getAttributes('textStyle').color || '#f4f4f6'" />
                  </svg>
                </button>
                <div v-if="colorPickerOpen" class="bubble-color-menu">
                  <button v-for="c in colors" :key="c.label" class="bubble-color-swatch" :title="c.label" @click="setTextColor(c.value)">
                    <span class="bubble-color-dot" :style="{ background: c.value || '#f4f4f6' }" />
                  </button>
                </div>
              </div>
            </div>
          </BubbleMenu>

          <!-- Editor Content -->
          <EditorContent v-if="editor" :editor="editor" />
        </div>
      </div>

      <!-- Meta Panel -->
      <div :class="`notion-meta-panel ${metaPanelOpen ? 'open' : ''}`">
        <div class="notion-meta-panel-header">
          <span>Instellingen</span>
          <button class="notion-meta-close" @click="metaPanelOpen = false">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 4L4 12M4 4l8 8" />
            </svg>
          </button>
        </div>
        <div class="notion-meta-panel-body">
          <div class="notion-meta-field">
            <label>Slug</label>
            <input v-model="slug" placeholder="auto-generated" @input="autoSlug = false" />
          </div>
          <div class="notion-meta-field">
            <label>Beschrijving</label>
            <textarea v-model="description" placeholder="Korte samenvatting..." rows="3" />
          </div>
          <div class="notion-meta-row">
            <div class="notion-meta-field">
              <label>Locale</label>
              <select v-model="locale">
                <option value="nl">NL</option>
                <option value="en">EN</option>
              </select>
            </div>
            <div class="notion-meta-field">
              <label>Auteur</label>
              <input v-model="author" />
            </div>
          </div>
          <div class="notion-meta-field">
            <label>Tags (komma-gescheiden)</label>
            <input v-model="tagsInput" placeholder="AI, Automatisering, Development" />
          </div>
          <div v-if="parsedTags.length > 0" class="notion-meta-tags">
            <span v-for="tag in parsedTags" :key="tag" class="notion-meta-tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent, VueRenderer } from '@tiptap/vue-3';
import { BubbleMenu } from '@tiptap/vue-3/menus';
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

// ─── Lowlight ────────────────────────────────────────────────────────────────

const lowlight = createLowlight(common);

// ─── Custom Extensions ────────────────────────────────────────────────────────

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
  parseHTML() { return [{ tag: 'div[data-callout]' }]; },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-callout': '', class: `callout callout-${HTMLAttributes['data-callout-type'] || 'info'}` }), 0];
  },
  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { $anchor } = editor.state.selection;
        if ($anchor.parentOffset === 0 && $anchor.node(-1)?.type.name === 'callout' && $anchor.parent.textContent === '') {
          return editor.chain().lift('callout').run();
        }
        return false;
      },
    };
  },
});

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
  parseHTML() { return [{ tag: 'div[data-columns]' }]; },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: `columns columns-${HTMLAttributes['data-columns'] || 2}` }), 0];
  },
});

const Column = TiptapNode.create({
  name: 'column',
  group: '',
  content: 'block+',
  defining: true,
  parseHTML() { return [{ tag: 'div[data-column]' }]; },
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
  { title: 'Tekst', description: 'Standaard tekst', icon: 'T', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setParagraph().run() },
  { title: 'Heading 1', description: 'Grote koptekst', icon: 'H1', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run() },
  { title: 'Heading 2', description: 'Middelgrote koptekst', icon: 'H2', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run() },
  { title: 'Heading 3', description: 'Kleine koptekst', icon: 'H3', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run() },
  { title: 'Opsomming', description: 'Ongeordende lijst', icon: '•', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run() },
  { title: 'Genummerde lijst', description: 'Geordende lijst', icon: '1.', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run() },
  { title: 'Takenlijst', description: 'Lijst met checkboxen', icon: '☑', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleTaskList().run() },
  { title: 'Citaat', description: 'Blockquote', icon: '❝', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setBlockquote().run() },
  { title: 'Callout - Info', description: 'Informatie blok', icon: 'ℹ', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'callout', attrs: { type: 'info' }, content: [{ type: 'paragraph' }] }).run() },
  { title: 'Callout - Waarschuwing', description: 'Waarschuwing blok', icon: '⚠', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'callout', attrs: { type: 'warning' }, content: [{ type: 'paragraph' }] }).run() },
  { title: 'Callout - Tip', description: 'Tip blok', icon: '💡', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'callout', attrs: { type: 'tip' }, content: [{ type: 'paragraph' }] }).run() },
  { title: 'Callout - Succes', description: 'Succes blok', icon: '✓', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'callout', attrs: { type: 'success' }, content: [{ type: 'paragraph' }] }).run() },
  { title: 'Code blok', description: 'Code met syntax highlighting', icon: '</>', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setCodeBlock().run() },
  { title: 'Afbeelding', description: 'Voeg een afbeelding in via URL', icon: '🖼', command: ({ editor, range }) => {
    const url = window.prompt('Afbeelding URL:');
    if (url) editor.chain().focus().deleteRange(range).setImage({ src: url }).run();
    else editor.chain().focus().deleteRange(range).run();
  }},
  { title: 'YouTube', description: 'Embed een YouTube video', icon: '▶', command: ({ editor, range }) => {
    const url = window.prompt('YouTube URL:');
    editor.chain().focus().deleteRange(range).run();
    if (url) editor.commands.setYoutubeVideo({ src: url });
  }},
  { title: 'Tabel', description: '3x3 tabel invoegen', icon: '▦', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
  { title: 'Scheidingslijn', description: 'Horizontale lijn', icon: '—', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHorizontalRule().run() },
  { title: '2 Kolommen', description: 'Layout met 2 kolommen', icon: '▥', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'columns', attrs: { count: 2 }, content: [{ type: 'column', content: [{ type: 'paragraph' }] }, { type: 'column', content: [{ type: 'paragraph' }] }] }).run() },
  { title: '3 Kolommen', description: 'Layout met 3 kolommen', icon: '▤', command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertContent({ type: 'columns', attrs: { count: 3 }, content: [{ type: 'column', content: [{ type: 'paragraph' }] }, { type: 'column', content: [{ type: 'paragraph' }] }, { type: 'column', content: [{ type: 'paragraph' }] }] }).run() },
];

// ─── Slash Command Vue Component (for VueRenderer) ────────────────────────────

const SlashCommandListComponent = defineComponent({
  props: {
    items: { type: Array as PropType<SlashCommandItem[]>, required: true },
    command: { type: Function as PropType<(item: SlashCommandItem) => void>, required: true },
  },
  setup(props, { expose }) {
    const selectedIndex = ref(0);
    const containerRef = ref<HTMLDivElement>();

    watch(() => props.items, () => { selectedIndex.value = 0; });

    watch(selectedIndex, () => {
      nextTick(() => {
        const active = containerRef.value?.querySelector('.slash-item-active');
        active?.scrollIntoView({ block: 'nearest' });
      });
    });

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex.value = (selectedIndex.value - 1 + props.items.length) % props.items.length;
        return true;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex.value = (selectedIndex.value + 1) % props.items.length;
        return true;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (props.items[selectedIndex.value]) {
          props.command(props.items[selectedIndex.value]);
        }
        return true;
      }
      return false;
    }

    expose({ onKeyDown });

    return () => {
      if (props.items.length === 0) {
        return h('div', { class: 'slash-command-menu' }, [
          h('div', { class: 'slash-command-empty' }, 'Geen resultaten'),
        ]);
      }
      return h('div', { class: 'slash-command-menu', ref: containerRef }, props.items.map((item, index) =>
        h('button', {
          key: item.title,
          class: `slash-command-item ${index === selectedIndex.value ? 'slash-item-active' : ''}`,
          onClick: () => props.command(item),
          onMouseenter: () => { selectedIndex.value = index; },
        }, [
          h('span', { class: 'slash-command-icon' }, item.icon),
          h('div', { class: 'slash-command-text' }, [
            h('span', { class: 'slash-command-title' }, item.title),
            h('span', { class: 'slash-command-description' }, item.description),
          ]),
        ])
      ));
    };
  },
});

// ─── Slash Command Extension ─────────────────────────────────────────────────

const slashCommandPluginKey = new PluginKey('slashCommand');

const SlashCommand = Extension.create({
  name: 'slashCommand',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        pluginKey: slashCommandPluginKey,
        command: ({ editor, range, props }: { editor: TiptapEditor; range: any; props: SlashCommandItem }) => {
          props.command({ editor, range });
        },
        items: ({ query }: { query: string }) =>
          slashCommandItems.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
          ),
        render: () => {
          let component: VueRenderer | null = null;
          let popup: TippyInstance[] | null = null;

          return {
            onStart: (props: any) => {
              component = new VueRenderer(SlashCommandListComponent, {
                props,
                editor: props.editor,
              });
              if (!props.clientRect) return;
              popup = [tippy(document.body, {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element ?? undefined,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
                theme: 'slash-command',
                offset: [0, 8],
                popperOptions: { modifiers: [{ name: 'flip', options: { fallbackPlacements: ['top-start'] } }] },
              })];
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
                return (component?.ref as any)?.onKeyDown?.(props.event) ?? true;
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
    return [Suggestion({ editor: this.editor, ...this.options.suggestion })];
  },
});

// ─── Props ────────────────────────────────────────────────────────────────────

interface PostData {
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
}

const props = defineProps<{ post?: PostData }>();

// ─── State ────────────────────────────────────────────────────────────────────

const title = ref(props.post?.title || '');
const slug = ref(props.post?.slug || '');
const description = ref(props.post?.description || '');
const locale = ref(props.post?.locale || 'nl');
const tagsInput = ref(props.post?.tags?.join(', ') || '');
const author = ref(props.post?.author || 'Camille');
const saving = ref(false);
const savedMsg = ref(false);
const error = ref('');
const autoSlug = ref(!props.post);
const previewMode = ref(false);
const isPublished = ref(props.post?.published || false);
const metaPanelOpen = ref(false);
const titleRef = ref<HTMLHeadingElement>();

// Block handle state
const blockHandleVisible = ref(false);
const blockMenuOpen = ref(false);
const blockHandlePos = ref({ top: 0, left: 0 });
const resolvedBlockPos = ref<number | null>(null);
const handleRef = ref<HTMLDivElement>();
const menuRef = ref<HTMLDivElement>();

// Bubble menu state
const turnIntoOpen = ref(false);
const turnIntoRef = ref<HTMLDivElement>();
const colorPickerOpen = ref(false);
const colorPickerRef = ref<HTMLDivElement>();

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugifyText(text: string): string {
  return text.toLowerCase()
    .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/[ñ]/g, 'n').replace(/[ç]/g, 'c')
    .replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

// ─── Editor ──────────────────────────────────────────────────────────────────

const editor = useEditor({
  extensions: [
    StarterKit.configure({ heading: { levels: [1, 2, 3] }, codeBlock: false, dropcursor: false }),
    CodeBlockLowlight.configure({ lowlight }),
    Image.configure({ inline: false }),
    Table.configure({ resizable: true }),
    TableRow,
    TableCell,
    TableHeader,
    Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'heading') return `Heading ${node.attrs.level}`;
        if (node.type.name === 'paragraph') return "Typ '/' voor commando's...";
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
  content: props.post?.content ? (() => { try { return JSON.parse(props.post!.content); } catch { return props.post!.content; } })() : undefined,
  editorProps: {
    attributes: { class: 'notion-editor-body' },
  },
});

// ─── Computed ─────────────────────────────────────────────────────────────────

const parsedTags = computed(() => tagsInput.value.split(',').map(t => t.trim()).filter(Boolean));

const wordCount = computed(() => (editor.value?.storage.characterCount?.words() || 0));
const charCount = computed(() => (editor.value?.storage.characterCount?.characters() || 0));

const currentBlockLabel = computed(() => {
  const e = editor.value;
  if (!e) return 'Tekst';
  if (e.isActive('heading', { level: 1 })) return 'H1';
  if (e.isActive('heading', { level: 2 })) return 'H2';
  if (e.isActive('heading', { level: 3 })) return 'H3';
  if (e.isActive('bulletList')) return 'Lijst';
  if (e.isActive('orderedList')) return '1. Lijst';
  if (e.isActive('blockquote')) return 'Citaat';
  if (e.isActive('codeBlock')) return 'Code';
  return 'Tekst';
});

// ─── Watchers ────────────────────────────────────────────────────────────────

watch(title, (val) => {
  if (autoSlug.value && val) slug.value = slugifyText(val);
});

// ─── Lifecycle ───────────────────────────────────────────────────────────────

onMounted(() => {
  if (titleRef.value && props.post?.title) {
    titleRef.value.textContent = props.post.title;
  }

  // Block handle mouse tracking
  const handleMouseMove = (evt: Event) => {
    if (!editor.value) return;
    const e = evt as MouseEvent;
    if (blockMenuOpen.value) return;

    const editorEl = editor.value.view.dom;
    const editorContainer = editorEl.closest('.notion-editor-content') as HTMLElement | null;
    if (!editorContainer) return;

    const editorRect = editorEl.getBoundingClientRect();
    const containerRect = editorContainer.getBoundingClientRect();

    if (e.clientX < containerRect.left - 60 || e.clientX > containerRect.right + 20 ||
        e.clientY < editorRect.top || e.clientY > editorRect.bottom) {
      blockHandleVisible.value = false;
      return;
    }

    const posAtCoords = editor.value.view.posAtCoords({ left: editorRect.left + 10, top: e.clientY });
    if (!posAtCoords) { blockHandleVisible.value = false; return; }

    try {
      const resolved = editor.value.state.doc.resolve(posAtCoords.pos);
      if (resolved.depth === 0) { blockHandleVisible.value = false; return; }

      const topPos = resolved.before(1);
      const dom = editor.value.view.nodeDOM(topPos);
      if (!dom || !(dom instanceof HTMLElement)) { blockHandleVisible.value = false; return; }

      const domRect = dom.getBoundingClientRect();
      blockHandlePos.value = { top: domRect.top - containerRect.top, left: -36 };
      resolvedBlockPos.value = topPos;
      blockHandleVisible.value = true;
    } catch {
      blockHandleVisible.value = false;
    }
  };

  const handleMouseLeave = () => {
    if (!blockMenuOpen.value) blockHandleVisible.value = false;
  };

  const editorEl = editor.value?.view.dom;
  const editorContainer = editorEl?.closest('.notion-editor-content') as HTMLElement | null;
  editorContainer?.addEventListener('mousemove', handleMouseMove);
  editorContainer?.addEventListener('mouseleave', handleMouseLeave);

  // Close menus on outside click
  document.addEventListener('mousedown', handleOutsideClick);
});

onUnmounted(() => {
  editor.value?.destroy();
  document.removeEventListener('mousedown', handleOutsideClick);
});

// ─── Event Handlers ──────────────────────────────────────────────────────────

function handleOutsideClick(e: MouseEvent) {
  if (blockMenuOpen.value &&
      menuRef.value && !menuRef.value.contains(e.target as Node) &&
      handleRef.value && !handleRef.value.contains(e.target as Node)) {
    blockMenuOpen.value = false;
  }
  if (turnIntoOpen.value && turnIntoRef.value && !turnIntoRef.value.contains(e.target as Node)) {
    turnIntoOpen.value = false;
  }
  if (colorPickerOpen.value && colorPickerRef.value && !colorPickerRef.value.contains(e.target as Node)) {
    colorPickerOpen.value = false;
  }
}

function handleTitleInput() {
  const text = titleRef.value?.textContent || '';
  title.value = text;
}

function handleTitleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault();
    editor.value?.commands.focus('start');
  }
}

function autoResizeTextarea(e: Event) {
  const target = e.target as HTMLTextAreaElement;
  target.style.height = 'auto';
  target.style.height = target.scrollHeight + 'px';
}

// ─── Block Handle Actions ────────────────────────────────────────────────────

function deleteBlock() {
  if (resolvedBlockPos.value === null || !editor.value) return;
  try {
    const node = editor.value.state.doc.nodeAt(resolvedBlockPos.value);
    if (node) {
      editor.value.chain().focus().deleteRange({ from: resolvedBlockPos.value, to: resolvedBlockPos.value + node.nodeSize }).run();
    }
  } catch { /* ignore */ }
  blockMenuOpen.value = false;
}

function duplicateBlock() {
  if (resolvedBlockPos.value === null || !editor.value) return;
  try {
    const node = editor.value.state.doc.nodeAt(resolvedBlockPos.value);
    if (node) {
      const end = resolvedBlockPos.value + node.nodeSize;
      editor.value.chain().focus().insertContentAt(end, node.toJSON()).run();
    }
  } catch { /* ignore */ }
  blockMenuOpen.value = false;
}

function turnInto(type: string) {
  if (resolvedBlockPos.value === null || !editor.value) return;
  try {
    editor.value.chain().focus().setNodeSelection(resolvedBlockPos.value).run();
    switch (type) {
      case 'paragraph': editor.value.chain().focus().setParagraph().run(); break;
      case 'h1': editor.value.chain().focus().setHeading({ level: 1 }).run(); break;
      case 'h2': editor.value.chain().focus().setHeading({ level: 2 }).run(); break;
      case 'h3': editor.value.chain().focus().setHeading({ level: 3 }).run(); break;
      case 'bulletList': editor.value.chain().focus().toggleBulletList().run(); break;
      case 'orderedList': editor.value.chain().focus().toggleOrderedList().run(); break;
      case 'blockquote': editor.value.chain().focus().setBlockquote().run(); break;
      case 'codeBlock': editor.value.chain().focus().setCodeBlock().run(); break;
    }
  } catch { /* ignore */ }
  blockMenuOpen.value = false;
}

// ─── Bubble Menu Actions ─────────────────────────────────────────────────────

function bubbleTurnInto(type: string) {
  if (!editor.value) return;
  switch (type) {
    case 'paragraph': editor.value.chain().focus().setParagraph().run(); break;
    case 'h1': editor.value.chain().focus().setHeading({ level: 1 }).run(); break;
    case 'h2': editor.value.chain().focus().setHeading({ level: 2 }).run(); break;
    case 'h3': editor.value.chain().focus().setHeading({ level: 3 }).run(); break;
    case 'bulletList': editor.value.chain().focus().toggleBulletList().run(); break;
    case 'orderedList': editor.value.chain().focus().toggleOrderedList().run(); break;
    case 'blockquote': editor.value.chain().focus().setBlockquote().run(); break;
    case 'codeBlock': editor.value.chain().focus().setCodeBlock().run(); break;
  }
  turnIntoOpen.value = false;
}

function addLink() {
  if (!editor.value) return;
  const previousUrl = editor.value.getAttributes('link').href;
  const url = window.prompt('Link URL:', previousUrl);
  if (url === null) return;
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
}

function setTextColor(value: string) {
  if (!editor.value) return;
  if (value) editor.value.chain().focus().setColor(value).run();
  else editor.value.chain().focus().unsetColor().run();
  colorPickerOpen.value = false;
}

// ─── Save ─────────────────────────────────────────────────────────────────────

async function save(publish: boolean) {
  if (!editor.value) return;
  if (!title.value.trim() || !description.value.trim()) {
    error.value = 'Titel en beschrijving zijn verplicht';
    return;
  }

  saving.value = true;
  error.value = '';
  savedMsg.value = false;

  const json = editor.value.getJSON();
  const html = editor.value.getHTML();

  const body = {
    title: title.value.trim(),
    slug: slug.value.trim() || slugifyText(title.value),
    description: description.value.trim(),
    content: JSON.stringify(json),
    contentHtml: html,
    locale: locale.value,
    tags: parsedTags.value,
    author: author.value.trim() || 'Camille',
    published: publish,
  };

  try {
    const url = props.post ? `/api/blog/${props.post.id}` : '/api/blog';
    const method = props.post ? 'PUT' : 'POST';
    const saved = await $fetch<{ id: string }>(url, { method, body });
    savedMsg.value = true;
    isPublished.value = publish;
    if (!props.post) {
      window.location.href = `/admin/blog/${saved.id}/edit`;
    }
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'Failed to save';
  } finally {
    saving.value = false;
  }
}

async function unpublish() {
  if (!props.post) return;
  saving.value = true;
  error.value = '';
  savedMsg.value = false;
  try {
    await $fetch(`/api/blog/${props.post.id}`, { method: 'PUT', body: { published: false } });
    isPublished.value = false;
    savedMsg.value = true;
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'Failed to unpublish';
  } finally {
    saving.value = false;
  }
}
</script>
