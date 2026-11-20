(function(){
"use strict";
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer=matchMedia('(pointer: fine)').matches;
if(!finePointer) document.documentElement.classList.add('no-fine');

/* ---------- entrance ---------- */
addEventListener('load',()=>setTimeout(()=>document.body.classList.add('loaded'),80));
setTimeout(()=>document.body.classList.add('loaded'),1400);

/* ---------- header ---------- */
const header=$('#siteHeader');
addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>12),{passive:true});

/* ---------- mobile menu ---------- */
const mm=$('#mobileMenu'), burger=$('#burger');
const pageRegions=[$('#siteHeader'),$('main'),$('footer')].filter(Boolean);
function setPageInert(value){pageRegions.forEach(el=>el.toggleAttribute('inert',value));}
const focusableSelector='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
function trapTabWithin(container,event){
  if(event.key!=='Tab')return;
  const items=$$(focusableSelector,container);
  if(!items.length){event.preventDefault();return;}
  const first=items[0],last=items[items.length-1];
  if(event.shiftKey&&(document.activeElement===first||!container.contains(document.activeElement))){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&(document.activeElement===last||!container.contains(document.activeElement))){event.preventDefault();first.focus();}
}
function openMenu(){
  mm.removeAttribute('inert');mm.setAttribute('aria-hidden','false');
  burger.setAttribute('aria-expanded','true');burger.setAttribute('aria-label','Close menu');
  setPageInert(true);document.body.style.overflow='hidden';mm.classList.add('open');$('#menuClose').focus();
}
function closeMenu(restoreFocus=false){
  if(!mm.classList.contains('open'))return;
  mm.classList.remove('open');mm.setAttribute('aria-hidden','true');mm.setAttribute('inert','');
  burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Open menu');
  setPageInert(false);document.body.style.overflow='';
  if(restoreFocus)burger.focus();
}
burger.addEventListener('click',openMenu);
$('#menuClose').addEventListener('click',()=>closeMenu(true));
$$('.mlink',mm).forEach(a=>a.addEventListener('click',()=>closeMenu()));

/* ---------- reveal on scroll ---------- */
if('IntersectionObserver' in window){
  document.documentElement.classList.add('js-ready');
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}
  }),{threshold:.15});
  $$('[data-reveal]').forEach(el=>io.observe(el));
}

/* ---------- active nav ---------- */
const navLinks=$$('.nav-link');
const secIO=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting) navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));
}),{rootMargin:'-40% 0px -55% 0px'});
['firm','disciplines','method','portfolio','contact'].forEach(id=>{const s=document.getElementById(id);if(s)secIO.observe(s);});

/* ---------- marquee ---------- */
const mqItems=['Pre-Construction','Construction','Sustainability','Construction Management','General Contracting'];
const mqGreens=['#C9DFC0','#6FBE5E','#A9D39A','#8CC67F'];
let mqHTML='';
mqItems.forEach((t,i)=>{
  mqHTML+=`<span>${t} <i class="msq" style="background:${mqGreens[i%4]}"></i></span>`;
});
$('#mqTrack').innerHTML=mqHTML+mqHTML;

/* ---------- hero canvas: the four-green bloom field ---------- */
/* squares light in the logo's exact four-color, four-quadrant arrangement around the cursor */
const cv=$('#heroCanvas'),ctx=cv.getContext('2d'),hero=$('#hero');
let W,H,dpr,cells=[],mx=-9999,my=-9999,ripple=null,raf=null,heroVisible=true;
const CELL=Math.max(50,Math.min(64,innerWidth/20));
const G={
  mist:[201,223,192],   /* top-left of the mark  */
  bright:[111,190,94],  /* top-right             */
  pale:[169,211,154],   /* bottom-left           */
  sage:[140,198,127]    /* bottom-right          */
};
function quadColor(dx,dy){
  if(dx<0&&dy<0)return G.mist;
  if(dx>=0&&dy<0)return G.bright;
  if(dx<0&&dy>=0)return G.pale;
  return G.sage;
}
function buildField(){
  dpr=Math.min(devicePixelRatio||1,2);
  W=hero.offsetWidth;H=hero.offsetHeight;
  cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  cells=[];
  for(let x=CELL*.6;x<W;x+=CELL)
    for(let y=CELL*.6;y<H;y+=CELL)
      cells.push({x,y,ph:(x*.013+y*.009)%6.28});
}
buildField();
addEventListener('resize',buildField);
hero.addEventListener('mousemove',e=>{const r=hero.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;});
hero.addEventListener('mouseleave',()=>{mx=-9999;my=-9999;});
const touchViewport=matchMedia('(max-width:1024px)');
function isHeroTouch(e){return e.pointerType==='touch'||(touchViewport.matches&&e.pointerType==='pen');}
function setHeroPointer(e){const r=hero.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;}
hero.addEventListener('pointerdown',e=>{
  if(!isHeroTouch(e))return;
  setHeroPointer(e);ripple={x:mx,y:my,start:performance.now()};
  if(reduced)drawField(0);
});
hero.addEventListener('pointermove',e=>{
  if(isHeroTouch(e)&&e.buttons)setHeroPointer(e);
});
function endHeroTouch(e){
  if(!isHeroTouch(e))return;
  mx=-9999;my=-9999;
  if(reduced)drawField(0);
}
addEventListener('pointerup',endHeroTouch);
addEventListener('pointercancel',endHeroTouch);
function drawField(t){
  ctx.clearRect(0,0,W,H);
  const R=210;
  for(const c of cells){
    const hoverD=Math.hypot(mx-c.x,my-c.y);
    const sourceX=mx>-1000?mx:(ripple?ripple.x:mx),sourceY=my>-1000?my:(ripple?ripple.y:my);
    const dx=sourceX-c.x,dy=sourceY-c.y;
    let inf=Math.max(0,1-hoverD/R);
    if(ripple&&!reduced){
      const progress=(t-ripple.start)/1200;
      if(progress>=1)ripple=null;
      else{
        const radius=Math.max(0,progress)*(R+50);
        const wave=Math.max(0,1-Math.abs(Math.hypot(ripple.x-c.x,ripple.y-c.y)-radius)/48);
        inf=Math.max(inf,wave*(1-Math.max(0,progress)));
      }
    }
    const s=CELL*.3;
    if(inf>0.02){
      const col=quadColor(dx,dy);
      const a=.12+.78*inf;
      const sz=s*(1+inf*.85);
      ctx.fillStyle=`rgba(${col[0]},${col[1]},${col[2]},${a})`;
      ctx.fillRect(c.x-sz/2,c.y-sz/2,sz,sz);
    }else{
      const idle=reduced?0:(Math.sin(t*.0006+c.ph)*.5+.5);
      ctx.strokeStyle=`rgba(140,198,127,${.05+idle*.05})`;
      ctx.lineWidth=1;
      ctx.strokeRect(c.x-s/2,c.y-s/2,s,s);
    }
  }
  if(!reduced)raf=requestAnimationFrame(drawField);
}
if(reduced){drawField(0);}
else{
  raf=requestAnimationFrame(drawField);
  new IntersectionObserver(es=>{
    heroVisible=es[0].isIntersecting;
    if(heroVisible&&!raf)raf=requestAnimationFrame(drawField);
    if(!heroVisible&&raf){cancelAnimationFrame(raf);raf=null;}
  }).observe(hero);
}

/* ---------- instrument: square cursor and crosshair ---------- */
if(finePointer){
  const cur=$('#cursor'),chX=$('#chX'),chY=$('#chY'),dFix=$('#datumFixed'),dLive=$('#datumLive');
  let tx=innerWidth/2,ty=innerHeight/2,cx=tx,cy=ty;
  addEventListener('mousemove',e=>{
    tx=e.clientX;ty=e.clientY;
    chX.style.transform=`translateY(${ty}px)`;
    chY.style.transform=`translateX(${tx}px)`;
    const lat=(40.7128+(0.5-ty/innerHeight)*0.05).toFixed(5);
    const lon=Math.abs(-74.0060+(tx/innerWidth)*0.05).toFixed(5);
    if(dFix)dFix.textContent=`${lat}° N · ${lon}° W`;
    if(dLive)dLive.textContent=`${lat}° N · ${lon}° W`;
  },{passive:true});
  (function loop(){
    cx+=(tx-cx)*.2;cy+=(ty-cy)*.2;
    cur.style.left=cx+'px';cur.style.top=cy+'px';
    requestAnimationFrame(loop);
  })();
  const hoverSel='a,button,.folio-item,.disc-head,.q-btn,select,.csq';
  document.addEventListener('mouseover',e=>{
    document.body.classList.toggle('cursor-hover',!!e.target.closest(hoverSel));
    document.documentElement.classList.toggle('cursor-native',!!e.target.closest('input,textarea,select'));
  });
}

/* ---------- count-up ---------- */
$$('[data-since]').forEach(el=>{el.dataset.count=String(Math.max(0,new Date().getFullYear()-Number(el.dataset.since)));});
const cntIO=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;cntIO.unobserve(e.target);
  const el=e.target,end=parseFloat(el.dataset.count),dec=+(el.dataset.dec||0);
  if(reduced){el.textContent=end.toFixed(dec);return;}
  const t0=performance.now(),dur=1700;
  (function step(t){
    const p=Math.min(1,(t-t0)/dur),ease=1-Math.pow(2,-10*p);
    el.textContent=(end*ease).toFixed(dec);
    if(p<1)requestAnimationFrame(step);else el.textContent=end.toFixed(dec);
  })(t0);
}),{threshold:.5});
$$('[data-count]').forEach(el=>cntIO.observe(el));

/* ---------- disciplines: each owns one of the four logo greens ---------- */
const PH={"kpf": ["assets/images/8af21b1a9912835d.webp", "assets/images/f28ad7221fb3b0cd.webp", "assets/images/e0322469c982f59e.webp"], "armonk": ["assets/images/0f7b97308f85ef48.webp", "assets/images/d43d3ee45cba8db0.webp", "assets/images/810af39b5641c207.webp", "assets/images/48ef219f808dd9b6.webp"], "montblanc": ["assets/images/1d52911f989ba5bf.webp", "assets/images/8c483e9ad2361e27.webp", "assets/images/2f2b9c85e2989d16.webp", "assets/images/ec8d05858dc2a054.webp"], "pretium": ["assets/images/a40bf59f11d9061e.webp", "assets/images/c5a8ca2c005841c4.webp", "assets/images/c1bbac1ea564e4df.webp"]};
const greens=['#C9DFC0','#6FBE5E','#A9D39A','#8CC67F'];
const disciplines=[
  {name:'Pre-Construction',photo:PH.montblanc[1],
   desc:'In today’s market, organized and efficient pre-construction services are essential to the success of any project. With years of experience and a high level of expertise, our team stands out in this field.',
   caps:['Constructability review & site inspections','Trade-by-trade budgets & long-lead pre-purchasing','Subcontractor pre-qualification','Detailed schedule with weekly status updates','Financial reporting, permits & approvals'],
   more:['We take a very detailed approach to preconstruction services and provide our clients with a team of specialists to prepare all estimates and budgets. Our staff is dedicated to continued learning opportunities to keep abreast of the current changes in technology and innovation. We use state of the art programs to assist the team in their efforts.','Initially, the team reviews the drawings and specifications for completeness and constructability, taking great care to identify any problem areas. Site inspections help us to identify any issues that may arise due to existing conditions, and we evaluate the project accordingly.','Our estimators then provide an initial budget by trade breakdowns, based on the schematics and site visits. We coordinate with the architectural and engineering teams to determine and pre-purchase any long lead time items.','Before going out to bid we pre-qualify our subcontractors based on their current workload, financial position, experience with similar projects, and relationship with the other trades to compile a team that will complete the project seamlessly. This system of selecting the proper subcontractor is managed by our estimators, accounting personnel, principals of our company and our in-house legal staff. We leave no stone unturned and are confident to stand behind the subcontractors we recommend for each and every project.','We recognize the importance of developing a sensible detailed schedule that both the client and the trades can agree to. Once the schedule is agreed upon, we make the most of every avenue available to us to strictly adhere to it and provide weekly updates on project status.','Our estimating and accounting teams work with our clients to establish and implement financial reporting procedures to keep projects on budget. We assist our clients in identifying and obtaining required construction permits and approvals and work closely with the appointed expeditor to ensure a smooth process.','We understand that every project comes with diverse and wide ranging expectations and requirements and we customize our pre-construction services to meet our client’s needs.'],
   url:'https://www.crossmanagementcorp.com/preconstruction'},
  {name:'Construction',photo:PH.armonk[0],
   desc:'Throughout a project, our clients can expect the project team, including the owners of CMC, to be available every step of the way. The project team is responsible for the overall coordination of the project, including construction means and methods and quality and safety control. We coordinate the daily activities of the trades, while managing sequencing, phasing and scheduling.',
   caps:['Quality control & safety','Long-standing trade partnerships','Means & methods, site logistics, sequencing & phasing','Regular reports, submittal logs, minutes & schedules','Closeout: inspections, warranties, as-builts & manuals'],
   more:['At CMC, the standards we set in pre-construction carry through every phase of delivery. Once construction begins, our focus shifts to disciplined execution — where safety, quality, and coordination come together on site.','The importance of quality control and safety can never be overstated. We manage both with rigor and consistency, embedded into daily operations and decision-making. Every job site is overseen by a dedicated team — including company leadership — who remain engaged from mobilization through closeout.','The strength of our execution lies in the strength of our trade partnerships. Over decades in the field, we’ve developed long-standing relationships with local subcontractors whose work we know firsthand. These relationships are built on fairness, accountability, and a shared understanding of expectations. That familiarity allows us to assemble high-performing teams who deliver with precision, and at a value our clients can rely on.','Construction means and methods, site logistics, sequencing, and phasing are managed with care and structure. Clients receive regular reports, submittal logs, meeting minutes, and updated schedules throughout the process, so that every step forward is visible and aligned.','When a project concludes, we manage closeout with the same level of attention: inspections, documentation, department approvals, warranties, as-built drawings, and operations manuals are all tailored to support long-term facility performance.','Many of our clients return with additional projects or ask us to remain involved in ongoing maintenance. For us, that continued partnership is the clearest measure of trust earned through delivery.'],
   url:'https://www.crossmanagementcorp.com/construction'},
  {name:'Sustainability',photo:PH.kpf[1],
   desc:'We enthusiastically support the U.S. Green Building Council’s mission to “change the ways buildings and communities are designed, built and operated.”',
   caps:['LEED-accredited professionals on staff','Guidance from preconstruction through final delivery','Trade submittal review & construction supervision','USGBC certification documentation'],
   more:['Sustainable building is part of how we work — not an added feature. With several LEED-accredited professionals on staff and a Sustainability department well-versed in best practices, we support clients in making informed, responsible choices throughout the life of a project.','Whether the goal is LEED certification or simply integrating long-term efficiencies, we tailor strategies to meet each client’s priorities. Our sustainability efforts begin early, helping guide decisions during preconstruction and continuing through final delivery. Every approach is designed to balance performance, practicality, and cost.','We collaborate closely with subcontractors, consultants, and client teams to ensure that sustainability measures align with design intent and are executed as specified. This includes reviewing trade submittals, supervising construction to ensure standards are upheld, and tracking documentation for submission to the U.S. Green Building Council when certification is pursued.','We share the USGBC’s mission to help shape environments that respect both people and the planet. For us, sustainable construction is not only about meeting a standard — it’s about delivering spaces that perform better, last longer, and leave a lighter footprint.'],
   url:'https://www.crossmanagementcorp.com/sustainability'}
];
const discList=$('#discList');
discList.innerHTML=disciplines.map((d,i)=>`
  <div class="disc-row" data-i="${i}" style="--sw:${greens[i]}">
    <button class="disc-head" type="button" aria-expanded="false">
      <span class="disc-idx"><i></i>0${i+1}</span>
      <span class="disc-name">${d.name}</span>
      <span class="disc-tog"><svg viewBox="0 0 24 24"><path d="M12 4v16M4 12h16"/></svg></span>
    </button>
    <div class="disc-body"><div class="disc-body-in">
      <div class="disc-cols">
        <div><p>${d.desc}</p>
          ${d.caps.length?`<ul class="caps">${d.caps.map(c=>`<li>${c}</li>`).join('')}</ul>`:''}
          <button class="tlink more-btn" type="button" aria-expanded="false"><span class="lbl">Read more</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 4v15M5 13l7 7 7-7"></path></svg></button>
          <div class="more"><div>${d.more.map(m=>`<p>${m}</p>`).join('')}<p><a class="tlink" href="${d.url}" target="_blank" rel="noopener">View on website</a></p></div></div>
        </div>
        <div class="disc-img"><img loading="lazy" src="${d.photo}" alt="${d.name}"></div>
      </div>
    </div></div>
  </div>`).join('');
$$('.disc-row',discList).forEach(row=>{
  const head=$('.disc-head',row);
  const mb=$('.more-btn',row);
  mb.addEventListener('click',()=>{const o=row.classList.toggle('more-open');mb.setAttribute('aria-expanded',o);$('.lbl',mb).textContent=o?'Read less':'Read more';});
  head.addEventListener('click',()=>{
    const open=row.classList.contains('open');
    $$('.disc-row.open',discList).forEach(r=>{r.classList.remove('open');$('.disc-head',r).setAttribute('aria-expanded','false');});
    if(!open){row.classList.add('open');head.setAttribute('aria-expanded','true');}
  });
});
if(finePointer){
  const fl=$('#discFloat'),fImg=$('#discFloatImg');
  let fx=0,fy=0,px=0,py=0,prevX=0,rot=0,active=false;
  document.addEventListener('mousemove',e=>{fx=e.clientX;fy=e.clientY;},{passive:true});
  $$('.disc-row',discList).forEach(row=>{
    row.addEventListener('mouseenter',()=>{
      if(row.classList.contains('open'))return;
      fImg.src=disciplines[+row.dataset.i].photo;
      fl.classList.add('on');active=true;
    });
    row.addEventListener('mouseleave',()=>{fl.classList.remove('on');active=false;});
  });
  (function floop(){
    px+=(fx-px)*.12;py+=(fy-py)*.12;
    rot+=(Math.max(-9,Math.min(9,(fx-prevX)*.55))-rot)*.1;prevX=fx;
    if(fl.classList.contains('on'))
      fl.style.transform=`translate(${px+26}px,${py-190}px) rotate(${rot}deg)`;
    requestAnimationFrame(floop);
  })();
}

/* ---------- method: the CMC module (interactive logo cluster) ---------- */
const phases=[
  {name:'New York',desc:'100 Park Avenue, 30th Floor, New York, NY 10017. Our work spans New York, New Jersey, Connecticut, Massachusetts, Pennsylvania, Delaware, North Carolina, Georgia, Florida, Illinois and Ohio.'},
  {name:'Chicago',desc:'2108 W Walnut St – Suite 600, Chicago, IL 60612.'},
  {name:'Delaware',desc:'<a href="https://www.google.com/42" target="_blank" rel="noopener">251 Little Falls Drive</a> in Wilmington.'},
  {name:'Florida',desc:'1110 Brickell Ave #506, Miami, FL 33131.'}
];
/* square positions mirror the logo cluster: big / medium / small / big */
const layoutAll=[
  {l:'0%',t:'0%',w:'52%',h:'50%',c:'var(--mist)',sm:false},
  {l:'66%',t:'12%',w:'28%',h:'30%',c:'var(--green-b)',sm:false},
  {l:'28%',t:'62%',w:'22%',h:'24%',c:'var(--pale)',sm:true},
  {l:'60%',t:'58%',w:'36%',h:'38%',c:'var(--sage)',sm:false}
];
// Assign offices clockwise around the CMC mark: top-left, top-right, bottom-right, bottom-left.
const layout=[layoutAll[0],layoutAll[1],layoutAll[3],layoutAll[2]];
const cluster=$('#cluster');
phases.forEach((p,i)=>{
  const b=document.createElement('button');
  b.type='button';b.className='csq'+(layout[i].sm?' csq-sm':'');b.dataset.p=i;
  b.setAttribute('aria-label',`Office 0${i+1} — ${p.name}`);
  b.style.cssText=`left:${layout[i].l};top:${layout[i].t};width:${layout[i].w};height:${layout[i].h};--c:${layout[i].c}`;
  b.innerHTML=`<span class="n">0${i+1}</span><span class="t">${p.name}</span>`;
  cluster.appendChild(b);
});
const phaseList=$('#phaseList');
phaseList.innerHTML=phases.map((p,i)=>`
  <div class="phase" data-p="${i}" style="--pc:${greens[i]}">
    <button class="phase-btn" type="button">
      <span class="pidx">0${i+1}</span><span class="pname">${p.name}</span><span class="pmark"></span>
    </button>
    <div class="phase-desc"><div><p>${p.desc}</p></div></div>
  </div>`).join('');
const cap=$('#clusterCap');
let phaseIdx=0,methodTimer=null;
function setPhase(i){
  phaseIdx=i;
  $$('.csq',cluster).forEach((q,k)=>q.classList.toggle('active',k===i));
  $$('.phase',phaseList).forEach((p,k)=>p.classList.toggle('active',k===i));
  cap.innerHTML=`OFFICE <b>0${i+1}</b> — ${phases[i].name.toUpperCase()}`;
}
cluster.addEventListener('click',e=>{
  const q=e.target.closest('.csq');if(!q)return;
  setPhase(+q.dataset.p);restartMethodTimer();
});
phaseList.addEventListener('click',e=>{
  const btn=e.target.closest('.phase-btn');if(!btn)return;
  setPhase(+btn.parentElement.dataset.p);restartMethodTimer();
});
function startMethodTimer(){if(reduced)return;stopMethodTimer();methodTimer=setInterval(()=>setPhase((phaseIdx+1)%phases.length),4600);}
function stopMethodTimer(){if(methodTimer){clearInterval(methodTimer);methodTimer=null;}}
function restartMethodTimer(){stopMethodTimer();startMethodTimer();}
new IntersectionObserver(es=>{
  es[0].isIntersecting?startMethodTimer():stopMethodTimer();
},{threshold:.25}).observe($('#method'));
setPhase(0);

/* ---------- portfolio ---------- */
const props=[
  {key:'kpf',name:'Kohn Pedersen Fox Headquarters',loc:'11 West 42nd Street, New York',cls:'f-3',w:4,h:3,
   url:'https://www.crossmanagementcorp.com/kohn-pedersen-fox-headquarters',
   rows:[['Architect','Kohn Pedersen Fox'],['Owner','Kohn Pedersen Fox'],['Size','29,500 RSF']],
   desc:'KPF’s 29,500 RSF office expansion of the 7th Floor at 11 West 42nd Street. The project contains extensive custom finishes including new office front systems, terrazzo reception desk, a new large conference room, and multiple medium-sized conference rooms.'},
  {key:'armonk',name:'Confidential Client, Armonk',loc:'Armonk, New York',cls:'f-2',w:3,h:2,
   url:'https://www.crossmanagementcorp.com/confidential-client-armonk',
   rows:[['Architect','HoK Architects'],['Volume','396,400 Gross SF'],['Location','Armonk, New York']],
   desc:'Interior and exterior renovation of an executive conference center, including renovation of existing guest rooms, conference rooms, dining facilities, and all new infrastructure. Existing woodwork refinished to match new millwork. Exterior renovations include new windows, roofing, and repainting of the exterior of the building.'},
  {key:'montblanc',name:'Montblanc',loc:'Chicago, IL',cls:'f-2',w:3,h:2,
   url:'https://www.crossmanagementcorp.com/montblanc',
   rows:[['Owner','Richemont'],['Location','Chicago, IL']],desc:''},
  {key:'pretium',name:'Pretium Partners',loc:'New York, New York',cls:'f-2',w:3,h:2,
   url:'https://www.crossmanagementcorp.com/pretiumpartners',
   rows:[['Architect','Gensler'],['Volume','30,000 Square Feet'],['Location','New York, New York']],
   desc:'This project is an open-plan concept with high-end custom ceilings and flooring. Reception and Amenity areas are dominated by millwork, metal and glass, and custom lighting. High-end office fronts complement the office and Conference/Team room areas. The space also includes a Broadcast room for tenant internal and podcast use. The project includes decoustic ceilings, K-13 spray at exposed ceilings, custom millwork booths in the pantry, polished concrete floor, demountable office, front systems sound masking and AV systems, custom light fixtures, and Level 5 wall finish.'}
];
const folio=$('#folioGrid');
function folioItem(i){
  const p=props[i],ph=PH[p.key];
  return `<article class="folio-item" data-i="${i}" tabindex="0" role="button" aria-label="View ${p.name} photos">
    <div class="frame ${p.cls}"><img loading="lazy" src="${ph[0]}" alt="${p.name}, ${p.loc}"></div>
    <div class="folio-cap"><h3>${p.name}</h3><span class="fmeta">${p.loc}<br>${ph.length} photos</span></div>
  </article>`;}
folio.innerHTML=`<div class="folio-col">${[0,2].map(folioItem).join('')}</div>
                 <div class="folio-col">${[1,3].map(folioItem).join('')}</div>`;
const modal=$('#folioModal');let mIdx=0,pIdx=0,lastFocus=null;
function showPhoto(k){
  const p=props[mIdx],ph=PH[p.key];pIdx=(k+ph.length)%ph.length;
  $('#modalImg').src=ph[pIdx];$('#modalImg').alt=`${p.name} — photo ${pIdx+1}`;
  $$('#mThumbs button').forEach((b,j)=>b.classList.toggle('on',j===pIdx));
  $('#mCount').textContent=`0${pIdx+1} / 0${ph.length}`;
}
function openModal(i){
  mIdx=i;const p=props[i],ph=PH[p.key];
  $('#mName').textContent=p.name;
  $('#mRows').innerHTML=p.rows.map(r=>`<div><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join('');
  $('#mDesc').textContent=p.desc;$('#mDesc').style.display=p.desc?'':'none';
  $('#mLink').href=p.url;
  $('#mThumbs').innerHTML=ph.map((src,j)=>`<button type="button" aria-label="Photo ${j+1}"><img src="${src}" alt=""></button>`).join('');
  $$('#mThumbs button').forEach((b,j)=>b.addEventListener('click',()=>showPhoto(j)));
  showPhoto(0);
  lastFocus=document.activeElement;
  modal.removeAttribute('inert');modal.setAttribute('aria-hidden','false');
  setPageInert(true);modal.classList.add('open');document.body.style.overflow='hidden';
  $('#modalClose').focus();
}
function closeModal(){
  modal.classList.remove('open');modal.setAttribute('aria-hidden','true');modal.setAttribute('inert','');
  setPageInert(false);document.body.style.overflow='';
  if(lastFocus)lastFocus.focus();
}
folio.addEventListener('click',e=>{const it=e.target.closest('.folio-item');if(it)openModal(+it.dataset.i);});
folio.addEventListener('keydown',e=>{
  const it=e.target.closest('.folio-item');
  if(it&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openModal(+it.dataset.i);}
});
$('#modalClose').addEventListener('click',closeModal);
$('.veil',modal).addEventListener('click',closeModal);
$('#modalNext').addEventListener('click',()=>showPhoto(pIdx+1));
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(modal.classList.contains('open'))closeModal();
    else if(mm.classList.contains('open'))closeMenu(true);
  }
  if(modal.classList.contains('open')){
    if(e.key==='ArrowRight')showPhoto(pIdx+1);
    if(e.key==='ArrowLeft')showPhoto(pIdx-1);
    trapTabWithin(modal,e);
  }else if(mm.classList.contains('open'))trapTabWithin(mm,e);
});

/* ---------- quotes ---------- */
const logos=[{"n": "Faithful+Gould", "s": "assets/images/c79451d03273634d.png"}, {"n": "Citibank", "s": "assets/images/3bf29199d86fd347.png"}, {"n": "Pretium", "s": "assets/images/010665874097d8ca.png"}, {"n": "Médecins Sans Frontières", "s": "assets/images/c95ec47e962d163e.png"}, {"n": "Point72 Asset Management", "s": "assets/images/ccc9ceea711d58f0.png"}, {"n": "JLL", "s": "assets/images/fc82a0adf286e772.png"}, {"n": "Silverlake", "s": "assets/images/ea6e6036de8c1a91.png"}, {"n": "Fitch Ratings", "s": "assets/images/6456013b92961fbe.png"}, {"n": "The Durst Organization", "s": "assets/images/e9abdddcaf5bfd5d.png"}, {"n": "Empire State Realty Trust", "s": "assets/images/69826553b0dddb60.png"}, {"n": "Lloyds Bank", "s": "assets/images/25b2829632d9880d.png"}, {"n": "The Stagwell Group", "s": "assets/images/692d63dd5a017fd0.png"}, {"n": "OCP North America", "s": "assets/images/802b792bbee576a6.png"}, {"n": "Shorenstein", "s": "assets/images/2b1fcc2830e88229.png"}, {"n": "The Fedcap Group", "s": "assets/images/11131ca55c784c04.png"}, {"n": "ONEX", "s": "assets/images/8b0cd9c88169f6c6.png"}, {"n": "KPF", "s": "assets/images/aa62ada8fc201097.png"}, {"n": "Madison Realty Capital", "s": "assets/images/40d978ea4c46a43a.png"}, {"n": "SWIFT", "s": "assets/images/0a9e2f004a442160.png"}, {"n": "CUNY", "s": "assets/images/c979d179ec866dd8.png"}, {"n": "Related", "s": "assets/images/7c424e5cbb929a5f.png"}, {"n": "Mitsui & Co.", "s": "assets/images/f346bbe02fbce3b0.png"}, {"n": "New Enterprise Associates", "s": "assets/images/a0e7d19ccc15db16.png"}, {"n": "BlackRock", "s": "assets/images/675c733d4954a24c.png"}, {"n": "Starbucks", "s": "assets/images/45064a515b87c4dd.png"}, {"n": "Vornado", "s": "assets/images/a7ff19c52d6196ad.png"}, {"n": "Robeco", "s": "assets/images/e108c28f9d437849.png"}, {"n": "Cambridge University Press", "s": "assets/images/a3a772d46efefbf2.png"}, {"n": "HSBC", "s": "assets/images/ca64901060112f26.png"}, {"n": "ESPN", "s": "assets/images/e87a68a81cef66e9.png"}];
const per=6,pages=Math.ceil(logos.length/per);
const qStage=$('#qStage');
qStage.innerHTML=Array.from({length:pages},(_,k)=>`<div class="cslide${k===0?' active':''}">${logos.slice(k*per,k*per+per).map(l=>`<div class="ctile"><img loading="lazy" src="${l.s}" alt="${l.n}"></div>`).join('')}</div>`).join('');
let qIdx=0,qTimer=null;
function showQuote(i){
  qIdx=(i+pages)%pages;
  $$('.cslide',qStage).forEach((q,k)=>q.classList.toggle('active',k===qIdx));
  $('#qIdx').textContent=`0${qIdx+1} / 0${pages}`;
}
function qAuto(){if(reduced)return;stopQ();qTimer=setInterval(()=>showQuote(qIdx+1),5000);}
function stopQ(){if(qTimer){clearInterval(qTimer);qTimer=null;}}
$('#qPrev').addEventListener('click',()=>{showQuote(qIdx-1);qAuto();});
$('#qNext').addEventListener('click',()=>{showQuote(qIdx+1);qAuto();});
qStage.addEventListener('mouseenter',stopQ);
qStage.addEventListener('mouseleave',qAuto);
qAuto();

/* ---------- toast ---------- */
function toast(msg){
  const t=document.createElement('div');t.className='toast';t.textContent=msg;
  $('#toasts').appendChild(t);
  requestAnimationFrame(()=>t.classList.add('on'));
  setTimeout(()=>{t.classList.remove('on');setTimeout(()=>t.remove(),500);},3600);
}

/* ---------- form ---------- */
const form=$('#contactForm');
form.addEventListener('submit',e=>{
  e.preventDefault();
  let ok=true;
  const check=(id,valid)=>{
    const w=$('#fw-'+id);w.classList.toggle('err',!valid);if(!valid)ok=false;
  };
  check('name',$('#f-name').value.trim().length>1);
  check('email',/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($('#f-email').value.trim()));
  check('msg',$('#f-msg').value.trim().length>5);
  if(!ok){
    const firstInvalid=$('.field.err input,.field.err textarea');
    if(firstInvalid)firstInvalid.focus();
    return;
  }
  const name=$('#f-name').value.trim();
  const email=$('#f-email').value.trim();
  const company=$('#f-firm').value.trim();
  const project=$('#f-aum').value;
  const message=$('#f-msg').value.trim();
  const subject=encodeURIComponent('Website inquiry from '+name);
  const body=encodeURIComponent(['Name: '+name,'Email: '+email,'Company: '+(company||'Not provided'),'Project type: '+project,'','Message:',message].join('\n'));
  $('#formStatus').classList.add('show');
  window.location.href='mailto:office@crossmanagementcorp.com?subject='+subject+'&body='+body;
});
$$('#contactForm input,#contactForm textarea').forEach(el=>
  el.addEventListener('input',()=>el.closest('.field').classList.remove('err')));

/* ---------- footer ---------- */
$('#year').textContent=new Date().getFullYear();
const clock=$('#nycClock');
try{
  const fmt=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'});
  const tick=()=>clock.textContent=fmt.format(new Date());
  tick();setInterval(tick,1000);
}catch(e){clock.textContent='';}
$('#toTop').addEventListener('click',()=>scrollTo({top:0,behavior:reduced?'auto':'smooth'}));
})();
