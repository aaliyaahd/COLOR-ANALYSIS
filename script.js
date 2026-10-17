// Seasonal Color Analysis — Beauty Journey interactions
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
let currentPhase = 0;
let currentQuestion = 0;
const phaseTitles = ['Analysis','Natural Signals','Palette Direction','Your Color Story','Your Color Result'];
function setProgress(n){ const el=$('#top-progress'); if(el) el.style.width=`${Math.max(8,Math.min(100,n))}%`; }
function setTitle(t){ const el=$('#header-phase-title'); if(el) el.textContent=t; }
function showOnly(id){
  $$('.quiz-screen, .q-block, .card, .q-block-p2, .q-block-p3').forEach(el=>el.classList.add('hidden'));
  const target=document.getElementById(id); if(target){target.classList.remove('hidden');target.classList.add('fade-in');}
  window.scrollTo({top:0,behavior:'smooth'});
}
function startQuiz(){currentPhase=1;currentQuestion=1;showOnly('screen-q1');setTitle('Natural Signals');setProgress(16);}
function nextScreen(currentId,nextId,progressWidth){
 const card=event?.currentTarget; const radio=card?.querySelector('input[type="radio"]'); if(radio) radio.checked=true;
 setTimeout(()=>{ if(currentId==='screen-q1'){currentPhase=1;currentQuestion=2;showOnlyBySelector('.q-block[data-q="c2"]');setTitle('Natural Signals');setProgress(24);} else {showOnly(nextId);setTitle('Natural Signals');setProgress(parseInt(progressWidth)||20);} },160);
}
function autoNext(input){
 if(!input)return; const block=input.closest('.q-block');
 if(!block){const q1=input.closest('#screen-q1');if(q1){nextScreen('screen-q1','screen-q2','24%');}return;}
 const q=block.dataset.q;
 const nextMap={c2:'c3',c3:'c4',c4:'c5',c5:'c6'};
 if(nextMap[q]){currentQuestion=Number(nextMap[q].slice(1));showOnlyBySelector(`.q-block[data-q="${nextMap[q]}"]`);setTitle('Natural Signals');setProgress(16+currentQuestion*8);return;}
 if(q==='c6'){showOnly('section-color-trans1');currentPhase=1;setTitle('Your Beauty Journey');setProgress(33);}
}
function showOnlyBySelector(selector){
  const target=$(selector);
  // Hide screens and question blocks, then reveal the selected block AND its parent cards.
  $$('.quiz-screen, .q-block, .card, .q-block-p2, .q-block-p3').forEach(el=>el.classList.add('hidden'));
  if(target){
    let node=target;
    while(node && node!==document.body){
      node.classList.remove('hidden');
      node=node.parentElement;
    }
    target.classList.add('fade-in');
  }
  window.scrollTo({top:0,behavior:'smooth'});
}
function prevStep(){
 if(currentPhase===1){if(currentQuestion>1){const ids={2:'c2',3:'c3',4:'c4',5:'c5',6:'c6'};if(currentQuestion===2){showOnly('screen-q1');currentQuestion=1;setProgress(16)}else{currentQuestion--;showOnlyBySelector(`.q-block[data-q="${ids[currentQuestion]}"]`);setProgress(16+currentQuestion*7)}setTitle('Natural Signals');return;}showOnly('screen-intro');setTitle('Analysis');setProgress(8);return;}
 if(currentPhase===2){showOnly('section-color-phase2');currentQuestion=Math.max(1,currentQuestion-1);showOnlyBySelector(`.q-block-p2[data-qp2="${currentQuestion}"]`);setTitle('Palette Direction');return;}
 if(currentPhase===3){showOnly('section-color-phase3');currentQuestion=Math.max(1,currentQuestion-1);showOnlyBySelector(`.q-block-p3[data-qp3="${currentQuestion}"]`);setTitle('Your Style');return;}
 showOnly('screen-intro');setTitle('Analysis');setProgress(8);
}
function showPhase2(){currentPhase=2;currentQuestion=1;showOnly('section-color-phase2');showOnlyBySelector('.q-block-p2[data-qp2="1"]');setTitle('Palette Direction');setProgress(42)}
function goToPhase2(){showPhase2()}
function autoNextP2(input){const block=input.closest('.q-block-p2');if(!block)return;const n=Number(block.dataset.qp2);if(n<4){currentQuestion=n+1;showOnlyBySelector(`.q-block-p2[data-qp2="${n+1}"]`);setTitle('Palette Direction');setProgress(42+n*6)} }
function nextP2SubQ(n){currentQuestion=n;showOnlyBySelector(`.q-block-p2[data-qp2="${n}"]`)}
function finishPhase2(){showOnly('section-color-trans2');setTitle('Your Beauty Journey');setProgress(66)}
function goToPhase3(){currentPhase=3;currentQuestion=1;showOnly('section-color-phase3');showOnlyBySelector('.q-block-p3[data-qp3="1"]');setTitle('Your Style');setProgress(72)}
function autoNextP3(input){const block=input.closest('.q-block-p3');if(!block)return;const n=Number(block.dataset.qp3);if(n<8){currentQuestion=n+1;showOnlyBySelector(`.q-block-p3[data-qp3="${n+1}"]`);setTitle('Your Style');setProgress(Math.min(90,72+n*2))}}
function autoNextP3Sub(n){currentQuestion=n;showOnlyBySelector(`.q-block-p3[data-qp3="${n}"]`);setTitle('Your Style');setProgress(Math.min(90,72+n*2))}
function nextP3SubQ(n){currentQuestion=n;showOnlyBySelector(`.q-block-p3[data-qp3="${n}"]`)}
function finishPhase3(){showOnly('section-color-trans3');setTitle('Your Beauty Journey');setProgress(93)}
function goToLoading(){showOnly('section-color-loading');setTitle('Creating Your Report');setProgress(97)}
function setHairGuide(value){window.includeHairGuide=value;const box=$('#section-color-loading .quick-report-box');if(box)box.innerHTML=`<p class="hair-choice-confirm">${value?'Hair color guide added to your report ✨':'We’ll keep your report focused on your seasonal palette ✨'}</p><p class="loading-caption">Perfect. Let’s bring your colour story together…</p>`;runAnalysisLoading();}
function runAnalysisLoading(){
 const steps=[$('#load-step-1'),$('#load-step-2'),$('#load-step-3')],fill=$('#loading-fill');
 steps.forEach((el,i)=>{if(el){el.classList.toggle('active-load',i===0);el.classList.toggle('opacity-low',i!==0);const pct=el.querySelector('span');if(pct)pct.textContent='0%';}});if(fill)fill.style.width='0%';
 const milestones=[{t:350,p:28,n:0},{t:1050,p:64,n:1},{t:1750,p:100,n:2}];
 milestones.forEach(m=>setTimeout(()=>{if(fill)fill.style.width=m.p+'%';steps.forEach((el,i)=>{if(el){el.classList.toggle('active-load',i===m.n);el.classList.toggle('opacity-low',i>m.n);const pct=el.querySelector('span');if(pct)pct.textContent=(i<m.n?100:i===m.n?m.p:0)+'%';}})},m.t));
 setTimeout(calculateColorAnalysis,2450);
}
function calculateColorAnalysis(){let scores={spring:0,summer:0,autumn:0,winter:0};$$('input[type="radio"]:checked').forEach(input=>{const v=input.value;if(['warm','tan','amber'].includes(v)){scores.spring+=.6;scores.autumn+=.8}if(['cool','blue'].includes(v)){scores.summer+=.8;scores.winter+=.6}if(['bright','high-contrast'].includes(v)){scores.spring+=.7;scores.winter+=.9}if(['soft','muted','neutral'].includes(v)){scores.summer+=.8;scores.autumn+=.5}if(['deep','rich'].includes(v)){scores.autumn+=.9;scores.winter+=.7}if(['light','fresh','fair'].includes(v)){scores.spring+=.8;scores.summer+=.7}});let season=Object.keys(scores).reduce((a,b)=>scores[a]>=scores[b]?a:b);displayResult(season)}
function displayResult(season){
 const data={
 spring:{title:'Spring · Fresh & Warm',desc:'Your palette leans fresh, bright and warm. Think sunlit colours that feel lively without overpowering your natural features.',palette:[['Peach','#F4B49C'],['Warm pink','#E98FA8'],['Butter yellow','#F1D477'],['Fresh green','#AFCB9B'],['Turquoise','#7FC7C1']],guide:'Honey blonde, caramel, warm chestnut',avoid:'Very icy pastels and overly ashy shades',wheel:'spring'},
 summer:{title:'Summer · Soft & Cool',desc:'Your palette leans cool, gentle and softly blended. Muted shades create an easy, harmonious look.',palette:[['Dusty rose','#C987A5'],['Lavender','#B9A4D6'],['Powder blue','#A9C4E5'],['Sage','#A9BFAE'],['Soft berry','#9D637D']],guide:'Mushroom brown, cool beige, ash brown',avoid:'Very warm orange and harsh neon shades',wheel:'summer'},
 autumn:{title:'Autumn · Earthy & Rich',desc:'Your palette leans warm, grounded and rich. Nature-inspired shades bring depth and warmth to your look.',palette:[['Terracotta','#C66F4E'],['Olive','#92945A'],['Mustard','#D7AD45'],['Cocoa','#805747'],['Warm cream','#E9D4B0']],guide:'Chocolate, chestnut, warm auburn',avoid:'Icy grey and blue-based pastel shades',wheel:'autumn'},
 winter:{title:'Winter · Bold & Cool',desc:'Your palette leans cool, crisp and defined. Clear contrast and jewel tones give your look a polished finish.',palette:[['Ruby','#C43D63'],['Emerald','#168675'],['Cobalt','#355DB5'],['Icy lilac','#C6B7E6'],['Ink navy','#24334E']],guide:'Espresso, cool black, blue-black',avoid:'Dusty warm beige and muted orange shades',wheel:'winter'}
 };
 const d=data[season];showOnly('section-color-result');setTitle('Your Color Result');setProgress(100);
 const title=$('#res-season-title');if(title)title.textContent=d.title;
 const list=$('#res-color-list');if(list)list.innerHTML=`<li>${d.desc}</li><li><strong>Best colour direction:</strong> ${d.title.split('·')[1].trim()}.</li><li><strong>Colours to try less often:</strong> ${d.avoid}.</li>`;
 const swatches=$('#res-palette-swatches');if(swatches)swatches.innerHTML=d.palette.map(([name,color])=>`<div class="palette-chip"><i style="background:${color}" title="${name}"></i><span>${name}</span></div>`).join('');
 const hair=$('#res-hair-text');if(hair)hair.textContent=d.guide;const hairBox=$('#res-hair-guide-box');if(hairBox)hairBox.classList.toggle('hidden',window.includeHairGuide===false);
 const wheel=$('#season-wheel');if(wheel){wheel.dataset.result=season;wheel.querySelectorAll('.wheel-season-label').forEach(el=>el.classList.toggle('chosen-season',el.classList.contains(season+'-label')));}
}
function toggleTheme(){const next=document.body.dataset.theme==='rose'?'berry':'rose';document.body.dataset.theme=next;const label=$('#theme-label');if(label)label.textContent=next==='rose'?'Berry night':'Rose studio';const icon=$('#theme-toggle .control-icon');if(icon)icon.textContent=next==='rose'?'☾':'✿';}
let musicContext=null,musicTimer=null,musicOn=false,musicStep=0;
function playSoftNote(){if(!musicContext||!musicOn)return;const notes=[523.25,659.25,783.99,659.25,587.33,698.46,880,698.46,523.25,659.25,783.99,987.77,880,783.99,659.25,587.33];const now=musicContext.currentTime;const osc=musicContext.createOscillator(),gain=musicContext.createGain();osc.type='sine';osc.frequency.value=notes[musicStep%notes.length];gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.045,now+.06);gain.gain.exponentialRampToValueAtTime(.0001,now+.55);osc.connect(gain);gain.connect(musicContext.destination);osc.start(now);osc.stop(now+.58);musicStep++;}
function toggleMusic(){musicOn=!musicOn;if(musicOn){try{const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)throw new Error('Audio unavailable');musicContext=musicContext||new Ctx();musicContext.resume();playSoftNote();musicTimer=setInterval(playSoftNote,440);}catch(e){musicOn=false;alert('Audio belum didukung browser ini. Coba gunakan browser terbaru ya!');}}else{if(musicTimer)clearInterval(musicTimer);musicTimer=null;if(musicContext)musicContext.suspend();}const label=$('#music-label'),icon=$('#music-icon'),btn=$('#music-toggle');if(label)label.textContent=musicOn?'Music on':'Music off';if(icon)icon.textContent=musicOn?'♫':'♪';if(btn)btn.setAttribute('aria-pressed',String(musicOn));}
// Keep the option cards visually selected, including multi-select options.
document.addEventListener('change',e=>{if(e.target.matches('.opt-card input,.image-opt-card input')){const label=e.target.closest('label');if(label&&e.target.type==='radio'){const group=e.target.name;$$(`input[name="${CSS.escape(group)}"]`).forEach(r=>r.closest('label')?.classList.toggle('selected',r.checked))}else if(label){label.classList.toggle('selected',e.target.checked)}}});
