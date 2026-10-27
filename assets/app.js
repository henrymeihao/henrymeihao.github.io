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
const shell = document.querySelector('.shell');
close.hidden = false;
function closeDrawer() { drawer.open = false; }
close.addEventListener('click', closeDrawer);
document.querySelector('.drawer-backdrop').addEventListener('click', closeDrawer);
drawer.addEventListener('toggle', () => {
  shell.inert = drawer.open;
  document.body.classList.toggle('drawer-open', drawer.open);
  opener.setAttribute('aria-label', drawer.open ? '关闭导航' : '打开导航');
  if (drawer.open) {
    sidebar.setAttribute('role', 'dialog');
    sidebar.setAttribute('aria-modal', 'true');
    close.focus();
  } else {
    sidebar.removeAttribute('role');
    sidebar.removeAttribute('aria-modal');
    opener.focus({preventScroll:true});
  }
});
document.addEventListener('keydown', event => {
  if (!drawer.open) return;
  if (event.key === 'Escape') { event.preventDefault(); closeDrawer(); }
  if (event.key === 'Tab') {
    const items = [...sidebar.querySelectorAll('a[href],button:not([hidden])')];
    const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
