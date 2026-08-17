import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span>🐅</span>
        <div><b>Vyaghravana</b></div>
      </div>
      <nav>
        <small>COMMAND CENTER</small>
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
          🏠 Dashboard
        </NavLink>
        <NavLink to="/verification" className={({ isActive }) => (isActive ? 'active' : '')}>
          🔎 AI Verification
        </NavLink>
        <NavLink to="/cameras" className={({ isActive }) => (isActive ? 'active' : '')}>
          📷 Camera Traps
        </NavLink>
        <NavLink to="/tigers" className={({ isActive }) => (isActive ? 'active' : '')}>
          🐅 Tigers
        </NavLink>
        <NavLink to="/movement" className={({ isActive }) => (isActive ? 'active' : '')}>
          🗺️ Movement
        </NavLink>
        <NavLink to="/alerts" className={({ isActive }) => (isActive ? 'active' : '')}>
          🚨 Alerts
        </NavLink>
        <small>ANALYSIS</small>
        <NavLink to="/analytics" className={({ isActive }) => (isActive ? 'active' : '')}>
          📊 Analytics
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => (isActive ? 'active' : '')}>
          📄 Reports
        </NavLink>
        <small>FIELD</small>
        <NavLink to="/field" className={({ isActive }) => (isActive ? 'active' : '')}>
          🌲 Field Operations
        </NavLink>
        <NavLink to="/assistant" className={({ isActive }) => (isActive ? 'active' : '')}>
          🧠 AI Assistant
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
          ⚙️ Settings
        </NavLink>
      </nav>
    </aside>
  );
}
