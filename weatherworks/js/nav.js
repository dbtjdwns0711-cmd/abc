/* ==========================================================================
   nav.js — 전 페이지 공통 사이드바 / 상단바 렌더링
   ========================================================================== */

const NAV_SECTIONS = [
  {group:null, items:[
    {href:'index.html', label:'현장 관리'},
    {href:'quantity.html', label:'공사 물량·생산성 산정'},
    {href:'stations.html', label:'구간별 관측지점'},
  ]},
  {group:'공사기간 산정', items:[
    {href:'duration.html', label:'총괄·결과·Timeline'},
    {href:'duration-workdays.html', label:'작업일수 산정'},
    {href:'duration-weather.html', label:'비작업일수 산정·예측정확도'},
  ]},
  {group:'데이터·공정', items:[
    {href:'quality.html', label:'기상데이터 품질관리'},
    {href:'schedule.html', label:'공정표 Import'},
    {href:'data.html', label:'데이터 관리'},
  ]},
  {group:null, items:[
    {href:'admin.html', label:'공종·기준·표준작업량'},
  ]},
];

function currentFile(){
  const p = location.pathname.split('/').pop();
  return p === '' ? 'index.html' : p;
}

function renderSidebar(){
  const el = document.getElementById('sidebar');
  if(!el) return;
  const cur = currentFile();
  let html = `
    <div class="brand">
      <div class="mark">WEATHERWORKS</div>
      <h1>WeatherWorks</h1>
      <div class="tagline">건설공사 비작업일수 · 공사기간 산정</div>
    </div>
    <nav>`;
  NAV_SECTIONS.forEach(sec=>{
    if(sec.group) html += `<div class="group-label">${sec.group}</div>`;
    sec.items.forEach(item=>{
      const active = item.href === cur ? ' active' : '';
      html += `<a class="nav-item${active}" href="${item.href}">${item.label}</a>`;
    });
  });
  html += `</nav>
    <div class="sidebar-foot">예상값이며 실제 작업 여부는 현장 상황 및<br>공식 기상정보에 따라 달라질 수 있습니다.</div>`;
  el.innerHTML = html;
}

function renderTopbar(title, opts){
  opts = opts || {};
  const el = document.getElementById('topbar');
  if(!el) return;
  const db = loadDB();
  const curId = getCurrentProjectId(db);
  let projectSelectHtml = '';
  if(opts.showProjectSelect){
    projectSelectHtml = `<select id="global-project-select" onchange="onGlobalProjectChange(this.value)">
      ${db.projects.map(p=>`<option value="${p.id}" ${p.id===curId?'selected':''}>${p.name}</option>`).join('') || '<option value="">등록된 현장 없음</option>'}
    </select>`;
  }
  el.innerHTML = `
    <div class="topbar-title">${title}</div>
    <div class="topbar-actions">${projectSelectHtml}</div>`;
}

function onGlobalProjectChange(id){
  setCurrentProjectId(id);
  location.reload();
}

document.addEventListener('DOMContentLoaded', renderSidebar);
