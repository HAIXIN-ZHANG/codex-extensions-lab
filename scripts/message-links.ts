import { isMain } from '../runtime/paths.ts';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export interface MessageLink {
  label: string;
  title: string;
  url: string;
}

function checkTarget(value: string) {
  if (/[\r\n<>]/.test(value)) throw new Error('Use a single-line URL or absolute file path');
  if (value.startsWith('/')) return;
  const parsed = new URL(value);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Unsupported link protocol');
  if (parsed.username || parsed.password) throw new Error('Remove credentials from the link');
}

export function formatMessageLink({ label, title, url }: MessageLink): string {
  if (!label.trim() || /[\r\n:\[\]<>]/.test(label)) throw new Error('Use a short resource label');
  if (!title.trim() || /[\r\n]/.test(title) || /^(?:https?:\/\/|\/)/.test(title)) {
    throw new Error('Use a descriptive resource title');
  }
  checkTarget(url);
  return `${label.trim()}: ${title.trim()} (${url})`;
}

function proseOnly(text: string): string {
  return text
    .replace(/(`+)([^`]|(?!\1)`)*?\1/g, '')
    .replace(/!\[(?:\\.|[^\]\\])*\]\((?:<[^>]+>|[^\s)]+)\s*\)/g, '')
    .replace(/<img\b[^>]*>/gi, '');
}

function withoutFencedCode(text: string): string {
  let fence: string | undefined;
  return text.split(/\r?\n/).map(original => {
    const line = original.trim().replace(/^(?:>\s*)*(?:[-*+]\s+|\d+\.\s+)?/, '');
    const marker = line.match(/^(`{3,}|~{3,})/);
    if (fence) {
      if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && !line.slice(marker[1].length).trim()) {
        fence = undefined;
      }
      return '';
    }
    if (marker) {
      fence = marker[1];
      return '';
    }
    return original;
  }).join('\n');
}

export function validateMessageLinks(text: string): string[] {
  const issues: string[] = [];
  for (const [index, original] of withoutFencedCode(text).split('\n').entries()) {
    const line = original.trim().replace(/^(?:>\s*)*(?:[-*+]\s+|\d+\.\s+)?/, '');
    // Preserve actual code blocks and image embeds. Check prose references only.
    const content = proseOnly(line);
    const references = content.replace(/\b(?:GET|HEAD|POST|PUT|DELETE|CONNECT|OPTIONS|TRACE|PATCH)\s+\/[^\s<>"`()[\]]+/g, '');
    if (!/https?:\/\/|\]\(|\]\[|(?:^|[\s(])\/[A-Za-z0-9_.~-]+(?:\/|\.[A-Za-z])/.test(references)) continue;
    const visibleUrlLink = content.match(/^([^:\[\]<>]+): \[(https?:\/\/[^\s\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (visibleUrlLink) {
      try {
        const [, label, visible, target] = visibleUrlLink;
        if (visible !== target) throw new Error('Visible URL must match the hyperlink destination');
        formatMessageLink({ label, title: 'Reference', url: target });
      } catch (error) {
        issues.push(`Line ${index + 1}: ${(error as Error).message}`);
      }
      continue;
    }
    const match = content.match(/^([^:\[\]<>]+): (.+) \((https?:\/\/.+|\/.+)\)$/);
    if (!match) {
      issues.push(`Line ${index + 1}: use Label: Descriptive title (original URL)`);
      continue;
    }
    try {
      const [, label, display, url] = match;
      const hyperlink = display.match(/^\[((?:\\.|[^\]\\])+)\]\((.+)\)$/);
      if (hyperlink && hyperlink[2] !== url) throw new Error('Visible URL must match the hyperlink destination');
      if (!hyperlink && /\]\(|https?:\/\/|<a\b/i.test(display)) throw new Error('Use a plain descriptive title');
      formatMessageLink({ label, title: hyperlink ? hyperlink[1] : display, url });
    } catch (error) {
      issues.push(`Line ${index + 1}: ${(error as Error).message}`);
    }
  }
  return issues;
}

export function validatePrSummary(text: string): string[] {
  text = text.replace(/\r\n/g, '\n');
  const issues = validateMessageLinks(text);
  text = withoutFencedCode(text);
  const headings = [...text.matchAll(/^#{1,6} .+$/gm)].map(match => match[0]);
  const expected = ['## Ticket', '## Background', '## What changed'];
  if (headings.includes('## Screenshots')) expected.push('## Screenshots');
  if (JSON.stringify(headings) !== JSON.stringify(expected)) {
    issues.push('Use Ticket, Background, What changed, then optional Screenshots in that order');
  }
  for (const heading of expected) {
    const section = text.split(heading + '\n')[1]?.split(/^## /m)[0]?.trim();
    if (!section) issues.push(`Fill or remove the empty section ${heading}`);
  }
  const changes = text.split('## What changed\n')[1]?.split(/^## /m)[0] || '';
  if (!/^- .+/m.test(changes)) issues.push('What changed needs concrete change bullets');
  const paragraphs = changes.trim().split(/\n[ \t]*\n/);
  const reviewIndex = paragraphs.findIndex(paragraph =>
    !paragraph.split('\n').every(line => !line.trim() || /^- .+|^ {2,}\S/.test(line)));
  const bullets = paragraphs.slice(0, reviewIndex).join('\n\n');
  const review = paragraphs[reviewIndex] || '';
  const supporting = paragraphs[reviewIndex + 1] || '';
  const supportLabel = /^\*\*[^\n]+\*\*(?:\n|$)|^[^:\n]+: .+ \(https?:\/\//;
  if (reviewIndex < 1 || !/^- .+/m.test(bullets) || !review.trim() ||
      /^(?:[-*+] |\d+\. |#{1,6} |```|~~~|>|\*\*)/m.test(review) ||
      supportLabel.test(review) || (supporting && !supportLabel.test(supporting))) {
    issues.push('Follow the change bullets with one unheaded review and validation paragraph; labelled examples or spec links may follow');
  }
  const screenshots = text.split('## Screenshots\n')[1] || '';
  if (headings.includes('## Screenshots') && !/!\[[^\]\n]*\]\(\S+[^\n]*\)|<img\b[^>]*\bsrc\s*=\s*["'][^"']+["'][^>]*>/i.test(screenshots)) {
    issues.push('Screenshots needs an attached Markdown image or HTML img element');
  }
  if (/^(Hi|Hey|Hello)\b|^PR: /m.test(text)) issues.push('Keep the PR summary focused on the change and evidence');
  return issues;
}

if (await isMain(import.meta.url)) {
  try {
    const [command, file, ...extra] = process.argv.slice(2);
    if (!file || extra.length || !['format', 'check-links', 'check-pr'].includes(command)) {
      throw new Error('Usage: node scripts/message-links.ts format references.json | check-links message.md | check-pr summary.md');
    }
    const input = await readFile(file, 'utf8');
    if (command === 'format') {
      const refs: unknown = JSON.parse(input);
      if (!Array.isArray(refs)) throw new Error('Expected an array of {label, title, url}');
      console.log(refs.map(ref => {
        if (!ref || ['label', 'title', 'url'].some(key => typeof ref[key] !== 'string')) {
          throw new Error('Each reference needs label, title and url strings');
        }
        return formatMessageLink(ref);
      }).join('\n'));
    } else {
      const issues = command === 'check-pr' ? validatePrSummary(input) : validateMessageLinks(input);
      if (issues.length) throw new Error(issues.join('\n'));
      console.log('Writing format passed.');
    }
  } catch (error) {
    console.error((error as Error).message);
    process.exitCode = 1;
  }
}
