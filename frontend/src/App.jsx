import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Verification from './pages/Verification';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Protected Routes wrapped in Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/verification" element={<Verification />} />
          
          {/* Placeholder for missing pages to not break links */}
          <Route path="/cameras" element={<div style={{padding:'20px'}}>Camera Traps Page (Placeholder)</div>} />
          <Route path="/tigers" element={<div style={{padding:'20px'}}>Tigers Page (Placeholder)</div>} />
          <Route path="/movement" element={<div style={{padding:'20px'}}>Movement Map (Placeholder)</div>} />
          <Route path="/alerts" element={<div style={{padding:'20px'}}>Alerts Page (Placeholder)</div>} />
          <Route path="/analytics" element={<div style={{padding:'20px'}}>Analytics (Placeholder)</div>} />
          <Route path="/reports" element={<div style={{padding:'20px'}}>Reports (Placeholder)</div>} />
          <Route path="/field" element={<div style={{padding:'20px'}}>Field Operations (Placeholder)</div>} />
          <Route path="/assistant" element={<div style={{padding:'20px'}}>AI Assistant (Placeholder)</div>} />
          <Route path="/settings" element={<div style={{padding:'20px'}}>Settings (Placeholder)</div>} />
        </Route>
        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
