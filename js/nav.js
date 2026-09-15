/*---------------------------------------------------------
  nav.js - 공통 상단 네비게이션 바 렌더링
---------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.getElementById('nav-container');
  if (!navContainer) return;

  const currentPath = window.location.pathname;

  const navHtml = `
    <header style="background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 0 24px;">
      <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 60px;">
        <div style="display: flex; align-items: center; gap: 24px;">
          <a href="index.html" style="font-weight: 700; font-size: 18px; color: #1e293b; text-decoration: none; display: flex; align-items: center; gap: 8px;">
            <span>WeatherWorks</span>
          </a>
          <nav style="display: flex; gap: 16px; font-size: 14px; font-weight: 500;">
            <a href="duration.html" style="color: ${currentPath.includes('duration') ? '#2563eb' : '#64748b'}; text-decoration: none; padding: 6px 10px; border-radius: 4px;">공기 산정 기준</a>
            <a href="data.html" style="color: ${currentPath.includes('data') ? '#2563eb' : '#64748b'}; text-decoration: none; padding: 6px 10px; border-radius: 4px;">기상 데이터</a>
            <a href="stations.html" style="color: ${currentPath.includes('stations') ? '#2563eb' : '#64748b'}; text-decoration: none; padding: 6px 10px; border-radius: 4px;">관측소 목록</a>
          </nav>
        </div>
        <div>
          <span style="font-size: 12px; background: #eff6ff; color: #2563eb; padding: 4px 8px; border-radius: 4px; font-weight: 600;">코랩 정밀 분석 모델 v1.0</span>
        </div>
      </div>
    </header>
  `;

  navContainer.innerHTML = navHtml;
});