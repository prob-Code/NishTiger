import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    tigersMonitored: '—',
    cameraStations: '—',
    imagesProcessed: '—',
    activeAlerts: '—',
    online: 0,
    warning: 0,
    offline: 0
  });

  const [alerts, setAlerts] = useState([]);

  const API_BASE = "https://nishtiger-1.onrender.com/api";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [camerasRes, tigersRes] = await Promise.all([
          fetch(`${API_BASE}/cameras`),
          fetch(`${API_BASE}/tigers`)
        ]);

        const camerasData = await camerasRes.json();
        const tigersData = await tigersRes.json();

        if (camerasData.success && tigersData.success) {
          const cameras = camerasData.data || [];
          const tigers = tigersData.data || [];

          setStats({
            tigersMonitored: tigers.length,
            cameraStations: cameras.length,
            imagesProcessed: '12,450', // Still mock since we don't have a count API for images
            activeAlerts: 2,
            online: cameras.filter(c => c.status === 'active').length,
            warning: cameras.filter(c => c.batteryLevel < 20).length,
            offline: cameras.filter(c => c.status === 'offline').length
          });
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    fetchStats();

    // Mock alerts for now
    setAlerts([
      { level: 'critical', title: 'Intrusion Detected', detail: 'Human presence detected near Zone 4 boundary.', time: '10 mins ago' },
      { level: 'warning', title: 'Low Battery', detail: 'Camera PTR-C05 is below 15% battery.', time: '1 hour ago' },
      { level: 'high', title: 'New Tiger Individual', detail: 'Unrecognized stripe pattern at Camera 12.', time: '3 hours ago' },
    ]);
  }, []);

  return (
    <>
      <section className="hero">
        <div>
          <span className="live-pill">● SYSTEM ONLINE</span>
          <h2>Camera Trap Command Center</h2>
          <p>Monitor wildlife detections, camera health and tiger movement from one workspace.</p>
          <Link className="primary-btn inline" to="/verification">Upload & Detect Image →</Link>
        </div>
        <div className="hero-tiger">🐅</div>
      </section>

      <section className="kpi-grid">
        <div className="kpi">
          <span>🐅 Tigers monitored</span>
          <strong>{stats.tigersMonitored}</strong>
          <small>Known individuals</small>
        </div>
        <div className="kpi">
          <span>📷 Camera stations</span>
          <strong>{stats.cameraStations}</strong>
          <small>{stats.online} online • {stats.warning} warning • {stats.offline} offline</small>
        </div>
        <div className="kpi">
          <span>🖼️ Images processed</span>
          <strong>{stats.imagesProcessed}</strong>
          <small>Prototype dataset</small>
        </div>
        <div className="kpi alert">
          <span>🚨 Active alerts</span>
          <strong>{stats.activeAlerts}</strong>
          <small>Requires attention</small>
        </div>
      </section>

      <section className="grid-2">
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Tiger Movement Intelligence</h3>
              <p>Latest camera-linked movement events</p>
            </div>
            <Link to="/movement">Full map</Link>
          </div>
          <div className="map">
            <div className="map-line"></div>
            <span className="map-camera c1">📷</span>
            <span className="map-camera c2">📷</span>
            <span className="map-camera c3">📷</span>
            <span className="map-tiger">🐅</span>
            <span className="map-label l1">PTR-C01</span>
            <span className="map-label l2">PTR-C03</span>
            <span className="map-label l3">PTR-C05</span>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3>Priority Alerts</h3>
              <p>Latest system intelligence</p>
            </div>
            <Link to="/alerts">View all</Link>
          </div>
          <div className="list">
            {alerts.length === 0 ? <div className="muted">Loading alerts...</div> : null}
            {alerts.map((a, i) => (
              <div key={i} className={`list-item ${a.level}`}>
                <div>🚨</div>
                <div>
                  <b>{a.title}</b>
                  <p>{a.detail}</p>
                  <small>{a.time}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid-3">
        <div className="card">
          <div className="card-head">
            <h3>AI Verification</h3>
            <span className="status-dot">LIVE</span>
          </div>
          <p className="big-number">Ready</p>
          <p className="muted">Upload a camera-trap image and send it to the configured wildlife detection model.</p>
          <Link className="secondary-btn full" to="/verification" style={{ textAlign: 'center' }}>Open verification</Link>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Camera Health</h3>
            <Link to="/cameras">View</Link>
          </div>
          <div>
            <div className="health-row"><span>🟢 Online</span><strong>{stats.online}</strong></div>
            <div className="health-row"><span>🟡 Warning</span><strong>{stats.warning}</strong></div>
            <div className="health-row"><span>🔴 Offline</span><strong>{stats.offline}</strong></div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>New Individual</h3>
            <span>Review</span>
          </div>
          <div className="individual">
            <div className="animal-icon">🐅</div>
            <div>
              <b>Possible T-38</b>
              <p className="muted">Human verification required</p>
            </div>
            <strong>71%</strong>
          </div>
        </div>
      </section>
    </>
  );
}
