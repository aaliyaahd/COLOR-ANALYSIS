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
function autoNextP3(input){const block=input.closest('.q-block-p3');if(!block)return;const n=Number(block.dataset.qp3);if(n<10){currentQuestion=n+1;showOnlyBySelector(`.q-block-p3[data-qp3="${n+1}"]`);setTitle('Your Style');setProgress(Math.min(90,72+n*2))}}
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

/**
 * Seasonal Color Analysis — Forward Chaining + Certainty Factor
 * Aturan R1–R8 sama persis dengan Bab III (3.2.3) dan Bab IV (4.1).
 *
 * Peran jawaban pengguna:
 *  - SINYAL ALAMI (sun, vein, white, black test; eye & hair hanya pemecah seri)
 *      -> fakta undertone -> R1–R4
 *  - PREFERENSI WARNA (mood, palet netral, rasa warna) + skin "fair"
 *      -> fakta karakteristik (bright / soft / deep / light) -> R5–R8
 *  - Aksen, warna yang dihindari, tujuan, makeup, rambut
 *      -> HANYA personalisasi tampilan, tidak masuk perhitungan CF.
 */
const CF_RULES = [
  { id: "R1", fact: "warm",   season: "spring", cf: 0.6, evidence: "Warm undertone" },
  { id: "R2", fact: "warm",   season: "autumn", cf: 0.8, evidence: "Warm undertone" },
  { id: "R3", fact: "cool",   season: "summer", cf: 0.8, evidence: "Cool undertone" },
  { id: "R4", fact: "cool",   season: "winter", cf: 0.6, evidence: "Cool undertone" },
  { id: "R5", fact: "bright", season: "winter", cf: 0.9, evidence: "Bright / high contrast" },
  { id: "R6", fact: "soft",   season: "summer", cf: 0.8, evidence: "Soft / muted" },
  { id: "R7", fact: "deep",   season: "autumn", cf: 0.9, evidence: "Deep / rich" },
  { id: "R8", fact: "light",  season: "spring", cf: 0.8, evidence: "Light / fresh / fair" }
];
const CF_SEASONS = ["spring", "summer", "autumn", "winter"];
const UNDERTONE_SEASONS = { warm: ["spring", "autumn"], cool: ["summer", "winter"] };

function majorityTone(list) {
  const w = list.filter(v => v === "warm").length;
  const c = list.filter(v => v === "cool").length;
  return { warm: w, cool: c, result: w > c ? "warm" : c > w ? "cool" : "uncertain" };
}

// Pembentukan fakta dari jawaban (CF(E) = 1 untuk fakta yang terpilih)
function buildFacts(a) {
  // Sinyal utama dulu; jika seri pakai mata & rambut; jika masih seri -> bukti belum cukup
  const main = majorityTone([a.sun, a.vein, a.white, a.metal]);
  let undertone = main.result, tieBreak = "";
  if (undertone === "uncertain") {
    const second = majorityTone([a.eye, a.hair]);
    if (second.result !== "uncertain") { undertone = second.result; tieBreak = "eye & hair"; }
  }
  return {
    undertone, tieBreak, warmVotes: main.warm, coolVotes: main.cool,
    bright: [a.mood, a.palette, a.preferredFeel].includes("bright"),
    soft:   [a.mood, a.palette, a.preferredFeel].includes("soft"),
    deep:   a.mood === "deep" || a.palette === "warm" || a.preferredFeel === "deep",
    light:  a.palette === "light" || a.preferredFeel === "light" || a.skin === "fair"
  };
}

// Forward Chaining: aktifkan aturan yang kondisinya terpenuhi
function forwardChain(facts) {
  return CF_RULES.filter(r => facts.undertone === r.fact || facts[r.fact] === true);
}

// CFcombine = CF1 + CF2 × (1 − CF1)
function combineCF(firedRules) {
  const cf = { spring: 0, summer: 0, autumn: 0, winter: 0 };
  const steps = { spring: [], summer: [], autumn: [], winter: [] };
  firedRules.forEach(r => {
    const prev = cf[r.season];
    cf[r.season] = prev + r.cf * (1 - prev);
    steps[r.season].push(prev === 0 ? `${r.id} = ${r.cf.toFixed(2)}` : `${r.id}: ${prev.toFixed(2)} + ${r.cf.toFixed(2)}×(1−${prev.toFixed(2)}) = ${cf[r.season].toFixed(2)}`);
  });
  return { cf, steps };
}

// H* = argmax CF(H). Aturan seri (deterministik): sesuai undertone > aturan aktif terbanyak > CF aturan tunggal tertinggi > urutan S, Su, A, W
function pickSeason(cf, firedRules, undertone) {
  const max = Math.max(...Object.values(cf));
  const tied = CF_SEASONS.filter(s => Math.abs(cf[s] - max) < 1e-9);
  const count = s => firedRules.filter(r => r.season === s).length;
  const top = s => Math.max(0, ...firedRules.filter(r => r.season === s).map(r => r.cf));
  const fit = s => (UNDERTONE_SEASONS[undertone] || []).includes(s) ? 1 : 0;
  return tied.sort((a, b) => fit(b) - fit(a) || count(b) - count(a) || top(b) - top(a))[0];
}

function calculateColorAnalysis() {
  const sel = (n) => document.querySelector(`input[name="${n}"]:checked`)?.value || "";
  const answers = {
    eye: sel("c_eye"), hair: sel("c_hair"), skin: sel("c_skin"),
    sun: sel("c_sun"), vein: sel("c_vein"), white: sel("c_white"),
    metal: sel("c2_1"), mood: sel("c2_2"), glow: sel("c2_3"),
    palette: sel("c3_1"), preferredFeel: sel("c3_8")
  };
  const facts = buildFacts(answers);
  const firedRules = forwardChain(facts);
  const { cf, steps } = combineCF(firedRules);
  const usedFallback = firedRules.length === 0;
  let season;
  if (!usedFallback) {
    season = pickSeason(cf, firedRules, facts.undertone);
  } else {
    // Bukti belum cukup: indikasi awal dari kulit/mata/rambut (bukan hasil CF)
    const fb = { eye: { warm: "autumn", cool: "winter", neutral: "summer" }, hair: { warm: "autumn", cool: "winter", neutral: "summer" }, skin: { fair: "spring", medium: "summer", tan: "autumn", deep: "winter", neutral: "summer" } };
    const counts = { spring: 0, summer: 0, autumn: 0, winter: 0 };
    [fb.eye[answers.eye], fb.hair[answers.hair], fb.skin[answers.skin]].filter(Boolean).forEach(s => counts[s]++);
    season = CF_SEASONS.reduce((b, c) => counts[c] > counts[b] ? c : b, "spring");
  }
  window.lastCFAnalysis = {
    method: "Forward Chaining + Certainty Factor",
    facts: answers, derivedFacts: facts, undertone: facts.undertone,
    warmVotes: facts.warmVotes, coolVotes: facts.coolVotes,
    firedRules, combinedCF: { ...cf }, steps, result: season,
    resultCF: cf[season], resultPercent: Math.round(cf[season] * 100), usedFallback
  };
  displayResult(season);
  renderResultVisuals(season);
}

function displayResult(season){
 const data={
 spring:{title:'Spring · Fresh & Warm',desc:'Your answers lean toward a warm, light-to-bright palette. Fresh colors can bring energy without overwhelming your features.',palette:[['Peach','#F4B49C'],['Warm pink','#E98FA8'],['Butter yellow','#F1D477'],['Fresh green','#AFCB9B'],['Turquoise','#7FC7C1'],['Coral','#F08070'],['Warm ivory','#F4E7CF'],['Light camel','#C9A078'],['Tomato red','#D94C3D'],['Aqua','#91D8D0'],['Golden yellow','#E8B84B'],['Warm turquoise','#43B8B0'],['Apple green','#83B85A'],['Salmon','#F28C78'],['Apricot','#F6C09B'],['Warm navy','#34536A'],['Pistachio','#C4D99A'],['Poppy red','#E34D45'],['Light camel','#C9A078'],['Marigold','#E9A52B'],['Warm lilac','#C7A2C9'],['Jade','#58A88A'],['Creamy white','#FFF1D6']],guide:'Honey blonde, golden beige, caramel, warm chestnut, copper gloss',avoid:'Very icy pastels, blue-grey ash and overly cool burgundy',makeup:'Peach or apricot blush; coral, warm pink or poppy-red lips; champagne or warm-gold eyeshadow; brown mascara/liner.',wheel:'spring'},
 summer:{title:'Summer · Soft & Cool',desc:'Your answers lean toward a cool, softly blended palette. Muted colors and gentle contrast may feel harmonious next to your features.',palette:[['Dusty rose','#C987A5'],['Lavender','#B9A4D6'],['Powder blue','#A9C4E5'],['Sage','#A9BFAE'],['Soft berry','#9D637D'],['Mauve','#B58BA8'],['Blue-grey','#8B9DB5'],['Soft navy','#52647F'],['Rose brown','#A8797C'],['Cool taupe','#A69A96'],['Periwinkle','#9DAFE0'],['Rose pink','#D8A0B5'],['Soft plum','#94708F'],['Seafoam','#B7D1C6'],['Cloud blue','#C6D9EB'],['Berry rose','#A65C78'],['Cool cocoa','#8B7775'],['Lilac grey','#B9B5C9'],['Soft raspberry','#C17A99'],['Denim blue','#6E8DAF'],['Pale mint','#D1E2D7'],['Misty mauve','#C4A9B9'],['Slate blue','#7189A5'],['Soft white','#F1F0F2']],guide:'Mushroom brown, cool beige, ash brown, muted mocha, soft cool brunette',avoid:'Very orange-based shades, neon brights and stark warm mustard',makeup:'Dusty rose or mauve blush; rosewood, soft berry or pink-mauve lips; taupe, soft plum or cool brown eyeshadow; brown-grey liner.',wheel:'summer'},
 autumn:{title:'Autumn · Earthy & Rich',desc:'Your answers lean warm, earthy and gently deep. Nature-inspired shades can bring richness and warmth to your overall look.',palette:[['Terracotta','#C66F4E'],['Olive','#92945A'],['Mustard','#D7AD45'],['Cocoa','#805747'],['Warm cream','#E9D4B0'],['Rust','#A94F32'],['Forest green','#3E6651'],['Cinnamon','#B66D4B'],['Petrol teal','#397C78'],['Camel','#B98B5E'],['Burnt orange','#B85B36'],['Moss green','#6F7745'],['Warm burgundy','#783E3D'],['Spiced paprika','#C35F42'],['Bronze','#9B6A3D'],['Deep teal','#245D59'],['Warm plum','#78495B'],['Golden olive','#A18A3D'],['Toffee','#A96E45'],['Creamy beige','#E5D0AF'],['Mahogany','#663F35'],['Peacock blue','#236B70'],['Pumpkin','#D9823B'],['Dark chocolate','#4A3028'],['Copper','#B86D4F']],guide:'Chocolate, chestnut, warm auburn, cinnamon brown, espresso with warm undertones',avoid:'Icy grey, blue-based pastels and very cool fuchsia',makeup:'Terracotta or warm-peach blush; brick, cinnamon, warm nude or brown-red lips; bronze, olive, copper and chocolate eyeshadow.',wheel:'autumn'},
 winter:{title:'Winter · Bold & Cool',desc:'Your answers lean toward coolness, definition and stronger contrast. Crisp neutrals and jewel tones may make your features stand out.',palette:[['Ruby','#C43D63'],['Emerald','#168675'],['Cobalt','#355DB5'],['Icy lilac','#C6B7E6'],['Ink navy','#24334E'],['Fuchsia','#D32F82'],['True red','#C6283D'],['Cool white','#F7F7F8'],['Pine green','#145A4A'],['Plum','#673A63'],['Icy pink','#F0C9D8'],['Sapphire','#174AA5'],['Blue-red','#B51F3B'],['Charcoal','#33343A'],['Black cherry','#51243A'],['Pine','#174C43'],['Cool magenta','#B82B83'],['Ice blue','#C8E2F3'],['Silver grey','#B9BCC5'],['True white','#FFFFFF'],['Deep violet','#4D3678'],['Raspberry','#B92758'],['Royal purple','#5B3B91'],['Cool emerald','#087F67'],['Ink black','#202127']],guide:'Espresso, cool dark brown, soft black, blue-black, cool burgundy',avoid:'Dusty orange, yellow-beige and muted warm camel near the face',makeup:'Cool pink or berry blush; blue-red, raspberry, plum or fuchsia lips; charcoal, silver, cool taupe or plum eyeshadow; black or cool brown liner.',wheel:'winter'}
 };
 const d=data[season];showOnly('section-color-result');setTitle('Your Color Result');setProgress(100);
 const title=$('#res-season-title');if(title)title.textContent=d.title;

 // Display the CF value computed by Forward Chaining.
 let cfBadge = $('#res-cf-result');
 if (!cfBadge && title) {
   cfBadge = document.createElement('p');
   cfBadge.id = 'res-cf-result';
   cfBadge.style.cssText = 'margin:10px auto 18px;padding:10px 16px;max-width:360px;border-radius:14px;background:rgba(201,135,165,.12);color:inherit;text-align:center;font-weight:700;';
   title.insertAdjacentElement('afterend', cfBadge);
 }
 if (cfBadge) {
   const analysis = window.lastCFAnalysis;
   if (analysis && !analysis.usedFallback && analysis.result === season) {
     cfBadge.textContent = `Certainty Factor (CF): ${analysis.resultCF.toFixed(2)} (${analysis.resultPercent}%)`;
   } else {
     cfBadge.textContent = 'Hasil sementara: aturan CF belum menghasilkan nilai untuk ditampilkan.';
   }
 }

 const avoid=$$('input[name="c3_3"]:checked').map(x=>x.value).filter(x=>x!=='none');
 const accentNames=$$('input[name="c2_4"]:checked').map(x=>x.closest('label')?.querySelector('.swatch-label')?.textContent.trim()).filter(Boolean).filter(x=>!x.startsWith('None'));
 const goals=$$('input[name="c3_4"]:checked').map(x=>({polished:'look more polished',fast:'build outfits faster',refresh:'refresh your wardrobe',hair:'try a new hair color'}[x.value])).filter(Boolean);
 const problem=selectedValue('c3_2');
 const colorReaction=selectedValue('c3_9');
 const list=$('#res-color-list');if(list)list.innerHTML=`<li>${d.desc}</li><li><strong>Best colour direction:</strong> ${d.title.split('·')[1].trim()}.</li><li><strong>Colours to try less often:</strong> ${d.avoid}.</li>${accentNames.length?`<li><strong>Accent colours you like:</strong> ${accentNames.join(', ')}. Use these as personal preferences, then compare their undertones with your palette.</li>`:''}${avoid.length?`<li><strong>Colours you said you avoid:</strong> ${avoid.join(', ')}. You don't need to ban them; try softer, darker or more muted versions before ruling them out.</li>`:''}${goals.length?`<li><strong>Your styling goals:</strong> ${goals.join(', ')}. Start with two palette colors and one neutral so the recommendations are practical.</li>`:''}${problem?`<li><strong>Your main color challenge:</strong> ${({'1':'some colors make you look tired','2':"you buy colors but don't wear them",'3':'you mostly wear black clothes','4':"matching colors with your hair and eyes",'5':'getting clear, practical guidance'})[problem]||'finding colors that feel right'}.</li>`:''}${colorReaction&&colorReaction!=='unsure'?`<li><strong>What you notice:</strong> ${colorReaction==='tired'?'Some colors can make your face look tired or uneven.':colorReaction==='color-first'?'Some colors may stand out more than your face.':'You do not notice a big difference yet.'}</li>`:''}`;
 const swatches=$('#res-palette-swatches');if(swatches)swatches.innerHTML=d.palette.map(([name,color])=>`<div class="palette-chip"><i style="background:${color}" title="${name}"></i><span>${name}</span></div>`).join('');
 const hair=$('#res-hair-text');if(hair)hair.textContent=d.guide;const hairBox=$('#res-hair-guide-box');if(hairBox)hairBox.classList.toggle('hidden',window.includeHairGuide!==true);
 const makeupChoice=selectedValue('c3_10');const makeupBox=$('#res-makeup-guide-box'),makeupText=$('#res-makeup-text');
 const makeupGuides={everyday:`Everyday look — ${d.makeup}`,lips:`Focus on lips & cheeks — ${d.makeup}`,simple:`Simple starter guide — choose one blush and one lip shade from this direction: ${d.makeup}`};
 if(makeupBox&&makeupText){makeupBox.classList.toggle('hidden',!makeupChoice||makeupChoice==='no');makeupText.textContent=makeupGuides[makeupChoice]||'';}
 const pref=$('#res-preference-text');if(pref)pref.textContent=accentNames.length?`You picked ${accentNames.join(', ')} as colors you are open to wearing. Mix them with ${d.palette.slice(0,3).map(x=>x[0].toLowerCase()).join(', ')} for a palette-led outfit.`:`Start with ${d.palette.slice(0,3).map(x=>x[0].toLowerCase()).join(', ')} and a neutral you already own.`;
 const profileUndertone=$('#profile-undertone'), profileUndertoneNote=$('#profile-undertone-note');
 const profileFeel=$('#profile-feel'), profileFeelNote=$('#profile-feel-note');
 const profileContrast=$('#profile-contrast'), profileContrastNote=$('#profile-contrast-note');
 const metal=selectedValue('c2_1');
 if(profileUndertone){profileUndertone.textContent=metal==='warm'?'Warm-leaning':metal==='cool'?'Cool-leaning':'Still exploring';}
 if(profileUndertoneNote){profileUndertoneNote.textContent=metal==='warm'?'Your black-color answer suggests softer warmth may feel easier.':metal==='cool'?'You said black can look defined on you.':'Your answers do not point clearly one way yet.';}
 const feel=selectedValue('c3_8');
 const feelLabels={bright:'Clear & lively',soft:'Soft & blended',deep:'Deep & bold',light:'Light & fresh',unsure:'Still exploring'};
 if(profileFeel){profileFeel.textContent=feelLabels[feel]||({spring:'Fresh & lively',summer:'Soft & gentle',autumn:'Earthy & rich',winter:'Bold & crisp'}[season]);}
 if(profileFeelNote){profileFeelNote.textContent='A starting point to compare with your personal palette.';}
 if(profileContrast){profileContrast.textContent=season==='winter'?'More defined':season==='summer'?'Gentle & blended':season==='autumn'?'Warm & grounded':'Fresh & balanced';}
 if(profileContrastNote){profileContrastNote.textContent='Try the suggested shades near your face and see what you notice.';}
}
function selectedValue(name){return document.querySelector(`input[name="${name}"]:checked`)?.value||'';}
function toggleTheme(){const next=document.body.dataset.theme==='rose'?'berry':'rose';document.body.dataset.theme=next;const label=$('#theme-label');if(label)label.textContent=next==='rose'?'Berry night':'Rose studio';const icon=$('#theme-toggle .control-icon');if(icon)icon.textContent=next==='rose'?'☾':'✿';}
let musicContext=null,musicTimer=null,musicOn=false,musicStep=0;
// A brighter, upbeat little synth loop (no external audio file required).
function playSoftNote(){
 if(!musicContext||!musicOn)return;
 const notes=[784,988,1175,1568,1397,1175,988,1175,880,1109,1319,1760,1568,1319,1109,1319,988,1175,1480,1760,1568,1480,1175,988];
 const now=musicContext.currentTime;
 const play=(freq,type,volume,duration,delay=0)=>{
   const osc=musicContext.createOscillator(),gain=musicContext.createGain();
   osc.type=type;osc.frequency.setValueAtTime(freq,now+delay);
   gain.gain.setValueAtTime(.0001,now+delay);
   gain.gain.exponentialRampToValueAtTime(volume,now+delay+.015);
   gain.gain.exponentialRampToValueAtTime(.0001,now+delay+duration);
   osc.connect(gain);gain.connect(musicContext.destination);
   osc.start(now+delay);osc.stop(now+delay+duration+.02);
 };
 const n=notes[musicStep%notes.length];
 play(n,'triangle',.045,.19);
 // Add a soft harmony on alternating beats for a fuller, more playful feel.
 if(musicStep%2===0)play(n/2,'sine',.018,.24);
 if(musicStep%4===0){const chords=[523.25,659.25,783.99,587.33,739.99,880,493.88,659.25];play(chords[(musicStep/4)%chords.length],'sine',.014,.32,.015);}
 musicStep++;
}
function toggleMusic(){
 musicOn=!musicOn;
 if(musicOn){
   try{const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)throw new Error('Audio unavailable');musicContext=musicContext||new Ctx();musicContext.resume();playSoftNote();musicTimer=setInterval(playSoftNote,220);}
   catch(e){musicOn=false;alert('Audio belum didukung browser ini. Coba gunakan browser terbaru ya!');}
 }else{if(musicTimer)clearInterval(musicTimer);musicTimer=null;if(musicContext)musicContext.suspend();}
 const label=$('#music-label'),icon=$('#music-icon'),btn=$('#music-toggle');
 if(label)label.textContent=musicOn?'Music on':'Music off';if(icon)icon.textContent=musicOn?'♫':'♪';if(btn)btn.setAttribute('aria-pressed',String(musicOn));
}
// Keep the option cards visually selected, including multi-select options.
document.addEventListener('change',e=>{if(e.target.matches('.opt-card input,.image-opt-card input')){const label=e.target.closest('label');if(label&&e.target.type==='radio'){const group=e.target.name;$$(`input[name="${CSS.escape(group)}"]`).forEach(r=>r.closest('label')?.classList.toggle('selected',r.checked))}else if(label){label.classList.toggle('selected',e.target.checked)}}});


// Keep the "none" choice exclusive while allowing any combination of actual colors.
document.addEventListener('change', function (event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || input.type !== 'checkbox') return;
  if (!['c2_4', 'c3_3'].includes(input.name)) return;
  const group = Array.from(document.querySelectorAll(`input[name="${input.name}"]`));
  const noneValues = input.name === 'c2_4' ? ['minimal'] : ['none'];
  if (noneValues.includes(input.value) && input.checked) {
    group.forEach(other => { if (other !== input) other.checked = false; });
  } else if (input.checked) {
    group.filter(other => noneValues.includes(other.value)).forEach(other => { other.checked = false; });
  }
});


/* ===== Result visuals, download & share ===== */
const SEASON_META = {
  spring: { name: 'Spring', accent: '#F08070' }, summer: { name: 'Summer', accent: '#8F9FD6' },
  autumn: { name: 'Autumn', accent: '#B8683F' }, winter: { name: 'Winter', accent: '#355DB5' }
};
function arcPath(cx, cy, r1, r2, a0, a1) {
  const p = (r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x1, y1] = p(r2, a0), [x2, y2] = p(r2, a1), [x3, y3] = p(r1, a1), [x4, y4] = p(r1, a0);
  const l = a1 - a0 > Math.PI ? 1 : 0;
  return `M${x1} ${y1}A${r2} ${r2} 0 ${l} 1 ${x2} ${y2}L${x3} ${y3}A${r1} ${r1} 0 ${l} 0 ${x4} ${y4}Z`;
}
function renderResultVisuals(season) {
  const A = window.lastCFAnalysis; if (!A) return;
  const M = SEASON_META[season];
  const cols = $$('#res-palette-swatches .palette-chip i').map(i => i.style.background);
  const n = cols.length || 1, gap = 0.025;
  const arcs = cols.map((c, i) => `<path d="${arcPath(100, 100, 58, 96, -Math.PI / 2 + i * 2 * Math.PI / n + gap, -Math.PI / 2 + (i + 1) * 2 * Math.PI / n - gap)}" fill="${c}"/>`).join('');
  const donut = $('#viz-donut');
  if (donut) donut.innerHTML = `<svg viewBox="0 0 200 200" role="img" aria-label="${M.name} palette wheel">${arcs}</svg><div class="donut-center"><small>${A.usedFallback ? 'first guess' : 'match'}</small><strong>${A.usedFallback ? '–' : A.resultPercent + '%'}</strong><span>${M.name}</span></div>`;
  const bars = $('#viz-bars');
  if (bars) bars.innerHTML = CF_SEASONS.map(s => { const v = A.combinedCF[s], w = SEASON_META[s]; return `<div class="bar-row${s === season ? ' win' : ''}"><span>${w.name}</span><div class="bar-track"><i style="width:${Math.round(v * 100)}%;background:${w.accent}"></i></div><b>${v.toFixed(2)}</b></div>`; }).join('');
  const d = A.derivedFacts, tot = Math.max(1, A.warmVotes + A.coolVotes);
  const pos = d.undertone === 'warm' ? 12 : d.undertone === 'cool' ? 88 : 50;
  const traits = [['bright', 'Bright'], ['soft', 'Soft'], ['deep', 'Deep'], ['light', 'Light']].map(([k, t]) => `<span class="trait${d[k] ? ' on' : ''}">${t}</span>`).join('');
  const sig = $('#viz-signals');
  if (sig) sig.innerHTML = `<div class="tone-meter"><span>Warm</span><div class="tone-line"><i style="left:${pos}%"></i></div><span>Cool</span></div><div class="trait-row">${traits}</div><div class="rule-row">${A.firedRules.map(r => `<span class="rule-pill" style="--c:${SEASON_META[r.season].accent}">${r.id}</span>`).join('') || '<small>No rule matched yet</small>'}</div>`;
  const calc = $('#viz-calc-body');
  if (calc) calc.innerHTML = `<p>Undertone: <b>${d.undertone}</b> (${A.warmVotes} warm · ${A.coolVotes} cool${d.tieBreak ? ', tie settled by ' + d.tieBreak : ''})</p>` + CF_SEASONS.map(s => `<p><b>${SEASON_META[s].name}</b> ${A.steps[s].length ? A.steps[s].join(' → ') : '0.00'}</p>`).join('') + `<p class="calc-note">Only undertone and palette-character answers count toward CF. Favorites, avoided colors and goals personalize the report.</p>`;
  const dots = (name, skip) => $$(`input[name="${name}"]:checked`).filter(x => !skip.includes(x.value)).map(x => `<i style="background:${x.closest('label')?.querySelector('.color-dot')?.style.background}" title="${x.closest('label')?.querySelector('.swatch-label')?.textContent.trim()}"></i>`).join('');
  const fav = dots('c2_4', ['minimal']), av = dots('c3_3', ['none']), pr = $('#viz-prefs');
  if (pr) { pr.innerHTML = (fav ? `<div><small>You love</small><p>${fav}</p></div>` : '') + (av ? `<div><small>You avoid</small><p>${av}</p></div>` : ''); pr.classList.toggle('hidden', !fav && !av); }
  document.documentElement.style.setProperty('--season-accent', M.accent);
}

function wrapText(g, text, maxW) {
  const lines = []; let line = '';
  text.split(/\s+/).forEach(w => { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; });
  if (line) lines.push(line); return lines;
}
function buildResultCanvas() {
  const A = window.lastCFAnalysis, M = SEASON_META[A.result];
  const fullTitle = ($('#res-season-title')?.textContent || M.name).replace(/[^\w·&\s-]/g, '').trim();
  const [name, tagline] = fullTitle.split('·').map(s => s.trim());
  const chips = $$('#res-palette-swatches .palette-chip').slice(0, 15).map(c => ({ col: c.querySelector('i').style.background, label: c.querySelector('span').textContent }));
  const sections = [];
  if (window.includeHairGuide === true && $('#res-hair-text')?.textContent) sections.push(['HAIR COLOR', $('#res-hair-text').textContent]);
  if (!$('#res-makeup-guide-box')?.classList.contains('hidden') && $('#res-makeup-text')?.textContent) sections.push(['MAKEUP SHADES', $('#res-makeup-text').textContent]);
  const W = 1080, serif = "'Playfair Display', Georgia, serif", sans = "'DM Sans', Arial, sans-serif";
  const t = document.createElement('canvas'); t.width = W; t.height = 3000;
  const g = t.getContext('2d'); g.textAlign = 'center';
  // header
  g.fillStyle = M.accent; g.font = `700 24px ${sans}`; g.letterSpacing = '6px'; g.fillText('MY COLOR STORY', W / 2, 130); g.letterSpacing = '0px';
  g.fillStyle = '#392b3b'; g.font = `700 118px ${serif}`; g.fillText(name || M.name, W / 2, 255);
  g.fillStyle = '#7b6a7b'; g.font = `italic 500 42px ${serif}`; g.fillText(tagline || '', W / 2, 322);
  g.fillStyle = M.accent; g.fillRect(W / 2 - 40, 360, 80, 4);
  // palette grid
  g.fillStyle = '#8a7a8a'; g.font = `700 22px ${sans}`; g.letterSpacing = '5px'; g.fillText('YOUR BEST COLOURS', W / 2, 432); g.letterSpacing = '0px';
  const cell = 170, gp = 16, per = 5, x0 = (W - (per * cell + (per - 1) * gp)) / 2; let y = 470;
  chips.forEach((c, i) => {
    const x = x0 + (i % per) * (cell + gp), yy = 470 + Math.floor(i / per) * 192;
    g.save(); g.shadowColor = 'rgba(70,40,70,.18)'; g.shadowBlur = 18; g.shadowOffsetY = 8;
    g.fillStyle = c.col; g.beginPath(); g.roundRect(x, yy, cell, 124, 30); g.fill(); g.restore();
    g.strokeStyle = 'rgba(0,0,0,.06)'; g.lineWidth = 2; g.beginPath(); g.roundRect(x, yy, cell, 124, 30); g.stroke();
    let fs = 22; g.font = `500 ${fs}px ${sans}`; while (g.measureText(c.label).width > cell && fs > 14) { fs--; g.font = `500 ${fs}px ${sans}`; }
    g.fillStyle = '#6d5d6d'; g.fillText(c.label, x + cell / 2, yy + 124 + 34);
  });
  y = 470 + Math.ceil(chips.length / per) * 192 + 20;
  // hair / makeup cards
  sections.forEach(([label, text]) => {
    g.textAlign = 'left'; g.font = `500 30px ${sans}`;
    const lines = wrapText(g, text, W - 2 * 100 - 80), h = 96 + lines.length * 46 + 30;
    g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.roundRect(100, y, W - 200, h, 34); g.fill();
    g.strokeStyle = M.accent + '55'; g.lineWidth = 2; g.stroke();
    g.fillStyle = M.accent; g.beginPath(); g.arc(150, y + 58, 9, 0, 7); g.fill();
    g.font = `700 22px ${sans}`; g.letterSpacing = '5px'; g.fillText(label, 176, y + 66); g.letterSpacing = '0px';
    g.fillStyle = '#4b3b4d'; g.font = `500 30px ${sans}`;
    lines.forEach((l, i) => g.fillText(l, 140, y + 124 + i * 46));
    y += h + 28;
  });
  // footer
  g.textAlign = 'center'; g.fillStyle = '#a597a5'; g.font = `500 22px ${sans}`; g.fillText('Seasonal Color Analysis', W / 2, y + 56);
  const H = y + 110, c = document.createElement('canvas'); c.width = W; c.height = H;
  const f = c.getContext('2d'), bg = f.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#fffafc'); bg.addColorStop(1, '#f6ebf1'); f.fillStyle = bg; f.fillRect(0, 0, W, H);
  const bar = f.createLinearGradient(0, 0, W, 0); chips.slice(0, 6).forEach((ch, i, a) => bar.addColorStop(i / Math.max(1, a.length - 1), ch.col));
  f.fillStyle = bar; f.fillRect(0, 0, W, 22);
  f.drawImage(t, 0, 0); return c;
}
function canvasBlob(c) { return new Promise(r => c.toBlob(r, 'image/png')); }
async function downloadResult() {
  if (!window.lastCFAnalysis) return;
  await document.fonts?.ready;
  const b = await canvasBlob(buildResultCanvas()), a = document.createElement('a');
  a.href = URL.createObjectURL(b); a.download = `my-color-story-${window.lastCFAnalysis.result}.png`;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}
async function shareResult() {
  const A = window.lastCFAnalysis; if (!A) return;
  const text = `My seasonal color is ${SEASON_META[A.result].name} 🎨`;
  await document.fonts?.ready;
  try {
    const file = new File([await canvasBlob(buildResultCanvas())], `my-color-story-${A.result}.png`, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text, title: 'My Color Story' }); return; }
    if (navigator.share) { await navigator.share({ text, title: 'My Color Story', url: location.href }); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(text); alert('Result copied! You can also use Download to save the image.'); }
  catch (e) { downloadResult(); }
}