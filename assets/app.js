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
document.querySelector('.back-top').addEventListener('click', event => { event.preventDefault(); window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); document.querySelector('.wordmark').focus({preventScroll:true}); });
