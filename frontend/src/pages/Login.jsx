import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand-mark">🐅</div>
        <p className="eyebrow">PENCH TIGER RESERVE</p>
        <h1>Vyaghravana</h1>
        <p className="muted">IoT Wildlife Intelligence & Camera Trap Triage</p>

        <form onSubmit={handleLogin}>
          <label>Officer ID</label>
          <input id="officerId" defaultValue="FOREST-001" required />

          <label>Access PIN</label>
          <input id="pin" type="password" defaultValue="1234" required />

          <button className="primary-btn" type="submit" style={{ marginTop: '15px' }}>
            Enter Command Center
          </button>
        </form>

        <p className="login-note">Prototype access • Manthan 4 Yuva</p>
      </div>
    </div>
  );
}
