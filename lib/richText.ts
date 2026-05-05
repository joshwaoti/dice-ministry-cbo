const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'h1',
  'h2',
  'h3',
  'ul',
  'ol',
  'li',
  'blockquote',
  'code',
  'pre',
  'hr',
  'a',
  'img',
]);

function decodeBasicEntities(value: string) {
  return value
    .replace(/&colon;/gi, ':')
    .replace(/&#58;/g, ':')
    .replace(/&#x3a;/gi, ':')
    .replace(/&Tab;/gi, '')
    .replace(/&NewLine;/gi, '');
}

export function isSafeRichTextUrl(value: string, kind: 'link' | 'image' = 'link') {
  const url = decodeBasicEntities(value).trim().replace(/[\u0000-\u001F\u007F\s]+/g, '');
  if (!url) return false;
  if (url.startsWith('#')) return kind === 'link';
  if (url.startsWith('/')) return !url.startsWith('//');
  if (kind === 'image' && /^data:image\/(png|jpe?g|gif|webp);base64,[a-z0-9+/=]+$/i.test(url)) return true;
  if (/^(https?:|mailto:|tel:)/i.test(url)) return kind === 'link';
  if (/^https?:/i.test(url)) return true;
  return false;
}

function sanitizeAttributes(tag: string, rawAttributes: string) {
  const attrs: string[] = [];
  const attrPattern = /([a-zA-Z0-9:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match: RegExpExecArray | null;
  while ((match = attrPattern.exec(rawAttributes)) !== null) {
    const name = match[1].toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? '';
    if (name.startsWith('on') || name === 'style' || name === 'srcdoc') continue;
    if (tag === 'a' && name === 'href' && isSafeRichTextUrl(value, 'link')) {
      attrs.push(`href="${value.replace(/"/g, '&quot;')}"`, 'rel="noopener noreferrer"');
    }
    if (tag === 'img' && name === 'src' && isSafeRichTextUrl(value, 'image')) {
      attrs.push(`src="${value.replace(/"/g, '&quot;')}"`);
    }
    if (tag === 'img' && name === 'alt') {
      attrs.push(`alt="${value.replace(/"/g, '&quot;')}"`);
    }
  }
  return attrs.length ? ` ${Array.from(new Set(attrs)).join(' ')}` : '';
}

export function sanitizeRichText(input: string) {
  const withoutUnsafeBlocks = input
    .slice(0, 100_000)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe|object|embed|svg|math|form|input|button|select|textarea|link|meta|base)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|style|iframe|object|embed|svg|math|form|input|button|select|textarea|link|meta|base)\b[^>]*\/?>/gi, '');

  return withoutUnsafeBlocks.replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (raw, tagName: string, rawAttributes: string) => {
    const tag = tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return '';
    if (raw.startsWith('</')) return `</${tag}>`;
    if (tag === 'br' || tag === 'hr') return `<${tag}>`;
    const attrs = sanitizeAttributes(tag, rawAttributes);
    return `<${tag}${attrs}>`;
  });
}
