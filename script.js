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
 * Seasonal Color Analysis
 * Metode: Forward Chaining + Certainty Factor
 * Aturan R1-R8 sesuai basis pengetahuan Bab IV.
 */

function calculateColorAnalysis() {
  const selected = (name) =>
    document.querySelector(`input[name="${name}"]:checked`)?.value || "";

  // 1. Mengumpulkan fakta dari jawaban pengguna
  const facts = {
    eye: selected("c_eye"),
    hair: selected("c_hair"),
    skin: selected("c_skin"),
    sun: selected("c_sun"),
    vein: selected("c_vein"),
    white: selected("c_white"),
    metal: selected("c2_1"),
    mood: selected("c2_2"),
    glow: selected("c2_3"),
    palette: selected("c3_1"),
    preferredFeel: selected("c3_8")
  };

  // 2. Menentukan undertone berdasarkan indikator yang relevan
  const votes = [
    facts.sun,
    facts.vein,
    facts.white,
    facts.metal
  ].filter(value => value === "warm" || value === "cool");

  const warmVotes = votes.filter(value => value === "warm").length;
  const coolVotes = votes.filter(value => value === "cool").length;

  const undertone =
    warmVotes > coolVotes ? "warm" :
    coolVotes > warmVotes ? "cool" :
    "uncertain";

  // 3. Forward Chaining: mencocokkan fakta dengan aturan
  const firedRules = [];

  // R1-R4: aturan undertone
  if (undertone === "warm") {
    firedRules.push({
      id: "R1", season: "spring", cf: 0.6,
      evidence: "Warm undertone"
    });
    firedRules.push({
      id: "R2", season: "autumn", cf: 0.8,
      evidence: "Warm undertone"
    });
  }

  if (undertone === "cool") {
    firedRules.push({
      id: "R3", season: "summer", cf: 0.8,
      evidence: "Cool undertone"
    });
    firedRules.push({
      id: "R4", season: "winter", cf: 0.6,
      evidence: "Cool undertone"
    });
  }

  // R5-R8: aturan karakteristik palet
  const brightEvidence =
    facts.mood === "bright" || facts.palette === "bright" || facts.preferredFeel === "bright";

  const softEvidence =
    facts.mood === "soft" || facts.palette === "soft" || facts.preferredFeel === "soft";

  const deepEvidence =
    facts.mood === "deep" || facts.palette === "warm" || facts.preferredFeel === "deep";

  const lightEvidence = facts.palette === "light" || facts.preferredFeel === "light";

  if (brightEvidence) {
    firedRules.push({
      id: "R5", season: "winter", cf: 0.9,
      evidence: "Bright / high contrast"
    });
  }

  if (softEvidence) {
    firedRules.push({
      id: "R6", season: "summer", cf: 0.8,
      evidence: "Soft / muted"
    });
  }

  if (deepEvidence) {
    firedRules.push({
      id: "R7", season: "autumn", cf: 0.9,
      evidence: "Deep / rich"
    });
  }

  if (lightEvidence) {
    firedRules.push({
      id: "R8", season: "spring", cf: 0.8,
      evidence: "Light / fresh"
    });
  }

  // 4. Menggabungkan CF untuk setiap musim
  // CFcombine = CF1 + CF2 * (1 - CF1)
  const combinedCF = {
    spring: 0,
    summer: 0,
    autumn: 0,
    winter: 0
  };

  const seasonRules = {
    spring: [],
    summer: [],
    autumn: [],
    winter: []
  };

  firedRules.forEach(rule => {
    const previousCF = combinedCF[rule.season];

    combinedCF[rule.season] =
      previousCF === 0
        ? rule.cf
        : previousCF + rule.cf * (1 - previousCF);

    seasonRules[rule.season].push(rule.id);
  });

  // 5. Menentukan musim dengan CF tertinggi
  const seasons = ["spring", "summer", "autumn", "winter"];

  const maxCF = Math.max(...Object.values(combinedCF));

  let candidates = seasons.filter(
    season => Math.abs(combinedCF[season] - maxCF) < 1e-9
  );

  let season;

  if (maxCF > 0) {
    // Jika CF sama, utamakan musim dengan lebih banyak aturan aktif.
    candidates.sort((a, b) =>
      seasonRules[b].length - seasonRules[a].length
    );

    season = candidates[0];
  } else {
    // Fallback jika tidak ada aturan CF yang aktif.
    // Hasil fallback bukan hasil perhitungan CF.
    const fallbackMap = {
      eye: {
        warm: "autumn",
        cool: "winter",
        neutral: "summer"
      },
      hair: {
        warm: "autumn",
        cool: "winter",
        neutral: "summer"
      },
      skin: {
        fair: "spring",
        medium: "summer",
        tan: "autumn",
        deep: "winter",
        neutral: "summer"
      }
    };

    const fallbackResults = [
      fallbackMap.eye[facts.eye],
      fallbackMap.hair[facts.hair],
      fallbackMap.skin[facts.skin]
    ].filter(Boolean);

    const counts = {
      spring: 0,
      summer: 0,
      autumn: 0,
      winter: 0
    };

    fallbackResults.forEach(result => counts[result]++);

    season = seasons.reduce((best, current) =>
      counts[current] > counts[best] ? current : best
    , "spring");
  }

  // 6. Simpan jejak perhitungan untuk pengujian
  window.lastCFAnalysis = {
    method: "Forward Chaining + Certainty Factor",
    facts,
    undertone,
    warmVotes,
    coolVotes,
    firedRules,
    seasonRules,
    combinedCF: { ...combinedCF },
    result: season,
    resultCF: combinedCF[season],
    resultPercent: Math.round(combinedCF[season] * 100),
    usedFallback: maxCF === 0
  };

  // 7. Tampilkan hasil menggunakan fungsi website yang sudah ada
  displayResult(season);
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
function playSoftNote(){if(!musicContext||!musicOn)return;const notes=[659.25,783.99,987.77,783.99,880,1046.5,1174.66,1046.5,783.99,987.77,1174.66,1318.51,1174.66,1046.5,987.77,880,783.99,1046.5,1318.51,1567.98,1318.51,1174.66,1046.5,987.77];const now=musicContext.currentTime;const osc=musicContext.createOscillator(),gain=musicContext.createGain();osc.type='triangle';osc.frequency.value=notes[musicStep%notes.length];gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.035,now+.025);gain.gain.exponentialRampToValueAtTime(.0001,now+.28);osc.connect(gain);gain.connect(musicContext.destination);osc.start(now);osc.stop(now+.31);musicStep++;}
function toggleMusic(){musicOn=!musicOn;if(musicOn){try{const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)throw new Error('Audio unavailable');musicContext=musicContext||new Ctx();musicContext.resume();playSoftNote();musicTimer=setInterval(playSoftNote,300);}catch(e){musicOn=false;alert('Audio belum didukung browser ini. Coba gunakan browser terbaru ya!');}}else{if(musicTimer)clearInterval(musicTimer);musicTimer=null;if(musicContext)musicContext.suspend();}const label=$('#music-label'),icon=$('#music-icon'),btn=$('#music-toggle');if(label)label.textContent=musicOn?'Music on':'Music off';if(icon)icon.textContent=musicOn?'♫':'♪';if(btn)btn.setAttribute('aria-pressed',String(musicOn));}
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
