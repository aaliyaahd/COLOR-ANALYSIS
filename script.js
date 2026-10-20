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
function goToLoading(){showOnly('section-color-loading');setTitle('Creating Your Report');setProgress(97);const modal=$('#beauty-modal');if(modal)modal.classList.remove('hidden')}
function setHairGuide(value){window.includeHairGuide=value;const modal=$('#beauty-modal');if(modal)modal.classList.add('hidden');const box=$('#section-color-loading .quick-report-box');if(box)box.innerHTML=`<p class="hair-choice-confirm">${value?'Hair recommendations will be included in your report ✨':'We’ll keep the report focused on your palette ✨'}</p>`;runAnalysisLoading();}
function runAnalysisLoading(){
 const steps=[$('#load-step-1'),$('#load-step-2'),$('#load-step-3')],fill=$('#loading-fill');
 steps.forEach((el,i)=>{if(el){el.classList.toggle('active-load',i===0);el.classList.toggle('opacity-low',i!==0);const pct=el.querySelector('span');if(pct)pct.textContent='0%';}});if(fill)fill.style.width='0%';
 const milestones=[{t:350,p:28,n:0},{t:1050,p:64,n:1},{t:1750,p:100,n:2}];
 milestones.forEach(m=>setTimeout(()=>{if(fill)fill.style.width=m.p+'%';steps.forEach((el,i)=>{if(el){el.classList.toggle('active-load',i===m.n);el.classList.toggle('opacity-low',i>m.n);const pct=el.querySelector('span');if(pct)pct.textContent=(i<m.n?100:i===m.n?m.p:0)+'%';}})},m.t));
 setTimeout(calculateColorAnalysis,2450);
}
function calculateColorAnalysis(){
  // Score answers by the question they came from; preference answers no longer distort the season.
  const scores={spring:0,summer:0,autumn:0,winter:0};
  const add=(season,n)=>scores[season]+=n;
  const selected=name=>document.querySelector(`input[name="${name}"]:checked`)?.value||'';
  const scoreMap={
    c_eye:{cool:{summer:1.2,winter:.8},neutral:{summer:.5,spring:.4},warm:{spring:1,autumn:1}},
    c_hair:{warm:{spring:1,autumn:1.2},neutral:{summer:.5,spring:.5,autumn:.4},cool:{summer:.8,winter:1}},
    c_skin:{fair:{summer:.6,spring:.6},medium:{spring:.4,autumn:.4,summer:.3},tan:{autumn:.8,spring:.5},deep:{winter:1,autumn:.8},neutral:{summer:.3,autumn:.3}},
    c_sun:{warm:{spring:.8,autumn:1},cool:{summer:.8,winter:.7},neutral:{summer:.3,spring:.3,autumn:.3,winter:.3}},
    c_vein:{cool:{summer:1,winter:1},warm:{spring:.8,autumn:1},neutral:{summer:.3,spring:.3,autumn:.3,winter:.3}},
    c_white:{cool:{summer:.8,winter:1},warm:{spring:1,autumn:.8},both:{spring:.3,summer:.3,autumn:.3,winter:.3},neutral:{summer:.2,autumn:.2}},
    c2_1:{cool:{winter:1,summer:.4},neutral:{summer:.5,autumn:.3},warm:{spring:.5,autumn:.6}},
    c2_2:{soft:{summer:1.1,autumn:.4},bright:{spring:1,winter:.6},warm:{spring:.7,autumn:1.1},cool:{summer:.6,winter:1},deep:{autumn:.8,winter:1},bright2:{spring:1,winter:.7}},
    c2_3:{soft:{summer:1, spring:.3},bright:{spring:.8,winter:.8},cool:{summer:.5,winter:.8},warm:{spring:.7,autumn:1}},
    c3_1:{bright:{winter:.8,spring:.7},soft:{summer:1,autumn:.4},light:{spring:.8,summer:.7},warm:{spring:.6,autumn:1}},
  };
  Object.entries(scoreMap).forEach(([name,map])=>{const val=selected(name);const row=map[val];if(row)Object.entries(row).forEach(([season,points])=>add(season,points));});
  // Color-mood and glow answers can add separate clues without overpowering natural features.
  const mood=selected('c2_2');if(mood==='bright')add('spring',.3);if(mood==='deep')add('winter',.3);if(mood==='soft')add('summer',.3);
  const glow=selected('c2_3');if(glow==='warm')add('autumn',.25);if(glow==='soft')add('summer',.25);if(glow==='bright')add('spring',.25);if(glow==='cool')add('winter',.25);
  // Use the user's accent-color choices as a small tie-breaker only.
  const accents=$$('input[name="c2_4"]:checked').map(x=>x.value);
  if(accents.some(v=>['coral','peach','mustard','cream'].includes(v)))add('spring',.25);
  if(accents.some(v=>['lavender','lilac','navy','cobalt','burgundy'].includes(v)))add('winter',.25);
  if(accents.some(v=>['sage','teal','emerald'].includes(v)))add('summer',.2);
  if(accents.some(v=>['brown','olive','mustard'].includes(v)))add('autumn',.25);
  const max=Math.max(...Object.values(scores));let candidates=Object.keys(scores).filter(k=>max-scores[k]<.18);
  // Deterministic but answer-specific tie break: strongest natural clues first.
  let season=candidates[0];
  if(candidates.length>1){const priority=[selected('c_vein'),selected('c_white'),selected('c_sun')];const preference=priority.includes('cool')?'cool':priority.includes('warm')?'warm':'';if(preference==='cool'&&candidates.includes('winter'))season='winter';else if(preference==='cool'&&candidates.includes('summer'))season='summer';else if(preference==='warm'&&candidates.includes('autumn'))season='autumn';else if(preference==='warm'&&candidates.includes('spring'))season='spring';}
  displayResult(season);
}
function displayResult(season){
 const data={
 spring:{title:'Spring · Fresh & Warm',desc:'Your answers lean toward a warm, light-to-bright palette. Fresh colors can bring energy without overwhelming your features.',palette:[['Peach','#F4B49C'],['Warm pink','#E98FA8'],['Butter yellow','#F1D477'],['Fresh green','#AFCB9B'],['Turquoise','#7FC7C1'],['Coral','#F08070'],['Warm ivory','#F4E7CF'],['Light camel','#C9A078'],['Tomato red','#D94C3D'],['Aqua','#91D8D0']],guide:'Honey blonde, golden beige, caramel, warm chestnut, copper gloss',avoid:'Very icy pastels, blue-grey ash and overly cool burgundy',makeup:'Peach or apricot blush; coral, warm pink or poppy-red lips; champagne or warm-gold eyeshadow; brown mascara/liner.',wheel:'spring'},
 summer:{title:'Summer · Soft & Cool',desc:'Your answers lean toward a cool, softly blended palette. Muted colors and gentle contrast may feel harmonious next to your features.',palette:[['Dusty rose','#C987A5'],['Lavender','#B9A4D6'],['Powder blue','#A9C4E5'],['Sage','#A9BFAE'],['Soft berry','#9D637D'],['Mauve','#B58BA8'],['Blue-grey','#8B9DB5'],['Soft navy','#52647F'],['Rose brown','#A8797C'],['Cool taupe','#A69A96']],guide:'Mushroom brown, cool beige, ash brown, muted mocha, soft cool brunette',avoid:'Very orange-based shades, neon brights and stark warm mustard',makeup:'Dusty rose or mauve blush; rosewood, soft berry or pink-mauve lips; taupe, soft plum or cool brown eyeshadow; brown-grey liner.',wheel:'summer'},
 autumn:{title:'Autumn · Earthy & Rich',desc:'Your answers lean warm, earthy and gently deep. Nature-inspired shades can bring richness and warmth to your overall look.',palette:[['Terracotta','#C66F4E'],['Olive','#92945A'],['Mustard','#D7AD45'],['Cocoa','#805747'],['Warm cream','#E9D4B0'],['Rust','#A94F32'],['Forest green','#3E6651'],['Cinnamon','#B66D4B'],['Petrol teal','#397C78'],['Camel','#B98B5E']],guide:'Chocolate, chestnut, warm auburn, cinnamon brown, espresso with warm undertones',avoid:'Icy grey, blue-based pastels and very cool fuchsia',makeup:'Terracotta or warm-peach blush; brick, cinnamon, warm nude or brown-red lips; bronze, olive, copper and chocolate eyeshadow.',wheel:'autumn'},
 winter:{title:'Winter · Bold & Cool',desc:'Your answers lean toward coolness, definition and stronger contrast. Crisp neutrals and jewel tones may make your features stand out.',palette:[['Ruby','#C43D63'],['Emerald','#168675'],['Cobalt','#355DB5'],['Icy lilac','#C6B7E6'],['Ink navy','#24334E'],['Fuchsia','#D32F82'],['True red','#C6283D'],['Cool white','#F7F7F8'],['Pine green','#145A4A'],['Plum','#673A63']],guide:'Espresso, cool dark brown, soft black, blue-black, cool burgundy',avoid:'Dusty orange, yellow-beige and muted warm camel near the face',makeup:'Cool pink or berry blush; blue-red, raspberry, plum or fuchsia lips; charcoal, silver, cool taupe or plum eyeshadow; black or cool brown liner.',wheel:'winter'}
 };
 const d=data[season];showOnly('section-color-result');setTitle('Your Color Result');setProgress(100);
 const title=$('#res-season-title');if(title)title.textContent=d.title;
 const avoid=$$('input[name="c3_3"]:checked').map(x=>x.value).filter(x=>x!=='none');
 const accentNames=$$('input[name="c2_4"]:checked').map(x=>x.closest('label')?.querySelector('.swatch-label')?.textContent.trim()).filter(Boolean).filter(x=>!x.startsWith('None'));
 const goals=$$('input[name="c3_4"]:checked').map(x=>({polished:'look more polished',fast:'build outfits faster',refresh:'refresh your wardrobe',hair:'try a new hair color'}[x.value])).filter(Boolean);
 const problem=selectedValue('c3_2');
 const list=$('#res-color-list');if(list)list.innerHTML=`<li>${d.desc}</li><li><strong>Best colour direction:</strong> ${d.title.split('·')[1].trim()}.</li><li><strong>Colours to try less often:</strong> ${d.avoid}.</li>${accentNames.length?`<li><strong>Accent colours you like:</strong> ${accentNames.join(', ')}. Use these as personal preferences, then compare their undertones with your palette.</li>`:''}${avoid.length?`<li><strong>Colours you said you avoid:</strong> ${avoid.join(', ')}. You don't need to ban them; try softer, darker or more muted versions before ruling them out.</li>`:''}${goals.length?`<li><strong>Your styling goals:</strong> ${goals.join(', ')}. Start with two palette colors and one neutral so the recommendations are practical.</li>`:''}${problem?`<li><strong>Your main color challenge:</strong> ${({'1':'some colors make you look tired','2':"you buy colors but don't wear them",'3':'you mostly wear black clothes','4':"matching colors with your hair and eyes",'5':'getting clear, practical guidance'})[problem]||'finding colors that feel right'}.</li>`:''}`;
 const swatches=$('#res-palette-swatches');if(swatches)swatches.innerHTML=d.palette.map(([name,color])=>`<div class="palette-chip"><i style="background:${color}" title="${name}"></i><span>${name}</span></div>`).join('');
 const hair=$('#res-hair-text');if(hair)hair.textContent=d.guide;const hairBox=$('#res-hair-guide-box');if(hairBox)hairBox.classList.toggle('hidden',window.includeHairGuide!==true);
 const makeupChoice=selectedValue('c3_8');const makeupBox=$('#res-makeup-guide-box'),makeupText=$('#res-makeup-text');
 const makeupGuides={everyday:`Everyday look — ${d.makeup}`,lips:`Focus on lips & cheeks — ${d.makeup}`,simple:`Simple starter guide — choose one blush and one lip shade from this direction: ${d.makeup}`};
 if(makeupBox&&makeupText){makeupBox.classList.toggle('hidden',!makeupChoice||makeupChoice==='no');makeupText.textContent=makeupGuides[makeupChoice]||'';}
 const pref=$('#res-preference-text');if(pref)pref.textContent=accentNames.length?`You picked ${accentNames.join(', ')} as colors you are open to wearing. Mix them with ${d.palette.slice(0,3).map(x=>x[0].toLowerCase()).join(', ')} for a palette-led outfit.`:`Start with ${d.palette.slice(0,3).map(x=>x[0].toLowerCase()).join(', ')} and a neutral you already own.`;
 const wheel=$('#season-wheel');if(wheel){wheel.dataset.result=season;wheel.querySelectorAll('.wheel-season-label').forEach(el=>el.classList.toggle('chosen-season',el.classList.contains(season+'-label')));}
}
function selectedValue(name){return document.querySelector(`input[name="${name}"]:checked`)?.value||'';}
function toggleTheme(){const next=document.body.dataset.theme==='rose'?'berry':'rose';document.body.dataset.theme=next;const label=$('#theme-label');if(label)label.textContent=next==='rose'?'Berry night':'Rose studio';const icon=$('#theme-toggle .control-icon');if(icon)icon.textContent=next==='rose'?'☾':'✿';}
let musicContext=null,musicTimer=null,musicOn=false,musicStep=0;
function playSoftNote(){if(!musicContext||!musicOn)return;const notes=[659.25,783.99,987.77,783.99,880,1046.5,1174.66,1046.5,783.99,987.77,1174.66,1318.51,1174.66,1046.5,987.77,880,783.99,1046.5,1318.51,1567.98,1318.51,1174.66,1046.5,987.77];const now=musicContext.currentTime;const osc=musicContext.createOscillator(),gain=musicContext.createGain();osc.type='triangle';osc.frequency.value=notes[musicStep%notes.length];gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.035,now+.025);gain.gain.exponentialRampToValueAtTime(.0001,now+.28);osc.connect(gain);gain.connect(musicContext.destination);osc.start(now);osc.stop(now+.31);musicStep++;}
function toggleMusic(){musicOn=!musicOn;if(musicOn){try{const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)throw new Error('Audio unavailable');musicContext=musicContext||new Ctx();musicContext.resume();playSoftNote();musicTimer=setInterval(playSoftNote,300);}catch(e){musicOn=false;alert('Audio belum didukung browser ini. Coba gunakan browser terbaru ya!');}}else{if(musicTimer)clearInterval(musicTimer);musicTimer=null;if(musicContext)musicContext.suspend();}const label=$('#music-label'),icon=$('#music-icon'),btn=$('#music-toggle');if(label)label.textContent=musicOn?'Music on':'Music off';if(icon)icon.textContent=musicOn?'♫':'♪';if(btn)btn.setAttribute('aria-pressed',String(musicOn));}
// Keep the option cards visually selected, including multi-select options.
document.addEventListener('change',e=>{if(e.target.matches('.opt-card input,.image-opt-card input')){const label=e.target.closest('label');if(label&&e.target.type==='radio'){const group=e.target.name;$$(`input[name="${CSS.escape(group)}"]`).forEach(r=>r.closest('label')?.classList.toggle('selected',r.checked))}else if(label){label.classList.toggle('selected',e.target.checked)}}});
