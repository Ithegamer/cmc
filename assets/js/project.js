(function(){
"use strict";
const $=s=>document.querySelector(s);
const projects=window.CMC_PROJECTS||[];
const slug=new URLSearchParams(location.search).get('slug');
const index=projects.findIndex(project=>project.slug===slug);
const project=projects[index];
if(!project){
  document.title='Project not found — Cross Management Corporation';
  $('#projectKicker').textContent='Portfolio';
  $('#projectName').textContent='Project not found';
  $('#projectLocation').textContent='Return to the portfolio to choose a project.';
  $('#projectDescription').hidden=true;$('#projectMeta').hidden=true;$('#projectExternal').hidden=true;
  return;
}
const photoCount=Math.max(project.photoCount||0,project.photos.length,10);
document.title=`${project.name} — Portfolio | Cross Management Corporation`;
$('#projectKicker').textContent=`PROJECT ${String(index+1).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')} · ${photoCount} PHOTOS`;
$('#projectName').textContent=project.name;
$('#projectLocation').textContent=project.location;
const description=$('#projectDescription');
if(project.description)description.textContent=project.description;else description.hidden=true;
const meta=$('#projectMeta');
meta.innerHTML=project.details.map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
meta.hidden=project.details.length===0;
const external=$('#projectExternal');
if(project.url)external.href=project.url;else external.hidden=true;
$('#projectGallery').innerHTML=Array.from({length:photoCount},(_,i)=>{
  const src=project.photos[i];
  return src?`<figure class="project-photo"><img src="${src}" alt="${project.name} project photo ${i+1}" loading="${i===0?'eager':'lazy'}"></figure>`:
    `<figure class="project-photo project-photo-placeholder" aria-label="Photo ${String(i+1).padStart(2,'0')} placeholder"><span aria-hidden="true">${String(i+1).padStart(2,'0')}</span><figcaption>Photo ${String(i+1).padStart(2,'0')}</figcaption></figure>`;
}).join('');
})();
