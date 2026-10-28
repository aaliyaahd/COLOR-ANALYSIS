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
  const selected = (name) => document.querySelector(`input[name="${name}"]:checked`)?.value || "";
  // Natural clues and reported color responses inform the season. Style preferences personalize advice only.
  const facts = {
    eye:selected("c_eye"), hair:selected("c_hair"), skin:selected("c_skin"),
    sun:selected("c_sun"), vein:selected("c_vein"), white:selected("c_white"),
    blackReaction:selected("c2_1"), glow:selected("c2_3"),
    styleMood:selected("c2_2"), preferredNeutral:selected("c3_1"), preferredFeel:selected("c3_8")
  };
  // Sun response, vein appearance and white/cream comparison are the undertone clues.
  // The black question is kept as a separate color-response observation; looking tired in black
  // must not be mistaken for having a warm undertone.
  const votes=[facts.sun,facts.vein,facts.white].filter(v=>v==="warm"||v==="cool");
  const warmVotes=votes.filter(v=>v==="warm").length, coolVotes=votes.filter(v=>v==="cool").length;
  const undertone=warmVotes>coolVotes?"warm":coolVotes>warmVotes?"cool":"uncertain";
  const firedRules=[];
  if(undertone==="warm"){firedRules.push({id:"R1",season:"spring",cf:0.6,evidence:"Warm-leaning natural/color-response clues"},{id:"R2",season:"autumn",cf:0.8,evidence:"Warm-leaning natural/color-response clues"});}
  if(undertone==="cool"){firedRules.push({id:"R3",season:"summer",cf:0.8,evidence:"Cool-leaning natural/color-response clues"},{id:"R4",season:"winter",cf:0.6,evidence:"Cool-leaning natural/color-response clues"});}
  // This question asks which colors appear flattering, unlike questions about preferred personal style.
  const observedFeel=facts.glow;
  if(observedFeel==="bright") firedRules.push({id:"R5",season:"winter",cf:0.55,evidence:"Reported bright/clear colors look flattering"});
  if(observedFeel==="soft") firedRules.push({id:"R6",season:"summer",cf:0.55,evidence:"Reported soft/muted colors look flattering"});
  if(observedFeel==="warm") firedRules.push({id:"R7",season:"autumn",cf:0.55,evidence:"Reported warm/earthy colors look flattering"});
  if(observedFeel==="cool") firedRules.push({id:"R8",season:"winter",cf:0.5,evidence:"Reported cool/defined colors look flattering"});
  const seasons=["spring","summer","autumn","winter"], combinedCF={spring:0,summer:0,autumn:0,winter:0}, seasonRules={spring:[],summer:[],autumn:[],winter:[]};
  firedRules.forEach(rule=>{const prev=combinedCF[rule.season];combinedCF[rule.season]=prev===0?rule.cf:prev+rule.cf*(1-prev);seasonRules[rule.season].push(rule.id);});
  const maxCF=Math.max(...Object.values(combinedCF)); let candidates=seasons.filter(season=>Math.abs(combinedCF[season]-maxCF)<1e-9), season;
  if(maxCF>0){candidates.sort((a,b)=>seasonRules[b].length-seasonRules[a].length);season=candidates[0];}
  else {
    const map={eye:{warm:"autumn",cool:"winter",neutral:"summer"},hair:{warm:"autumn",cool:"winter",neutral:"summer"},skin:{fair:"spring",medium:"summer",tan:"autumn",deep:"winter",neutral:"summer"}};
    const results=[map.eye[facts.eye],map.hair[facts.hair],map.skin[facts.skin]].filter(Boolean), counts={spring:0,summer:0,autumn:0,winter:0};results.forEach(r=>counts[r]++);
    season=seasons.reduce((best,current)=>counts[current]>counts[best]?current:best,"spring");
  }
  window.lastCFAnalysis={method:"Forward Chaining + Certainty Factor",facts,undertone,warmVotes,coolVotes,firedRules,seasonRules,combinedCF:{...combinedCF},result:season,resultCF:combinedCF[season],resultPercent:Math.round(combinedCF[season]*100),usedFallback:maxCF===0,note:"Season scoring excludes personal style preferences; those personalize the styling advice only."};
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
     cfBadge.textContent = 'Estimated from natural clues; no CF rule was activated.';
   }
 }
 const rulesNote=$('#res-rules-note');
 if(rulesNote){const active=window.lastCFAnalysis?.firedRules||[];rulesNote.textContent=active.length?`Rules applied: ${active.map(rule=>rule.id).join(', ')}. The CF values from the applicable rules are combined to compare seasonal directions.`:'No seasonal rule matched these answers, so the website used its natural-feature fallback.';}

 const avoid=$$('input[name="c3_3"]:checked').map(x=>x.value).filter(x=>x!=='none');
 const accentNames=$$('input[name="c2_4"]:checked').map(x=>x.closest('label')?.querySelector('.swatch-label')?.textContent.trim()).filter(Boolean).filter(x=>!x.startsWith('None'));
 const goals=$$('input[name="c3_4"]:checked').map(x=>({polished:'look more polished',fast:'build outfits faster',refresh:'refresh your wardrobe',hair:'try a new hair color'}[x.value])).filter(Boolean);
 const problem=selectedValue('c3_2');
 const colorReaction=selectedValue('c3_9');
 const list=$('#res-color-list');if(list)list.innerHTML=`<li><strong>Color direction:</strong> ${d.title.split('·')[1].trim()}.</li><li><strong>Try less often near your face:</strong> ${d.avoid}.</li>${accentNames.length?`<li><strong>Your style picks:</strong> ${accentNames.slice(0,6).join(', ')}${accentNames.length>6?' and more':''}. These are personal favorites, not evidence used to choose your season.</li>`:''}${goals.length?`<li><strong>Style tip:</strong> ${goals.join(', ')} — start with two palette colors and one neutral.</li>`:''}${problem?`<li><strong>Your focus:</strong> ${{'1':'notice which shades make your face look tired','2':"make outfits easier to repeat",'3':'find alternatives to all-black outfits','4':"coordinate colors with your hair and eyes",'5':'build a simple, practical color guide'}[problem]||'finding colors that feel right'}.</li>`:''}`;
 const swatches=$('#res-palette-swatches');if(swatches)swatches.innerHTML=d.palette.map(([name,color])=>`<div class="palette-chip"><i style="background:${color}" title="${name}"></i><span>${name}</span></div>`).join('');
 const hair=$('#res-hair-text');if(hair)hair.textContent=d.guide;const hairBox=$('#res-hair-guide-box');if(hairBox)hairBox.classList.toggle('hidden',window.includeHairGuide!==true);
 const makeupChoice=selectedValue('c3_10');const makeupBox=$('#res-makeup-guide-box'),makeupText=$('#res-makeup-text');
 const makeupGuides={everyday:`Everyday look — ${d.makeup}`,lips:`Focus on lips & cheeks — ${d.makeup}`,simple:`Simple starter guide — choose one blush and one lip shade from this direction: ${d.makeup}`};
 if(makeupBox&&makeupText){makeupBox.classList.toggle('hidden',!makeupChoice||makeupChoice==='no');makeupText.textContent=makeupGuides[makeupChoice]||'';}
 const pref=$('#res-preference-text');if(pref)pref.textContent=accentNames.length?`You picked ${accentNames.join(', ')} as colors you are open to wearing. Mix them with ${d.palette.slice(0,3).map(x=>x[0].toLowerCase()).join(', ')} for a palette-led outfit.`:`Start with ${d.palette.slice(0,3).map(x=>x[0].toLowerCase()).join(', ')} and a neutral you already own.`;
 const profileUndertone=$('#profile-undertone'), profileUndertoneNote=$('#profile-undertone-note');
 const profileFeel=$('#profile-feel'), profileFeelNote=$('#profile-feel-note');
 const profileContrast=$('#profile-contrast'), profileContrastNote=$('#profile-contrast-note');
 const analysisProfile=window.lastCFAnalysis;
 if(profileUndertone){profileUndertone.textContent=analysisProfile?.undertone==='warm'?'Warm-leaning':analysisProfile?.undertone==='cool'?'Cool-leaning':'Balanced / unclear';}
 if(profileUndertoneNote){profileUndertoneNote.textContent=analysisProfile?.undertone==='warm'?'Several clues lean warm.':analysisProfile?.undertone==='cool'?'Several clues lean cool.':'Your selected clues are mixed; compare colors in daylight.';}
 const feel=selectedValue('c3_8');
 const feelLabels={bright:'Clear & lively',soft:'Soft & blended',deep:'Deep & bold',light:'Light & fresh',unsure:'Still exploring'};
 if(profileFeel){profileFeel.textContent=feelLabels[feel]||({spring:'Fresh & lively',summer:'Soft & gentle',autumn:'Earthy & rich',winter:'Bold & crisp'}[season]);}
 if(profileFeelNote){profileFeelNote.textContent='A starting point to compare with your personal palette.';}
 if(profileContrast){profileContrast.textContent=season==='winter'?'More defined':season==='summer'?'Gentle & blended':season==='autumn'?'Warm & grounded':'Fresh & balanced';}
 if(profileContrastNote){profileContrastNote.textContent='Try the suggested shades near your face and see what you notice.';}
}
function downloadColorStory(){
 const analysis=window.lastCFAnalysis, seasonTitle=$('#res-season-title')?.textContent||'Your Color Story';
 const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');
 const berry=document.body.dataset.theme==='berry',bg=berry?'#271e2d':'#fbf7f5',ink=berry?'#fff4fb':'#332a35',muted=berry?'#ddcbdc':'#786c7c';
 ctx.fillStyle=bg;ctx.fillRect(0,0,1080,1350);ctx.fillStyle=berry?'#493249':'#f0e5f0';ctx.beginPath();ctx.arc(980,80,230,0,Math.PI*2);ctx.fill();ctx.fillStyle=berry?'#402735':'#f8e8e7';ctx.beginPath();ctx.arc(80,1260,210,0,Math.PI*2);ctx.fill();
 ctx.textAlign='left';ctx.fillStyle=muted;ctx.font='600 25px Arial';ctx.fillText('YOUR COLOR STORY',80,100);ctx.fillStyle=ink;ctx.font='bold 54px Georgia';wrapCanvasText(ctx,seasonTitle,80,185,900,66);ctx.fillStyle=muted;ctx.font='26px Arial';ctx.fillText('Your seasonal palette • a guide, not a rulebook',80,280);
 const chips=$$('#res-palette-swatches .palette-chip').slice(0,15),startY=355,cols=5,cardW=174,cardH=205,gap=18;
 chips.forEach((chip,i)=>{const x=80+(i%cols)*(cardW+gap),y=startY+Math.floor(i/cols)*(cardH+gap),name=chip.querySelector('span')?.textContent||'',color=chip.querySelector('i')?.style.backgroundColor||'#ddd';ctx.fillStyle=berry?'#382b40':'#fffdfc';roundRect(ctx,x,y,cardW,cardH,18);ctx.fill();ctx.strokeStyle=berry?'#604866':'#eadfe8';ctx.stroke();ctx.fillStyle=color;roundRect(ctx,x+15,y+15,cardW-30,105,13);ctx.fill();ctx.fillStyle=ink;ctx.font='bold 20px Arial';wrapCanvasText(ctx,name,x+14,y+148,cardW-28,25);});
 const score=analysis&&!analysis.usedFallback?`CF support value: ${analysis.resultCF.toFixed(2)} (${analysis.resultPercent}%)`:'A result was estimated from available clues; no CF rule was activated.';ctx.fillStyle=ink;ctx.font='bold 25px Arial';ctx.fillText(score,80,1090);ctx.fillStyle=muted;ctx.font='22px Arial';wrapCanvasText(ctx,'Natural clues and color-response answers inform the seasonal result. Personal style preferences shape the styling tips, not the season score.',80,1140,900,32);ctx.fillStyle=muted;ctx.font='20px Arial';ctx.fillText('Made with Your Color Story',80,1295);
 const link=document.createElement('a');link.download='your-color-story-palette.png';link.href=canvas.toDataURL('image/png');link.click();
}
function wrapCanvasText(ctx,text,x,y,maxWidth,lineHeight){const words=String(text).split(' ');let line='';for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width>maxWidth&&line){ctx.fillText(line,x,y);line=word;y+=lineHeight;}else line=test;}if(line)ctx.fillText(line,x,y);}
function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
async function shareColorStory(){
 const season=$('#res-season-title')?.textContent||'my seasonal palette',palette=$$('#res-palette-swatches .palette-chip').slice(0,8).map(chip=>chip.querySelector('span')?.textContent).filter(Boolean).join(', ');
 const message=`My Your Color Story result: ${season}.\nPalette colors: ${palette}.\nThe result is a guide based on natural clues and color responses; personal style helps tailor the styling tips.`;
 if(navigator.share){try{await navigator.share({title:'My Your Color Story result',text:message,url:location.href});return;}catch(error){if(error.name==='AbortError')return;}}
 try{await navigator.clipboard.writeText(message);showShareFeedback('Result copied — paste it into a message or post.');}catch(error){window.prompt('Copy your result:',message);}
}
function showShareFeedback(message){let note=$('#share-feedback');if(!note){note=document.createElement('p');note.id='share-feedback';note.className='share-feedback';$('.result-actions')?.insertAdjacentElement('afterend',note);}if(note)note.textContent=message;}

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
