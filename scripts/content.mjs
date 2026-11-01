import matter from 'gray-matter';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Sidebar folders, in display order. Every published post belongs to exactly one.
export const categories = ['项目','AI 行业','工作','社会','生活'];

export function parsePost(text, name) {
  const { data, content } = matter(text);
  if (data.published !== true) return null;
  if (typeof data.title !== 'string' || !data.title.trim()) throw new Error(`${name}: title is required`);
  if (typeof data.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) throw new Error(`${name}: invalid slug`);
  if (!categories.includes(data.category)) throw new Error(`${name}: category must be one of ${categories.join(', ')}`);
  // Validate the source date too: YAML parsers can normalize impossible dates.
  const rawDate = text.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})["']?\s*$/m)?.[1];
  if (!rawDate || Number.isNaN(Date.parse(rawDate)) || new Date(rawDate).toISOString().slice(0,10) !== rawDate) throw new Error(`${name}: invalid date; use YYYY-MM-DD`);
  const html = sanitizeHtml(marked.parse(content), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
    allowedAttributes: {...sanitizeHtml.defaults.allowedAttributes, img: ['src','alt','title','width','height','loading'], code: ['class']},
    allowedSchemes: ['https','http','mailto'],
  });
  const plain = sanitizeHtml(html, {allowedTags:[],allowedAttributes:{}});
  const summary = typeof data.summary === 'string' && data.summary.trim() ? data.summary.replace(/\s+/g,' ').trim() : autoSummary(plain);
  return {title:data.title.trim(), slug:data.slug, date:rawDate, category:data.category, summary, tags:Array.isArray(data.tags) ? data.tags.filter(t=>typeof t==='string') : [], html, minutes:Math.max(1,Math.ceil(plain.length/450))};
}

const entities = {'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'",'&nbsp;':' '};
// Used for the meta description when a post has no summary: one line, ending at a sentence boundary when one is near.
export function autoSummary(plain, max = 120) {
  const text = plain.replace(/&(?:amp|lt|gt|quot|nbsp|#39);/g, m => entities[m]).replace(/\s+/g,' ').trim();
  if (text.length <= max) return text;
  const head = text.slice(0, max);
  const end = Math.max(...[...'。！？!?'].map(mark => head.lastIndexOf(mark)));
  return end >= 40 ? head.slice(0, end + 1) : `${head.slice(0, max - 1).trimEnd()}…`;
}

export function collectPosts(files) {
  const posts = files.map(f => parsePost(f.text, f.name)).filter(Boolean);
  const seen = new Set();
  for (const post of posts) {
    if (seen.has(post.slug)) throw new Error(`Duplicate slug: ${post.slug}`);
    seen.add(post.slug);
  }
  return posts.sort((a,b)=>b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}
