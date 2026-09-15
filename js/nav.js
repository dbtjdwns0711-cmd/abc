/*---------------------------------------------------------
  nav.js - 사이드바 및 상단 헤더 렌더링
---------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar') || document.getElementById('sidebar');
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  const menuItems = [
    { name: '종합 현황', href: 'index.html' },
    { name: '현장 관리', href: 'admin.html' },
    { name: '현장별 상세 분석', href: 'project-detail.html' },
    { name: '기상 데이터 조회', href: 'data.html' },
    { name: '공사 물량·생산성 산정', href: 'quantity.html' },
    { name: '구간별 관측지점', href: 'stations.html' },
    { header: '공사기간 산정' },
    { name: '비작업일수 산정', href: 'duration-workdays.html' },
    { name: '산정근거 검토', href: 'duration.html' },
    { name: '작업일수 산정', href: 'schedule.html' }
  ];

  let menuHtml = `
    <div class="sidebar-brand" style="padding: 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.08);">
      <div style="font-size: 11px; color: #94a3b8; letter-spacing: 1px; margin-bottom: 4px;">WEATHERWORKS</div>
      <div style="font-size: 18px; font-weight: 700; color: #ffffff;">WeatherWorks</div>
      <div style="font-size: 11px; color: #64748b; margin-top: 4px;">건설공사 비작업일수 · 공사기간 산정</div>
    </div>
    <nav class="sidebar-menu" style="padding: 16px 0;">
  `;

  menuItems.forEach(item => {
    if (item.header) {
      menuHtml += `<div style="padding: 16px 20px 8px; font-size: 11px; color: #64748b; font-weight: 600;">${item.header}</div>`;
    } else {
      const isActive = currentFile === item.href;
      const activeStyle = isActive ? 'background: #1e3a8a; color: #ffffff; font-weight: 600;' : 'color: #94a3b8;';
      menuHtml += `
        <a href="${item.href}" style="display: block; padding: 10px 20px; font-size: 13px; text-decoration: none; transition: 0.2s; ${activeStyle}">
          ${item.name}
        </a>
      `;
    }
  });

  menuHtml += `</nav>`;

  if (sidebar) {
    sidebar.innerHTML = menuHtml;
  }
});