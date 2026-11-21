(function(){
"use strict";
const $=s=>document.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const header=$('#siteHeader'),menu=$('#mobileMenu'),burger=$('#burger');
const pageRegions=[header,$('main'),$('footer')].filter(Boolean);
const focusable='a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';
function setPageInert(value){pageRegions.forEach(el=>el.toggleAttribute('inert',value));}
function openMenu(){
  menu.removeAttribute('inert');menu.setAttribute('aria-hidden','false');
  burger.setAttribute('aria-expanded','true');burger.setAttribute('aria-label','Close menu');
  setPageInert(true);document.body.style.overflow='hidden';menu.classList.add('open');$('#menuClose').focus();
}
function closeMenu(restoreFocus=false){
  if(!menu.classList.contains('open'))return;
  menu.classList.remove('open');menu.setAttribute('aria-hidden','true');menu.setAttribute('inert','');
  burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Open menu');
  setPageInert(false);document.body.style.overflow='';
  if(restoreFocus)burger.focus();
}
burger.addEventListener('click',openMenu);
$('#menuClose').addEventListener('click',()=>closeMenu(true));
$$('.mlink',menu).forEach(link=>link.addEventListener('click',()=>closeMenu()));
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&menu.classList.contains('open'))closeMenu(true);
  if(e.key!=='Tab'||!menu.classList.contains('open'))return;
  const items=$$(focusable,menu),first=items[0],last=items[items.length-1];
  if(e.shiftKey&&(document.activeElement===first||!menu.contains(document.activeElement))){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&(document.activeElement===last||!menu.contains(document.activeElement))){e.preventDefault();first.focus();}
});
addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>12),{passive:true});
$('#year').textContent=new Date().getFullYear();
const clock=$('#nycClock');
try{
  const format=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'});
  const tick=()=>clock.textContent=format.format(new Date());tick();setInterval(tick,1000);
}catch(e){clock.textContent='';}
$('#toTop').addEventListener('click',()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
})();
