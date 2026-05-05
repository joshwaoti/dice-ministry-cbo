'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  SeparatorHorizontal,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { isSafeRichTextUrl, sanitizeRichText } from '@/lib/richText';
import { useToast } from '@/components/ui/toast';

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}

function ToolbarButton({ onClick, isActive, disabled, children, title }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'p-2 rounded-lg transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed',
        isActive ? 'bg-accent/10 text-accent' : 'text-gray-600',
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-gray-200 self-center mx-1" />;
}

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ content, onChange, placeholder, className }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        protocols: ['http', 'https', 'mailto', 'tel'],
        isAllowedUri: (url) => isSafeRichTextUrl(url, 'link'),
      }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(sanitizeRichText(editor.getHTML()));
    },
    editorProps: {
      attributes: {
        class: 'rich-text-content max-w-none focus:outline-none min-h-[200px] px-4 py-3',
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    if (showLinkInput && linkUrl) {
      if (!isSafeRichTextUrl(linkUrl, 'link')) {
        toast({ title: 'Unsafe link blocked', description: 'Use http, https, mailto, tel, or a relative page link.', tone: 'warning' });
        return;
      }
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    } else {
      setShowLinkInput(true);
    }
  }, [editor, linkUrl, showLinkInput, toast]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter image URL:');
    if (url) {
      if (!isSafeRichTextUrl(url, 'image')) {
        toast({ title: 'Unsafe image blocked', description: 'Use an http, https, relative, or image data URL.', tone: 'warning' });
        return;
      }
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor, toast]);

  if (!editor) {
    return <div className="h-[200px] bg-gray-50 rounded-xl animate-pulse" />;
  }

  return (
    <div className={cn('border border-border rounded-xl overflow-hidden bg-white', className)}>
      {/* Toolbar */}
      <div className="border-b border-border bg-gray-50 p-2 flex flex-wrap items-center gap-1">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1">
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List">
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote">
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block">
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
          <SeparatorHorizontal className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="Insert Link">
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Insert Image">
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Link input bar */}
      {showLinkInput && (
        <div className="border-b border-border bg-gray-50 p-2 flex gap-2 items-center">
          <input
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 h-8 rounded-md border border-input px-3 text-sm outline-none focus:border-accent"
            autoFocus
          />
          <Button size="sm" variant="primary" onClick={addLink}>Add</Button>
          <Button size="sm" variant="outline" onClick={() => { setShowLinkInput(false); setLinkUrl(''); }}>Cancel</Button>
        </div>
      )}

      {/* Editor area */}
      <EditorContent editor={editor} />

      <style jsx global>{`
        .ProseMirror {
          min-height: 200px;
          padding: 12px 16px;
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror h1 { font-size: 1.875rem; font-weight: 700; margin-top: 1rem; margin-bottom: 0.5rem; }
        .ProseMirror h2 { font-size: 1.5rem; font-weight: 700; margin-top: 0.875rem; margin-bottom: 0.5rem; }
        .ProseMirror h3 { font-size: 1.25rem; font-weight: 600; margin-top: 0.75rem; margin-bottom: 0.5rem; }
        .ProseMirror p { margin-bottom: 0.5rem; line-height: 1.7; }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 0.5rem; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 0.5rem; }
        .ProseMirror blockquote { border-left: 3px solid #F6AC55; padding-left: 1rem; margin-left: 0; color: #6b7280; font-style: italic; }
        .ProseMirror code { background: #f3f4f6; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875em; }
        .ProseMirror pre { background: #1f2937; color: #f9fafb; padding: 0.75rem 1rem; border-radius: 0.5rem; overflow-x: auto; }
        .ProseMirror pre code { background: none; padding: 0; color: inherit; }
        .ProseMirror a { color: #F6AC55; text-decoration: underline; }
        .ProseMirror img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 0.5rem 0; }
        .ProseMirror hr { border: none; border-top: 2px solid #e5e7eb; margin: 1rem 0; }
      `}</style>
    </div>
  );
}
