const toggle = document.querySelector('.theme-toggle');
const media = window.matchMedia('(prefers-color-scheme: dark)');
const isDark = () => document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : media.matches;
function updateToggle() { toggle.setAttribute('aria-label', isDark() ? '切换浅色模式' : '切换深色模式'); toggle.setAttribute('aria-pressed', String(isDark())); }
toggle.hidden = false;
updateToggle();
media.addEventListener('change', updateToggle);
toggle.addEventListener('click', () => {
  const theme = isDark() ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('meihao-theme', theme); } catch {}
  updateToggle();
});
const search = document.querySelector('#search');
if (search) {
  document.querySelector('[data-search-ui]').hidden = false;
  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    let found = 0;
    document.querySelectorAll('[data-post]').forEach(row => { row.hidden = !row.dataset.search.includes(query); if (!row.hidden) found++; });
    document.querySelector('#search-empty').hidden = found > 0;
  });
}

const drawer = document.querySelector('.drawer');
const opener = drawer.querySelector('summary');
const sidebar = document.querySelector('#sidebar');
const close = document.querySelector('.drawer-close');
const frame = document.querySelector('.content-frame');
const mobile = matchMedia('(max-width: 760px)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let expanded = false;
close.hidden = false;
document.documentElement.classList.add('drawer-enhanced');
// Keep the native disclosure rendered so both opening and closing can animate.
drawer.open = true;
function syncDrawer() {
  const modal = expanded && mobile.matches;
  document.body.classList.toggle('drawer-open', expanded);
  document.body.classList.toggle('drawer-modal', modal);
  sidebar.inert = !expanded;
  sidebar.setAttribute('aria-hidden', String(!expanded));
  frame.inert = modal;
  opener.setAttribute('aria-expanded', String(expanded));
  opener.setAttribute('aria-label', expanded ? '关闭导航' : '打开导航');
  if (modal) { sidebar.setAttribute('role','dialog'); sidebar.setAttribute('aria-modal','true'); }
  else { sidebar.removeAttribute('role'); sidebar.removeAttribute('aria-modal'); }
}
function setDrawer(value) {
  expanded = value;
  syncDrawer();
  if (expanded) close.focus({preventScroll:true});
  else opener.focus({preventScroll:true});
}
opener.addEventListener('click', event => { event.preventDefault(); setDrawer(!expanded); });
close.addEventListener('click', () => setDrawer(false));
document.querySelector('.drawer-backdrop').addEventListener('click', () => setDrawer(false));
mobile.addEventListener('change', () => { syncDrawer(); if (expanded && mobile.matches) close.focus({preventScroll:true}); });
syncDrawer();
document.addEventListener('keydown', event => {
  if (!expanded) return;
  if (event.key === 'Escape') { event.preventDefault(); setDrawer(false); }
  if (event.key === 'Tab' && mobile.matches) {
    const items = [...sidebar.querySelectorAll('a[href],button:not([hidden])')];
    const first=items[0], last=items.at(-1);
    if (event.shiftKey && document.activeElement===first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement===last) { event.preventDefault(); first.focus(); }
  }
});
const articleLinks = [...sidebar.querySelectorAll('.article-nav-link')];
articleLinks.forEach(link => link.addEventListener('click', event => {
  const target=document.getElementById(link.dataset.slug);
  if (!target || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (target.hidden && search) { search.value=''; search.dispatchEvent(new Event('input')); }
  if (mobile.matches) setDrawer(false);
  history.replaceState(null,'','#'+target.id);
  target.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
}));
const streamArticles=[...document.querySelectorAll('.flow-article[id]')];
let scheduled=false;
function updateCurrentArticle() {
  scheduled=false;
  const current=streamArticles.filter(el=>!el.hidden && el.getBoundingClientRect().top<=130).at(-1) || streamArticles.find(el=>!el.hidden);
  if (!current) return;
  articleLinks.forEach(link=>{ if(link.dataset.slug===current.id) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); });
}
window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateCurrentArticle);}}, {passive:true});
updateCurrentArticle();
