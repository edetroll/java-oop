const T={hu:{course:'TANANYAG',resources:'GYŰJTEMÉNYEK',glossary:'Szakszótár',phrases:'Kifejezéstár',static:'Statikus oktatási felület',language:'Nyelv',split:'Két nyelv',footer:'Tananyagvázlat — a tartalom később bővíthető',search:'Keresés bármelyik nyelven…',missing:'Ehhez a fejezethez még nincs elérhető fordítás.',overview:'ÁTTEKINTÉS',chapter:'FEJEZET',notFound:'Nincs találat.',contents:'Fejezet tartalma',draft:'Mintatartalom — a végleges tananyag később készül el.'},en:{course:'COURSE',resources:'RESOURCES',glossary:'Glossary',phrases:'Phrasebook',static:'Static learning website',language:'Language',split:'Two languages',footer:'Prototype — content can be expanded later',search:'Search in any language…',missing:'A translation is not yet available for this chapter.',overview:'OVERVIEW',chapter:'CHAPTER',notFound:'No matches.',contents:'Chapter content',draft:'Sample content — final lessons will be added later.'},zh:{course:'课程',resources:'资料',glossary:'术语表',phrases:'常用表达',static:'静态教学网站',language:'语言',split:'双语对照',footer:'网页原型 — 课程内容将逐步完善',search:'使用任意语言搜索…',missing:'该章节尚无此语言的译文。',overview:'概览',chapter:'章节',notFound:'未找到结果。',contents:'章节内容',draft:'示例内容 — 正式课程将稍后添加。'}};
const state={manifest:[],page:'chapter',id:null,lang:localStorage.getItem('oop.lang')||'hu',right:localStorage.getItem('oop.right')||'en',split:localStorage.getItem('oop.split')==='true',theme:localStorage.getItem('oop.theme')||'light'};
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tr=k=>(T[state.lang]||T.hu)[k]||k;
const fetchJSON=async path=>{const r=await fetch(path);if(!r.ok)throw Error(path);return r.json()};
const mdCache={};
async function loadMd(path){if(!path)return null;if(mdCache[path])return mdCache[path];try{const r=await fetch(path);if(!r.ok)return null;return mdCache[path]=await r.text()}catch{return null}}
function inline(s){return esc(s)
 .replace(/\[([^\]\n]+)\]\(((?:content\/|assets\/)[A-Za-z0-9_\/.-]+\.(?:csv|java|txt))\)/gi,
  (_m,label,url)=>`<a href="${url}" download>${label}</a>`)
 .replace(/`([^`]+)`/g,'<code>$1</code>')
 .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
 .replace(/\*(.+?)\*/g,'<em>$1</em>')}
function markdown(md){const lines=md.replace(/\r/g,'').split('\n');let html='',code=false,language='',buffer=[],list=false;function flush(){if(buffer.length){html+='<p>'+inline(buffer.join(' '))+'</p>';buffer=[]}}function endList(){if(list){html+='</ul>';list=false}}for(const line of lines){const l=line.trim();if(l.startsWith('```')){flush();endList();if(!code){language=l.slice(3).trim();html+=`<div class="code-label">${esc(language||'code')}</div><pre><code>`;code=true}else{html+='</code></pre>';code=false}continue}if(code){html+=esc(line)+'\n';continue}if(!l){flush();endList();continue}const h=l.match(/^(#{1,4})\s+(.+)$/);if(h){flush();endList();const n=Math.min(h[1].length+1,4);html+=`<h${n}>${inline(h[2])}</h${n}>`;continue}const image=l.match(/^!\[([^\]]*)\]\(([^)]+)\)(?:\s*\{width=(\d{2,4})\})?$/);if(image){flush();endList();const url=image[2].trim();if(/^(?:content\/|assets\/)[a-zA-Z0-9_\/.-]+\.(?:svg|png|jpe?g|webp)$/i.test(url)){const width=image[3]?Math.min(Number(image[3]),1600):null;html+=`<button type="button" class="lesson-image-trigger" aria-label="${esc(image[1])}" title="Nagyítás"${width?` style="--image-width:${width}px"`: ''}><img class="lesson-image" src="${esc(url)}" alt="${esc(image[1])}" loading="lazy"></button>`}continue}if(l.startsWith('> ')){flush();endList();html+=`<div class="note">${inline(l.slice(2))}</div>`;continue}if(l.startsWith('- ')){flush();if(!list){html+='<ul>';list=true}html+=`<li>${inline(l.slice(2))}</li>`;continue}endList();buffer.push(l)}flush();endList();if(code)html+='</code></pre>';return html}

const baseMarkdown=markdown;
const PROGRAMMING_LANGS=['java','csharp','python','cpp'];
const LANG_LABELS={java:'Java',csharp:'C#',python:'Python',cpp:'C++'};
// A continuous set of :::lang ... :::end blocks renders as a single switchable group.
// Each block can contain prose, headings, notes and fenced code, not only code.
function markdownWithTabs(src){
 const ls=src.replace(/\r/g,'').split('\n'),pieces=[];let plain=[],at=0;
 const flushPlain=()=>{if(plain.length){pieces.push(baseMarkdown(plain.join('\n')));plain=[]}};
 while(at<ls.length){const m=ls[at].trim().match(/^:::lang\s+(java|csharp|python|cpp)\s*$/i);
  if(!m){
   const marker=ls[at].trim();
   if(marker===':::exercise'||marker===':::endexercise'){
    flushPlain();pieces.push(marker===':::exercise'?'<div class="exercise-card">':'</div>');at++;continue;
   }
   plain.push(ls[at++]);continue;
  }
  flushPlain();const entries=[];
  while(at<ls.length){const start=ls[at].trim().match(/^:::lang\s+(java|csharp|python|cpp)\s*$/i);if(!start)break;
   const lang=start[1].toLowerCase();at++;const lines=[];
   while(at<ls.length&&ls[at].trim()!==':::end')lines.push(ls[at++]);
   if(at<ls.length)at++;
   entries.push({lang,html:baseMarkdown(lines.join('\n'))});
   while(at<ls.length&&ls[at].trim()==='')at++;
  }
  if(entries.length){const group='lang'+pieces.length+'_'+Math.random().toString(36).slice(2,8);pieces.push(`<div class="lang-group"><div class="lang-tabs" role="tablist" aria-label="Programozási nyelv">${entries.map((e,i)=>`<button type="button" class="lang-tab" role="tab" aria-selected="${i===0}" data-lang="${e.lang}" data-group="${group}">${LANG_LABELS[e.lang]}</button>`).join('')}</div>${entries.map((e,i)=>`<section class="lang-content" role="tabpanel" data-group="${group}" data-lang="${e.lang}" ${i?'hidden':''}>${e.html}</section>`).join('')}</div>`)}
 }
 flushPlain();return pieces.join('');
}
// Small offline highlighter; HTML is escaped before highlighting tokens.
function colorCode(raw){
 const token=/\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|\b(?:public|private|protected|class|static|void|new|extends|implements|interface|abstract|final|return|import|package|namespace|using|internal|override|virtual|def|self|from|pass|print|if|else|for|while|this|super|const|auto|struct|include|int|string|bool|boolean|float|double|var|null|None|True|False)\b|\b(?:String|System|Console|Main|Object|List|ArrayList|int|str|Integer)\b/g;
 let out='',last=0;for(const m of raw.matchAll(token)){out+=esc(raw.slice(last,m.index));const v=m[0];const kind=/^(\/\/|#|\/\*)/.test(v)?'comment':/^["']/.test(v)?'string':/^\d/.test(v)?'number':/^(String|System|Console|Main|Object|List|ArrayList|Integer)$/.test(v)?'type':'keyword';out+=`<span class="hl-${kind}">${esc(v)}</span>`;last=m.index+v.length}return out+esc(raw.slice(last));
}
function enhanceCode(root){
 const labels={hu:['Kód másolása','Másolva','Nem sikerült másolni'],en:['Copy code','Copied','Copy failed'],zh:['复制代码','已复制','复制失败']};
 root.querySelectorAll('pre code').forEach(code=>{
  const raw=code.textContent;code.innerHTML=colorCode(raw);
  const pre=code.parentElement,old=pre.previousElementSibling;
  if(old?.classList.contains('code-label'))old.remove();
  const footer=document.createElement('div');footer.className='code-footer';
  const btn=document.createElement('button');btn.type='button';btn.className='copy-code';
  const languagePane=pre.closest('.aligned-row > article');
  const language=languagePane&&languagePane===languagePane.parentElement?.lastElementChild?state.right:state.lang;
  const texts=labels[language]||labels.hu;
  btn.title=texts[0];btn.setAttribute('aria-label',texts[0]);
  btn.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';
  footer.append(btn);pre.after(footer);
  btn.onclick=async()=>{
   try{
    if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(raw);
    else {const area=document.createElement('textarea');area.value=raw;document.body.append(area);area.select();if(!document.execCommand('copy'))throw Error('copy');area.remove()}
    btn.title=texts[1];btn.setAttribute('aria-label',texts[1]);btn.classList.add('copied');
   }catch{btn.title=texts[2];btn.setAttribute('aria-label',texts[2]);btn.classList.add('copy-error')}
   btn.blur();
  };
 });
}
function enhanceImages(root){
 root.querySelectorAll('.lesson-image-trigger').forEach(button=>{
  const image=button.querySelector('img');
  image.addEventListener('error',()=>{
   const fallback=document.createElement('a');
   fallback.className='lesson-image-fallback';
   fallback.href=image.getAttribute('src');
   fallback.target='_blank';
   fallback.rel='noopener noreferrer';
   fallback.textContent=(image.alt||'UML')+' — UML / diagram megnyitása';
   button.replaceWith(fallback);
  });
  button.addEventListener('click',()=>{
   const source=button.querySelector('img');
   const dialog=document.createElement('dialog');dialog.className='image-lightbox';
   const close=document.createElement('button');close.className='lightbox-close';close.type='button';close.textContent='×';close.setAttribute('aria-label','Close / Bezárás / 关闭');
   const picture=document.createElement('img');picture.src=source.src;picture.alt=source.alt;
   dialog.append(close,picture);document.body.append(dialog);
   const dismiss=()=>{dialog.close();dialog.remove();button.focus()};
   close.onclick=dismiss;
   dialog.addEventListener('click',event=>{if(event.target===dialog)dismiss()});
   dialog.addEventListener('cancel',event=>{event.preventDefault();dismiss()});
   dialog.showModal();
  });
 });
}
function activateTabs(root){root.querySelectorAll('.lang-tab').forEach(tab=>{tab.onclick=()=>{const g=tab.closest('.lang-group');g.querySelectorAll('.lang-tab').forEach(b=>b.setAttribute('aria-selected',String(b===tab)));g.querySelectorAll('.lang-content').forEach(section=>section.hidden=section.dataset.lang!==tab.dataset.lang)}})}

// Stable section identifiers are shared across HU / EN / ZH files.
const sectionCatalog={};
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function sectionsOf(md){
 const lines=(md||'').replace(/\r/g,'').split('\n');const sections=[];let current={id:'intro',title:'',body:[]};
 const push=()=>{if(current.body.join('\n').trim())sections.push({...current,body:current.body.join('\n')})};
 for(const line of lines){const h=line.match(/^## (.+?)(?:\s+\{#([a-zA-Z][\w-]*)\})?\s*$/);
  if(h){push();current={id:h[2]||slug(h[1]),title:h[1],body:[`## ${h[1]}`]};}
  else if(/^# (?!#)/.test(line)){/* page title is already shown above the article */}
  else current.body.push(line);
 }
 push();return sections;
}
function sectionHTML(sec){return `<section class="lesson-section" data-section="${esc(sec.id)}" id="section-${esc(sec.id)}">${markdownWithTabs(sec.body)}</section>`}
function jumpToSection(id){if(!id)return;const node=document.querySelector(`.lesson-section[data-section="${CSS.escape(id)}"]`);if(node){node.scrollIntoView({behavior:'smooth',block:'start'});document.querySelectorAll('.subchapter-link').forEach(b=>b.classList.toggle('current',b.dataset.section===id))}}
function chapterHash(id,section){return `#chapter/${encodeURIComponent(id)}${section?'/'+encodeURIComponent(section):''}`}
function navigate(page,id,section=''){
 state.page=page;state.id=id||state.id;state.section=section;
 const h=page==='chapter'?chapterHash(state.id,section):`#${page}`;
 if(location.hash!==h)location.hash=h;else render();
}
function parseHash(){
 const h=decodeURIComponent(location.hash.slice(1));state.section='';
 if(h==='glossary'||h==='phrases'){state.page=h;return}
 state.page='chapter';const parts=h.startsWith('chapter/')?h.slice(8).split('/'):[];
 state.id=state.manifest.find(c=>c.id===parts[0])?.id||state.manifest[0]?.id||null;
 state.section=parts[1]||'';
}
function updateUI(){
 document.documentElement.lang=state.lang;document.documentElement.dataset.theme=state.theme;
 $('#lang-left').value=state.lang;$('#lang-right').value=state.right;$('#split-toggle').checked=state.split;
 $('#lang-right').hidden=!state.split;
 document.querySelectorAll('[data-i18n]').forEach(e=>e.textContent=tr(e.dataset.i18n));
 const c=state.manifest.find(x=>x.id===state.id);
 $('#breadcrumbs').textContent=state.page==='chapter'?`${tr('course')} / ${c?.title?.[state.lang]||c?.title?.hu||''}`:tr(state.page);
 $('#chapter-nav').innerHTML=state.manifest.map((c,i)=>{
  const active=state.page==='chapter'&&state.id===c.id;
  const sub=sectionCatalog[c.id]||[];
  return `<div class="chapter-group"><button class="chapter-btn ${active?'active':''}" data-id="${esc(c.id)}" aria-expanded="${active}"><span class="chapter-number">${String(i+1).padStart(2,'0')}</span><span class="chapter-name">${esc(c.title?.[state.lang]||c.title?.hu||c.id)}</span><span class="chapter-chevron">${active?'⌄':'›'}</span></button>${active?`<div class="subchapter-list">${sub.filter(v=>v.id!=='intro').map(v=>`<button class="subchapter-link ${state.section===v.id?'current':''}" data-section="${esc(v.id)}">${esc(v.title)}</button>`).join('')}</div>`:''}</div>`
 }).join('');
 document.querySelectorAll('.chapter-btn').forEach(e=>e.onclick=()=>{navigate('chapter',e.dataset.id);$('#sidebar').classList.remove('open')});
 document.querySelectorAll('.subchapter-link').forEach(e=>e.onclick=()=>{const id=e.dataset.section;if(location.hash!==chapterHash(state.id,id))location.hash=chapterHash(state.id,id);else jumpToSection(id);$('#sidebar').classList.remove('open')});
 document.querySelectorAll('[data-page]').forEach(b=>{b.classList.toggle('active',b.dataset.page===state.page);b.onclick=()=>{navigate(b.dataset.page);$('#sidebar').classList.remove('open')}});
}
async function renderChapter(){
 const c=state.manifest.find(x=>x.id===state.id);if(!c){$('#main').innerHTML='<div class="empty">No chapters yet.</div>';return}
 const title=c.title?.[state.lang]||c.title?.hu||c.id;
 const description=c.description?.[state.lang]||c.description?.hu||'';
 const top=`<div class="header-block"><h1 class="page-title">${esc(title)}</h1><p class="lead">${esc(description)}</p></div>`;
 const left=sectionsOf(await loadMd(c.files?.[state.lang]));
 if(!state.split){$('#main').innerHTML=top+`<div class="pane"><article class="panel article">${left.length?left.map(sectionHTML).join(''):`<div class="empty">${tr('missing')}</div>`}</article></div>`;}
 else{
  const right=sectionsOf(await loadMd(c.files?.[state.right]));
  const other=new Map(right.map(x=>[x.id,x]));const primary=new Set(left.map(x=>x.id));
  const order=[...left.map(x=>x.id),...right.filter(x=>!primary.has(x.id)).map(x=>x.id)];
  const lmap=new Map(left.map(x=>[x.id,x]));
  $('#main').innerHTML=top+`<div class="aligned-sections">${order.map(id=>`<div class="aligned-row"><article class="panel article">${lmap.has(id)?sectionHTML(lmap.get(id)):`<div class="empty">${tr('missing')}</div>`}</article><article class="panel article">${other.has(id)?sectionHTML(other.get(id)):`<div class="empty">${tr('missing')}</div>`}</article></div>`).join('')||`<div class="empty">${tr('missing')}</div>`}</div>`;
 }
 activateTabs($('#main'));enhanceCode($('#main'));enhanceImages($('#main'));
 if(state.section)requestAnimationFrame(()=>jumpToSection(state.section));
}
async function renderDictionary(){
 const isPhrase=state.page==='phrases';const data=await fetchJSON('content/'+(isPhrase?'phrases':'glossary')+'.json');
 const heading=tr(isPhrase?'phrases':'glossary');
 const lead=state.lang==='hu'?(isPhrase?'Gyakori programozási utasítások és mondatminták magyarul, angolul és kínaiul.':'Az objektumorientált programozás legfontosabb fogalmai három nyelven.'):state.lang==='en'?(isPhrase?'Common programming instructions in Hungarian, English and Chinese.':'Key object-oriented programming terms in three languages.'):(isPhrase?'匈牙利语、英语和中文常用编程表达。':'三语面向对象编程术语。');
 $('#main').innerHTML=`<div class="header-block"><h1 class="page-title">${heading}</h1><p class="lead">${lead}</p></div><div class="search-wrap"><input id="entry-search" class="search" type="search" placeholder="${tr('search')}" aria-label="${tr('search')}"></div><div id="entry-count" class="mini-status"></div><div class="dictionary-scroll"><table class="dictionary"><thead><tr>${[['hu','Magyar'],['en','English'],['zh','中文']].map(([key,label])=>`<th scope="col"><button class="sort-heading" data-sort="${key}" aria-label="${label}: rendezés">${label}<span class="sort-icon">↕</span></button></th>`).join('')}</tr></thead><tbody id="entries"></tbody></table></div>`;
 let sort=state.lang,direction=1,query='';
 const collators={hu:new Intl.Collator('hu',{sensitivity:'base',numeric:true}),en:new Intl.Collator('en',{sensitivity:'base',numeric:true}),zh:new Intl.Collator('zh-Hans-CN',{sensitivity:'base',numeric:true})};
 function paint(){
  const filtered=data.filter(x=>['hu','en','zh','category','note'].some(k=>String(x[k]||'').toLocaleLowerCase().includes(query.toLocaleLowerCase())));
  filtered.sort((a,b)=>direction*collators[sort].compare(a[sort]||'',b[sort]||''));
  $('#entry-count').textContent=`${filtered.length} / ${data.length}`;
  $('#entries').innerHTML=filtered.length?filtered.map(x=>`<tr>${['hu','en','zh'].map(l=>`<td lang="${l}">${esc(x[l]||'')}${l==='hu'&&x.note?`<div class="dictionary-note">${esc(x.note)}</div>`:''}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="3" class="empty">${tr('notFound')}</td></tr>`;
  document.querySelectorAll('.sort-heading').forEach(b=>{const current=b.dataset.sort===sort;b.querySelector('.sort-icon').textContent=current?(direction>0?'↑':'↓'):'↕';b.closest('th').setAttribute('aria-sort',current?(direction>0?'ascending':'descending'):'none')});
 }
 document.querySelectorAll('.sort-heading').forEach(btn=>btn.onclick=()=>{const key=btn.dataset.sort;direction=sort===key?-direction:1;sort=key;paint()});
 $('#entry-search').oninput=e=>{query=e.target.value;paint()};paint();
}
async function render(){updateUI();if(state.page==='chapter')await renderChapter();else await renderDictionary()}
function configureSidebarToggle() {
 const app=$('.app'), button=$('#sidebar-toggle');
 if (!app || !button) return;
 const labels={hu:['Oldalsáv elrejtése','Oldalsáv megjelenítése'],en:['Hide sidebar','Show sidebar'],zh:['隐藏侧边栏','显示侧边栏']};
 const update=()=>{
  const hidden=app.classList.contains('sidebar-hidden');
  const label=(labels[state.lang]||labels.hu)[hidden?1:0];
  button.setAttribute('aria-pressed',String(hidden));
  button.setAttribute('aria-label',label);
  button.title=label;
  button.textContent=hidden?'☰':'☷';
 };
 if(localStorage.getItem('oop.sidebar-hidden')==='true') app.classList.add('sidebar-hidden');
 button.onclick=()=>{
  app.classList.toggle('sidebar-hidden');
  localStorage.setItem('oop.sidebar-hidden',String(app.classList.contains('sidebar-hidden')));
  update();
 };
 window.addEventListener('oop-language-change',update);
 update();
}
async function init(){try{state.manifest=(await fetchJSON('content/manifest.json')).chapters||[];await Promise.all(state.manifest.map(async c=>{const md=await loadMd(c.files?.[state.lang]||c.files?.hu);sectionCatalog[c.id]=sectionsOf(md).map(x=>({id:x.id,title:x.title}))}));parseHash();$('#lang-left').onchange=e=>{state.lang=e.target.value;localStorage.setItem('oop.lang',state.lang);window.dispatchEvent(new Event('oop-language-change'));Promise.all(state.manifest.map(async c=>{const md=await loadMd(c.files?.[state.lang]||c.files?.hu);sectionCatalog[c.id]=sectionsOf(md).map(x=>({id:x.id,title:x.title}))})).then(()=>render())};$('#lang-right').onchange=e=>{state.right=e.target.value;localStorage.setItem('oop.right',state.right);render()};$('#split-toggle').onchange=e=>{state.split=e.target.checked;localStorage.setItem('oop.split',state.split);render()};$('#theme-toggle').onclick=()=>{state.theme=state.theme==='light'?'dark':'light';localStorage.setItem('oop.theme',state.theme);render()};$('#menu-toggle').onclick=()=>$('#sidebar').classList.toggle('open');configureSidebarToggle();window.addEventListener('hashchange',()=>{parseHash();render()});await render()}catch(e){$('#main').innerHTML=`<div class="panel article"><h2>Nem sikerült betölteni az adatokat.</h2><p>A statikus oldalhoz helyi HTTP-szerver szükséges. Lásd: README.md.</p><code>${esc(e.message)}</code></div>`}}
init();
