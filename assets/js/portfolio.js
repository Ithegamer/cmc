(function(){
"use strict";
const grid=document.getElementById('portfolioGrid');
const projects=window.CMC_PROJECTS||[];
if(!grid)return;
grid.innerHTML=projects.map((project,index)=>{
  const firstDetail=project.details&&project.details[0];
  const photoCount=Math.max(project.photoCount||0,project.photos.length,10);
  const visual=project.placeholder
    ?`<span class="tile-number" aria-hidden="true">${String(index+1).padStart(2,'0')}</span>`
    :`<img src="${project.photos[0]}" alt="${project.name} project photo" loading="lazy">`;
  const fact=firstDetail?`<p class="tile-fact">${firstDetail[0]} · ${firstDetail[1]}</p>`:'';
  const description=project.description?`<p class="tile-description">${project.description}</p>`:'';
  return `<div class="portfolio-cell">
  <a class="portfolio-tile${project.placeholder?' portfolio-tile-numbered':''}" href="project.html?slug=${encodeURIComponent(project.slug)}" aria-label="Open ${project.name} project details">
    ${visual}
    <span class="tile-index">${String(index+1).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}</span>
    <div class="tile-copy">
      <h2>${project.name}</h2>
      <div class="tile-extra">
        <p class="tile-location">${project.location} · ${photoCount} photos</p>
        ${fact}
        ${description}
        <span class="tile-open">View project
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h17M14 5l7 7-7 7"></path></svg>
        </span>
      </div>
    </div>
  </a>
  </div>`;
}).join('');
})();
