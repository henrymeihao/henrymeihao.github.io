// Home reading state belongs to this history entry; session state also supports Home links.
(() => {
  if (document.body.dataset.page !== '/') return;
  const articles = [...document.querySelectorAll('.flow-article')];
  if (!articles.length) return;
  const links = [...document.querySelectorAll('.sidebar-articles .article-nav-link')];
  const key = 'meihao-home-reading';
  let ready = false, queued = false;
  history.scrollRestoration = 'manual';

  function currentArticle() {
    return articles.findLast(article => article.getBoundingClientRect().top <= 100) || articles[0];
  }
  function highlight() {
    articles.forEach(article => {
      const title = article.querySelector('.flow-title');
      title.classList.toggle('is-stuck', title.getBoundingClientRect().top <= 0);
    });
    const path = `/writing/${currentArticle().id}/`;
    links.forEach(link => {
      if (link.getAttribute('href') === path) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function save() {
    if (!ready) return;
    const article = currentArticle();
    const blocks = [...article.querySelector('.prose').children];
    const block = blocks.findLastIndex(el => el.getBoundingClientRect().top <= 100);
    const anchor = blocks[block] || article;
    const state = {slug: article.id, block, top: anchor.getBoundingClientRect().top, y: scrollY};
    try { history.replaceState({...history.state, homeReading: state}, ''); } catch {}
    try { sessionStorage.setItem(key, JSON.stringify(state)); } catch {}
  }
  function restore() {
    let state = history.state?.homeReading;
    if (!state) { try { state = JSON.parse(sessionStorage.getItem(key)); } catch {} }
    if (!location.hash && state && Number.isFinite(state.top) && Number.isFinite(state.y)) {
      const article = articles.find(item => item.id === state.slug);
      const anchor = article && (article.querySelector('.prose').children[state.block] || article);
      scrollTo(0, anchor ? scrollY + anchor.getBoundingClientRect().top - state.top : state.y);
    }
    ready = true;
    highlight();
  }
  addEventListener('pageshow', restore);
  addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
  document.addEventListener('click', event => { if (event.target.closest('a[href]')) save(); }, true);
  addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; highlight(); });
  }, {passive: true});
  addEventListener('resize', highlight);
  highlight();
})();
