import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRobot } from 'react-icons/fa';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Signup() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault(); setError(''); setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to create account.');
      navigate('/login');
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  return <main className="auth-page"><form className="auth-card" onSubmit={handleSubmit}><div className="auth-brand"><FaRobot /> MicroGPT</div><h1>Create your account</h1><p>Save your conversations and pick up where you left off.</p>{error && <div className="auth-error">{error}</div>}<label>Email address<input type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label><label>Password<input type="password" minLength={6} required autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" /></label><button className="auth-submit" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button><div className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></div><Link className="auth-back" to="/">← Back to chat</Link></form></main>;
}
