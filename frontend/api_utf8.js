const API_BASE = "/api";

async function apiGet(path) {
  const res = await fetch(API_BASE + path);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

async function loadCameras() {
  const box = document.getElementById("cameraTable");
  if (!box) return;
  try {
    const data = await apiGet("/cameras");
    box.innerHTML = `<table class="table"><thead><tr><th>ID</th><th>Zone</th><th>Status</th><th>Battery</th><th>Signal</th><th>Temp</th><th>Last sync</th></tr></thead><tbody>${
      data.cameras.map(c => `<tr><td><b>${esc(c.id)}</b></td><td>${esc(c.zone)}</td><td><span class="badge ${c.status}">${esc(c.status)}</span></td><td>${c.battery}%</td><td>${c.signal}%</td><td>${c.temperature ? c.temperature+"°C" : "—"}</td><td>${esc(c.lastSync)}</td></tr>`).join("")
    }</tbody></table>`;
  } catch(e) {
    box.innerHTML = `<div class="message">Could not load camera data.</div>`;
  }
}

async function loadTigers() {
  const box = document.getElementById("tigerGrid");
  if (!box) return;
  const data = await apiGet("/tigers");
  box.innerHTML = data.tigers.map(t => `
    <div class="card">
      <div class="individual">
        <div class="animal-icon">🐅</div>
        <div><h3>${esc(t.id)}</h3><p class="muted">${esc(t.sex)} • ${esc(t.age)}</p></div>
      </div>
      <div class="metric-row"><span>Last camera</span><b>${esc(t.lastSeen)}</b></div>
      <div class="metric-row"><span>Match confidence</span><b>${t.confidence}%</b></div>
      <div class="metric-row"><span>Status</span><b>${esc(t.status)}</b></div>
    </div>
  `).join("");
}

async function loadMovements() {
  const box = document.getElementById("movementTable");
  if (!box) return;
  const data = await apiGet("/movements");
  box.innerHTML = `<table class="table"><thead><tr><th>Tiger</th><th>Camera</th><th>Zone</th><th>GPS</th><th>Time</th></tr></thead><tbody>${
    data.movements.map(m => `<tr><td>🐅 <b>${esc(m.tiger)}</b></td><td>${esc(m.camera)}</td><td>${esc(m.zone)}</td><td>${m.lat}, ${m.lng}</td><td>${esc(m.time)}</td></tr>`).join("")
  }</tbody></table>`;
}

async function loadAlertsPage() {
  const box = document.getElementById("fullAlerts");
  if (!box) return;
  const data = await apiGet("/alerts");
  box.innerHTML = data.alerts.map(a => `
    <div class="alert-card ${esc(a.level)}">
      <b>${esc(a.title)}</b>
      <p class="muted">${esc(a.detail)}</p>
      <small class="muted">${esc(a.time)}</small>
    </div>
  `).join("");
}
