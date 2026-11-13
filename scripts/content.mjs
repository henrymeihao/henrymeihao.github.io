import matter from 'gray-matter';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Sidebar folders, in display order. Every published post belongs to exactly one.
export const categories = ['实践','行业','工作','社会','生活','文化'];

export function parsePost(text, name) {
  const { data, content } = matter(text);
  if (data.published !== true) return null;
  if (typeof data.title !== 'string' || !data.title.trim()) throw new Error(`${name}: title is required`);
  if (typeof data.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) throw new Error(`${name}: invalid slug`);
  if (!categories.includes(data.category)) throw new Error(`${name}: category must be one of ${categories.join(', ')}`);
  // Validate the source date too: YAML parsers can normalize impossible dates.
  const rawDate = text.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})["']?\s*$/m)?.[1];
  if (!rawDate || Number.isNaN(Date.parse(rawDate)) || new Date(rawDate).toISOString().slice(0,10) !== rawDate) throw new Error(`${name}: invalid date; use YYYY-MM-DD`);
  // Optional publish time, only used to order posts that share a date. Read from the raw text: YAML would parse 15:31 as a number.
  const rawTime = text.match(/^time:\s*["']?(\d{2}:\d{2})["']?\s*$/m)?.[1];
  if (/^time:/m.test(text) && (!rawTime || +rawTime.slice(0,2) > 23 || +rawTime.slice(3) > 59)) throw new Error(`${name}: invalid time; use HH:MM`);
  const clean = sanitizeHtml(marked.parse(content), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
    allowedAttributes: {...sanitizeHtml.defaults.allowedAttributes, img: ['src','alt','title','width','height','loading'], code: ['class']},
    allowedSchemes: ['https','http','mailto'],
  });
  // Section headings get numbered ids (headings are mostly Chinese, so text slugs would be unreadable) for the article table of contents.
  const toc = [];
  const html = clean.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner) => {
    const id = `section-${toc.length + 1}`;
    toc.push({id, text: plainText(inner)});
    return `<h2 id="${id}">${inner}</h2>`;
  });
  const plain = plainText(html);
  const wordCount = (plain.match(/\p{Script=Han}/gu) || []).length + (plain.replace(/\p{Script=Han}/gu, ' ').match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []).length;
  const summary = typeof data.summary === 'string' && data.summary.trim() ? data.summary.replace(/\s+/g,' ').trim() : autoSummary(plain);
  const opening = html.replace(/^(?:\s*<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>)+\s*/i, '').split(/<(?:h[1-6]|pre|ul|ol|table|img|hr)\b/i)[0];
  const excerpt = autoSummary(plainText(opening) || plain,260);
  return {title:data.title.trim(), slug:data.slug, date:rawDate, time:rawTime ?? '00:00', category:data.category, summary, excerpt, wordCount, tags:Array.isArray(data.tags) ? data.tags.filter(t=>typeof t==='string') : [], html, toc, minutes:Math.max(1,Math.ceil(wordCount/450)), ...(data.cover === undefined ? {} : {cover:parseCover(data.cover, name)})};
}

// Optional share image for one article; without it the page uses the site-wide cover.
function parseCover(cover, name) {
  const {path, width, height, alt} = cover ?? {};
  if (typeof path !== 'string' || !/^\/assets\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.(?:jpg|jpeg|png)$/.test(path)) throw new Error(`${name}: cover.path must be an image under /assets/`);
  if (![width, height].every(n => Number.isInteger(n) && n > 0)) throw new Error(`${name}: cover.width and cover.height must be positive integers`);
  if (typeof alt !== 'string' || !alt.trim()) throw new Error(`${name}: cover.alt is required`);
  return {path, width, height, alt:alt.trim()};
}

const entities = {'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'",'&nbsp;':' '};
export function plainText(html) {
  return sanitizeHtml(html.replace(/<\/(?:p|h[1-6]|li|pre|blockquote|tr)>/gi, '$& ').replace(/<br\s*\/?\s*>/gi,' '), {allowedTags:[],allowedAttributes:{}})
    .replace(/&(?:amp|lt|gt|quot|nbsp|#39);/g, m => entities[m]).replace(/\s+/g,' ').trim();
}
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
  return posts.sort((a,b)=>b.date.localeCompare(a.date) || b.time.localeCompare(a.time) || a.slug.localeCompare(b.slug));
}
