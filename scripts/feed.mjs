import { escapeHtml as e } from './content.mjs';

// Feed readers show no site, so relative links in article HTML must become absolute.
const absolutize = (html, base) => html.replace(/(href|src)="\/(?!\/)/g, `$1="${base}/`);
// "]]>" would end the CDATA section early; split it across two sections.
const cdata = text => `<![CDATA[${text.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;

export function buildFeed(posts, site) {
  const items = posts.map(p => {
    const url = `${site.url}/writing/${p.slug}/`;
    return `<item><title>${e(p.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(p.date + 'T00:00:00+08:00').toUTCString()}</pubDate><description>${e(p.summary)}</description><content:encoded>${cdata(absolutize(p.html, site.url))}</content:encoded></item>`;
  }).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><title>${e(site.name)} 的文章</title><link>${site.url}/</link><description>${e(site.description)}</description><language>zh-CN</language><atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
}

// lastmod is the publish date: posts have no edit date, and a guessed one would teach search engines to ignore the field.
// /about/ has no reliable date, so it gets none.
export function buildSitemap(posts, site) {
  const newest = posts[0]?.date;
  const entries = [['/', newest], ['/writing/', newest], ['/about/'], ...posts.map(p => [`/writing/${p.slug}/`, p.date])];
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map(([p, date]) => `<url><loc>${site.url}${p}</loc>${date ? `<lastmod>${date}</lastmod>` : ''}</url>`).join('')}</urlset>`;
}
