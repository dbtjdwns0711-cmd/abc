/*---------------------------------------------------------
  nav.js - 사이드바 동적 렌더링 및 현재 메뉴 활성화
---------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const currentPath = window.location.pathname;
  let page = currentPath.split('/').pop() || 'index.html';
  if (page === '' || page === 'abc') page = 'index.html';

  const menuSections = [
    {
      items: [
        { name: '종합 현황', href: 'index.html' },
        { name: '현장 관리', href: 'admin.html' },
        { name: '현장별 상세 분석', href: 'project-detail.html' },
        { name: '기상 데이터 조회', href: 'data.html' },
        { name: '공사 물량·생산성 산정', href: 'quantity.html' },
        { name: '구간별 관측지점', href: 'stations.html' }
      ]
    },
    {
      title: '공사기간 산정',
      items: [
        { name: '비작업일수 산정', href: 'duration-workdays.html' },
        { name: '산정근거 검토', href: 'duration.html' },
        { name: '기상 비작업일 상세', href: 'duration-weather.html' }
      ]
    }
  ];

  let html = `
    <div class="sidebar-header">
      <span class="sidebar-sub">WEATHERWORKS</span>
      <h1 class="sidebar-title">WeatherWorks</h1>
      <p class="sidebar-desc">건설공사 비작업일수 · 공사기간 산정</p>
    </div>
    <nav class="sidebar-nav">
  `;

  menuSections.forEach(sec => {
    if (sec.title) {
      html += `<div class="sidebar-section-title">${sec.title}</div>`;
    }
    sec.items.forEach(item => {
      const isActive = page === item.href;
      html += `
        <a href="${item.href}" class="sidebar-link ${isActive ? 'active' : ''}">
          ${item.name}
        </a>
      `;
    });
  });

  html += `</nav>`;
  sidebar.innerHTML = html;
});