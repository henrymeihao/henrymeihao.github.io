try {
  var savedTheme = localStorage.getItem('meihao-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') document.documentElement.dataset.theme = savedTheme;
} catch {}
