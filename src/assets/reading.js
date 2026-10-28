// Article pages: the toolbar title appears once the large title has scrolled away.
(() => {
  const heading = document.querySelector('.article-heading');
  const toolbar = document.querySelector('.page-toolbar');
  if (!heading || !toolbar) return;
  let queued = false;
  const update = () => { queued = false; toolbar.classList.toggle('title-shown', heading.getBoundingClientRect().bottom <= 40); };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, {passive: true});
  addEventListener('resize', update);
  addEventListener('pageshow', update);
  update();
})();

// Home reading state belongs to this history entry; session state also supports Home links.
(() => {
  if (document.body.dataset.page !== '/') return;
  const articles = [...document.querySelectorAll('.flow-article')];
  if (!articles.length) return;
  const key = 'meihao-home-reading';
  let ready = false, queued = false;
  history.scrollRestoration = 'manual';

  function currentArticle() {
    return articles.findLast(article => article.getBoundingClientRect().top <= 100) || articles[0];
  }
  function updateStickyTitles() {
    articles.forEach(article => {
      const bar = article.querySelector('.flow-title');
      const heading = article.querySelector('.flow-heading');
      bar.classList.toggle('is-stuck', heading.getBoundingClientRect().bottom <= 40);
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
    updateStickyTitles();
  }
  addEventListener('pageshow', restore);
  addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
  document.addEventListener('click', event => { if (event.target.closest('a[href]')) save(); }, true);
  addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; updateStickyTitles(); });
  }, {passive: true});
  addEventListener('resize', updateStickyTitles);
  updateStickyTitles();
})();
