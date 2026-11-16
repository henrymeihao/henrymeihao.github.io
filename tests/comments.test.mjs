import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Execute the shipped comments block, with only its DOM and network boundaries replaced.
const script=readFileSync(new URL('../src/assets/app.js',import.meta.url),'utf8');
const source=script.slice(script.indexOf("const comments=document.querySelector('[data-comments]');"));
const settle=()=>new Promise(resolve=>setImmediate(resolve));
function element(){
  return {hidden:true,value:'',textContent:'',style:{},scrollHeight:40,children:[],handlers:{},
    addEventListener(type,handler){this.handlers[type]=handler;},
    append(...items){this.children.push(...items);},
    prepend(item){this.children.unshift(item);},
    replaceChildren(...items){this.children=items;},
    focus(){},scrollIntoView(){this.scrolled=true;}};
}
function setup(fetch,signal=AbortSignal,dataset={}){
  const nodes=Object.fromEntries(['.composer','.composer-send','.composer-status','.comments-list','.comments-empty','.comments-load-status','.comments-retry'].map(key=>[key,element()]));
  const name=element(),content=element();
  nodes['.composer'].elements={name,content};
  nodes['.composer'].querySelector=selector=>nodes[selector];
  const section=element();
  Object.assign(section,{id:'comments',dataset:{comments:'https://example.test',commentsKey:'public',commentsPage:'/writing/test/',...dataset},querySelector:selector=>nodes[selector]});
  vm.runInNewContext(source,{document:{querySelector:()=>section,createElement:element},
    sidebar:{querySelectorAll:()=>[]},mobile:{matches:false},location:{hash:'#comments'},
    localStorage:{getItem:()=>'',setItem(){}},matchMedia:()=>({matches:false}),fetch,AbortSignal:signal});
  return {section,nodes,content};
}

test('comment destination and composer appear before the network responds',()=>{
  const {section,nodes}=setup(()=>new Promise(()=>{}));
  assert.equal(section.hidden,false);
  assert.equal(section.scrolled,true);
  assert.match(nodes['.comments-load-status'].textContent,/正在加载/);
});

for(const failure of ['network','http','timeout'])test(`comment ${failure} failure stays visible and can recover on retry`,async()=>{
  let broken=true;
  const timeoutCalls=[];
  const {section,nodes}=setup(async()=>{
    if(broken){if(failure==='http')return {ok:false};throw new Error(failure);}
    return {ok:true,json:async()=>[]};
  },{timeout(ms){timeoutCalls.push(ms);return AbortSignal.abort();}});
  await settle();
  assert.equal(section.hidden,false);
  assert.match(nodes['.comments-load-status'].textContent,/加载失败/);
  assert.equal(nodes['.comments-retry'].hidden,false);
  assert.equal(nodes['.comments-empty'].hidden,true);
  broken=false;
  await nodes['.comments-retry'].handlers.click();
  assert.equal(nodes['.comments-load-status'].textContent,'');
  assert.equal(nodes['.comments-retry'].hidden,true);
  assert.equal(nodes['.comments-empty'].hidden,false);
  assert.deepEqual(timeoutCalls,[12000,12000]);
});

test('failed sending preserves the draft and re-enables sending without automatic reposting',async()=>{
  let posts=0;
  const {nodes,content}=setup(async(url,options)=>{
    if(options.method==='POST'){posts++;throw new Error('offline');}
    return {ok:true,json:async()=>[]};
  });
  await settle();
  content.value='保留这段还没有发出的文字';
  await nodes['.composer'].handlers.submit({preventDefault(){}});
  assert.equal(content.value,'保留这段还没有发出的文字');
  assert.equal(nodes['.composer-send'].disabled,false);
  assert.match(nodes['.composer-status'].textContent,/没发出去/);
  assert.equal(posts,1);
});
test('an article thread reads only its own comments',async()=>{
  const urls=[];
  setup(async url=>{urls.push(url);return {ok:true,json:async()=>[]};});
  await settle();
  assert.match(urls[0],/&page=eq\.%2Fwriting%2Ftest%2F&/);
});

test('the guestbook lists comments from every page, each labelled and linked to where it was left',async()=>{
  const urls=[];
  const row=(page,id)=>({id,created_at:'2026-11-16T08:00:00Z',page,display_name:'读者',content:'你好'});
  const sources={'/guestbook/':'留言板','/about/':'关于','/writing/a/':'《甲》'};
  const {nodes,content}=setup(async(url,options)=>{
    if(options.method==='POST')return {ok:true,json:async()=>[{id:9,created_at:'2026-11-16T09:00:00Z',display_name:'新朋友',content:'刚来'}]};
    urls.push(url);
    return {ok:true,json:async()=>[row('/writing/a/',1),row('/about/',2),row('/guestbook/',3),row('/writing/gone/',4)]};
  },AbortSignal,{commentsPage:'/guestbook/',commentsSources:JSON.stringify(sources)});
  await settle();
  assert.doesNotMatch(urls[0],/page=eq/);
  assert.match(urls[0],/select=id,created_at,page,display_name,content/);
  content.value='刚来';
  await nodes['.composer'].handlers.submit({preventDefault(){}});
  const labels=nodes['.comments-list'].children.map(item=>{const source=item.children[0].children[2];return [source.textContent,source.href];});
  assert.deepEqual(labels,[['留言板',undefined],['《甲》','/writing/a/#comments'],['关于','/about/#comments'],['留言板',undefined],['已下线的文章',undefined]]);
});
