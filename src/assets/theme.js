try {
  var savedTheme = localStorage.getItem('meihao-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') document.documentElement.dataset.theme = savedTheme;
} catch {}
var sidebarPreference='open';
try { sidebarPreference=localStorage.getItem('meihao-sidebar')||'open'; } catch {}
document.documentElement.dataset.sidebar=matchMedia('(min-width:761px)').matches&&sidebarPreference!=='closed'?'open':'closed';
