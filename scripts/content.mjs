import matter from 'gray-matter';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function parsePost(text, name) {
  const { data, content } = matter(text);
  if (data.published !== true) return null;
  if (typeof data.title !== 'string' || !data.title.trim()) throw new Error(`${name}: title is required`);
  if (typeof data.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) throw new Error(`${name}: invalid slug`);
  // Validate the source date too: YAML parsers can normalize impossible dates.
  const rawDate = text.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})["']?\s*$/m)?.[1];
  if (!rawDate || Number.isNaN(Date.parse(rawDate)) || new Date(rawDate).toISOString().slice(0,10) !== rawDate) throw new Error(`${name}: invalid date; use YYYY-MM-DD`);
  const html = sanitizeHtml(marked.parse(content), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
    allowedAttributes: {...sanitizeHtml.defaults.allowedAttributes, img: ['src','alt','title','width','height','loading'], code: ['class']},
    allowedSchemes: ['https','http','mailto'],
  });
  const plain = sanitizeHtml(html, {allowedTags:[],allowedAttributes:{}});
  return {title:data.title.trim(), slug:data.slug, date:rawDate, summary:typeof data.summary === 'string' ? data.summary : plain.slice(0,110), tags:Array.isArray(data.tags) ? data.tags.filter(t=>typeof t==='string') : [], html, minutes:Math.max(1,Math.ceil(plain.length/450))};
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
