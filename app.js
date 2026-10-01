const app=document.querySelector('#app'),sheet=document.querySelector('#sheet'),detail=document.querySelector('#wordDetail');
const TESTAMENTS={greek:{name:'Greek New Testament',sub:'Καινὴ Διαθήκη',dir:'ltr'},hebrew:{name:'Hebrew Old Testament',sub:'תנ״ך',dir:'rtl'}};
const BOOKS={greek:['Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'],hebrew:['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','1 Samuel','2 Samuel','1 Kings','2 Kings','Isaiah','Jeremiah','Ezekiel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Psalms','Job','Proverbs','Ruth','Song of Songs','Ecclesiastes','Lamentations','Esther','Daniel','Ezra','Nehemiah','1 Chronicles','2 Chronicles']};

const CHAPTERS={
'Matthew':28,'Mark':16,'Luke':24,'John':21,'Acts':28,'Romans':16,'1 Corinthians':16,'2 Corinthians':13,'Galatians':6,'Ephesians':6,'Philippians':4,'Colossians':4,'1 Thessalonians':5,'2 Thessalonians':3,'1 Timothy':6,'2 Timothy':4,'Titus':3,'Philemon':1,'Hebrews':13,'James':5,'1 Peter':5,'2 Peter':3,'1 John':5,'2 John':1,'3 John':1,'Jude':1,'Revelation':22,
'Genesis':50,'Exodus':40,'Leviticus':27,'Numbers':36,'Deuteronomy':34,'Joshua':24,'Judges':21,'1 Samuel':31,'2 Samuel':24,'1 Kings':22,'2 Kings':25,'Isaiah':66,'Jeremiah':52,'Ezekiel':48,'Hosea':14,'Joel':3,'Amos':9,'Obadiah':1,'Jonah':4,'Micah':7,'Nahum':3,'Habakkuk':3,'Zephaniah':3,'Haggai':2,'Zechariah':14,'Malachi':4,'Psalms':150,'Job':42,'Proverbs':31,'Ruth':4,'Song of Songs':8,'Ecclesiastes':12,'Lamentations':5,'Esther':10,'Daniel':12,'Ezra':10,'Nehemiah':13,'1 Chronicles':29,'2 Chronicles':36};

const DEMO={
  greek:{
    John:{
      1:[{v:1,w:[
        ['Ἐν','ἐν','en','in','Preposition'],
        ['ἀρχῇ','ἀρχή','archē','beginning','Noun · Dative · Feminine · Singular'],
        ['ἦν','εἰμί','eimi','was','Verb · Imperfect · Active · Indicative · 3rd Singular'],
        ['ὁ','ὁ','ho','the','Article · Nominative · Masculine · Singular'],
        ['λόγος','λόγος','logos','word','Noun · Nominative · Masculine · Singular']
      ]}]
    }
  },
  hebrew:{
    Genesis:{
      1:[{v:1,w:[
        ['בְּרֵאשִׁית','רֵאשִׁית','bərēʾšît','in the beginning','Preposition + Noun · Feminine · Singular'],
        ['בָּרָא','ברא','bārāʾ','created','Verb · Qal · Perfect · 3rd Masculine Singular'],
        ['אֱלֹהִים','אלהים','ʾĕlōhîm','God','Noun · Masculine · Plural form'],
        ['אֵת','את','ʾēt','[object marker]','Particle'],
        ['הַשָּׁמַיִם','שׁמים','haššāmayim','the heavens','Noun · Masculine · Plural'],
        ['וְאֵת','את','wəʾēt','and [object marker]','Conjunction + Particle'],
        ['הָאָרֶץ','ארץ','hāʾāreṣ','the earth','Noun · Feminine · Singular']
      ]}]
    }
  }
};
let state={view:'home'};
function shell(x){app.innerHTML=`<div class="shell">${x}</div>`}
function home(){state={view:'home'};shell(`<div class="home"><div class="brand">Original</div><h1>Scripture<br>at its source.</h1>${Object.entries(TESTAMENTS).map(([k,t])=>`<button class="choice" data-testament="${k}">${t.name}<small>${t.sub}</small></button>`).join('')}</div>`);document.querySelectorAll('[data-testament]').forEach(b=>b.onclick=()=>books(b.dataset.testament))}
function books(t){state={view:'books',t};shell(`<div class="topbar"><button class="back">← Back</button><div class="title">${TESTAMENTS[t].name}</div><span></span></div><div class="books">${BOOKS[t].map(b=>`<button class="book" data-book="${b}">${b}</button>`).join('')}</div>`);document.querySelector('.back').onclick=home;document.querySelectorAll('[data-book]').forEach(b=>b.onclick=()=>reader(t,b.dataset.book,1))}
async function getChapter(t,b,c){const folder=t==='greek'?'nt':'ot';try{const r=await fetch(`data/${folder}/${slug(b)}/${c}.json`);if(r.ok)return r.json()}catch(e){}return DEMO[t]?.[b]?.[c]||null}function slug(s){return s.toLowerCase().replaceAll(' ','-')}
async function reader(t,b,c){state={view:'reader',t,b,c};const verses=await getChapter(t,b,c);shell(`<div class="topbar"><button class="back">← Books</button><button class="chapterBtn" title="Chapter">${b} ${c}</button><span></span></div><div class="readerHead"><h1>${b} ${c}</h1><p>${TESTAMENTS[t].name}</p></div>${verses?`<div class="scripture ${t==='hebrew'?'hebrew':''}" dir="${TESTAMENTS[t].dir}">${verses.map(v=>`<span class="verse"><sup class="vnum">${v.v}</sup>${v.w.map((x,i)=>`<button class="word" data-x='${esc(JSON.stringify(x))}'>${x[0]}</button>${i<v.w.length-1?' ':''}`).join('')} </span>`).join('')}</div>`:`<p class="empty">This chapter is ready for the full MACULA dataset. The included v1 shell contains John 1 and Genesis 1 as live examples; run the data importer to generate every chapter.</p>`}`);document.querySelector('.back').onclick=()=>books(t);document.querySelector('.chapterBtn').onclick=()=>chooseChapter(t,b,c);document.querySelectorAll('.word').forEach(w=>w.onclick=()=>show(JSON.parse(unesc(w.dataset.x))))}
function esc(s){return s.replaceAll('&','&amp;').replaceAll("'",'&#39;').replaceAll('<','&lt;')};function unesc(s){const e=document.createElement('textarea');e.innerHTML=s;return e.value}

function chooseChapter(t,b,current){
  const max=CHAPTERS[b]||1;
  detail.innerHTML=`<div class="chapterTitle">${b}</div><div class="chapterGrid">${Array.from({length:max},(_,i)=>`<button class="chapterChoice ${i+1===current?'active':''}" data-ch="${i+1}">${i+1}</button>`).join('')}</div>`;
  sheet.hidden=false;
  detail.querySelectorAll('[data-ch]').forEach(x=>x.onclick=()=>{close();reader(t,b,Number(x.dataset.ch))});
}

function show(x){detail.innerHTML=`<div class="detailWord">${x[0]}</div><div class="detailTranslit">${x[2]||''}</div><div class="gloss">${x[3]||'—'}</div><div class="meta"><div class="row"><b>Lemma</b><span>${x[1]||'—'}</span></div><div class="row"><b>Parsing</b><span>${x[4]||'—'}</span></div></div>`;sheet.hidden=false}
function close(){sheet.hidden=true}document.querySelector('.scrim').onclick=close;document.querySelector('.close').onclick=close;home();if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
