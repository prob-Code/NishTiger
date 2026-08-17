async function loadDashboard() {
  try {
    const [stats, alerts, cameras] = await Promise.all([
      apiGet("/stats"),
      apiGet("/alerts"),
      apiGet("/cameras")
    ]);

    const s = stats.stats;
    document.getElementById("tigers").textContent = s.tigersMonitored;
    document.getElementById("cameras").textContent = s.cameraStations;
    document.getElementById("images").textContent = Number(s.imagesProcessed).toLocaleString();
    document.getElementById("alerts").textContent = s.activeAlerts;
    document.getElementById("cameraHealth").textContent =
      `${s.online} online • ${s.warning} warning • ${s.offline} offline`;

    document.getElementById("alertList").innerHTML = alerts.alerts.slice(0,4).map(a => `
      <div class="list-item ${a.level}">
        <div>🚨</div>
        <div><b>${a.title}</b><p>${a.detail}</p><small>${a.time}</small></div>
      </div>
    `).join("");

    document.getElementById("healthRows").innerHTML = `
      <div class="health-row"><span>🟢 Online</span><strong>${s.online}</strong></div>
      <div class="health-row"><span>🟡 Warning</span><strong>${s.warning}</strong></div>
      <div class="health-row"><span>🔴 Offline</span><strong>${s.offline}</strong></div>
    `;
  } catch (error) {
    console.error(error);
  }
}

loadDashboard();
