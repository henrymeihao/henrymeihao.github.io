const toggle=document.querySelector('.theme-toggle');
const media=matchMedia('(prefers-color-scheme: dark)');
const isDark=()=>document.documentElement.dataset.theme?document.documentElement.dataset.theme==='dark':media.matches;
function updateToggle(){toggle.setAttribute('aria-label',isDark()?'切换浅色模式':'切换深色模式');toggle.setAttribute('aria-pressed',String(isDark()));}
toggle.hidden=false;updateToggle();media.addEventListener('change',updateToggle);
toggle.addEventListener('click',()=>{const theme=isDark()?'light':'dark';document.documentElement.dataset.theme=theme;try{localStorage.setItem('meihao-theme',theme);}catch{}updateToggle();});

const search=document.querySelector('#search');
if(search){
  document.querySelector('[data-search-ui]').hidden=false;
  search.addEventListener('input',()=>{const query=search.value.trim().toLowerCase();let found=0;document.querySelectorAll('[data-post]').forEach(row=>{row.hidden=!row.dataset.search.includes(query);if(!row.hidden)found++;});document.querySelector('#search-empty').hidden=found>0;});
}

const drawer=document.querySelector('.drawer');
const opener=drawer.querySelector('summary');
const sidebar=document.querySelector('#sidebar');
const close=document.querySelector('.drawer-close');
const frame=document.querySelector('.content-frame');
const scrollArea=document.querySelector('.sidebar-scroll');
const mobile=matchMedia('(max-width:760px)');
let desktopPreference=true;
try{desktopPreference=localStorage.getItem('meihao-sidebar')!=='closed';}catch{}
let expanded=!mobile.matches && desktopPreference;
close.hidden=false;
document.documentElement.classList.add('drawer-enhanced');
drawer.open=true;
function syncDrawer(){
  const modal=expanded&&mobile.matches;
  document.documentElement.dataset.sidebar=expanded?'open':'closed';
  document.body.classList.toggle('drawer-open',expanded);
  document.body.classList.toggle('drawer-modal',modal);
  sidebar.inert=!expanded;sidebar.setAttribute('aria-hidden',String(!expanded));frame.inert=modal;
  opener.setAttribute('aria-expanded',String(expanded));opener.setAttribute('aria-label',expanded?'关闭导航':'打开导航');
  if(modal){sidebar.setAttribute('role','dialog');sidebar.setAttribute('aria-modal','true');}
  else{sidebar.removeAttribute('role');sidebar.removeAttribute('aria-modal');}
}
function setDrawer(value){
  expanded=value;
  if(!mobile.matches){desktopPreference=value;try{localStorage.setItem('meihao-sidebar',value?'open':'closed');}catch{}}
  syncDrawer();(value?close:opener).focus({preventScroll:true});
}
opener.addEventListener('click',event=>{event.preventDefault();setDrawer(!expanded);});
close.addEventListener('click',()=>setDrawer(false));
document.querySelector('.drawer-backdrop').addEventListener('click',()=>setDrawer(false));
mobile.addEventListener('change',()=>{expanded=mobile.matches?false:desktopPreference;syncDrawer();if(sidebar.contains(document.activeElement)&&!expanded)opener.focus({preventScroll:true});});
syncDrawer();
try{scrollArea.scrollTop=Number(sessionStorage.getItem('meihao-sidebar-scroll'))||0;}catch{}
sidebar.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{try{sessionStorage.setItem('meihao-sidebar-scroll',String(scrollArea.scrollTop));}catch{}}));
requestAnimationFrame(()=>requestAnimationFrame(()=>document.documentElement.classList.add('ui-ready')));

const titleMenu=document.querySelector('.title-menu');
document.addEventListener('click',event=>{if(titleMenu&&!titleMenu.contains(event.target))titleMenu.open=false;});
document.addEventListener('keydown',event=>{
  if(document.querySelector('.search-dialog')?.open)return;
  if(event.key==='Escape'&&titleMenu?.open){titleMenu.open=false;titleMenu.querySelector('summary').focus();return;}
  if(!expanded)return;
  if(event.key==='Escape'){event.preventDefault();setDrawer(false);}
  if(event.key==='Tab'&&mobile.matches){
    const items=[...sidebar.querySelectorAll('a[href],button:not([hidden]),summary')].filter(el=>el.getClientRects().length);
    const first=items[0],last=items.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
});
const copy=document.querySelector('.copy-link');
if(copy&&navigator.clipboard){copy.hidden=false;copy.addEventListener('click',async()=>{const status=document.querySelector('.copy-status');try{await navigator.clipboard.writeText(copy.dataset.url);status.textContent='链接已复制';}catch{status.textContent='未能复制，请复制地址栏链接。';}});}

const searchDialog=document.querySelector('.search-dialog');
const searchInput=document.querySelector('#dialog-search');
const results=[...searchDialog.querySelectorAll('.search-result')];
const resultTitles=results.map(row=>row.querySelector('.result-title').textContent);
let visibleResults=results, selectedIndex=0, searchReturnFocus=null;
function selectResult(index){
  selectedIndex=visibleResults.length?Math.max(0,Math.min(index,visibleResults.length-1)):-1;
  results.forEach(row=>row.setAttribute('aria-selected',String(row===visibleResults[selectedIndex])));
  if(selectedIndex>=0)searchInput.setAttribute('aria-activedescendant',visibleResults[selectedIndex].id);
  else searchInput.removeAttribute('aria-activedescendant');
}
function filterResults(){
  const query=searchInput.value.trim().toLowerCase();
  const terms=query.split(/\s+/).filter(Boolean);
  results.forEach((row,i)=>{
    row.hidden=!terms.every(term=>row.dataset.search.includes(term));
    const label=row.querySelector('.result-title');label.replaceChildren();
    const title=resultTitles[i], at=query?title.toLowerCase().indexOf(query):-1;
    if(at>=0){label.append(title.slice(0,at));const mark=document.createElement('strong');mark.textContent=title.slice(at,at+query.length);label.append(mark,title.slice(at+query.length));}
    else label.textContent=title;
  });
  visibleResults=results.filter(row=>!row.hidden);selectResult(0);
  document.querySelector('#search-caption').textContent=query?`搜索结果 · ${visibleResults.length}`:'全部文章';
  document.querySelector('.search-no-results').hidden=visibleResults.length>0;
}
function openSearch(event){
  if(event&&(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey))return;
  event?.preventDefault();
  if(searchDialog.open)return;
  searchReturnFocus=mobile.matches&&expanded?opener:document.activeElement;
  if(mobile.matches&&expanded)setDrawer(false);
  if(titleMenu)titleMenu.open=false;
  filterResults();searchDialog.showModal();document.body.classList.add('search-open');searchInput.focus();
}
document.querySelectorAll('[data-open-search]').forEach(trigger=>{trigger.hidden=false;trigger.addEventListener('click',openSearch);});
searchInput.addEventListener('input',filterResults);
searchDialog.querySelector('.search-close').addEventListener('click',()=>searchDialog.close());
searchDialog.addEventListener('click',event=>{if(event.target===searchDialog){const r=searchDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)searchDialog.close();}});
searchDialog.addEventListener('close',()=>{document.body.classList.remove('search-open');if(searchReturnFocus?.isConnected&&!searchReturnFocus.closest('[inert]'))searchReturnFocus.focus({preventScroll:true});});
searchInput.addEventListener('keydown',event=>{
  if(event.isComposing)return;
  if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();selectResult(selectedIndex+(event.key==='ArrowDown'?1:-1));visibleResults[selectedIndex]?.scrollIntoView({block:'nearest'});}
  if(event.key==='Enter'){event.preventDefault();visibleResults[selectedIndex]?.click();}
});
results.forEach(row=>row.addEventListener('pointermove',()=>selectResult(visibleResults.indexOf(row))));
document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openSearch();}});
if(document.body.dataset.page==='/writing/')openSearch();
